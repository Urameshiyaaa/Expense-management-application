// src/api/reportsApi.ts
import axiosClient from './axiosClient'; //Đức: Fix import


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
//Đức: Fix phương thức get của axiosClient
export const getMonthlyReport = (userId: number, year: number, month: number) =>
  axiosClient.get<MonthlyReportData>('/reports/monthly', { params: { userId, year, month } });

export const getYearlyReport = (userId: number, year: number) =>
  axiosClient.get<YearlyReportData[]>('/reports/yearly', { params: { userId, year } });
