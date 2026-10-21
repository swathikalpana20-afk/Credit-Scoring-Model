import React, { useState } from 'react';
import { Zap, ArrowRight } from 'lucide-react';
import { apiService } from '../services/api';
import type { PredictionInput, WhatIfResult } from '../types';
import { DEMO_PROFILES } from '../utils/demoProfiles';
import ScoreRing from '../components/ScoreRing';
import { formatPercent } from '../utils/helpers';

const WhatIfSimulator: React.FC = () => {
  const [baseProfile] = useState<PredictionInput>(DEMO_PROFILES[1].data);
  const [scenario, setScenario] = useState<{
    total_debt: number;
    credit_utilization: number;
    late_payments: number;
  }>({
    total_debt: baseProfile.total_debt,
    credit_utilization: baseProfile.credit_utilization,
    late_payments: baseProfile.late_payments,
  });
  
  const [result, setResult] = useState<WhatIfResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSimulate = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiService.whatIf({
        base_input: baseProfile,
        total_debt: scenario.total_debt,
        credit_utilization: scenario.credit_utilization,
        late_payments: scenario.late_payments,
      });
      setResult(res);
    } catch (e: any) {
      setError(e.message || 'Simulation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">What-If Simulator</h1>
        <p className="page-subtitle">
          Adjust financial factors to see how they impact the predicted risk score
        </p>
      </div>

      <div className="page-content">
        <div className="grid-2">
           <div className="card">
              <h3 style={{ marginBottom: 20 }}>1. Current Profile (Moderate Risk Demo)</h3>
              
              <div className="form-group" style={{ marginBottom: 16 }}>
                 <label className="form-label">Total Debt ($)</label>
                 <input type="number" className="form-input" disabled value={baseProfile.total_debt} />
              </div>
              <div className="form-group" style={{ marginBottom: 16 }}>
                 <label className="form-label">Credit Utilization (0-1)</label>
                 <input type="number" className="form-input" disabled value={baseProfile.credit_utilization} />
              </div>
              <div className="form-group" style={{ marginBottom: 16 }}>
                 <label className="form-label">Late Payments</label>
                 <input type="number" className="form-input" disabled value={baseProfile.late_payments} />
              </div>
           </div>

           <div className="card" style={{ borderColor: 'var(--accent-blue-light)' }}>
              <h3 style={{ marginBottom: 20, color: 'var(--accent-blue-light)' }}>2. Adjusted Scenario</h3>
              
              <div className="form-group" style={{ marginBottom: 16 }}>
                 <label className="form-label">Total Debt ($)</label>
                 <input 
                    type="number" 
                    className="form-input" 
                    value={scenario.total_debt}
                    onChange={(e) => setScenario({...scenario, total_debt: Number(e.target.value) || 0})}
                 />
              </div>
              <div className="form-group" style={{ marginBottom: 16 }}>
                 <label className="form-label">Credit Utilization (0-1)</label>
                 <input 
                    type="number" 
                    className="form-input"
                    step="0.05"
                    min="0" max="1"
                    value={scenario.credit_utilization}
                    onChange={(e) => setScenario({...scenario, credit_utilization: Number(e.target.value) || 0})}
                 />
              </div>
              <div className="form-group" style={{ marginBottom: 16 }}>
                 <label className="form-label">Late Payments</label>
                 <input 
                    type="number" 
                    className="form-input"
                    value={scenario.late_payments}
                    onChange={(e) => setScenario({...scenario, late_payments: Number(e.target.value) || 0})}
                 />
              </div>

              <button className="btn btn-primary btn-full" onClick={handleSimulate} disabled={loading}>
                 <Zap size={16} /> {loading ? 'Simulating...' : 'Run Simulation'}
              </button>
           </div>
        </div>

        {error && (
          <div className="alert alert-error" style={{ marginTop: 24 }}>
            {error}
          </div>
        )}

        {result && (
           <div className="card" style={{ marginTop: 24, animation: 'slideUp 0.4s ease' }}>
              <h3 style={{ marginBottom: 24, textAlign: 'center' }}>Simulation Result</h3>
              
              <div className="whatif-comparison">
                 <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 16 }}>Current Profile</div>
                    <ScoreRing score={result.original.credit_score} riskLevel={result.original.risk_level} size={140} />
                    <div style={{ marginTop: 12, fontWeight: 600 }}>Default Risk: {formatPercent(result.original.probability)}</div>
                 </div>

                 <div className="whatif-arrow">
                    <ArrowRight size={24} color="var(--text-muted)" />
                    <div style={{ padding: '4px 12px', background: 'var(--bg-secondary)', borderRadius: 100, marginTop: 8, fontWeight: 600, color: result.score_delta > 0 ? 'var(--accent-emerald)' : (result.score_delta < 0 ? 'var(--accent-rose)' : 'var(--text-muted)') }}>
                       {result.score_delta > 0 && '+'}{result.score_delta} Pts
                    </div>
                 </div>

                 <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--accent-blue-light)', marginBottom: 16 }}>Simulated Scenario</div>
                    <ScoreRing score={result.scenario.credit_score} riskLevel={result.scenario.risk_level} size={140} />
                    <div style={{ marginTop: 12, fontWeight: 600 }}>Default Risk: {formatPercent(result.scenario.probability)}</div>
                 </div>
              </div>

              <div style={{ marginTop: 24, padding: 16, background: 'var(--bg-glass)', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                 {result.disclaimer}
              </div>
           </div>
        )}
      </div>
    </div>
  );
};

export default WhatIfSimulator;
