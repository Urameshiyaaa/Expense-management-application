import React from 'react';
import { MonthlyReport } from '../components/MonthlyReport';
import { YearlyReport } from '../components/YearlyReport';

export const ReportsPage: React.FC = () => {
  const userId = 1; // hoặc lấy từ context/auth
  const year = new Date().getFullYear();
  const month = new Date().getMonth() + 1;

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Báo cáo tháng</h2>
      <MonthlyReport userId={userId} year={year} month={month} />

      <h2 style={{ marginTop: '2rem' }}>Báo cáo năm</h2>
      <YearlyReport userId={userId} year={year} />
    </div>
  );
};
