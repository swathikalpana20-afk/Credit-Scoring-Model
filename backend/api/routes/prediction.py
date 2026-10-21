"""
CreditWise AI — Prediction API routes
"""

import logging
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from api.schemas.prediction import PredictionInput, WhatIfInput
from database.database import get_db
from database.db_models import PredictionRecord
from ml.predict import predict

logger = logging.getLogger(__name__)
router = APIRouter()


def _income_range(income: float) -> str:
    """Bucket income for non-sensitive storage."""
    if income < 30000:
        return "<$30K"
    elif income < 60000:
        return "$30K–$60K"
    elif income < 100000:
        return "$60K–$100K"
    elif income < 200000:
        return "$100K–$200K"
    else:
        return ">$200K"


@router.post("/predict")
async def predict_credit_risk(
    payload: PredictionInput,
    db: Session = Depends(get_db),
):
    """
    POST /api/predict

    Runs the ML model and returns a comprehensive credit risk assessment.
    """
    try:
        input_dict = payload.model_dump(exclude={"threshold"})
        result = predict(input_dict, threshold=payload.threshold)

        # Store minimal record — no sensitive PII
        record = PredictionRecord(
            timestamp=datetime.utcnow(),
            model_name=result["model"],
            model_version=result["model_version"],
            probability=result["probability"],
            credit_score=result["credit_score"],
            risk_level=result["risk_level"],
            prediction_label=result["prediction"],
            confidence=result["confidence"],
            threshold_used=payload.threshold,
            annual_income_range=_income_range(payload.annual_income),
            employment_status=payload.employment_status,
        )
        db.add(record)
        db.commit()
        db.refresh(record)

        return {**result, "record_id": record.id}

    except FileNotFoundError as exc:
        logger.error(f"Model file not found: {exc}")
        raise HTTPException(
            status_code=503,
            detail="ML model not available. Please train the model first: python ml/train.py",
        )
    except Exception as exc:
        logger.exception("Prediction failed")
        raise HTTPException(
            status_code=500,
            detail="We couldn't process this assessment. Please check the entered financial information.",
        )


@router.post("/whatif")
async def what_if_analysis(payload: WhatIfInput):
    """
    POST /api/whatif

    Runs a What-If scenario analysis by overriding selected fields.
    Clearly labeled as a model simulation — not a guaranteed outcome.
    """
    try:
        base_dict = payload.base_input.model_dump(exclude={"threshold"})
        threshold = payload.base_input.threshold

        # Original prediction
        original = predict(base_dict, threshold=threshold)

        # Build modified scenario
        scenario_dict = base_dict.copy()
        overrides = payload.model_dump(exclude={"base_input"}, exclude_none=True)
        for k, v in overrides.items():
            if k in scenario_dict and v is not None:
                scenario_dict[k] = v

        # Recalculate monthly_income if annual changed
        if "annual_income" in overrides:
            scenario_dict["monthly_income"] = overrides["annual_income"] / 12

        scenario = predict(scenario_dict, threshold=threshold)

        return {
            "original": original,
            "scenario": scenario,
            "score_delta": scenario["credit_score"] - original["credit_score"],
            "probability_delta": round(
                scenario["probability"] - original["probability"], 4
            ),
            "disclaimer": (
                "This is a model simulation only. "
                "Results do not guarantee any future financial outcome."
            ),
        }
    except FileNotFoundError as exc:
        raise HTTPException(status_code=503, detail=str(exc))
    except Exception as exc:
        logger.exception("What-if analysis failed")
        raise HTTPException(
            status_code=500,
            detail="What-If simulation failed. Please check the input values.",
        )
