// src/api/reportsApi.ts
import axios from 'axios';

export interface CategoryData {
  category: string;
  amount: number;
}

export interface MonthlyReportData {
  monthTotal: number;
  budget: number | null;
  pctOfBudget: number | null;
  overBudget: number;
  byCategory: CategoryData[];
}

export interface YearlyReportData {
  month: number;
  spent: number;
  budget: number;
  overrun: number;
}

export const getMonthlyReport = (userId: number, year: number, month: number) =>
  axios.get<MonthlyReportData>('/api/reports/monthly', { params: { userId, year, month } });

export const getYearlyReport = (userId: number, year: number) =>
  axios.get<YearlyReportData[]>('/api/reports/yearly', { params: { userId, year } });
