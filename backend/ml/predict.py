"""
CreditWise AI — Prediction Engine

Loads the trained pipeline and computes predictions with credit scores.
"""

import json
import logging
from pathlib import Path
from typing import Any

import joblib
import numpy as np
import pandas as pd

from ml.explain import explain_prediction
from ml.preprocessing import prepare_single_prediction

logger = logging.getLogger(__name__)

MODELS_DIR = Path(__file__).parent.parent / "models"
_pipeline: Any = None
_metadata: dict = {}


def load_model() -> tuple[Any, dict]:
    """Load the saved pipeline and metadata. Caches after first load."""
    global _pipeline, _metadata

    if _pipeline is not None:
        return _pipeline, _metadata

    model_path = MODELS_DIR / "model.pkl"
    metadata_path = MODELS_DIR / "metadata.json"

    if not model_path.exists():
        raise FileNotFoundError(
            f"Model not found at {model_path}. "
            "Please run: python ml/train.py"
        )

    _pipeline = joblib.load(model_path)
    logger.info(f"Model loaded from {model_path}")

    if metadata_path.exists():
        with open(metadata_path) as f:
            _metadata = json.load(f)
    else:
        _metadata = {}

    return _pipeline, _metadata


def compute_credit_score(probability: float) -> int:
    """
    Convert default probability to a CreditWise AI demonstration score (0–900).

    Scale (demonstration only — NOT an official FICO/CIBIL/bank score):
        0 – 300   Very High Risk
        301 – 500  High Risk
        501 – 650  Moderate Risk
        651 – 750  Good
        751 – 900  Excellent

    Transformation: score = 900 × (1 − probability)^1.3
    (non-linear to spread scores in the Good/Excellent range)
    """
    score = int(round(900 * ((1 - probability) ** 1.3)))
    return max(0, min(900, score))


def get_risk_level(probability: float, threshold: float = 0.5) -> tuple[str, str]:
    """Determine risk level and label from probability and threshold."""
    if probability < 0.30:
        return "LOW", "Low Risk ✓"
    elif probability < threshold:
        return "MODERATE", "Moderate Risk !"
    else:
        return "HIGH", "High Risk ⚠"


def predict(input_data: dict, threshold: float = 0.5) -> dict:
    """
    Run end-to-end prediction for a single applicant.

    Args:
        input_data: dict with raw financial features
        threshold: classification threshold (default 0.5)

    Returns:
        Comprehensive prediction result dict
    """
    pipeline, metadata = load_model()

    X_input = prepare_single_prediction(input_data)
    probability = float(pipeline.predict_proba(X_input)[:, 1][0])
    credit_score = compute_credit_score(probability)
    risk_level, prediction_label = get_risk_level(probability, threshold)
    confidence = float(max(probability, 1 - probability))

    # Explainability
    explanation = explain_prediction(pipeline, X_input, input_data)

    return {
        "prediction": prediction_label,
        "probability": round(probability, 4),
        "credit_score": credit_score,
        "confidence": round(confidence, 4),
        "risk_level": risk_level,
        "threshold_used": threshold,
        "top_risk_factors": explanation["risk_factors"],
        "positive_factors": explanation["positive_factors"],
        "shap_contributions": explanation["shap_contributions"],
        "insight": explanation["insight"],
        "model": metadata.get("model_name", "Unknown"),
        "model_version": metadata.get("version", "1.0"),
    }
