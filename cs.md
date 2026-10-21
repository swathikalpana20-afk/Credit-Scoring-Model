# 🚀 CREDITWISE AI — ULTIMATE GOD MODE MASTER PROMPT v2.0

## ROLE

You are a **Senior AI/ML Engineer + Full-Stack Architect + Data Scientist + UI/UX Engineer + MLOps Engineer + Product Designer** with 10+ years of professional experience.

You are responsible for designing and implementing a **production-quality Credit Scoring & Creditworthiness Prediction Platform**.

Do NOT create a basic college-level ML demo.

Build this as if it is being developed by a **professional AI product engineering team** for a fintech company.

The final application must look **premium, modern, intelligent, trustworthy, explainable, responsive, and presentation-ready**.

The project must be:

* Fully functional
* Modular
* Error-resistant
* Easy to run
* Easy to demonstrate
* Properly documented
* ML-driven
* Explainable
* Secure by design
* Responsive
* Professional enough for a hackathon/project exhibition
* Suitable for GitHub portfolio presentation

---

# 1. PROJECT TITLE

Use the product name:

## CREDITWISE AI

### Intelligent Credit Risk & Creditworthiness Assessment Platform

Tagline:

> "Smarter Risk Decisions. Clearer Financial Insights."

Do NOT use generic names such as `credit_prediction_app`.

---

# 2. CORE OBJECTIVE

Build an AI-powered platform that predicts an individual's **credit risk / creditworthiness** from historical financial information.

The system should analyze financial characteristics such as:

* Annual income
* Monthly income
* Existing debt
* Debt-to-income ratio
* Credit history
* Payment history
* Number of late payments
* Number of credit accounts
* Credit utilization
* Loan amount
* Loan duration
* Employment status
* Employment length
* Savings/assets
* Previous defaults
* Number of open loans
* Number of inquiries
* Other relevant financial indicators

The system should produce:

1. Credit Risk Prediction
2. Creditworthiness Score
3. Risk Category
4. Probability of Default / Risk Probability
5. Confidence Level
6. Key Risk Factors
7. Positive Financial Factors
8. Explainable AI insights
9. Model performance metrics
10. Prediction history

---

# 3. IMPORTANT PRODUCT PRINCIPLE

This is NOT merely a machine-learning prediction page.

Create a complete AI product with:

```text
Data
 ↓
Validation
 ↓
Feature Engineering
 ↓
Preprocessing
 ↓
Model Training
 ↓
Model Evaluation
 ↓
Model Selection
 ↓
Prediction API
 ↓
Explainability Layer
 ↓
Professional Dashboard
```

Every layer must be properly separated.

---

# 4. RECOMMENDED TECH STACK

Use the following stack unless there is a strong technical reason to improve it.

## Backend

* Python 3.11+
* FastAPI
* Pydantic
* Uvicorn
* Pandas
* NumPy
* Scikit-learn
* XGBoost
* Joblib
* SHAP
* SQLite
* SQLAlchemy

## Frontend

Prefer:

* React
* Vite
* TypeScript
* Tailwind CSS
* Recharts
* Lucide Icons

If the existing project environment already contains another frontend framework, preserve it rather than unnecessarily rebuilding everything.

## ML

Implement and compare:

* Logistic Regression
* Decision Tree
* Random Forest
* XGBoost

Optional:

* Gradient Boosting

The final model should NOT be selected manually.

Select the best model using a clearly documented evaluation strategy.

---

# 5. PROJECT ARCHITECTURE

Create a clean architecture similar to:

```text
creditwise-ai/
│
├── backend/
│   ├── api/
│   │   ├── routes/
│   │   │   ├── prediction.py
│   │   │   ├── model.py
│   │   │   ├── health.py
│   │   │   └── analytics.py
│   │   │
│   │   └── schemas/
│   │       ├── prediction.py
│   │       └── response.py
│   │
│   ├── ml/
│   │   ├── preprocessing.py
│   │   ├── feature_engineering.py
│   │   ├── train.py
│   │   ├── evaluate.py
│   │   ├── predict.py
│   │   └── explain.py
│   │
│   ├── models/
│   │   ├── model.pkl
│   │   ├── scaler.pkl
│   │   └── metadata.json
│   │
│   ├── datasets/
│   │
│   ├── database/
│   │   ├── database.py
│   │   └── models.py
│   │
│   ├── tests/
│   │
│   ├── main.py
│   ├── requirements.txt
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── types/
│   │   └── utils/
│   │
│   ├── package.json
│   └── README.md
│
├── docs/
│   ├── architecture.md
│   ├── ml_pipeline.md
│   └── api.md
│
├── README.md
└── start.md
```

