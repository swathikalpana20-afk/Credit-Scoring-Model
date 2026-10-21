"""
CreditWise AI — Model Training Script

Trains Logistic Regression, Decision Tree, Random Forest, and XGBoost.
Selects the best model using documented composite criterion.
Saves the complete pipeline (preprocessor + model) and metadata.
"""

import json
import logging
import sys
from datetime import datetime
from pathlib import Path

import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import StratifiedKFold, cross_val_score, train_test_split
from sklearn.pipeline import Pipeline
from sklearn.tree import DecisionTreeClassifier
from xgboost import XGBClassifier

# Adjust path so this script can be run from the backend directory
sys.path.insert(0, str(Path(__file__).parent.parent))

from datasets.data_generator import load_or_generate_dataset
from ml.evaluate import build_comparison_table, evaluate_model, select_best_model
from ml.preprocessing import build_preprocessor, preprocess_raw_dataframe

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger(__name__)

MODELS_DIR = Path(__file__).parent.parent / "models"
MODELS_DIR.mkdir(exist_ok=True)

MODEL_DEFINITIONS = {
    "Logistic Regression": LogisticRegression(
        max_iter=1000,
        C=1.0,
        class_weight="balanced",
        random_state=42,
    ),
    "Decision Tree": DecisionTreeClassifier(
        max_depth=8,
        min_samples_leaf=20,
        class_weight="balanced",
        random_state=42,
    ),
    "Random Forest": RandomForestClassifier(
        n_estimators=200,
        max_depth=10,
        min_samples_leaf=10,
        class_weight="balanced",
        random_state=42,
        n_jobs=-1,
    ),
    "XGBoost": XGBClassifier(
        n_estimators=200,
        max_depth=6,
        learning_rate=0.1,
        subsample=0.8,
        colsample_bytree=0.8,
        scale_pos_weight=1,
        eval_metric="logloss",
        random_state=42,
        verbosity=0,
    ),
}


def train_and_evaluate_all(X: pd.DataFrame, y: pd.Series) -> tuple[dict, list[dict]]:
    """Train all models and collect evaluation results.

    Data split: 80% train, 20% test, stratified.
    Cross-validation: 5-fold stratified.
    Preprocessor is fitted ONLY on training data.
    """
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, stratify=y, random_state=42
    )
    logger.info(f"Train size: {len(X_train)}, Test size: {len(X_test)}")
    logger.info(f"Class balance (test) — 0: {(y_test==0).sum()}, 1: {(y_test==1).sum()}")

    preprocessor = build_preprocessor()

    trained_pipelines = {}
    all_results = []
    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)

    for name, clf in MODEL_DEFINITIONS.items():
        logger.info(f"Training: {name}")
        pipeline = Pipeline([
            ("preprocessor", preprocessor),
            ("classifier", clf),
        ])
        pipeline.fit(X_train, y_train)

        # Evaluate on held-out test set
        metrics = evaluate_model(pipeline, X_test, y_test, name)

        # Cross-validation ROC-AUC for stability check
        cv_roc = cross_val_score(pipeline, X_train, y_train, cv=cv, scoring="roc_auc", n_jobs=-1)
        metrics["cv_roc_auc_mean"] = round(float(cv_roc.mean()), 4)
        metrics["cv_roc_auc_std"] = round(float(cv_roc.std()), 4)

        all_results.append(metrics)
        trained_pipelines[name] = pipeline
        logger.info(
            f"  Accuracy={metrics['accuracy']:.4f}, "
            f"F1={metrics['f1']:.4f}, "
            f"ROC-AUC={metrics['roc_auc']:.4f}, "
            f"CV-AUC={metrics['cv_roc_auc_mean']:.4f}±{metrics['cv_roc_auc_std']:.4f}"
        )

    return trained_pipelines, all_results


def save_model_artifacts(
    pipeline: Pipeline,
    model_name: str,
    all_results: list[dict],
    feature_names: list[str],
    n_training_samples: int,
) -> None:
    """Save the best model pipeline and metadata JSON."""
    model_path = MODELS_DIR / "model.pkl"
    joblib.dump(pipeline, model_path)
    logger.info(f"Model saved to {model_path}")

    best_metrics = next(r for r in all_results if r["model_name"] == model_name)

    metadata = {
        "model_name": model_name,
        "version": "1.0",
        "training_date": datetime.now().isoformat(),
        "dataset": "Synthetic Demo Dataset (CREDITWISE AI — for demonstration only)",
        "n_training_samples": n_training_samples,
        "n_features": len(feature_names),
        "feature_names": feature_names,
        "metrics": {
            "accuracy": best_metrics["accuracy"],
            "balanced_accuracy": best_metrics["balanced_accuracy"],
            "precision": best_metrics["precision"],
            "recall": best_metrics["recall"],
            "f1": best_metrics["f1"],
            "roc_auc": best_metrics["roc_auc"],
            "pr_auc": best_metrics["pr_auc"],
            "cv_roc_auc_mean": best_metrics["cv_roc_auc_mean"],
            "cv_roc_auc_std": best_metrics["cv_roc_auc_std"],
        },
        "all_model_results": build_comparison_table(all_results),
        "selection_criterion": (
            "Composite = 0.50×ROC-AUC + 0.30×Recall + 0.20×F1. "
            "Recall weighted higher because missed defaulters (FN) are costly in credit risk."
        ),
        "confusion_matrix": best_metrics["confusion_matrix"],
    }

    metadata_path = MODELS_DIR / "metadata.json"
    with open(metadata_path, "w") as f:
        json.dump(metadata, f, indent=2)
    logger.info(f"Metadata saved to {metadata_path}")


def main() -> None:
    """Main training entrypoint."""
    logger.info("=" * 60)
    logger.info("CreditWise AI — Model Training Pipeline")
    logger.info("=" * 60)

    # Step 1: Load dataset
    logger.info("Loading dataset...")
    raw_df = load_or_generate_dataset()
    logger.info(f"Dataset shape: {raw_df.shape}")

    # Step 2: Preprocess (feature engineering, X/y split)
    logger.info("Preprocessing and feature engineering...")
    X, y = preprocess_raw_dataframe(raw_df)
    logger.info(f"Feature matrix shape: {X.shape}")
    logger.info(f"Class distribution — 0: {(y==0).sum()}, 1: {(y==1).sum()}")

    # Step 3: Train all models
    logger.info("Training all models...")
    trained_pipelines, all_results = train_and_evaluate_all(X, y)

    # Step 4: Select best model
    comparison = build_comparison_table(all_results)
    logger.info("\nModel Comparison Table:")
    logger.info(f"{'Model':<25} {'Acc':>6} {'F1':>6} {'ROC-AUC':>8} {'Recall':>7} {'Composite':>10}")
    logger.info("-" * 65)
    for r in comparison:
        logger.info(
            f"{r['model_name']:<25} {r['accuracy']:>6.4f} {r['f1']:>6.4f} "
            f"{r['roc_auc']:>8.4f} {r['recall']:>7.4f} {r['composite_score']:>10.4f}"
        )

    best_name = select_best_model(all_results)
    logger.info(f"\nBest model selected: {best_name}")

    best_pipeline = trained_pipelines[best_name]
    feature_names = list(X.columns)

    # Step 5: Save artifacts
    save_model_artifacts(
        pipeline=best_pipeline,
        model_name=best_name,
        all_results=all_results,
        feature_names=feature_names,
        n_training_samples=len(X),
    )

    logger.info("=" * 60)
    logger.info("Training complete. Artifacts saved to backend/models/")
    logger.info("=" * 60)


if __name__ == "__main__":
    main()
