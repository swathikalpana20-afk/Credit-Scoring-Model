"""
CreditWise AI — Explainability Layer (SHAP-based)

Computes SHAP values and converts them into human-readable explanations.
"""

import logging
from typing import Any

import numpy as np
import pandas as pd

logger = logging.getLogger(__name__)


def _get_shap_values(pipeline: Any, X_input: pd.DataFrame) -> np.ndarray | None:
    """Compute SHAP values for the input using the pipeline's classifier."""
    try:
        import shap

        preprocessor = pipeline.named_steps["preprocessor"]
        classifier = pipeline.named_steps["classifier"]
        X_transformed = preprocessor.transform(X_input)

        model_type = type(classifier).__name__

        if "XGB" in model_type or "GradientBoosting" in model_type:
            explainer = shap.TreeExplainer(classifier)
            shap_vals = explainer.shap_values(X_transformed)
            if isinstance(shap_vals, list):
                shap_vals = shap_vals[1]
        elif "Forest" in model_type or "Tree" in model_type:
            explainer = shap.TreeExplainer(classifier)
            shap_vals = explainer.shap_values(X_transformed)
            if isinstance(shap_vals, list):
                shap_vals = shap_vals[1]
        else:
            # Logistic Regression and others → LinearExplainer
            explainer = shap.LinearExplainer(classifier, X_transformed)
            shap_vals = explainer.shap_values(X_transformed)
            if isinstance(shap_vals, list):
                shap_vals = shap_vals[1]

        return shap_vals[0] if shap_vals.ndim > 1 else shap_vals
    except Exception as exc:
        logger.warning(f"SHAP computation failed: {exc}. Falling back to feature importance.")
        return None


def _get_feature_importance_fallback(
    pipeline: Any,
    X_input: pd.DataFrame,
) -> dict[str, float]:
    """Fallback: use model feature importances when SHAP fails."""
    try:
        preprocessor = pipeline.named_steps["preprocessor"]
        classifier = pipeline.named_steps["classifier"]

        # Get transformed feature names
        num_features = preprocessor.transformers_[0][2]
        cat_encoder = preprocessor.transformers_[1][1].named_steps["encoder"]
        cat_features = list(cat_encoder.get_feature_names_out(["employment_status"]))
        all_features = num_features + cat_features

        if hasattr(classifier, "feature_importances_"):
            importances = classifier.feature_importances_
        elif hasattr(classifier, "coef_"):
            importances = np.abs(classifier.coef_[0])
        else:
            return {}

        return dict(zip(all_features, importances.tolist()))
    except Exception as exc:
        logger.warning(f"Feature importance fallback failed: {exc}")
        return {}


def _get_transformed_feature_names(pipeline: Any) -> list[str]:
    """Get feature names after preprocessing."""
    try:
        preprocessor = pipeline.named_steps["preprocessor"]
        num_features = list(preprocessor.transformers_[0][2])
        cat_encoder = preprocessor.transformers_[1][1].named_steps["encoder"]
        cat_features = list(cat_encoder.get_feature_names_out(["employment_status"]))
        return num_features + cat_features
    except Exception:
        return []


FEATURE_LABELS = {
    "debt_to_income_ratio": "Debt-to-Income Ratio",
    "monthly_debt_burden": "Monthly Debt Burden",
    "payment_reliability": "Payment Reliability",
    "employment_stability": "Employment Stability",
    "savings_to_income_ratio": "Savings-to-Income Ratio",
    "inquiries_per_account": "Credit Inquiries Rate",
    "default_risk_indicator": "Default Risk Indicator",
    "credit_utilization": "Credit Utilization",
    "annual_income": "Annual Income",
    "total_debt": "Total Debt",
    "late_payments": "Late Payments",
    "previous_defaults": "Previous Defaults",
    "on_time_payments": "On-Time Payments",
    "monthly_income": "Monthly Income",
    "monthly_debt_payment": "Monthly Debt Payment",
    "num_inquiries": "Number of Inquiries",
    "credit_history_length": "Credit History Length",
    "num_credit_accounts": "Number of Credit Accounts",
    "age": "Age",
    "employment_length": "Employment Length",
    "savings": "Savings",
    "existing_loans": "Existing Loans",
    "num_open_loans": "Open Loans",
}

