import { useState, useEffect } from 'react';
import budgetApi from '../API/budgetApi';
import categoryApi from '../API/categoryApi';
import './ExpenseBudget.css';
import { useAuth } from '../authentication/AuthState';
import Header from './Header/Header'; 
import bgImage from '../others/Illustration/KiritaniHarukaBirthday.webp';
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
    <div style={{
      width: '100%',
      minHeight: '100vh',
      backgroundImage:`linear-gradient(rgba(81, 108, 139, 0.5), rgba(79, 103, 133, 0.5)),url(${bgImage})`,
      backgroundSize: 'cover',    
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'fixed',
      display: 'flex',      
      flexDirection: 'column',
    }}>
      <Header/>
      <div style={{flex:1}}>
        <section className="section-box" style={{marginLeft:'10rem', marginRight:'10rem'}}>
          <h3>💰 Quản lý Ngân sách (Theo Danh mục)</h3>
          
          <div className="form-box">
            <select
                className="input-field" 
                value={newBudget.category_id}
                onChange={e => setNewBudget({...newBudget, category_id: e.target.value})}
                style={{padding: '10px', borderRadius: '5px', border: '1px solid #ccc'}}
            >
                <option value="">-- Chọn danh mục --</option>
                {categories.map(cat => (
                    <option key={cat.category_id} value={cat.category_id}>
                        {cat.name}
                    </option>
                ))}
            </select>

            <input
              type="number"
              placeholder="Số tiền định mức"
              value={newBudget.limit_amount}
              onChange={e => setNewBudget({...newBudget, limit_amount: e.target.value})}
            />

            <input
              type="month"
              placeholder="Tháng"
              value={newBudget.budget_month}
              onChange={e => setNewBudget({...newBudget, budget_month: e.target.value})}
            />
            
            <button onClick={addBudget}>Lưu Ngân sách</button>
          </div>

          <ul className="list-box">
            {budgets.map(b => (
              <li key={b.budget_id}>
                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}}>
                    <span style={{fontWeight: 'bold', color: '#1877f2'}}>{b.category_name}</span>
                    <span style={{fontSize: '0.9em', color: '#555'}}>
                        {formatMonth(b.budget_month)}
                    </span>
                </div>
                
                <span style={{fontWeight: 'bold', fontSize: '1.1em'}}>
                    {Number(b.limit_amount).toLocaleString("vi-VN")}đ
                </span>
                 
                <button onClick={() => deleteBudget(b.budget_id)}>X</button>
              </li>
            ))}
          </ul>
        </section>
      </div>
      <Footer/>
    </div>
  );
};

export default BudgetSection;