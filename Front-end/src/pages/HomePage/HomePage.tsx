import Header from '../../components/Header/Header';
import ExpenseSection from '../../components/ExpenseSection';
import BudgetSection from '../../components/BudgetSection';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div style={{backgroundImage: ""}}>
      <Header />
      <main style={{ padding: '20px', maxWidth: '1100px', margin: '0 auto' }}>
        <h2>Chào mừng bạn đến với Ứng dụng Quản lý Chi tiêu</h2>
         {/* *Note: Sau khi code xong các component + logic tính toán thì các ông cho các component đó
         vào thư mục components, và import, gọi các component đó ở chỗ này (ý là vị trí tôi ghi cái note này* */}
        <ExpenseSection />
        <BudgetSection />

        <div style={{ marginTop: 24 }}>
          <Link to="/reports">
            <button
              style={{
                padding: '10px 16px',
                backgroundColor: '#1890ff',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 600
              }}
            >
              Xem Báo cáo & Thống kê
            </button>
          </Link>
        </div>

      </main>
    </div>
  );
};

export default HomePage;