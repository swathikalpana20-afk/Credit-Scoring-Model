// CreditWise AI — API Service

import axios from 'axios';
import type {
  Analytics,
  ModelInfo,
  PredictionHistory,
  PredictionInput,
  PredictionResult,
  WhatIfInput,
  WhatIfResult,
} from '../types';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: `${BASE_URL}/api`,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

// Intercept errors and return user-friendly messages
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (!error.response) {
      return Promise.reject(
        new Error(
          'Credit assessment service is temporarily unavailable. Please start the backend server and try again.'
        )
      );
    }
    const detail =
      error.response.data?.detail ||
      error.response.data?.error ||
      'An unexpected error occurred. Please try again.';
    return Promise.reject(new Error(detail));
  }
);

export const apiService = {
  async health(): Promise<{ status: string; service: string; timestamp: string }> {
    const res = await api.get('/health');
    return res.data;
  },

  async predict(input: PredictionInput): Promise<PredictionResult> {
    const res = await api.post('/predict', input);
    return res.data;
  },

  async whatIf(input: WhatIfInput): Promise<WhatIfResult> {
    const res = await api.post('/whatif', input);
    return res.data;
  },

  async modelInfo(): Promise<ModelInfo> {
    const res = await api.get('/model-info');
    return res.data;
  },

  async metrics(): Promise<{
    best_model: string;
    best_model_metrics: object;
    all_models: object[];
    selection_criterion: string;
    confusion_matrix: number[][];
    n_features: number;
    feature_names: string[];
    training_date: string;
  }> {
    const res = await api.get('/metrics');
    return res.data;
  },

  async predictions(limit = 50): Promise<PredictionHistory> {
    const res = await api.get(`/predictions?limit=${limit}`);
    return res.data;
  },

  async analytics(): Promise<Analytics> {
    const res = await api.get('/analytics');
    return res.data;
  },
};
