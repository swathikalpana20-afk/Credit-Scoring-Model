"""
CreditWise AI — Data Preprocessing Pipeline

Uses sklearn Pipeline + ColumnTransformer.
Fitted ONLY on training data to prevent training-serving skew.
"""

import numpy as np
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler

from ml.feature_engineering import (
    engineer_features,
    get_categorical_features,
    get_feature_columns,
    get_numerical_features,
)


def build_preprocessor() -> ColumnTransformer:
    """Build sklearn ColumnTransformer for numerical + categorical features.

    This preprocessor is fitted only on training data.
    """
    numerical_pipeline = Pipeline([
        ("imputer", SimpleImputer(strategy="median")),
        ("scaler", StandardScaler()),
    ])

    categorical_pipeline = Pipeline([
        ("imputer", SimpleImputer(strategy="most_frequent")),
        ("encoder", OneHotEncoder(handle_unknown="ignore", sparse_output=False)),
    ])

    preprocessor = ColumnTransformer(
        transformers=[
            ("num", numerical_pipeline, get_numerical_features()),
            ("cat", categorical_pipeline, get_categorical_features()),
        ],
        remainder="drop",
    )
    return preprocessor


def preprocess_raw_dataframe(df: pd.DataFrame) -> tuple[pd.DataFrame, pd.Series]:
    """Apply feature engineering and return (X, y) for model training.

    Target column 'default' is separated BEFORE feature engineering
    to ensure zero target leakage.
    """
    if "default" not in df.columns:
        raise ValueError("Dataset must contain 'default' target column.")

    y = df["default"].copy()
    X_raw = df.drop(columns=["default"])

    # Apply feature engineering (no target info used)
    X_engineered = engineer_features(X_raw)

    # Select only model feature columns
    feature_cols = get_feature_columns()
    available = [c for c in feature_cols if c in X_engineered.columns]
    X = X_engineered[available]

    return X, y


def prepare_single_prediction(input_dict: dict) -> pd.DataFrame:
    """Prepare a single prediction input dict into a model-ready DataFrame."""
    df = pd.DataFrame([input_dict])

    # Fill optional fields with safe defaults
    defaults = {
        "existing_loans": 0,
        "savings": 0.0,
        "on_time_payments": 12,
        "late_payments": 0,
        "previous_defaults": 0,
        "num_inquiries": 0,
        "num_open_loans": 0,
        "num_credit_accounts": 1,
    }
    for col, val in defaults.items():
        if col not in df.columns or df[col].isnull().any():
            df[col] = val

    df = engineer_features(df)
    feature_cols = get_feature_columns()
    available = [c for c in feature_cols if c in df.columns]
    return df[available]
