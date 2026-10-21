"""
CreditWise AI — Analytics & History routes
"""

import logging
from typing import Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy import func
from sqlalchemy.orm import Session

from database.database import get_db
from database.db_models import PredictionRecord

logger = logging.getLogger(__name__)
router = APIRouter()


@router.get("/predictions")
async def get_prediction_history(
    limit: int = Query(default=50, ge=1, le=200),
    db: Session = Depends(get_db),
):
    """Returns paginated prediction history."""
    records = (
        db.query(PredictionRecord)
        .order_by(PredictionRecord.timestamp.desc())
        .limit(limit)
        .all()
    )
    return {
        "total": db.query(PredictionRecord).count(),
        "records": [
            {
                "id": r.id,
                "timestamp": r.timestamp.isoformat(),
                "model_name": r.model_name,
                "model_version": r.model_version,
                "probability": r.probability,
                "credit_score": r.credit_score,
                "risk_level": r.risk_level,
                "prediction_label": r.prediction_label,
                "confidence": r.confidence,
                "threshold_used": r.threshold_used,
                "annual_income_range": r.annual_income_range,
                "employment_status": r.employment_status,
            }
            for r in records
        ],
    }


@router.get("/analytics")
async def get_analytics(db: Session = Depends(get_db)):
    """Returns aggregated analytics for the dashboard."""
    total = db.query(PredictionRecord).count()

    if total == 0:
        return {
            "total_assessments": 0,
            "low_risk_count": 0,
            "moderate_risk_count": 0,
            "high_risk_count": 0,
            "avg_credit_score": None,
            "avg_probability": None,
            "risk_distribution": [],
            "recent_trend": [],
        }

    low = db.query(PredictionRecord).filter(PredictionRecord.risk_level == "LOW").count()
    moderate = db.query(PredictionRecord).filter(PredictionRecord.risk_level == "MODERATE").count()
    high = db.query(PredictionRecord).filter(PredictionRecord.risk_level == "HIGH").count()

    avg_score = db.query(func.avg(PredictionRecord.credit_score)).scalar()
    avg_prob = db.query(func.avg(PredictionRecord.probability)).scalar()

    # Recent 20 records for trend
    recent = (
        db.query(PredictionRecord)
        .order_by(PredictionRecord.timestamp.desc())
        .limit(20)
        .all()
    )

    return {
        "total_assessments": total,
        "low_risk_count": low,
        "moderate_risk_count": moderate,
        "high_risk_count": high,
        "avg_credit_score": round(float(avg_score), 1) if avg_score else None,
        "avg_probability": round(float(avg_prob), 4) if avg_prob else None,
        "risk_distribution": [
            {"name": "Low Risk", "value": low, "color": "#10b981"},
            {"name": "Moderate Risk", "value": moderate, "color": "#f59e0b"},
            {"name": "High Risk", "value": high, "color": "#ef4444"},
        ],
        "recent_trend": [
            {
                "id": r.id,
                "timestamp": r.timestamp.isoformat(),
                "credit_score": r.credit_score,
                "probability": r.probability,
                "risk_level": r.risk_level,
            }
            for r in reversed(recent)
        ],
    }
