import { useState, useEffect } from 'react';
import transactionApi from '../API/transactionApi';
import categoryApi from '../API/categoryApi';
import './ExpenseBudget.css';
import { useAuth } from '../authentication/AuthState';

interface Transaction {
  transaction_id: number;
  category_id: string;
  amount: string;
  note: string;
  transaction_date: string;
  category_name: string;
}
 interface Category {
  category_id: number;
  name: string;
}

const ExpenseSection = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [newTran, setNewTran] = useState({ category_id: '', amount: '', note: '', transaction_date: '' });
  const [editing, setEditing] = useState<any>(null);
  const { user } = useAuth(); 

  
  useEffect(() => {
    //Đức: Chỉ fetch nếu đã có user
    if (user) {
      fetchTransactions();
      fetchCategories();
    }
  }, [user]); 

  //Đức: thêm fetchCategories
  const fetchCategories = async () => {
    try{
      const res = await categoryApi.getAll();
      setCategories(res.data);
    } 
    catch(err){
      console.error("Lỗi lấy category:", err);
    }
  };
  
  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await transactionApi.getAll(user.user_id);
      setTransactions(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const addTransaction = async () => {
    if (!newTran.category_id || !newTran.amount || !newTran.transaction_date) return alert('Nhập đủ thông tin!');
    if (!user) return;
    try {
      await transactionApi.create({ ...newTran, user_id: user.user_id });
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
        {/*Đức: Thay thế ô điền id danh mục thành chọn danh mục */}
        <select
          style={{borderRadius:"10px"}}
          value={newTran.category_id}
          onChange={e => setNewTran({...newTran, category_id: e.target.value})}
        >
          <option value="">-- Chọn danh mục --</option>
          {categories.map((cat) => (
            <option key={cat.category_id} value={cat.category_id}>{cat.name}</option>
          ))}
        </select>

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
        {/*Đức: đưa type về kiểu datime-local để lưu lại khung h có giao dịch */}
        <input
          type="datetime-local"
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
                      <div className='form-box'>
                        <select
                  style={{borderRadius:"10px"}}
                  value={editing.category_id}
                  onChange={e => setEditing({...editing, category_id: e.target.value})}
                >
                  <option value="">-- Chọn danh mục --</option>
                  {categories.map((cat) => (
                    <option key={cat.category_id} value={cat.category_id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <input type="number" value={editing.amount} onChange={e => setEditing({...editing, amount: e.target.value})} />
                <input value={editing.note} onChange={e => setEditing({...editing, note: e.target.value})} />
                <input type="datetime-local" value={editing.transaction_date} onChange={e => setEditing({...editing, transaction_date: e.target.value})} />
                <button onClick={updateTransaction}>Lưu</button>
                <button onClick={() => setEditing(null)}>Hủy</button>
              </div>
            ) : (
              <div style={{color: "#000000ff"}}>
                {/*Đức: fix định dạng time (ngày giờ)+ tiền (dấu chấm phân chia) để dễ nhìn với user*/}
                <b>{t.category_name}</b> - {Number(t.amount).toLocaleString('vi-VN')}đ ({t.note}) - {new Date(t.transaction_date).toLocaleString('vi-VN', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: false
                    })}
                <button style={{marginRight:"5px", marginLeft:"5px"}} onClick={() => startEdit(t)}>Sửa</button>
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
