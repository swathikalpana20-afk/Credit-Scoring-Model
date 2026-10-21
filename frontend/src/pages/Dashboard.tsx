import React, { useEffect, useState } from 'react';
import {
  BarChart3,
  CheckCircle,
  TrendingUp,
  Users,
  AlertTriangle,
  Activity,
  Calendar,
  Cpu,
} from 'lucide-react';
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import { apiService } from '../services/api';
import type { Analytics, ModelInfo } from '../types';
import { formatPercent } from '../utils/helpers';

const Dashboard: React.FC = () => {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [modelInfo, setModelInfo] = useState<ModelInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [a, m] = await Promise.allSettled([
          apiService.analytics(),
          apiService.modelInfo(),
        ]);
        if (a.status === 'fulfilled') setAnalytics(a.value);
        if (m.status === 'fulfilled') setModelInfo(m.value);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="loading-overlay">
        <div className="spinner" />
        <span>Loading dashboard...</span>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">
          CreditWise AI — Intelligent Credit Risk Assessment Platform
        </p>
      </div>

      <div className="page-content">
        {error && (
          <div className="alert alert-warning" style={{ marginBottom: 20 }}>
            <AlertTriangle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Model Status Banner */}
        {modelInfo ? (
          <div
            className="card"
            style={{
              marginBottom: 24,
              background: 'linear-gradient(135deg, rgba(59,130,246,0.1) 0%, rgba(139,92,246,0.1) 100%)',
              borderColor: 'rgba(59,130,246,0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: 24,
              flexWrap: 'wrap',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div className="pulse-dot" />
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--accent-blue-light)' }}>
                  Model Ready
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {modelInfo.model_name} v{modelInfo.version}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 24, flex: 1, flexWrap: 'wrap' }}>
              {[
                { label: 'ROC-AUC', value: modelInfo.metrics.roc_auc.toFixed(4) },
                { label: 'F1-Score', value: modelInfo.metrics.f1.toFixed(4) },
                { label: 'Accuracy', value: formatPercent(modelInfo.metrics.accuracy) },
                { label: 'Features', value: modelInfo.n_features },
                { label: 'Training Records', value: modelInfo.n_training_samples.toLocaleString() },
              ].map((item) => (
                <div key={item.label}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {item.label}
                  </div>
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1rem' }}>
                    {item.value}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              <Calendar size={12} style={{ display: 'inline', marginRight: 4 }} />
              Trained: {modelInfo.training_date ? new Date(modelInfo.training_date).toLocaleDateString() : 'N/A'}
            </div>
          </div>
        ) : (
          <div className="alert alert-warning" style={{ marginBottom: 24 }}>
            <AlertTriangle size={16} />
            <span>
              Model not loaded. Please run: <code>python ml/train.py</code> in the backend directory.
            </span>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid-4" style={{ marginBottom: 24 }}>
          <div className="stat-card">
            <div className="stat-label">Total Assessments</div>
            <div className="stat-value">{analytics?.total_assessments ?? 0}</div>
            <Users size={40} className="stat-icon" />
          </div>
          <div className="stat-card" style={{ borderTop: '2px solid var(--accent-emerald)' }}>
            <div className="stat-label">Low Risk</div>
            <div className="stat-value" style={{ color: 'var(--accent-emerald)' }}>
              {analytics?.low_risk_count ?? 0}
            </div>
            <CheckCircle size={40} className="stat-icon" />
          </div>
          <div className="stat-card" style={{ borderTop: '2px solid var(--accent-amber)' }}>
            <div className="stat-label">Moderate Risk</div>
            <div className="stat-value" style={{ color: 'var(--accent-amber)' }}>
              {analytics?.moderate_risk_count ?? 0}
            </div>
            <Activity size={40} className="stat-icon" />
          </div>
          <div className="stat-card" style={{ borderTop: '2px solid var(--accent-rose)' }}>
            <div className="stat-label">High Risk</div>
            <div className="stat-value" style={{ color: 'var(--accent-rose)' }}>
              {analytics?.high_risk_count ?? 0}
            </div>
            <AlertTriangle size={40} className="stat-icon" />
          </div>
        </div>

        <div className="grid-2" style={{ marginBottom: 24 }}>
          {/* Risk Distribution Chart */}
          <div className="card">
            <h3 style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
              <BarChart3 size={18} color="var(--accent-blue-light)" />
              Risk Distribution
            </h3>
            {analytics && analytics.total_assessments > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={analytics.risk_distribution}
                    cx="50%"
                    cy="50%"
                    outerRadius={85}
                    innerRadius={50}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                    labelLine={false}
                  >
                    {analytics.risk_distribution.map((entry, idx) => (
                      <Cell key={idx} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 8,
                      fontSize: '0.8rem',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div
                style={{
                  height: 220,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-muted)',
                  fontSize: '0.85rem',
                }}
              >
                No assessment data yet. Run a Credit Assessment to see distribution.
              </div>
            )}
          </div>

          {/* Recent Trend */}
          <div className="card">
            <h3 style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
              <TrendingUp size={18} color="var(--accent-blue-light)" />
              Credit Score Trend
            </h3>
            {analytics && analytics.recent_trend.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={analytics.recent_trend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                  <XAxis
                    dataKey="id"
                    tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
                    label={{ value: 'Assessment #', position: 'insideBottom', offset: -2, fill: 'var(--text-muted)', fontSize: 11 }}
                  />
                  <YAxis
                    domain={[0, 900]}
                    tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
                  />
                  <Tooltip
                    contentStyle={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 8,
                      fontSize: '0.8rem',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="credit_score"
                    stroke="var(--accent-blue)"
                    strokeWidth={2}
                    dot={{ fill: 'var(--accent-blue)', r: 3 }}
                    name="Credit Score"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div
                style={{
                  height: 220,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-muted)',
                  fontSize: '0.85rem',
                }}
              >
                No trend data yet.
              </div>
            )}
          </div>
        </div>

        {/* How the AI Decides */}
        <div className="card">
          <h3 style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Cpu size={18} color="var(--accent-purple)" />
            How the AI Decides — Model Transparency
          </h3>
          <div style={{ display: 'flex', gap: 0, flexWrap: 'wrap' }}>
            {[
              { step: '1', title: 'Input Data', desc: 'Raw financial profile submitted by user' },
              { step: '2', title: 'Feature Engineering', desc: 'Derived metrics: DTI, payment reliability, utilization ratios' },
              { step: '3', title: 'Preprocessing', desc: 'Imputation, scaling, one-hot encoding via sklearn Pipeline' },
              { step: '4', title: 'ML Model', desc: modelInfo ? modelInfo.model_name : 'Best model selected by ROC-AUC + Recall + F1' },
              { step: '5', title: 'Probability', desc: 'Default probability output from model.predict_proba()' },
              { step: '6', title: 'Risk Classification', desc: 'Threshold-based: LOW / MODERATE / HIGH' },
              { step: '7', title: 'Explainability', desc: 'SHAP values reveal per-feature contribution to prediction' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', flexWrap: 'nowrap' }}>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '12px 16px',
                  minWidth: 110,
                }}>
                  <div style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    background: 'rgba(99,102,241,0.15)',
                    border: '1px solid rgba(99,102,241,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    color: '#a78bfa',
                    marginBottom: 8,
                  }}>
                    {item.step}
                  </div>
                  <div style={{ fontWeight: 600, fontSize: '0.78rem', textAlign: 'center', color: 'var(--text-primary)' }}>{item.title}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: 2 }}>{item.desc}</div>
                </div>
                {i < 6 && (
                  <div style={{ color: 'var(--text-muted)', fontSize: '1.2rem', padding: '0 4px' }}>→</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Responsible AI Notice */}
        <div className="responsible-ai-notice" style={{ marginTop: 24 }}>
          <strong>⚖ Responsible AI & Model Limitations</strong>
          This platform is a demonstration of AI-powered credit risk assessment technology.
          Predictions are generated by a machine learning model trained on synthetic demo data.
          Results do <strong>not</strong> constitute regulated financial advice, official credit scores,
          or guaranteed lending decisions. The model may exhibit bias from training data and should always
          be reviewed by qualified financial professionals before any real-world use.
          Protected characteristics (race, religion, gender, etc.) are not used as features.
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