POSITIVE_INDICATORS = {
    "payment_reliability", "employment_stability", "savings_to_income_ratio",
    "on_time_payments", "annual_income", "monthly_income", "savings",
    "credit_history_length", "num_credit_accounts",
}

RISK_INDICATORS = {
    "debt_to_income_ratio", "monthly_debt_burden", "credit_utilization",
    "default_risk_indicator", "late_payments", "previous_defaults",
    "inquiries_per_account", "num_inquiries", "total_debt",
    "monthly_debt_payment", "existing_loans", "num_open_loans",
}

HUMAN_EXPLANATIONS = {
    "debt_to_income_ratio": {
        "risk": "High debt relative to income increases default likelihood",
        "good": "Low debt-to-income ratio indicates manageable debt levels",
    },
    "credit_utilization": {
        "risk": "High credit utilization signals over-reliance on borrowed funds",
        "good": "Low credit utilization shows disciplined credit management",
    },
    "late_payments": {
        "risk": "Late payments in history indicate payment unreliability",
        "good": "Few or no late payments reflect strong payment discipline",
    },
    "previous_defaults": {
        "risk": "Previous defaults are a strong indicator of future default risk",
        "good": "No prior defaults show strong credit responsibility",
    },
    "payment_reliability": {
        "risk": "Low payment reliability suggests inconsistent payment behavior",
        "good": "High payment reliability demonstrates consistent on-time payments",
    },
    "employment_stability": {
        "risk": "Unstable or short employment history may limit income reliability",
        "good": "Long-term stable employment suggests consistent income",
    },
    "savings_to_income_ratio": {
        "risk": "Low savings relative to income leaves little financial buffer",
        "good": "Healthy savings provide a financial safety net",
    },
    "monthly_debt_burden": {
        "risk": "High monthly debt payments relative to income strain cash flow",
        "good": "Low monthly debt burden leaves adequate disposable income",
    },
    "default_risk_indicator": {
        "risk": "Multiple combined risk signals indicate elevated default likelihood",
        "good": "Combined financial indicators show a healthy risk profile",
    },
}


def explain_prediction(
    pipeline: Any,
    X_input: pd.DataFrame,
    input_data: dict,
) -> dict:
    """Generate explainability output for a single prediction.

    Returns:
        dict with risk_factors, positive_factors, shap_contributions, insight
    """
    feature_names = _get_transformed_feature_names(pipeline)
    shap_values = _get_shap_values(pipeline, X_input)

    risk_factors = []
    positive_factors = []
    shap_contributions = []

    if shap_values is not None and len(feature_names) == len(shap_values):
        sorted_indices = np.argsort(np.abs(shap_values))[::-1]
        top_k = min(10, len(sorted_indices))

        for idx in sorted_indices[:top_k]:
            feat = feature_names[idx]
            val = float(shap_values[idx])
            base_feat = feat.split("_employment_status_")[0] if "employment_status" in feat else feat
            label = FEATURE_LABELS.get(base_feat, feat.replace("_", " ").title())

            contribution = {
                "feature": base_feat,
                "label": label,
                "shap_value": round(val, 4),
                "direction": "risk" if val > 0 else "good",
            }
            shap_contributions.append(contribution)

            if val > 0.005:
                expl = HUMAN_EXPLANATIONS.get(base_feat, {}).get("risk", f"↑ {label} is increasing default risk")
                risk_factors.append({"factor": label, "explanation": expl, "impact": round(val, 4)})
            elif val < -0.005:
                expl = HUMAN_EXPLANATIONS.get(base_feat, {}).get("good", f"✓ {label} is reducing default risk")
                positive_factors.append({"factor": label, "explanation": expl, "impact": round(abs(val), 4)})
    else:
        # Fallback using input values
        risk_factors, positive_factors = _rule_based_explanation(input_data)

    insight = _generate_insight(input_data, risk_factors)

    return {
        "risk_factors": risk_factors[:5],
        "positive_factors": positive_factors[:5],
        "shap_contributions": shap_contributions[:10],
        "insight": insight,
    }


