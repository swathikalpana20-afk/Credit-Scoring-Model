import React, { useEffect, useState } from 'react';
import { History as HistoryIcon, Loader2 } from 'lucide-react';
import { apiService } from '../services/api';
import type { PredictionHistory } from '../types';
import { formatDate, getRiskBadgeClass } from '../utils/helpers';

const History: React.FC = () => {
  const [data, setData] = useState<PredictionHistory | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await apiService.predictions(100);
        setData(res);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="loading-overlay">
        <Loader2 className="spinner" />
        <span>Loading prediction history...</span>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Prediction History</h1>
        <p className="page-subtitle">
          Review past credit assessments (showing up to 100 recent records)
        </p>
      </div>

      <div className="page-content">
        <div className="card">
          <h3 style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
            <HistoryIcon size={18} color="var(--accent-blue-light)" />
            Assessment Log
          </h3>
          
          {data && data.records.length > 0 ? (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Date</th>
                    <th>Income Range</th>
                    <th>Employment</th>
                    <th>Score</th>
                    <th>Probability</th>
                    <th>Risk Level</th>
                    <th>Model</th>
                  </tr>
                </thead>
                <tbody>
                  {data.records.map((r) => (
                    <tr key={r.id}>
                      <td>#{r.id}</td>
                      <td>{formatDate(r.timestamp)}</td>
                      <td>{r.annual_income_range || 'Unknown'}</td>
                      <td>{r.employment_status || 'Unknown'}</td>
                      <td style={{ fontWeight: 600 }}>{r.credit_score}</td>
                      <td>{(r.probability * 100).toFixed(1)}%</td>
                      <td>
                        <span className={getRiskBadgeClass(r.risk_level)}>
                          {r.prediction_label.replace(/[✓!⚠]/g, '').trim()}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {r.model_name}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
              No prediction history found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default History;
