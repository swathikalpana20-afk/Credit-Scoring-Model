// CreditWise AI — Utility functions

import type { RiskLevel } from '../types';

export function getRiskColor(level: RiskLevel): string {
  switch (level) {
    case 'LOW': return '#10b981';
    case 'MODERATE': return '#f59e0b';
    case 'HIGH': return '#ef4444';
    default: return '#94a3b8';
  }
}

export function getRiskBadgeClass(level: RiskLevel): string {
  switch (level) {
    case 'LOW': return 'badge badge-low';
    case 'MODERATE': return 'badge badge-moderate';
    case 'HIGH': return 'badge badge-high';
    default: return 'badge';
  }
}

export function formatPercent(val: number): string {
  return `${(val * 100).toFixed(1)}%`;
}

export function formatCurrency(val: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(val);
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getScoreGradient(score: number): string {
  if (score >= 751) return 'var(--gradient-success)';
  if (score >= 651) return 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)';
  if (score >= 501) return 'var(--gradient-warning)';
  return 'var(--gradient-danger)';
}

export function getScoreLabel(score: number): string {
  if (score >= 751) return 'Excellent';
  if (score >= 651) return 'Good';
  if (score >= 501) return 'Moderate Risk';
  if (score >= 301) return 'High Risk';
  return 'Very High Risk';
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}