Do not create unnecessary files.

Keep the architecture maintainable.

---

# 6. DATASET STRATEGY

The application must work with a real credit-risk dataset.

Prefer a reputable publicly available dataset such as:

* German Credit Dataset
* Home Credit dataset
* Give Me Some Credit
* Lending Club-derived dataset
* Other legitimate public credit-risk datasets

Do NOT fabricate realistic-looking financial records and falsely claim they are real.

If internet dataset download is unavailable:

Create a clearly labelled **demo/synthetic dataset generator** so the application remains runnable.

Clearly distinguish:

```text
REAL DATASET
```

from

```text
DEMO / SYNTHETIC DATA
```

Never misrepresent synthetic data as real financial data.

---

# 7. DATA PREPROCESSING

Implement a robust preprocessing pipeline.

Handle:

* Missing values
* Duplicate rows
* Numerical features
* Categorical features
* Outliers
* Invalid values
* Scaling
* Encoding
* Class imbalance

Use appropriate preprocessing such as:

```text
Numerical → Imputation → Scaling
Categorical → Imputation → One-Hot Encoding
```

Use `Pipeline` and `ColumnTransformer` wherever appropriate.

The preprocessing pipeline MUST be saved together with the model.

Avoid training-serving skew.

---

# 8. FEATURE ENGINEERING

Create meaningful financial features.

Examples:

### Debt-to-Income Ratio

```text
DTI = Total Debt / Annual Income
```

### Monthly Debt Burden

```text
Monthly Debt Burden =
Monthly Debt Payments / Monthly Income
```

### Credit Utilization

```text
Credit Utilization =
Used Credit / Total Available Credit
```

### Payment Reliability

Create a meaningful payment reliability feature from payment history.

### Employment Stability

Derive a stability indicator from employment duration.

### Credit Age

If credit account dates are available, derive credit-history age.

All engineered features must be documented.

Do not create features that leak the target variable.

---

# 9. DATA LEAKAGE PREVENTION

This is mandatory.

Ensure that:

* Target information is never used as an input feature.
* Future information is not used to predict past outcomes.
* Preprocessing is fitted only on training data.
* Feature engineering does not accidentally use target labels.
* Train/test separation happens correctly.

Document leakage prevention in the ML documentation.

---

# 10. MODEL TRAINING

Train at least:

### Model 1

Logistic Regression

### Model 2

Decision Tree

### Model 3

Random Forest

### Model 4

XGBoost

Use:

* Train/Test split
* Stratification when required
* Cross-validation
* Hyperparameter tuning where practical

Do not blindly optimize accuracy.

---

# 11. MODEL EVALUATION

Evaluate every model using:

* Accuracy
* Precision
* Recall
* F1-Score
* ROC-AUC
* Confusion Matrix

For imbalanced datasets also consider:

* PR-AUC
* Balanced Accuracy

Create a model comparison table:

```text
Model              Accuracy    Precision    Recall    F1    ROC-AUC
--------------------------------------------------------------------
Logistic Regression
Decision Tree
Random Forest
XGBoost
```

Select the final model using a transparent criterion.

Do NOT simply choose the model with the highest accuracy.

For credit-risk prediction, discuss the consequences of false positives and false negatives.

---

# 12. CLASSIFICATION THRESHOLD

Do not permanently assume:

```text
threshold = 0.5
```

Make the classification threshold configurable.

Allow the system to calculate:

```text
Probability
+
Threshold
=
Risk Classification
```

The UI should clearly explain that changing the threshold changes classification outcomes.

---

# 13. CREDIT RISK SCORE

Create a normalized risk/creditworthiness score for presentation.

