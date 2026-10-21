"""
CreditWise AI — Database Models
"""

from datetime import datetime

from sqlalchemy import DateTime, Float, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from database.database import Base


class PredictionRecord(Base):
    """Stores minimal prediction history — no sensitive personal data."""

    __tablename__ = "predictions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    timestamp: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    model_name: Mapped[str] = mapped_column(String(100))
    model_version: Mapped[str] = mapped_column(String(20), default="1.0")
    probability: Mapped[float] = mapped_column(Float)
    credit_score: Mapped[int] = mapped_column(Integer)
    risk_level: Mapped[str] = mapped_column(String(20))
    prediction_label: Mapped[str] = mapped_column(String(50))
    confidence: Mapped[float] = mapped_column(Float)
    threshold_used: Mapped[float] = mapped_column(Float, default=0.5)
    # Minimal non-sensitive feature summary
    annual_income_range: Mapped[str] = mapped_column(String(50), nullable=True)
    employment_status: Mapped[str] = mapped_column(String(50), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
