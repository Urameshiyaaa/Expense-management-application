import { useState, useEffect } from 'react';
import budgetApi from '../API/budgetApi';
import './ExpenseBudget.css';

interface Budget {
  budget_id: number;
  user_id: number;
  limit_amount: number;
  budget_month: string;
}

const BudgetSection = () => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [newBudget, setNewBudget] = useState({ limit_amount: '', budget_month: '' });
  const userId = 1; // Hardcoded for simplicity

  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    try {
      const res = await budgetApi.getAll(userId);
      setBudgets(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const addBudget = async () => {
    if (!newBudget.limit_amount || !newBudget.budget_month) return alert('Nhập đủ thông tin!');
    try {
      await budgetApi.create({ ...newBudget, user_id: userId });
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
            <b>{b.budget_month}</b> - {b.limit_amount.toLocaleString()}đ
            <button onClick={() => deleteBudget(b.budget_id)}>X</button>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default BudgetSection;
