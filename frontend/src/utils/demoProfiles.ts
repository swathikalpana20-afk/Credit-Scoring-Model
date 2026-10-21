// CreditWise AI — Demo Profiles

import type { PredictionInput } from '../types';

export interface DemoProfile {
  name: string;
  description: string;
  badge: 'low' | 'moderate' | 'high';
  data: PredictionInput;
}

export const DEMO_PROFILES: DemoProfile[] = [
  {
    name: 'Healthy Profile',
    description: 'Stable employed, low debt, excellent payment history',
    badge: 'low',
    data: {
      age: 38,
      employment_status: 'Employed',
      employment_length: 12,
      annual_income: 95000,
      monthly_income: 7917,
      savings: 42000,
      total_debt: 18000,
      monthly_debt_payment: 620,
      existing_loans: 1,
      credit_history_length: 15,
      num_credit_accounts: 6,
      credit_utilization: 0.12,
      num_inquiries: 1,
      num_open_loans: 1,
      on_time_payments: 72,
      late_payments: 0,
      previous_defaults: 0,
      threshold: 0.5,
    },
  },
  {
    name: 'Moderate Risk Profile',
    description: 'Average income, moderate debt, some late payments',
    badge: 'moderate',
    data: {
      age: 32,
      employment_status: 'Self-Employed',
      employment_length: 4,
      annual_income: 55000,
      monthly_income: 4583,
      savings: 8000,
      total_debt: 38000,
      monthly_debt_payment: 1200,
      existing_loans: 3,
      credit_history_length: 6,
      num_credit_accounts: 4,
      credit_utilization: 0.52,
      num_inquiries: 4,
      num_open_loans: 3,
      on_time_payments: 36,
      late_payments: 5,
      previous_defaults: 0,
      threshold: 0.5,
    },
  },
  {
    name: 'High Risk Profile',
    description: 'Unemployed, high debt, multiple defaults',
    badge: 'high',
    data: {
      age: 29,
      employment_status: 'Unemployed',
      employment_length: 0,
      annual_income: 18000,
      monthly_income: 1500,
      savings: 500,
      total_debt: 52000,
      monthly_debt_payment: 1800,
      existing_loans: 5,
      credit_history_length: 3,
      num_credit_accounts: 7,
      credit_utilization: 0.88,
      num_inquiries: 9,
      num_open_loans: 5,
      on_time_payments: 12,
      late_payments: 14,
      previous_defaults: 2,
      threshold: 0.5,
    },
  },
];