Use a transparent transformation of the model probability.

Example conceptual scale:

```text
0 – 300      Very High Risk
301 – 500    High Risk
501 – 650    Moderate Risk
651 – 750    Good
751 – 900    Excellent
```

IMPORTANT:

These ranges are for the application's demonstration scoring system only.

Do NOT claim that this is an official bank/FICO/CIBIL score.

Clearly label it:

> "CreditWise AI Score — Demonstration Score"

---

# 14. RISK CATEGORIES

Create clear categories:

```text
LOW RISK
MODERATE RISK
HIGH RISK
```

The category must be generated from the model's probability/score.

Do not hard-code the prediction based on arbitrary input rules.

---

# 15. EXPLAINABLE AI

This is one of the most important features.

Use SHAP where appropriate.

For every prediction show:

## Why this prediction happened

Example:

```text
Key Risk Factors

↑ High debt-to-income ratio
↑ Multiple late payments
↑ High credit utilization

Positive Factors

✓ Stable employment history
✓ Strong payment consistency
✓ Healthy income-to-debt relationship
```

Display feature contribution visually.

Use:

* SHAP bar chart
* Feature importance
* Contribution direction
* Human-readable explanation

Never show raw mathematical output only.

Convert technical output into understandable explanations.

---

# 16. FAIRNESS & RESPONSIBLE AI

This is mandatory for a professional credit-scoring project.

Do NOT use sensitive/protected attributes for prediction unless explicitly required for a controlled research/fairness analysis.

Avoid using:

* Race
* Religion
* Caste
* Political affiliation
* Sexual orientation
* Other unnecessary sensitive characteristics

Include a Responsible AI section explaining:

* Model limitations
* Bias risks
* Data quality limitations
* Human review
* Explainability
* No guaranteed lending decision
* Not a replacement for regulated financial decision-making

The application must NOT claim:

> "Loan guaranteed."

Instead use:

> "AI-generated risk assessment for demonstration purposes."

---

# 17. BACKEND API

Create clean REST APIs.

### Health

```http
GET /api/health
```

### Prediction

```http
POST /api/predict
```

### Model information

```http
GET /api/model-info
```

### Metrics

```http
GET /api/metrics
```

### Prediction history

```http
GET /api/predictions
```

### Analytics

```http
GET /api/analytics
```

Use Pydantic validation.

Return consistent JSON.

Example:

```json
{
  "prediction": "Low Risk",
  "probability": 0.18,
  "credit_score": 742,
  "confidence": 0.82,
  "risk_level": "LOW",
  "top_risk_factors": [],
  "positive_factors": [],
  "model": "Random Forest"
}
```

Never expose stack traces to the frontend.

---

# 18. FRONTEND — PREMIUM UI

The UI must NOT look like a basic HTML college project.

Create a premium fintech-style dashboard.

Design language:

* Clean
* Modern
* Minimal
* Professional
* Data-rich
* Responsive
* Accessible

Use:

* Cards
* Glass/soft panels where appropriate
* Subtle gradients
* Smooth transitions
* Clear typography
* Modern icons
* Interactive charts
* Progress indicators
* Risk badges
* Responsive layouts

Avoid:

* Excessive animations
* Overly bright colors
* Clutter
* Huge unnecessary text
* Generic template appearance

---

# 19. MAIN DASHBOARD

Create:

## CREDITWISE AI Dashboard

Top section:

```text
CreditWise AI
Intelligent Credit Risk Assessment
```

Dashboard cards:

```text
Total Assessments
Low Risk
Moderate Risk
High Risk
Model Accuracy
```

Charts:

* Risk distribution
* Model performance
* Prediction trend
* Feature importance

---

# 20. CREDIT ASSESSMENT PAGE

Create a professional multi-section form.

Sections:

### Personal & Employment

* Age
* Employment status
* Employment length

### Income

* Annual income
* Monthly income

### Debt

* Total debt
* Monthly debt payment
* Existing loans

### Credit History

* Credit history length
* Number of credit accounts
* Credit utilization
* Recent inquiries

### Payment Behaviour

* On-time payments
* Late payments
* Previous defaults

Use:

