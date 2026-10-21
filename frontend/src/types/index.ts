// CreditWise AI — TypeScript types

export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH';

export interface FactorItem {
  factor: string;
  explanation: string;
  impact: number;
}

export interface ShapContribution {
  feature: string;
  label: string;
  shap_value: number;
  direction: 'risk' | 'good';
}

export interface PredictionResult {
  record_id: number;
  prediction: string;
  probability: number;
  credit_score: number;
  confidence: number;
  risk_level: RiskLevel;
  threshold_used: number;
  top_risk_factors: FactorItem[];
  positive_factors: FactorItem[];
  shap_contributions: ShapContribution[];
  insight: string;
  model: string;
  model_version: string;
}

export interface PredictionInput {
  age: number;
  employment_status: 'Employed' | 'Self-Employed' | 'Unemployed' | 'Retired';
  employment_length: number;
  annual_income: number;
  monthly_income: number;
  savings: number;
  total_debt: number;
  monthly_debt_payment: number;
  existing_loans: number;
  credit_history_length: number;
  num_credit_accounts: number;
  credit_utilization: number;
  num_inquiries: number;
  num_open_loans: number;
  on_time_payments: number;
  late_payments: number;
  previous_defaults: number;
  threshold: number;
}

export interface WhatIfInput {
  base_input: PredictionInput;
  annual_income?: number;
  total_debt?: number;
  credit_utilization?: number;
  late_payments?: number;
  monthly_debt_payment?: number;
  savings?: number;
}

export interface WhatIfResult {
  original: PredictionResult;
  scenario: PredictionResult;
  score_delta: number;
  probability_delta: number;
  disclaimer: string;
}

export interface ModelMetrics {
  accuracy: number;
  balanced_accuracy: number;
  precision: number;
  recall: number;
  f1: number;
  roc_auc: number;
  pr_auc: number;
  cv_roc_auc_mean: number;
  cv_roc_auc_std: number;
}

export interface ModelResult {
  model_name: string;
  accuracy: number;
  balanced_accuracy: number;
  precision: number;
  recall: number;
  f1: number;
  roc_auc: number;
  pr_auc: number;
  confusion_matrix: number[][];
  cv_roc_auc_mean: number;
  cv_roc_auc_std: number;
  composite_score: number;
}

export interface ModelInfo {
  model_name: string;
  version: string;
  training_date: string;
  dataset: string;
  n_training_samples: number;
  n_features: number;
  feature_names: string[];
  metrics: ModelMetrics;
  all_model_results: ModelResult[];
  selection_criterion: string;
  confusion_matrix: number[][];
}

export interface PredictionRecord {
  id: number;
  timestamp: string;
  model_name: string;
  model_version: string;
  probability: number;
  credit_score: number;
  risk_level: RiskLevel;
  prediction_label: string;
  confidence: number;
  threshold_used: number;
  annual_income_range: string;
  employment_status: string;
}

export interface PredictionHistory {
  total: number;
  records: PredictionRecord[];
}

export interface RiskDistItem {
  name: string;
  value: number;
  color: string;
}

export interface TrendItem {
  id: number;
  timestamp: string;
  credit_score: number;
  probability: number;
  risk_level: RiskLevel;
}

export interface Analytics {
  total_assessments: number;
  low_risk_count: number;
  moderate_risk_count: number;
  high_risk_count: number;
  avg_credit_score: number | null;
  avg_probability: number | null;
  risk_distribution: RiskDistItem[];
  recent_trend: TrendItem[];
}
