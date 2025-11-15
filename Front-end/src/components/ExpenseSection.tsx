import { useState, useEffect } from 'react';
import transactionApi from '../API/transactionApi';
import './ExpenseBudget.css';

interface Transaction {
  transaction_id: number;
  category_id: string;
  amount: string;
  note: string;
  transaction_date: string;
  category_name: string;
}

const ExpenseSection = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [newTran, setNewTran] = useState({ category_id: '', amount: '', note: '', transaction_date: '' });
  const [editing, setEditing] = useState<Transaction | null>(null);
  const userId = 1; // Hardcoded for simplicity

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await transactionApi.getAll(userId);
      setTransactions(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const addTransaction = async () => {
    if (!newTran.category_id || !newTran.amount || !newTran.transaction_date) return alert('Nhập đủ thông tin!');
    try {
      await transactionApi.create({ ...newTran, user_id: userId });
      fetchTransactions();
      setNewTran({ category_id: '', amount: '', note: '', transaction_date: '' });
    } catch (err) {
      console.error(err);
    }
  };

  const updateTransaction = async () => {
    if (!editing || !editing.category_id || !editing.amount || !editing.transaction_date) return alert('Nhập đủ thông tin!');
    try {
      await (transactionApi as any).update(editing.transaction_id, editing);
      fetchTransactions();
      setEditing(null);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTransaction = async (id: number) => {
    try {
      await transactionApi.delete(id);
      fetchTransactions();
    } catch (err) {
      console.error(err);
    }
  };

  const startEdit = (tran: Transaction) => {
    setEditing({ ...tran });
  };

  return (
    <section className="section-box">
      <h3>📘 Quản lý Khoản chi</h3>
      <div className="form-box">
        <input
          placeholder="Category ID"
          value={newTran.category_id}
          onChange={e => setNewTran({...newTran, category_id: e.target.value})}
        />
        <input
          type="number"
          placeholder="Số tiền"
          value={newTran.amount}
          onChange={e => setNewTran({...newTran, amount: e.target.value})}
        />
        <input
          placeholder="Ghi chú"
          value={newTran.note}
          onChange={e => setNewTran({...newTran, note: e.target.value})}
        />
        <input
          type="date"
          placeholder="Ngày"
          value={newTran.transaction_date}
          onChange={e => setNewTran({...newTran, transaction_date: e.target.value})}
        />
        <button onClick={addTransaction}>Thêm</button>
      </div>

      <ul className="list-box">
        {transactions.map(t => (
          <li key={t.transaction_id}>
            {editing && editing.transaction_id === t.transaction_id ? (
              <div>
                <input value={editing.category_id} onChange={e => setEditing({...editing, category_id: e.target.value})} />
                <input type="number" value={editing.amount} onChange={e => setEditing({...editing, amount: e.target.value})} />
                <input value={editing.note} onChange={e => setEditing({...editing, note: e.target.value})} />
                <input type="date" value={editing.transaction_date} onChange={e => setEditing({...editing, transaction_date: e.target.value})} />
                <button onClick={updateTransaction}>Lưu</button>
                <button onClick={() => setEditing(null)}>Hủy</button>
              </div>
            ) : (
              <div>
                <b>{t.category_name}</b> - {t.amount}đ ({t.note}) - {t.transaction_date}
                <button onClick={() => startEdit(t)}>Sửa</button>
                <button onClick={() => deleteTransaction(t.transaction_id)}>X</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
};

export default ExpenseSection;