* Input validation
* Tooltips
* Helpful descriptions
* Numeric constraints
* Dropdowns where appropriate

---

# 21. DEMO DATA FEATURE

VERY IMPORTANT.

Add a button:

## "Load Demo Profile"

When clicked, populate the form with a realistic demo customer.

Add multiple demo profiles:

```text
Healthy Profile
Moderate Risk Profile
High Risk Profile
```

This allows fast project demonstrations.

The demo values must be clearly labelled as demonstration data.

---

# 22. PREDICTION RESULT SCREEN

After submission, show a visually impressive result.

Example:

```text
CREDITWISE AI RESULT

CreditWise Score
742 / 900

Risk Level
LOW RISK

Default Risk Probability
18%

Model Confidence
82%
```

Then show:

### Why?

```text
+ Stable employment
+ Strong payment history
+ Moderate debt burden
- Slightly high credit utilization
```

Use visual indicators.

---

# 23. MODEL INSIGHTS PAGE

Create a dedicated page containing:

### Model Comparison

Compare:

* Logistic Regression
* Decision Tree
* Random Forest
* XGBoost

Show:

* Accuracy
* Precision
* Recall
* F1
* ROC-AUC

### Confusion Matrix

Display an interactive or clean chart.

### Feature Importance

Show the most influential features.

---

# 24. PREDICTION HISTORY

Store predictions in SQLite.

Each record should contain:

* Timestamp
* Score
* Risk category
* Probability
* Model version
* Important input summary

Display history in a clean table.

Do NOT unnecessarily store sensitive personal information.

---

# 25. ANALYTICS

Create an analytics dashboard with:

* Risk distribution
* Average score
* Average risk probability
* Assessment count
* Model metrics
* Recent prediction trend

Charts should be responsive.

---

# 26. ERROR HANDLING

This is mandatory.

Handle:

* Missing input
* Invalid numeric values
* Negative income
* Invalid percentages
* Model missing
* Dataset missing
* API unavailable
* Database error
* Prediction failure
* Unexpected backend errors

Frontend must display friendly messages such as:

> "We couldn't process this assessment. Please check the entered financial information."

Never show:

```text
Traceback...
```

to the user.

---

# 27. LOADING STATES

Implement proper loading states.

Example:

```text
Analyzing financial profile...
Validating data...
Running ML model...
Generating explanation...
Preparing assessment...
```

Then show result.

---

# 28. API ERROR FALLBACK

If backend is unavailable:

Display:

> "Credit assessment service is temporarily unavailable. Please start the backend server and try again."

Do not crash the entire frontend.

---

# 29. SECURITY

Implement basic security best practices.

* Environment variables
* No hardcoded secrets
* Input validation
* CORS configuration
* Safe error handling
* No sensitive logging
* No unnecessary personal-data storage

Create:

```text
.env.example
```

Never commit actual secrets.

---

# 30. DATABASE

Use SQLite for simplicity.

Create a prediction history table.

Example:

```text
Prediction
----------
id
timestamp
model_name
model_version
probability
credit_score
risk_level
created_at
```

Keep stored information minimal.

---

# 31. MODEL VERSIONING

Store model metadata.

Example:

```json
{
  "model_name": "RandomForestClassifier",
  "version": "1.0",
  "training_date": "...",
  "dataset": "...",
  "features": [],
  "metrics": {}
}
```

Display model information in the dashboard.

---

# 32. TESTING

Create tests for:

### Backend

* Health API
* Prediction API
* Invalid input
* Missing input
* Model loading
* Database insertion

### ML

* Preprocessing
* Feature engineering
* Prediction shape
* Probability range
* Model loading

### Frontend

Test important components if practical.

Minimum requirement:

The project must run without obvious runtime errors.

---

# 33. AUTOMATED VALIDATION

Before considering the project complete, perform:

```text
1. Install dependencies
2. Run preprocessing
3. Train models
4. Evaluate models
5. Save final model
6. Start backend
7. Test APIs
8. Start frontend
9. Test prediction flow
10. Test demo profiles
11. Test error states
12. Test responsive layout
```

If a command fails:

* Diagnose the actual cause
* Fix it
* Re-run the failed step
* Continue only after validation

