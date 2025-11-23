// src/pages/DashboardPage.tsx
import React, { useState, useEffect } from 'react';
import { MonthlyReport } from '../components/MonthlyReport';
import { YearlyReport } from '../components/YearlyReport';
import { MonthlyReportData, getMonthlyReport } from '../api/reportsApi';
import '../styles/dashboard.css';

export const DashboardPage: React.FC = () => {
  const userId = 1;
  const year = new Date().getFullYear();
  const month = new Date().getMonth() + 1;

  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 768);
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [monthlyData, setMonthlyData] = useState<MonthlyReportData | null>(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);

    getMonthlyReport(userId, year, month)
      .then(res => setMonthlyData(res.data))
      .catch(console.error);

    return () => window.removeEventListener('resize', handleResize);
  }, [userId, year, month]);

  return (
    <div className="dashboard-wrapper" style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Navbar */}
      <div className="dashboard-navbar">
        <span>Expense Dashboard</span>
        {!isMobile && (
          <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)}>☰</button>
        )}
      </div>

      <div style={{ display: 'flex', flex: 1 }}>
        {/* Sidebar */}
        {!isMobile && (
          <div className={`dashboard-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
            <ul>
              <li>Dashboard</li>
              <li>Transactions</li>
              <li>Budgets</li>
              <li>Categories</li>
            </ul>
          </div>
        )}

        {/* Main content */}
        <div style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
          <h1 style={{ marginBottom: '1.5rem' }}>Dashboard Báo cáo Chi tiêu</h1>

          {/* Alert */}
          {monthlyData && monthlyData.overBudget > 0 && (
            <div className="dashboard-alert">
              <span>⚠️</span>
              <span>Bạn đã vượt định mức {monthlyData.overBudget.toLocaleString()} VNĐ!</span>
            </div>
          )}

          {/* Cards */}
          {monthlyData && (
            <div className={`dashboard-cards ${isMobile ? 'column' : 'row'}`}>
              <div className="dashboard-card">{/* Tổng chi */}<h4>Tổng chi tháng</h4><p>{monthlyData.monthTotal.toLocaleString()} VNĐ</p></div>
              <div className="dashboard-card">{/* Định mức */}<h4>Định mức</h4><p>{(monthlyData.budget || 0).toLocaleString()} VNĐ</p></div>
              <div className="dashboard-card">{/* Chi vượt */}<h4>Chi vượt</h4><p>{monthlyData.overBudget.toLocaleString()} VNĐ</p></div>
              <div className="dashboard-card">{/* Tiết kiệm */}<h4>Tiết kiệm</h4><p>{((monthlyData.budget || 0) - monthlyData.monthTotal).toLocaleString()} VNĐ</p></div>
            </div>
          )}

          {/* Grid Charts */}
          <div className="dashboard-grid">
            <div className="chart-container">
              <MonthlyReport userId={userId} year={year} month={month} highlightOnHover />
            </div>
            <div className="chart-container">
              <YearlyReport userId={userId} year={year} stackedGradient />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
