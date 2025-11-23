// src/components/YearlyReport.tsx
import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { getYearlyReport } from '../api/reportsApi';
import '../styles/dashboard.css';

interface MonthlyData {
  month: string;
  spent: number;
  budget: number;
  overBudget: number;
}

interface YearlyReportProps {
  userId: number;
  year: number;
  stackedGradient?: boolean;
}

export const YearlyReport: React.FC<YearlyReportProps> = ({ userId, year }) => {
  const [data, setData] = useState<MonthlyData[]>([]);
  const COLORS = ['#0088FE', '#52C41A', '#FF4D4F'];

  useEffect(() => {
    getYearlyReport(userId, year)
      .then(res => setData(res.data || []))
      .catch(console.error);
  }, [userId, year]);

  return (
    <div>
      <h3>Chi tiêu theo tháng năm {year}</h3>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip formatter={(value: number) => `${value.toLocaleString()} VNĐ`} />
          <Legend />
          <Bar dataKey="spent" stackId="a" fill={COLORS[0]} />
          <Bar dataKey="budget" stackId="a" fill={COLORS[1]} />
          <Bar dataKey="overBudget" stackId="a" fill={COLORS[2]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