Do NOT simply ignore errors.

---

# 34. REQUIREMENTS FILE

Generate a clean `requirements.txt`.

Pin versions when compatibility is important.

Avoid unnecessary dependencies.

Do not install libraries that are never used.

---

# 35. README

Create a professional README containing:

## CreditWise AI

### Overview

### Features

### Architecture

### Tech Stack

### Dataset

### Machine Learning Pipeline

### Feature Engineering

### Model Comparison

### Explainable AI

### Responsible AI

### API Documentation

### Installation

### Running the Backend

### Running the Frontend

### Demo

### Screenshots section

### Project Structure

### Testing

### Limitations

### Future Improvements

---

# 36. START COMMANDS

The final README must contain exact commands.

Example:

### Backend

```bash
cd backend
python -m venv venv
```

Windows:

```powershell
.\venv\Scripts\Activate.ps1
```

Then:

```bash
pip install -r requirements.txt
python ml/train.py
uvicorn main:app --reload
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

Adjust commands to the actual generated project.

Do NOT document commands that do not exist.

---

# 37. WINDOWS COMPATIBILITY

The developer is using Windows.

Ensure commands work with:

```text
PowerShell
Windows Terminal
VS Code / Antigravity
```

Do not assume Linux-only commands.

Avoid:

```bash
source venv/bin/activate
```

for Windows instructions.

---

# 38. ANTIGRAVITY DEVELOPMENT RULE

You are operating inside an Antigravity development environment.

FIRST inspect the existing project.

Before creating files:

1. Inspect directory structure.
2. Identify existing files.
3. Identify existing backend/frontend.
4. Identify existing dependencies.
5. Reuse working components.
6. Avoid unnecessary rewrites.

Never destroy working code without reason.

If an existing implementation is better than a proposed implementation, preserve it.

---

# 39. CODE QUALITY

Write code like a senior engineer.

Requirements:

* Clear naming
* Type hints where useful
* Modular functions
* Small reusable components
* No giant files unless justified
* No duplicated logic
* No unnecessary comments
* Meaningful comments for complex ML logic
* Proper exception handling
* Logging
* Clean imports

Never use:

```python
except:
    pass
```

Never hide errors.

---

# 40. UI QUALITY STANDARD

The final UI should pass this test:

> "If this screenshot is shown without explanation, it should look like a professional fintech AI product rather than a student CRUD application."

Use consistent:

* Spacing
* Typography
* Cards
* Icons
* Buttons
* Form controls
* Charts
* Status indicators

Ensure mobile/tablet/desktop responsiveness.

---

# 41. UNIQUE FEATURE — AI FINANCIAL INSIGHT

Add an intelligent insight section.

Example:

```text
Financial Insight

Your current debt burden is one of the strongest contributors
to the predicted risk level.

Improving payment consistency and reducing revolving credit
utilization may positively affect the profile.
```

IMPORTANT:

Do not make guaranteed financial claims.

Use wording such as:

* "may"
* "could"
* "is associated with"
* "according to this model"

---

# 42. UNIQUE FEATURE — WHAT-IF SIMULATOR

Create a professional "What-If Analysis" feature.

Allow the user to adjust selected financial values such as:

* Debt
* Income
* Credit utilization
* Late payments

Then recalculate the model prediction.

Display:

```text
Current Profile
        ↓
What-If Scenario
        ↓
Updated Risk Probability
        ↓
Score Difference
```

Clearly label this as a model simulation.

Do not present the result as a guaranteed future outcome.

---

# 43. UNIQUE FEATURE — MODEL TRANSPARENCY

Create:

## "How the AI Decides"

Show:

```text
Input Data
   ↓
Feature Engineering
   ↓
Preprocessing
   ↓
ML Model
   ↓
Probability
   ↓
Risk Classification
   ↓
Explainability
```

This makes the project highly suitable for viva/project presentation.

---

# 44. UNIQUE FEATURE — MODEL HEALTH

Dashboard should show:

```text
Model Status
● Ready

Model Version
1.0

Training Dataset
XXXX records

Features
XX

ROC-AUC
XX

