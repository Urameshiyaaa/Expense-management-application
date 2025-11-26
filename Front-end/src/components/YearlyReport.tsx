// src/components/YearlyReport.tsx
import React, { useEffect, useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { getYearlyReport } from '../API/reportsApi';

type YearItem = { month: number; spent: number; budget: number | null; overrun: number };

export const YearlyReport: React.FC<{ userId: number; year: number }> = ({ userId, year }) => {
  const [data, setData] = useState<YearItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getYearlyReport(userId, year)
      .then((res: { data: React.SetStateAction<YearItem[]>; }) => setData(res.data))
      .catch((err: any) => { console.error(err); setData([]); })
      .finally(() => setLoading(false));
  }, [userId, year]);

  if (loading) return <div>Đang tải...</div>;
  if (!data.length) return <div>Không có dữ liệu</div>;

  const chartData = data.map(d => ({ ...d, monthLabel: String(d.month).padStart(2, '0') }));

  return (
    <div>
      <ResponsiveContainer width="100%" height={360}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="monthLabel" />
          <YAxis />
          <Tooltip formatter={(v: number) => `${v.toLocaleString()} VNĐ`} />
          <Legend />
          <Bar dataKey="spent" name="Đã chi" fill="#0088FE" />
          <Bar dataKey="budget" name="Định mức" fill="#52C41A" />
          <Bar dataKey="overrun" name="Vượt" fill="#FF4D4F" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default YearlyReport;
