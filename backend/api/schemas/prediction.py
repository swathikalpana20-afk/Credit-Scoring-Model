"""
CreditWise AI — Pydantic Schemas for Prediction I/O
"""

from typing import Literal, Optional

from pydantic import BaseModel, Field, field_validator


class PredictionInput(BaseModel):
    """Validated input for credit risk prediction."""

    # Personal & Employment
    age: int = Field(ge=18, le=100, description="Applicant age in years")
    employment_status: Literal["Employed", "Self-Employed", "Unemployed", "Retired"] = Field(
        description="Current employment status"
    )
    employment_length: int = Field(ge=0, le=50, description="Years of employment")

    # Income
    annual_income: float = Field(gt=0, description="Annual income in USD")
    monthly_income: float = Field(gt=0, description="Monthly income in USD")

    # Savings & Debt
    savings: float = Field(ge=0, description="Total savings/assets in USD")
    total_debt: float = Field(ge=0, description="Total existing debt in USD")
    monthly_debt_payment: float = Field(ge=0, description="Monthly debt payments in USD")
    existing_loans: int = Field(ge=0, le=50, description="Number of existing loans")

    # Credit History
    credit_history_length: int = Field(ge=0, le=50, description="Credit history in years")
    num_credit_accounts: int = Field(ge=0, le=50, description="Number of credit accounts")
    credit_utilization: float = Field(ge=0.0, le=1.0, description="Credit utilization ratio (0–1)")
    num_inquiries: int = Field(ge=0, le=50, description="Recent credit inquiries")
    num_open_loans: int = Field(ge=0, le=50, description="Number of open loans")

    # Payment Behaviour
    on_time_payments: int = Field(ge=0, description="Number of on-time payments")
    late_payments: int = Field(ge=0, description="Number of late payments")
    previous_defaults: int = Field(ge=0, le=20, description="Number of previous defaults")

    # Optional configuration
    threshold: float = Field(default=0.5, ge=0.1, le=0.9, description="Classification threshold")

    @field_validator("monthly_income")
    @classmethod
    def monthly_income_consistent(cls, v: float, info) -> float:
        annual = info.data.get("annual_income")
        if annual and v > annual:
            raise ValueError("Monthly income cannot exceed annual income")
        return v

    @field_validator("monthly_debt_payment")
    @classmethod
    def debt_payment_reasonable(cls, v: float, info) -> float:
        monthly = info.data.get("monthly_income")
        if monthly and v > monthly * 2:
            raise ValueError("Monthly debt payment appears unreasonably high relative to income")
        return v

    model_config = {"json_schema_extra": {"example": {
        "age": 35,
        "employment_status": "Employed",
        "employment_length": 8,
        "annual_income": 72000,
        "monthly_income": 6000,
        "savings": 18000,
        "total_debt": 25000,
        "monthly_debt_payment": 800,
        "existing_loans": 2,
        "credit_history_length": 10,
        "num_credit_accounts": 4,
        "credit_utilization": 0.25,
        "num_inquiries": 1,
        "num_open_loans": 2,
        "on_time_payments": 48,
        "late_payments": 2,
        "previous_defaults": 0,
        "threshold": 0.5,
    }}}


class WhatIfInput(BaseModel):
    """What-If scenario analysis input — subset of adjustable fields."""

    base_input: PredictionInput
    annual_income: Optional[float] = Field(default=None, gt=0)
    total_debt: Optional[float] = Field(default=None, ge=0)
    credit_utilization: Optional[float] = Field(default=None, ge=0.0, le=1.0)
    late_payments: Optional[int] = Field(default=None, ge=0)
    monthly_debt_payment: Optional[float] = Field(default=None, ge=0)
    savings: Optional[float] = Field(default=None, ge=0)