Last Trained
DATE
```

Do not hard-code these values.

Read them from model metadata.

---

# 45. PRESENTATION MODE

Add a clean demonstration-friendly mode.

It should allow:

```text
Load Demo Profile
        ↓
Predict
        ↓
Show Score
        ↓
Show Risk
        ↓
Show Explanation
        ↓
Show Model Reasoning
```

The entire flow should be fast enough for a live college presentation.

---

# 46. ACCESSIBILITY

Ensure:

* Keyboard-friendly forms
* Proper labels
* Good contrast
* Meaningful error messages
* Icons with accessible labels
* Responsive layout

Do not depend only on color to communicate risk.

Example:

```text
LOW RISK ✓
MODERATE RISK !
HIGH RISK ⚠
```

---

# 47. RESPONSIVE DESIGN

The application must work on:

```text
Desktop
Laptop
Tablet
Mobile
```

Do not allow charts or tables to overflow horizontally unnecessarily.

---

# 48. NO FAKE FEATURES

Never create buttons that do nothing.

Every visible button must:

* Work
* Navigate
* Trigger an API
* Open a modal
* Perform an action

Remove unfinished UI.

Do not write:

```text
Coming Soon
```

unless specifically requested.

---

# 49. NO PLACEHOLDER CONTENT

Do not leave:

```text
Lorem ipsum
Test User
ABC Company
Sample Text
TODO
FIXME
Coming Soon
```

in the final UI.

Demo data is allowed only when clearly identified as demo data.

---

# 50. FINAL PROJECT CHECKLIST

Before declaring completion, verify:

### ML

[ ] Dataset available
[ ] Preprocessing works
[ ] Feature engineering works
[ ] Multiple models trained
[ ] Metrics calculated
[ ] Best model selected
[ ] Model saved
[ ] Metadata saved
[ ] SHAP/explainability works

### Backend

[ ] FastAPI starts
[ ] Health endpoint works
[ ] Prediction endpoint works
[ ] Validation works
[ ] Database works
[ ] Error handling works

### Frontend

[ ] Dashboard works
[ ] Assessment form works
[ ] Demo profiles work
[ ] Prediction result works
[ ] Charts work
[ ] Model comparison works
[ ] History works
[ ] What-if simulator works
[ ] Responsive design works

### Quality

[ ] No obvious runtime errors
[ ] No broken imports
[ ] No dead buttons
[ ] No fake metrics
[ ] No fake dataset claims
[ ] No exposed stack traces
[ ] README complete
[ ] Setup commands verified

---

# 51. FINAL EXECUTION RULE

Do NOT stop after generating files.

You must behave like a senior developer responsible for delivering a working product.

Follow this loop:

```text
INSPECT
  ↓
PLAN
  ↓
IMPLEMENT
  ↓
RUN
  ↓
TEST
  ↓
FIND ERRORS
  ↓
FIX
  ↓
RE-RUN
  ↓
VALIDATE
  ↓
POLISH
```

If you encounter an error:

### DO NOT SAY:

"Please fix this manually."

Instead:

1. Identify the root cause.
2. Modify the relevant code.
3. Re-run the failing command.
4. Verify the fix.
5. Continue development.

---

# 52. FINAL DELIVERABLE

At the end, provide:

```text
PROJECT STATUS
--------------
Backend: READY
Frontend: READY
ML Pipeline: READY
Database: READY
Explainability: READY
Testing: READY

FINAL MODEL:
<actual selected model>

ROC-AUC:
<actual value>

F1:
<actual value>

PROJECT RUN COMMANDS:
<actual verified commands>
```

Do NOT invent metrics.

Only show metrics actually produced by the trained model.

---

# 53. MOST IMPORTANT INSTRUCTION

Build this project with the mindset:

> "This is going to be evaluated by a senior software engineer, ML engineer, and project review panel."

Therefore prioritize:

**Correctness > Reliability > Explainability > Security > UX > Visual polish**

But achieve all six wherever practical.

The final result should feel like a **real AI fintech product**, not merely a machine-learning notebook converted into a webpage.

START NOW.

First inspect the existing project structure.

Then implement the complete CreditWise AI system incrementally.

Do not stop until the application is runnable and the complete prediction workflow has been validated.
