import React from 'react';
import {
  CheckCircle,
  AlertTriangle,
  XOctagon,
  TrendingUp,
  TrendingDown,
  Info,
} from 'lucide-react';
import type { PredictionResult, PredictionInput } from '../types';
import ScoreRing from './ScoreRing';
import ShapBarChart from './ShapBarChart';
import { formatPercent } from '../utils/helpers';

interface PredictionResultPanelProps {
  result: PredictionResult;
  input: PredictionInput;
}

const PredictionResultPanel: React.FC<PredictionResultPanelProps> = ({ result }) => {
  return (
    <div className="result-panel">
      <div className="card">
        <div className="result-header">
          <div>
            <h2 style={{ fontSize: '1.25rem', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
              CreditWise AI Result
              {result.risk_level === 'LOW' && <CheckCircle size={20} color="var(--accent-emerald)" />}
              {result.risk_level === 'MODERATE' && <AlertTriangle size={20} color="var(--accent-amber)" />}
              {result.risk_level === 'HIGH' && <XOctagon size={20} color="var(--accent-rose)" />}
            </h2>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Assessment ID: #{result.record_id} • Model: {result.model} v{result.model_version}
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: 16 }}>
             <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Default Risk</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>{formatPercent(result.probability)}</div>
             </div>
             <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Confidence</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>{formatPercent(result.confidence)}</div>
             </div>
          </div>
        </div>

        <div className="grid-3" style={{ alignItems: 'start' }}>
          {/* Left: Score Ring */}
          <div style={{ display: 'flex', justifyContent: 'center', padding: '20px 0' }}>
            <ScoreRing score={result.credit_score} riskLevel={result.risk_level} />
          </div>

          {/* Middle: Factors */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <h4 style={{ fontSize: '0.85rem', color: 'var(--accent-rose)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                <TrendingUp size={14} /> Key Risk Factors
              </h4>
              {result.top_risk_factors.length > 0 ? (
                <div className="factor-list">
                  {result.top_risk_factors.map((f, i) => (
                    <div key={i} className="factor-item risk-item">
                      <TrendingUp size={14} className="factor-icon" color="var(--accent-rose)" />
                      <div className="factor-text">
                        <div className="factor-name">{f.factor}</div>
                        <div className="factor-explanation">{f.explanation}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', padding: '8px 0' }}>
                  No significant risk factors identified.
                </div>
              )}
            </div>

            <div>
              <h4 style={{ fontSize: '0.85rem', color: 'var(--accent-emerald)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                <TrendingDown size={14} /> Positive Factors
              </h4>
              {result.positive_factors.length > 0 ? (
                 <div className="factor-list">
                  {result.positive_factors.map((f, i) => (
                    <div key={i} className="factor-item good-item">
                      <CheckCircle size={14} className="factor-icon" color="var(--accent-emerald)" />
                      <div className="factor-text">
                        <div className="factor-name">{f.factor}</div>
                        <div className="factor-explanation">{f.explanation}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', padding: '8px 0' }}>
                  No significant positive factors identified.
                </div>
              )}
            </div>
          </div>

          {/* Right: SHAP Contributions */}
          <div>
             <h4 style={{ fontSize: '0.85rem', color: 'var(--text-primary)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Info size={14} color="var(--accent-blue)" /> Feature Contributions
             </h4>
             <ShapBarChart contributions={result.shap_contributions} />
          </div>
        </div>

        <div style={{ marginTop: 24, padding: 16, background: 'var(--bg-glass)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--accent-purple)', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
             <Info size={14} /> AI Financial Insight
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
            {result.insight}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PredictionResultPanel;
