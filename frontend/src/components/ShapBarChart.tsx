import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import type { ShapContribution } from '../types';

interface ShapBarChartProps {
  contributions: ShapContribution[];
}

const ShapBarChart: React.FC<ShapBarChartProps> = ({ contributions }) => {
  if (!contributions || contributions.length === 0) {
    return (
      <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', padding: '8px 0' }}>
        No feature contributions available.
      </div>
    );
  }

  const maxAbs = Math.max(...contributions.map((c) => Math.abs(c.shap_value)), 0.001);

  return (
    <div className="shap-bar-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: 4 }}>
        <span>← Reduces Risk</span>
        <span>Increases Risk →</span>
      </div>
      {contributions.map((c, i) => {
        const pct = (Math.abs(c.shap_value) / maxAbs) * 48; // max 48% of half
        const isRisk = c.shap_value > 0;
        return (
          <div key={i} className="shap-bar-row">
            <div className="shap-label" title={c.label}>{c.label}</div>
            <div className="shap-bar-track">
              {/* Center line */}
              <div
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: 0,
                  width: 1,
                  height: '100%',
                  background: 'var(--border-color)',
                }}
              />
              <div
                className={`shap-bar-fill ${isRisk ? 'risk' : 'good'}`}
                style={{ width: `${pct}%` }}
              />
            </div>
            <div className="shap-value-label" style={{ color: isRisk ? 'var(--accent-rose)' : 'var(--accent-emerald)' }}>
              {isRisk ? <TrendingUp size={10} style={{ display: 'inline' }} /> : <TrendingDown size={10} style={{ display: 'inline' }} />}
              {' '}{c.shap_value.toFixed(3)}
            </div>
          </div>
        );
      })}
      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 4 }}>
        SHAP values show each feature's contribution to the default probability prediction.
      </div>
    </div>
  );
};

export default ShapBarChart;
