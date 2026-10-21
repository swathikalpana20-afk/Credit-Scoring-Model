"""
CreditWise AI — Synthetic Demo Dataset Generator

This module generates a clearly-labelled DEMO/SYNTHETIC dataset
for credit risk prediction. This is NOT real financial data.
"""

import numpy as np
import pandas as pd
from pathlib import Path
import logging

logger = logging.getLogger(__name__)

DATASET_PATH = Path(__file__).parent / "credit_data.csv"
SYNTHETIC_FLAG = Path(__file__).parent / "SYNTHETIC_DATA_NOTICE.txt"


def generate_synthetic_dataset(n_samples: int = 5000, random_state: int = 42) -> pd.DataFrame:
    """Generate a synthetic credit risk dataset with realistic distributions.
    
    IMPORTANT: This is synthetic/demo data generated for demonstration purposes.
    It is NOT based on real individuals' financial information.
    """
    rng = np.random.default_rng(random_state)

    # Employment status
    employment_options = ["Employed", "Self-Employed", "Unemployed", "Retired"]
    employment_weights = [0.60, 0.20, 0.10, 0.10]

    employment_status = rng.choice(employment_options, size=n_samples, p=employment_weights)
    employment_length = np.where(
        employment_status == "Unemployed", 0,
        np.where(employment_status == "Retired", rng.integers(10, 40, n_samples),
                 rng.integers(0, 30, n_samples))
    )

    # Demographics
    age = rng.integers(21, 75, n_samples)

    # Income (correlated with employment)
    base_income = np.where(
        employment_status == "Employed", rng.normal(65000, 25000, n_samples),
        np.where(employment_status == "Self-Employed", rng.normal(75000, 40000, n_samples),
                 np.where(employment_status == "Retired", rng.normal(35000, 15000, n_samples),
                          rng.normal(15000, 8000, n_samples)))
    )
    annual_income = np.clip(base_income, 8000, 500000).round(2)
    monthly_income = (annual_income / 12).round(2)

    # Savings
    savings = np.clip(rng.normal(annual_income * 0.2, annual_income * 0.15), 0, None).round(2)

    # Debt
    total_debt = np.clip(rng.normal(annual_income * 0.35, annual_income * 0.25), 0, None).round(2)
    monthly_debt_payment = np.clip(
        rng.normal(total_debt * 0.03, total_debt * 0.01), 0, monthly_income * 0.9
    ).round(2)

    # Credit history
    max_hist = np.minimum(age - 18, 30)  # per-element max
    credit_history_length = np.array([
        rng.integers(0, max(int(m) + 1, 1)) for m in max_hist
    ])
    credit_history_length = np.maximum(credit_history_length, 0)
    num_credit_accounts = rng.integers(1, 15, n_samples)
    credit_utilization = np.clip(rng.beta(2, 5, n_samples), 0.01, 0.99).round(4)
    num_inquiries = rng.integers(0, 12, n_samples)
    num_open_loans = rng.integers(0, 8, n_samples)
    existing_loans = num_open_loans

    # Payment behaviour
    on_time_payments = rng.integers(0, 60, n_samples)
    late_payments = rng.integers(0, 20, n_samples)
    previous_defaults = rng.integers(0, 5, n_samples)

    # ——————————————————————————————————————————————————————————
    # Generate target with realistic credit-risk logic
    # ——————————————————————————————————————————————————————————
    risk_score = (
        0.30 * np.clip((total_debt / np.maximum(annual_income, 1)), 0, 3)  # DTI
        + 0.20 * credit_utilization
        + 0.20 * (late_payments / np.maximum(on_time_payments + late_payments, 1))
        + 0.15 * (previous_defaults * 0.3)
        + 0.10 * np.where(employment_status == "Unemployed", 1, 0)
        - 0.05 * np.clip(credit_history_length / 30, 0, 1)
        - 0.05 * np.clip(savings / np.maximum(annual_income, 1), 0, 1)
        + rng.normal(0, 0.05, n_samples)  # noise
    )

    default_prob = 1 / (1 + np.exp(-4 * (risk_score - 0.5)))
    default = (rng.random(n_samples) < default_prob).astype(int)

    df = pd.DataFrame({
        "age": age,
        "employment_status": employment_status,
        "employment_length": employment_length,
        "annual_income": annual_income,
        "monthly_income": monthly_income,
        "savings": savings,
        "total_debt": total_debt,
        "monthly_debt_payment": monthly_debt_payment,
        "existing_loans": existing_loans,
        "credit_history_length": credit_history_length,
        "num_credit_accounts": num_credit_accounts,
        "credit_utilization": credit_utilization,
        "num_inquiries": num_inquiries,
        "num_open_loans": num_open_loans,
        "on_time_payments": on_time_payments,
        "late_payments": late_payments,
        "previous_defaults": previous_defaults,
        "default": default,
    })

    return df


def load_or_generate_dataset() -> pd.DataFrame:
    """Load existing dataset or generate synthetic demo dataset."""
    if DATASET_PATH.exists():
        logger.info(f"Loading existing dataset from {DATASET_PATH}")
        return pd.read_csv(DATASET_PATH)

    logger.warning(
        "No real dataset found. Generating SYNTHETIC DEMO dataset. "
        "This data is NOT real financial data."
    )
    df = generate_synthetic_dataset()
    df.to_csv(DATASET_PATH, index=False)

    SYNTHETIC_FLAG.write_text(
        "SYNTHETIC / DEMO DATA NOTICE\n"
        "==============================\n"
        "This dataset (credit_data.csv) was generated synthetically for demonstration.\n"
        "It is NOT real financial data and does NOT represent real individuals.\n"
        "Do NOT use this data for any real financial decision-making.\n"
    )
    logger.info(f"Synthetic dataset saved to {DATASET_PATH} ({len(df)} records).")
    return df
