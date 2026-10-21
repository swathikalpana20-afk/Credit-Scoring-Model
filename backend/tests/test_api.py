"""
CreditWise AI — Backend Tests
"""

import sys
from pathlib import Path

import pytest

sys.path.insert(0, str(Path(__file__).parent.parent))


VALID_PAYLOAD = {
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
}


@pytest.fixture
def client():
    from fastapi.testclient import TestClient
    from main import app
    return TestClient(app)


def test_health(client):
    resp = client.get("/api/health")
    assert resp.status_code == 200
    assert resp.json()["status"] == "healthy"


def test_predict_valid(client):
    resp = client.post("/api/predict", json=VALID_PAYLOAD)
    # May be 503 if model not trained yet
    assert resp.status_code in (200, 503)
    if resp.status_code == 200:
        data = resp.json()
        assert "probability" in data
        assert 0.0 <= data["probability"] <= 1.0
        assert "credit_score" in data
        assert 0 <= data["credit_score"] <= 900


def test_predict_invalid_income(client):
    payload = {**VALID_PAYLOAD, "annual_income": -1000}
    resp = client.post("/api/predict", json=payload)
    assert resp.status_code == 422


def test_predict_missing_field(client):
    payload = {k: v for k, v in VALID_PAYLOAD.items() if k != "age"}
    resp = client.post("/api/predict", json=payload)
    assert resp.status_code == 422


def test_model_info(client):
    resp = client.get("/api/model-info")
    assert resp.status_code in (200, 503)


def test_metrics(client):
    resp = client.get("/api/metrics")
    assert resp.status_code in (200, 503)


def test_predictions_history(client):
    resp = client.get("/api/predictions")
    assert resp.status_code == 200
    data = resp.json()
    assert "total" in data
    assert "records" in data


def test_analytics(client):
    resp = client.get("/api/analytics")
    assert resp.status_code == 200
    data = resp.json()
    assert "total_assessments" in data
