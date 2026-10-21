import React, { useEffect, useState } from 'react';
import { GitCompare, AlertTriangle, Loader2 } from 'lucide-react';
import { apiService } from '../services/api';
import type { ModelInfo } from '../types';

const ModelInsights: React.FC = () => {
  const [modelInfo, setModelInfo] = useState<ModelInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await apiService.modelInfo();
        setModelInfo(data);
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
        <Loader2 className="spinner" />
        <span>Loading model insights...</span>
      </div>
    );
  }

  if (error || !modelInfo) {
    return (
      <div className="page-content" style={{ paddingTop: 32 }}>
        <div className="alert alert-warning">
          <AlertTriangle size={16} />
          <span>{error || 'Model information not available.'}</span>
        </div>
      </div>
    );
  }

  const { all_model_results, selection_criterion, confusion_matrix, feature_names } = modelInfo;
  
  // Basic confusion matrix rendering (2x2)
  const [tn, fp] = confusion_matrix[0] || [0, 0];
  const [fn, tp] = confusion_matrix[1] || [0, 0];
  const total = tn + fp + fn + tp || 1;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Model Insights</h1>
        <p className="page-subtitle">
          Compare trained machine learning models and review evaluation metrics
        </p>
      </div>

      <div className="page-content">
        <div className="card" style={{ marginBottom: 24 }}>
          <h3 style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <GitCompare size={18} color="var(--accent-blue-light)" />
            Model Comparison
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 16 }}>
            Selection Criterion: {selection_criterion}
          </p>
          
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Model</th>
                  <th>ROC-AUC</th>
                  <th>Recall (Sensitivity)</th>
                  <th>F1 Score</th>
                  <th>Accuracy</th>
                  <th>Composite Score</th>
                </tr>
              </thead>
              <tbody>
                {all_model_results.map((m) => (
                  <tr key={m.model_name} style={{ backgroundColor: m.model_name === modelInfo.model_name ? 'rgba(59, 130, 246, 0.1)' : 'transparent' }}>
                    <td style={{ fontWeight: m.model_name === modelInfo.model_name ? 600 : 400 }}>
                      {m.model_name}
                      {m.model_name === modelInfo.model_name && (
                        <span className="badge badge-low" style={{ marginLeft: 8, fontSize: '0.65rem' }}>SELECTED</span>
                      )}
                    </td>
                    <td>{m.roc_auc.toFixed(4)}</td>
                    <td>{m.recall.toFixed(4)}</td>
                    <td>{m.f1.toFixed(4)}</td>
                    <td>{m.accuracy.toFixed(4)}</td>
                    <td style={{ fontWeight: 600 }}>{m.composite_score.toFixed(4)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid-2">
           <div className="card">
              <h3 style={{ marginBottom: 16 }}>Confusion Matrix (Best Model)</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 16 }}>
                Based on the test set. Shows true vs predicted classifications.
              </p>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr 1fr', gap: 2, background: 'var(--border-color)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
                 <div style={{ background: 'var(--bg-secondary)', padding: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}></div>
                 <div style={{ background: 'var(--bg-secondary)', padding: 12, textAlign: 'center', fontSize: '0.75rem', fontWeight: 600 }}>Predicted Negative (Good)</div>
                 <div style={{ background: 'var(--bg-secondary)', padding: 12, textAlign: 'center', fontSize: '0.75rem', fontWeight: 600 }}>Predicted Positive (Risk)</div>
                 
                 <div style={{ background: 'var(--bg-secondary)', padding: 12, display: 'flex', alignItems: 'center', fontSize: '0.75rem', fontWeight: 600 }}>Actual Negative (Good)</div>
                 <div style={{ background: 'var(--bg-card)', padding: 24, textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent-emerald)' }}>{tn}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>True Negative ({((tn/total)*100).toFixed(1)}%)</div>
                 </div>
                 <div style={{ background: 'var(--bg-card)', padding: 24, textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent-amber)' }}>{fp}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>False Positive ({((fp/total)*100).toFixed(1)}%)</div>
                 </div>
                 
                 <div style={{ background: 'var(--bg-secondary)', padding: 12, display: 'flex', alignItems: 'center', fontSize: '0.75rem', fontWeight: 600 }}>Actual Positive (Risk)</div>
                 <div style={{ background: 'var(--bg-card)', padding: 24, textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent-rose)' }}>{fn}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>False Negative ({((fn/total)*100).toFixed(1)}%)</div>
                 </div>
                 <div style={{ background: 'var(--bg-card)', padding: 24, textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent-blue)' }}>{tp}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>True Positive ({((tp/total)*100).toFixed(1)}%)</div>
                 </div>
              </div>
           </div>

           <div className="card">
              <h3 style={{ marginBottom: 16 }}>Feature Space</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 16 }}>
                 The model was trained on {modelInfo.n_features} features, including raw and engineered data.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                 {feature_names.map((f, i) => (
                    <span key={i} className="tag tag-blue" style={{ fontSize: '0.7rem' }}>{f}</span>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ModelInsights;
