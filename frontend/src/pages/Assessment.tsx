import React, { useState } from 'react';
import {
  User,
  Briefcase,
  DollarSign,
  CreditCard,
  Clock,
  AlertCircle,
  Loader2,
  Info,
  ChevronRight,
} from 'lucide-react';
import { apiService } from '../services/api';
import type { PredictionInput, PredictionResult } from '../types';
import { DEMO_PROFILES } from '../utils/demoProfiles';
import PredictionResultPanel from '../components/PredictionResultPanel';

const DEFAULT_INPUT: PredictionInput = {
  age: 30,
  employment_status: 'Employed',
  employment_length: 5,
  annual_income: 60000,
  monthly_income: 5000,
  savings: 10000,
  total_debt: 20000,
  monthly_debt_payment: 600,
  existing_loans: 2,
  credit_history_length: 5,
  num_credit_accounts: 3,
  credit_utilization: 0.30,
  num_inquiries: 2,
  num_open_loans: 2,
  on_time_payments: 36,
  late_payments: 1,
  previous_defaults: 0,
  threshold: 0.5,
};

const LOADING_STEPS = [
  'Validating financial data...',
  'Running feature engineering...',
  'Applying ML model...',
  'Computing SHAP explanations...',
  'Preparing assessment report...',
];

const Assessment: React.FC = () => {
  const [input, setInput] = useState<PredictionInput>(DEFAULT_INPUT);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [selectedProfile, setSelectedProfile] = useState<number | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const loadProfile = (idx: number) => {
    setSelectedProfile(idx);
    setInput({ ...DEMO_PROFILES[idx].data });
    setResult(null);
    setError(null);
    setFormErrors({});
  };

  const handleChange = (field: keyof PredictionInput, value: string | number) => {
    setInput((prev) => ({ ...prev, [field]: value }));
    setFormErrors((prev) => ({ ...prev, [field]: '' }));
    setSelectedProfile(null);
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    if (input.annual_income <= 0) errors.annual_income = 'Annual income must be positive';
    if (input.monthly_income > input.annual_income)
      errors.monthly_income = 'Monthly income cannot exceed annual income';
    if (input.age < 18 || input.age > 100) errors.age = 'Age must be between 18–100';
    if (input.credit_utilization < 0 || input.credit_utilization > 1)
      errors.credit_utilization = 'Must be between 0 and 1';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    setLoadingStep(0);

    // Simulate step progression
    const stepInterval = setInterval(() => {
      setLoadingStep((prev) => Math.min(prev + 1, LOADING_STEPS.length - 1));
    }, 600);

    try {
      const res = await apiService.predict(input);
      clearInterval(stepInterval);
      setResult(res);
    } catch (e: any) {
      clearInterval(stepInterval);
      setError(e.message || 'We couldn\'t process this assessment. Please check the entered financial information.');
    } finally {
      setLoading(false);
    }
  };

  const num = (field: keyof PredictionInput) => ({
    value: input[field] as number,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
      handleChange(field, parseFloat(e.target.value) || 0),
  });

  const int = (field: keyof PredictionInput) => ({
    value: input[field] as number,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
      handleChange(field, parseInt(e.target.value) || 0),
  });

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Credit Assessment</h1>
        <p className="page-subtitle">
          Submit a financial profile for AI-powered creditworthiness evaluation
        </p>
      </div>

      <div className="page-content">
        {/* Demo Profile Selector */}
        <div className="card" style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <Info size={16} color="var(--accent-blue-light)" />
            <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>
              Load Demo Profile{' '}
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 400 }}>
                — clearly labelled demonstration data
              </span>
            </span>
          </div>
          <div className="demo-profiles">
            {DEMO_PROFILES.map((p, i) => (
              <button
                key={i}
                className={`demo-profile-btn ${selectedProfile === i ? 'selected' : ''}`}
                onClick={() => loadProfile(i)}
              >
                <div className="demo-profile-name">
                  <span className={`badge badge-${p.badge}`} style={{ marginRight: 6, fontSize: '0.65rem' }}>
                    {p.badge.toUpperCase()}
                  </span>
                  {p.name}
                </div>
                <div className="demo-profile-desc">{p.description}</div>
              </button>
            ))}
          </div>
          {selectedProfile !== null && (
            <div className="alert alert-info" style={{ marginBottom: 0 }}>
              <Info size={14} />
              <span>
                Demo data loaded: <strong>{DEMO_PROFILES[selectedProfile].name}</strong>.
                This is synthetic demonstration data — not real financial information.
              </span>
            </div>
          )}
        </div>

        {/* Assessment Form */}
        <div className="card" style={{ marginBottom: 24 }}>
          {/* Section 1: Personal & Employment */}
          <div className="form-section">
            <div className="form-section-title">
              <User size={16} color="var(--accent-blue-light)" />
              Personal & Employment
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label" htmlFor="age">Age</label>
                <input id="age" type="number" className="form-input" min={18} max={100} {...int('age')} />
                {formErrors.age && <span className="form-error">{formErrors.age}</span>}
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="emp-status">Employment Status</label>
                <select
                  id="emp-status"
                  className="form-select"
                  value={input.employment_status}
                  onChange={(e) => handleChange('employment_status', e.target.value as any)}
                >
                  <option value="Employed">Employed</option>
                  <option value="Self-Employed">Self-Employed</option>
                  <option value="Unemployed">Unemployed</option>
                  <option value="Retired">Retired</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="emp-length">Employment Length (years)</label>
                <input id="emp-length" type="number" className="form-input" min={0} max={50} {...int('employment_length')} />
              </div>
            </div>
          </div>

          {/* Section 2: Income */}
          <div className="form-section">
            <div className="form-section-title">
              <DollarSign size={16} color="var(--accent-emerald)" />
              Income
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label" htmlFor="annual-income">Annual Income ($)</label>
                <input id="annual-income" type="number" className="form-input" min={1} step={1000} {...num('annual_income')} />
                {formErrors.annual_income && <span className="form-error">{formErrors.annual_income}</span>}
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="monthly-income">Monthly Income ($)</label>
                <input id="monthly-income" type="number" className="form-input" min={1} step={100} {...num('monthly_income')} />
                {formErrors.monthly_income && <span className="form-error">{formErrors.monthly_income}</span>}
                <span className="form-hint">Should be ≈ Annual Income ÷ 12</span>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="savings">Savings / Assets ($)</label>
                <input id="savings" type="number" className="form-input" min={0} step={500} {...num('savings')} />
              </div>
            </div>
          </div>

          {/* Section 3: Debt */}
          <div className="form-section">
            <div className="form-section-title">
              <Briefcase size={16} color="var(--accent-amber)" />
              Debt
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label" htmlFor="total-debt">Total Debt ($)</label>
                <input id="total-debt" type="number" className="form-input" min={0} step={1000} {...num('total_debt')} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="monthly-debt">Monthly Debt Payment ($)</label>
                <input id="monthly-debt" type="number" className="form-input" min={0} step={100} {...num('monthly_debt_payment')} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="existing-loans">Number of Existing Loans</label>
                <input id="existing-loans" type="number" className="form-input" min={0} max={50} {...int('existing_loans')} />
              </div>
            </div>
          </div>

          {/* Section 4: Credit History */}
          <div className="form-section">
            <div className="form-section-title">
              <CreditCard size={16} color="var(--accent-cyan)" />
              Credit History
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label" htmlFor="credit-hist">Credit History Length (years)</label>
                <input id="credit-hist" type="number" className="form-input" min={0} max={50} {...int('credit_history_length')} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="num-accounts">Number of Credit Accounts</label>
                <input id="num-accounts" type="number" className="form-input" min={0} max={50} {...int('num_credit_accounts')} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="credit-util">Credit Utilization (0–1)</label>
                <input
                  id="credit-util"
                  type="number"
                  className="form-input"
                  min={0}
                  max={1}
                  step={0.01}
                  {...num('credit_utilization')}
                />
                {formErrors.credit_utilization && <span className="form-error">{formErrors.credit_utilization}</span>}
                <span className="form-hint">E.g., 0.30 = 30% utilization</span>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="num-inquiries">Recent Credit Inquiries</label>
                <input id="num-inquiries" type="number" className="form-input" min={0} max={50} {...int('num_inquiries')} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="num-open-loans">Number of Open Loans</label>
                <input id="num-open-loans" type="number" className="form-input" min={0} max={50} {...int('num_open_loans')} />
              </div>
            </div>
          </div>

          {/* Section 5: Payment Behaviour */}
          <div className="form-section">
            <div className="form-section-title">
              <Clock size={16} color="var(--accent-purple)" />
              Payment Behaviour
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label" htmlFor="on-time">On-Time Payments (count)</label>
                <input id="on-time" type="number" className="form-input" min={0} {...int('on_time_payments')} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="late">Late Payments (count)</label>
                <input id="late" type="number" className="form-input" min={0} {...int('late_payments')} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="defaults">Previous Defaults (count)</label>
                <input id="defaults" type="number" className="form-input" min={0} max={20} {...int('previous_defaults')} />
              </div>
            </div>
          </div>

          {/* Classification Threshold */}
          <div className="form-section" style={{ marginBottom: 0 }}>
            <div className="form-section-title">
              <AlertCircle size={16} color="var(--text-muted)" />
              Classification Threshold
            </div>
            <div className="threshold-control">
              <div className="threshold-header">
                <span className="threshold-label">
                  Threshold: lower = more conservative (flags more as High Risk)
                </span>
                <span className="threshold-value">{input.threshold.toFixed(2)}</span>
              </div>
              <input
                type="range"
                id="threshold"
                min={0.1}
                max={0.9}
                step={0.05}
                value={input.threshold}
                onChange={(e) => handleChange('threshold', parseFloat(e.target.value))}
                aria-label="Classification threshold"
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                <span>0.10 — Very Conservative</span>
                <span>0.50 — Standard</span>
                <span>0.90 — Very Permissive</span>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 6 }}>
                Changing this threshold changes the risk classification outcome without affecting the underlying probability.
              </p>
            </div>
          </div>
        </div>

        {/* Submit */}
        <button
          className="btn btn-primary btn-full btn-lg"
          onClick={handleSubmit}
          disabled={loading}
          id="submit-assessment"
          style={{ marginBottom: 24 }}
        >
          {loading ? (
            <>
              <Loader2 size={18} className="spin" style={{ animation: 'spin 1s linear infinite' }} />
              {LOADING_STEPS[loadingStep]}
            </>
          ) : (
            <>
              <ChevronRight size={18} />
              Run Credit Assessment
            </>
          )}
        </button>

        {/* Error */}
        {error && (
          <div className="alert alert-error" style={{ marginBottom: 24 }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Result */}
        {result && <PredictionResultPanel result={result} input={input} />}
      </div>
    </div>
  );
};

export default Assessment;
