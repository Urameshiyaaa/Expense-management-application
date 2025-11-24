// src/pages/ReportsPage.tsx
import React from 'react';
import { MonthlyReport } from '../components/MonthlyReport';
import { YearlyReport } from '../components/YearlyReport';
import '../styles/dashboard.css';

const ReportsPage: React.FC = () => {
  const userId = 1;
  const year = new Date().getFullYear();
  const month = new Date().getMonth() + 1;

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Báo cáo tháng</h2>
      <div className="chart-container" style={{ marginBottom: 20 }}>
        <MonthlyReport userId={userId} year={year} month={month} />
      </div>

      <h2 style={{ marginTop: '2rem' }}>Báo cáo năm</h2>
      <div className="chart-container">
        <YearlyReport userId={userId} year={year} />
      </div>
    </div>
  );
};

export default ReportsPage;