def _rule_based_explanation(input_data: dict) -> tuple[list, list]:
    """Rule-based fallback explanation when SHAP is unavailable."""
    risk_factors = []
    positive_factors = []

    dti = input_data.get("total_debt", 0) / max(input_data.get("annual_income", 1), 1)
    util = input_data.get("credit_utilization", 0)
    late = input_data.get("late_payments", 0)
    defaults = input_data.get("previous_defaults", 0)
    emp_len = input_data.get("employment_length", 0)
    on_time = input_data.get("on_time_payments", 0)
    savings = input_data.get("savings", 0)
    income = input_data.get("annual_income", 1)

    if dti > 0.5:
        risk_factors.append({"factor": "Debt-to-Income Ratio", "explanation": HUMAN_EXPLANATIONS["debt_to_income_ratio"]["risk"], "impact": 0.15})
    else:
        positive_factors.append({"factor": "Debt-to-Income Ratio", "explanation": HUMAN_EXPLANATIONS["debt_to_income_ratio"]["good"], "impact": 0.10})

    if util > 0.6:
        risk_factors.append({"factor": "Credit Utilization", "explanation": HUMAN_EXPLANATIONS["credit_utilization"]["risk"], "impact": 0.12})
    elif util < 0.3:
        positive_factors.append({"factor": "Credit Utilization", "explanation": HUMAN_EXPLANATIONS["credit_utilization"]["good"], "impact": 0.08})

    if late > 3:
        risk_factors.append({"factor": "Late Payments", "explanation": HUMAN_EXPLANATIONS["late_payments"]["risk"], "impact": 0.10})
    elif late == 0:
        positive_factors.append({"factor": "Payment History", "explanation": HUMAN_EXPLANATIONS["payment_reliability"]["good"], "impact": 0.09})

    if defaults > 0:
        risk_factors.append({"factor": "Previous Defaults", "explanation": HUMAN_EXPLANATIONS["previous_defaults"]["risk"], "impact": 0.18})

    if emp_len >= 5:
        positive_factors.append({"factor": "Employment Stability", "explanation": HUMAN_EXPLANATIONS["employment_stability"]["good"], "impact": 0.07})

    if savings > income * 0.2:
        positive_factors.append({"factor": "Savings", "explanation": HUMAN_EXPLANATIONS["savings_to_income_ratio"]["good"], "impact": 0.06})

    return risk_factors, positive_factors


def _generate_insight(input_data: dict, risk_factors: list) -> str:
    """Generate a single human-readable AI financial insight."""
    if not risk_factors:
        return (
            "According to this model, your financial profile shows strong indicators "
            "of creditworthiness. Maintaining current payment habits and keeping debt levels "
            "manageable may continue to support a favorable risk profile."
        )

    top_factor = risk_factors[0]["factor"] if risk_factors else "debt levels"
    dti = input_data.get("total_debt", 0) / max(input_data.get("annual_income", 1), 1)
    util = input_data.get("credit_utilization", 0)

    parts = []
    if dti > 0.5:
        parts.append(
            f"Your current debt burden (debt-to-income ratio of {dti:.1%}) "
            "is one of the strongest contributors to the predicted risk level according to this model."
        )
    if util > 0.6:
        parts.append(
            f"Reducing revolving credit utilization from {util:.0%} could positively "
            "affect the risk profile, according to this model."
        )
    if input_data.get("late_payments", 0) > 0:
        parts.append(
            "Improving payment consistency may be associated with a lower risk score."
        )

    if not parts:
        parts.append(
            f"{top_factor} is identified as a key contributor to the predicted risk level. "
            "Addressing this factor may improve the creditworthiness profile over time."
        )

    parts.append(
        "Note: This is an AI-generated risk assessment for demonstration purposes only "
        "and does not constitute financial advice."
    )

    return " ".join(parts)
