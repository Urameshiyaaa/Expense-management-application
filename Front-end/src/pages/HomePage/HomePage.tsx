// src/pages/HomePage.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <div style={{ padding: '2rem' }}>
      {/* Giữ nguyên nội dung HomePage hiện có của bạn */}
      <h1>Welcome to Expense App</h1>

      {/* Nút điều hướng tới Reports */}
      <div style={{ marginTop: 16 }}>
        <Link to="/reports">
          <button style={{ padding: '8px 12px', borderRadius: 6, cursor: 'pointer' }}>
            Xem Báo cáo & Thống kê
          </button>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
