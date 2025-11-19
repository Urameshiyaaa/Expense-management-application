import { useState, useEffect } from 'react';
import budgetApi from '../API/budgetApi';
import './ExpenseBudget.css';
import { useAuth } from '../authentication/AuthState';

interface Budget {
  budget_id: number;
  user_id: number;
  limit_amount: number;
  budget_month: string;
}

const BudgetSection = () => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [newBudget, setNewBudget] = useState({ limit_amount: '', budget_month: '' });
  const { user } = useAuth();

  useEffect(() => {
    if (user) fetchBudgets();
  }, [user]);

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
    if (!newBudget.limit_amount || !newBudget.budget_month) return alert('Nhập đủ thông tin!');
    try {
      await budgetApi.create({ ...newBudget, user_id: user.user_id });
      fetchBudgets();
      setNewBudget({ limit_amount: '', budget_month: '' });
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

  return (
    <section className="section-box">
      <h3>💰 Quản lý Ngân sách (Định mức)</h3>
      <div className="form-box">
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
        <button onClick={addBudget}>Thêm/Cập nhật</button>
      </div>

      <ul className="list-box">
        {budgets.map(b => (
          <li key={b.budget_id}>
            {/*Đức: fix định dạng time (ngày giờ)+ tiền (dấu chấm phân chia) để dễ nhìn với user*/}
            <b>{new Date(b.budget_month).toLocaleString('vi-VN', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: false
                    })}</b>{Number(b.limit_amount).toLocaleString("vi-VN")}đ 
            <button onClick={() => deleteBudget(b.budget_id)}>X</button>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default BudgetSection;
