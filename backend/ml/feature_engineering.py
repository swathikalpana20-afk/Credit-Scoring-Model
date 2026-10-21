"""
CreditWise AI — Feature Engineering

All engineered features are derived from raw inputs without leaking target info.
"""

import pandas as pd
import numpy as np
from typing import Union


ENGINEERED_FEATURES = [
    "debt_to_income_ratio",
    "monthly_debt_burden",
    "payment_reliability",
    "employment_stability",
    "savings_to_income_ratio",
    "inquiries_per_account",
    "default_risk_indicator",
]


def engineer_features(df: pd.DataFrame) -> pd.DataFrame:
    """Apply all feature engineering transformations.

    No target variable ('default') is used in feature computation.
    Returns DataFrame with additional engineered columns.
    """
    df = df.copy()

    safe_annual_income = df["annual_income"].replace(0, np.nan).fillna(1)
    safe_monthly_income = df["monthly_income"].replace(0, np.nan).fillna(1)
    safe_accounts = df["num_credit_accounts"].replace(0, np.nan).fillna(1)
    total_payments = (
        df["on_time_payments"] + df["late_payments"]
    ).replace(0, np.nan).fillna(1)

    # Debt-to-Income Ratio: standard credit-risk metric
    df["debt_to_income_ratio"] = (df["total_debt"] / safe_annual_income).round(4)

    # Monthly Debt Burden: fraction of monthly income consumed by debt payments
    df["monthly_debt_burden"] = (
        df["monthly_debt_payment"] / safe_monthly_income
    ).clip(0, 5).round(4)

    # Payment Reliability: fraction of payments made on time
    df["payment_reliability"] = (
        df["on_time_payments"] / total_payments
    ).round(4)

    # Employment Stability: normalized 0–1 based on employment length (30-year cap)
    df["employment_stability"] = (
        df["employment_length"] / 30.0
    ).clip(0, 1).round(4)

    # Savings-to-Income Ratio: financial buffer indicator
    df["savings_to_income_ratio"] = (
        df["savings"] / safe_annual_income
    ).clip(0, 10).round(4)

    # Inquiries per Account: signals credit-seeking behavior
    df["inquiries_per_account"] = (
        df["num_inquiries"] / safe_accounts
    ).clip(0, 5).round(4)

    # Default Risk Indicator: composite weighted score (no target leakage)
    df["default_risk_indicator"] = (
        0.35 * df["debt_to_income_ratio"].clip(0, 3) / 3
        + 0.25 * df["credit_utilization"]
        + 0.20 * (1 - df["payment_reliability"])
        + 0.20 * (df["previous_defaults"].clip(0, 5) / 5)
    ).clip(0, 1).round(4)

    return df


def get_feature_columns() -> list[str]:
    """Return ordered list of all feature columns used for model training."""
    raw = [
        "age",
        "employment_length",
        "annual_income",
        "monthly_income",
        "savings",
        "total_debt",
        "monthly_debt_payment",
        "existing_loans",
        "credit_history_length",
        "num_credit_accounts",
        "credit_utilization",
        "num_inquiries",
        "num_open_loans",
        "on_time_payments",
        "late_payments",
        "previous_defaults",
        "employment_status",
    ]
    return raw + ENGINEERED_FEATURES


def get_numerical_features() -> list[str]:
    """Return list of numerical feature columns."""
    return [
        "age",
        "employment_length",
        "annual_income",
        "monthly_income",
        "savings",
        "total_debt",
        "monthly_debt_payment",
        "existing_loans",
        "credit_history_length",
        "num_credit_accounts",
        "credit_utilization",
        "num_inquiries",
        "num_open_loans",
        "on_time_payments",
        "late_payments",
        "previous_defaults",
        "debt_to_income_ratio",
        "monthly_debt_burden",
        "payment_reliability",
        "employment_stability",
        "savings_to_income_ratio",
        "inquiries_per_account",
        "default_risk_indicator",
    ]


def get_categorical_features() -> list[str]:
    """Return list of categorical feature columns."""
    return ["employment_status"]
