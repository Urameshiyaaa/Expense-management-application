// src/components/MonthlyReport.tsx
import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { getMonthlyReport } from '../api/reportsApi';
import '../styles/dashboard.css';

interface CategoryData {
  name: string;
  amount: number;
}

interface MonthlyReportProps {
  userId: number;
  year: number;
  month: number;
  highlightOnHover?: boolean;
}

export const MonthlyReport: React.FC<MonthlyReportProps> = ({ userId, year, month, highlightOnHover }) => {
  const [data, setData] = useState<CategoryData[]>([]);
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A52A2A', '#8A2BE2', '#FF1493'];

  useEffect(() => {
    getMonthlyReport(userId, year, month)
      .then(res => setData(res.data.categories || []))
      .catch(console.error);
  }, [userId, year, month]);

  return (
    <div>
      <h3>Chi tiêu theo danh mục tháng {month}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="amount"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            isAnimationActive={true}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value: number) => `${value.toLocaleString()} VNĐ`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
