"""
CreditWise AI — Model Evaluation

Computes all required metrics per model and selects the best model
using a transparent, documented criterion (weighted ROC-AUC + F1).
"""

import numpy as np
from typing import Any
from sklearn.metrics import (
    accuracy_score,
    average_precision_score,
    balanced_accuracy_score,
    confusion_matrix,
    f1_score,
    precision_score,
    recall_score,
    roc_auc_score,
)


def evaluate_model(
    model: Any,
    X_test: Any,
    y_test: Any,
    model_name: str,
) -> dict:
    """Evaluate a fitted model and return a metrics dictionary."""
    y_pred = model.predict(X_test)
    y_prob = model.predict_proba(X_test)[:, 1]

    cm = confusion_matrix(y_test, y_pred).tolist()

    metrics = {
        "model_name": model_name,
        "accuracy": round(float(accuracy_score(y_test, y_pred)), 4),
        "balanced_accuracy": round(float(balanced_accuracy_score(y_test, y_pred)), 4),
        "precision": round(float(precision_score(y_test, y_pred, zero_division=0)), 4),
        "recall": round(float(recall_score(y_test, y_pred, zero_division=0)), 4),
        "f1": round(float(f1_score(y_test, y_pred, zero_division=0)), 4),
        "roc_auc": round(float(roc_auc_score(y_test, y_prob)), 4),
        "pr_auc": round(float(average_precision_score(y_test, y_prob)), 4),
        "confusion_matrix": cm,
    }
    return metrics


def select_best_model(results: list[dict]) -> str:
    """
    Select the best model using a transparent composite score.

    Criterion (documented):
    -----------------------
    In credit-risk prediction, we prefer a model that:
    1. Discriminates well overall    → high ROC-AUC (weight 0.50)
    2. Captures real defaulters      → high Recall   (weight 0.30)
    3. Makes reliable predictions    → high F1       (weight 0.20)

    False Negatives (missed defaulters) cost more than False Positives
    in a lending context, hence the elevated Recall weight.

    We do NOT simply pick the highest accuracy model.
    """
    best_name = None
    best_score = -1.0

    for r in results:
        composite = (
            0.50 * r["roc_auc"]
            + 0.30 * r["recall"]
            + 0.20 * r["f1"]
        )
        if composite > best_score:
            best_score = composite
            best_name = r["model_name"]

    return best_name


def build_comparison_table(results: list[dict]) -> list[dict]:
    """Return a sorted comparison table (best first by composite score)."""
    table = []
    for r in results:
        composite = (
            0.50 * r["roc_auc"]
            + 0.30 * r["recall"]
            + 0.20 * r["f1"]
        )
        table.append({**r, "composite_score": round(composite, 4)})
    return sorted(table, key=lambda x: x["composite_score"], reverse=True)
