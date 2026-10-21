import React from 'react';
import type { RiskLevel } from '../types';
import { getRiskColor, getScoreLabel } from '../utils/helpers';

interface ScoreRingProps {
  score: number;
  riskLevel: RiskLevel;
  size?: number;
}

const ScoreRing: React.FC<ScoreRingProps> = ({ score, riskLevel, size = 160 }) => {
  const color = getRiskColor(riskLevel);
  const label = getScoreLabel(score);
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const fillPercent = score / 900;
  const strokeDashoffset = circumference * (1 - fillPercent);
  const center = size / 2;

  return (
    <div className="score-ring-container">
      <div className="score-ring" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {/* Background track */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="var(--bg-secondary)"
            strokeWidth={10}
          />
          {/* Score arc */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={10}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.4,0,0.2,1)', filter: `drop-shadow(0 0 8px ${color}60)` }}
          />
        </svg>
        <div className="score-text">
          <div className="score-number" style={{ color }}>
            {score}
          </div>
          <div className="score-max">/ 900</div>
        </div>
      </div>
      <div
        style={{
          fontSize: '0.85rem',
          fontWeight: 600,
          color,
          letterSpacing: '0.04em',
        }}
      >
        {label}
      </div>
      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textAlign: 'center', maxWidth: 160 }}>
        CreditWise AI Score — Demonstration Score Only
      </div>
    </div>
  );
};

export default ScoreRing;
