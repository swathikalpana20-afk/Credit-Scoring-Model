# CreditWise AI

### Intelligent Credit Risk & Creditworthiness Assessment Platform
> "Smarter Risk Decisions. Clearer Financial Insights."

## Overview
CreditWise AI is a premium, production-quality AI-powered platform that predicts an individual's credit risk and creditworthiness from historical financial information. It goes beyond simple predictions by offering robust Explainable AI (SHAP), a dynamic What-If simulator, and comprehensive model insights.

## Features
- **Credit Assessment Form:** A multi-section form to input personal, income, debt, and credit history details.
- **Explainable AI (SHAP):** Visualizes the exact impact of each feature on the final prediction, ensuring transparency.
- **What-If Simulator:** Allows users to adjust financial factors (e.g., debt, credit utilization) and instantly see the simulated impact on their score.
- **Model Insights & History:** View detailed model performance metrics (ROC-AUC, F1, Accuracy) and a log of past predictions.
- **Demo Profiles:** One-click loading of realistic synthetic profiles (Healthy, Moderate Risk, High Risk) for quick demonstrations.

## Architecture
- **Backend:** FastAPI (Python 3.11+), Scikit-learn, XGBoost, SHAP, SQLite (SQLAlchemy)
- **Frontend:** React, Vite, TypeScript, Recharts, Lucide Icons
- **ML Pipeline:** Preprocessing (scaling, imputation, one-hot encoding), Feature Engineering (DTI, utilization, reliability), Model Evaluation & Selection.

## Machine Learning Pipeline
The pipeline handles missing values, scales numerical features, and encodes categorical ones. It prevents data leakage by ensuring the target variable is never used in feature engineering and preprocessing is fitted only on the training data. 

### Feature Engineering
Features derived include:
- Debt-to-Income Ratio
- Monthly Debt Burden
- Payment Reliability
- Employment Stability
- Savings-to-Income Ratio

### Model Comparison
Four models are trained and evaluated:
- Logistic Regression
- Decision Tree
- Random Forest
- XGBoost

The final model is selected based on a transparent composite criterion favoring ROC-AUC and Recall (to minimize costly false negatives).

## Responsible AI
This platform is a demonstration of AI-powered credit risk assessment. It uses synthetic demo data and does not use protected characteristics (race, gender, religion). Predictions are not guaranteed financial decisions.

## Installation

### Prerequisites
- Python 3.11+
- Node.js (v24.21+)

### Backend Setup
```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

### Running the Backend
Train the model first, then start the server:
```powershell
cd backend
python ml/train.py
uvicorn main:app --reload
```

### Frontend Setup & Running
```powershell
cd frontend
npm install
npm run dev
```

## Demo
Once both servers are running:
1. Open your browser to the URL provided by Vite (usually `http://localhost:5173`).
2. Navigate to **Credit Assessment**.
3. Click on a **Demo Profile** (e.g., "Moderate Risk Profile").
4. Scroll down and click **Run Credit Assessment**.
5. Explore the Result, Key Risk Factors, SHAP Contributions, and the AI Insight.
6. Use the **What-If Simulator** to adjust debt or late payments and observe the score change.

## Testing
Basic automated tests for the backend API can be run with:
```powershell
cd backend
pytest tests/
```
