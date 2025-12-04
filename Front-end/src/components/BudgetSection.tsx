import { useState, useEffect } from 'react';
import budgetApi from '../API/budgetApi';
import categoryApi from '../API/categoryApi';
import './ExpenseBudget.css';
import { useAuth } from '../authentication/AuthState';
import Header from './Header/Header';
import bgImage from '../others/Illustration/MizukiAkiyama.jpg';
import Footer from './Footer/Footer';

interface Budget {
  budget_id: number;
  user_id: number;
  limit_amount: number;
  budget_month: string;
  category_id: number;
  category_name: string;
}

interface Category {
  category_id: number;
  name: string;
}

const BudgetSection = () => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [newBudget, setNewBudget] = useState({ limit_amount: '', budget_month: '', category_id: '' });
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchBudgets();
      fetchCategories();
    }
  }, [user]);

  const fetchCategories = async () => {
    try {
      const res = await categoryApi.getAll();
      setCategories(res.data);
    } catch (err) {
      console.error("Lỗi lấy danh mục:", err);
    }
  };

  const fetchBudgets = async () => {
    if (!user) return;
    try {
      const res = await budgetApi.getAll(user.user_id);
      setBudgets(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const addBudget = async () => {
    if (!newBudget.limit_amount || !newBudget.budget_month || !newBudget.category_id) {
      return alert('Vui lòng nhập đủ thông tin (Tiền, Tháng, Danh mục)!');
    }
    try {
      await budgetApi.create({ ...newBudget, user_id: user.user_id });
      fetchBudgets();
      setNewBudget({ limit_amount: '', budget_month: '', category_id: '' });
    } catch (err) {
      console.error(err);
    }
  };

  const deleteBudget = async (id: number) => {
    try {
      await budgetApi.delete(id);
      fetchBudgets();
    } catch (err) {
      console.error(err);
    }
  };

  const formatMonth = (dateString: string) => {
    const d = new Date(dateString);
    return `Tháng ${d.getMonth() + 1}/${d.getFullYear()}`;
  };

  return (
    <div 
      className="page-wrapper"
      style={{
         width: '100%',
          minHeight: '100vh',
          backgroundImage:`linear-gradient(#516c8b80, #4f678580),url(${bgImage})`,
          backgroundSize: 'cover',    
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
          display: 'flex',      
          flexDirection: 'column'
      }}
    >
      <Header />
      
      <div className="main-content">
        {/* Sử dụng lại section-box từ component trước */}
        <section className="section-box" style={{ width: '100%' }}>
          <h3>💰 Quản lý Ngân sách</h3>
          
          <div className="form-box">
            <select
              className="form-control"
              value={newBudget.category_id}
              onChange={e => setNewBudget({ ...newBudget, category_id: e.target.value })}
            >
              <option value="">-- Chọn danh mục --</option>
              {categories.map(cat => (
                <option key={cat.category_id} value={cat.category_id}>
                  {cat.name}
                </option>
              ))}
            </select>

            <input
              type='number'
              className="form-control"
              placeholder="Hạn mức (VNĐ)"
              value={newBudget.limit_amount}
              onChange={e => setNewBudget({ ...newBudget, limit_amount: e.target.value })}
            />

            <input
              type="month"
              className="form-control"
              placeholder="Chọn tháng"
              value={newBudget.budget_month}
              onChange={e => setNewBudget({ ...newBudget, budget_month: e.target.value })}
            />

            <button className="btn btn-primary" onClick={addBudget}>
              Thiết lập
            </button>
          </div>

          <ul className="list-box">
            {budgets.map(b => (
              <li key={b.budget_id} className="list-item">
                <div className="item-content">
                  <span className="item-category">{b.category_name}</span>
                  <div className="item-meta">
                    📅 {formatMonth(b.budget_month)}
                  </div>
                </div>

                <div className="item-right">
                  {/* Sử dụng class amount-budget màu xanh để phân biệt với chi tiêu */}
                  <span className="amount-budget">
                    {Number(b.limit_amount).toLocaleString("vi-VN")}đ
                  </span>
                  
                  <button 
                    className="btn btn-danger btn-sm" 
                    onClick={() => deleteBudget(b.budget_id)}
                    title="Xóa ngân sách này"
                  >
                    Xóa
                  </button>
                </div>
              </li>
            ))}
            
            {budgets.length === 0 && (
               <li style={{textAlign: 'center', color: '#636e72', padding: '20px'}}>
                  Chưa có ngân sách nào được thiết lập.
               </li>
            )}
          </ul>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default BudgetSection;