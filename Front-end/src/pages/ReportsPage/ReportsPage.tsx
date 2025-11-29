// src/pages/DashboardPage.tsx
import React, { useState, useEffect } from 'react';
import { MonthlyReport } from '../../components/MonthlyReport';
import { YearlyReport } from '../../components/YearlyReport';
import {type MonthlyReportData, getMonthlyReport} from '../../API/reportsApi'; //Đức: fix import
import './ReportPage.css';
import Header from '../../components/Header/Header';
import bgImage from '../../others/Illustration/MizukiAkiyama.jpg';
import Footer from '../../components/Footer/Footer';


const ReportPage: React.FC = () => {
  //Đức: Fix userId, lấy userId lưu trong localStorage
  const storedUser = localStorage.getItem('AuthUserObject');
  const currentUser = storedUser ? JSON.parse(storedUser) : null;
  const userId = currentUser ? Number(currentUser.user_id) : 0;  //Đức: Để userId = 0 để tránh crash khi ko tìm đc userId
 
  const year = new Date().getFullYear();
  const month = new Date().getMonth() + 1;

  const [isMobile, setIsMobile] = useState<boolean>(() => typeof window !== 'undefined' ? window.innerWidth < 768 : false);
  const [monthlyData, setMonthlyData] = useState<MonthlyReportData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);

    setLoading(true);
    getMonthlyReport(userId, year, month)
      .then((res: { data: React.SetStateAction<MonthlyReportData | null>; }) => { setMonthlyData(res.data); setError(null); })
      .catch((err: any) => { console.error(err); setError('Không thể tải dữ liệu báo cáo'); })
      .finally(() => setLoading(false));

    return () => window.removeEventListener('resize', handleResize);
  }, [userId, year, month]);

  return (
    <div style={{
          width: '100%',
          minHeight: '100vh',
          backgroundImage:`linear-gradient(#516c8b80, #4f678580),url(${bgImage})`,
          backgroundSize: 'cover',    
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
          display: 'flex',      
          flexDirection: 'column'
    }}>
      <Header/>
      <div className="dashboard-wrapper" style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        {/*Đức: Fix giao diện, xóa thanh công cụ cũ, thay mới */}
      
        <div style={{ display: 'flex', flex: 1 }}>
          
          <div style={{ flex: 1, padding: '2rem', overflowY: 'auto', color:'black' }}>
              <h1 className="page-title">Báo cáo Chi tiêu</h1>

            {loading && <div>Đang tải báo cáo...</div>}
            {error && <div style={{ color: 'red' }}>{error}</div>}

            {monthlyData && monthlyData.overBudget > 0 && (
              <div className="dashboard-alert" role="alert">
                <span>⚠️</span>
                <span>Bạn đã vượt định mức {monthlyData.overBudget.toLocaleString()} VNĐ!</span>
              </div>
            )}

            {monthlyData && (
              <div className={`dashboard-cards ${isMobile ? 'column' : 'row'}`}>
                <div className="dashboard-card"><h4>Tổng chi tháng</h4><p>{monthlyData.monthTotal.toLocaleString()} VNĐ</p></div>
                <div className="dashboard-card"><h4>Định mức</h4><p>{(monthlyData.budget || 0).toLocaleString()} VNĐ</p></div>
                <div className="dashboard-card"><h4>Chi vượt</h4><p>{monthlyData.overBudget.toLocaleString()} VNĐ</p></div>
                <div className="dashboard-card"><h4>Tiết kiệm</h4><p>{((monthlyData.budget || 0) - monthlyData.monthTotal).toLocaleString()} VNĐ</p></div>
              </div>
            )}

            <div className="dashboard-grid">
              <div className="chart-container">
                <MonthlyReport userId={userId} year={year} month={month} />
              </div>
              <div className="chart-container">
                <YearlyReport userId={userId} year={year} />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer/>
      
    </div>
  );
};

export default ReportPage;
