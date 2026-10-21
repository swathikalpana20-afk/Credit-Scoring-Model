"""
CreditWise AI — Model Info & Metrics routes
"""

import json
import logging
from pathlib import Path

from fastapi import APIRouter, HTTPException

logger = logging.getLogger(__name__)
router = APIRouter()

MODELS_DIR = Path(__file__).parent.parent.parent / "models"


@router.get("/model-info")
async def get_model_info():
    """Returns model metadata from training."""
    metadata_path = MODELS_DIR / "metadata.json"
    if not metadata_path.exists():
        raise HTTPException(
            status_code=503,
            detail="Model metadata not found. Please train the model: python ml/train.py",
        )
    with open(metadata_path) as f:
        metadata = json.load(f)
    return metadata


@router.get("/metrics")
async def get_metrics():
    """Returns model comparison metrics for all trained models."""
    metadata_path = MODELS_DIR / "metadata.json"
    if not metadata_path.exists():
        raise HTTPException(
            status_code=503,
            detail="Model metrics not available. Please train the model first.",
        )
    with open(metadata_path) as f:
        metadata = json.load(f)

    return {
        "best_model": metadata.get("model_name"),
        "best_model_metrics": metadata.get("metrics"),
        "all_models": metadata.get("all_model_results", []),
        "selection_criterion": metadata.get("selection_criterion"),
        "confusion_matrix": metadata.get("confusion_matrix"),
        "n_features": metadata.get("n_features"),
        "feature_names": metadata.get("feature_names"),
        "training_date": metadata.get("training_date"),
    }
