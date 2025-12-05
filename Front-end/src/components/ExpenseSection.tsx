import { useState, useEffect } from 'react';
import transactionApi from '../API/transactionApi';
import categoryApi from '../API/categoryApi';
import './ExpenseBudget.css';
import { useAuth } from '../authentication/AuthState';

// ... (Giữ nguyên phần Interface)
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
  // ... (Giữ nguyên toàn bộ phần Logic/State/Effect/Functions)
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]); //Đức
  const [newTran, setNewTran] = useState({ category_id: '', amount: '', note: '', transaction_date: '' });
  const [editing, setEditing] = useState<any>(null);
  const { user } = useAuth();
  
  //Đức: Quản Lý danh mục
  const [displayListCategory, setDisplayListCategory] = useState(false);
  const [categoryInput, setCategoryInput] = useState('');
  const [editCategoryId, setEditCategoryId] = useState<number | null>(null);

  useEffect(() => {
    if (user) {
      fetchTransactions();
      fetchCategories();
    }
  }, [user]);

  //Đức: Xử lí hiển thị toàn bộ danh mục hiện có
  const fetchCategories = async () => {
    try {
      const res = await categoryApi.getAll();
      setCategories(res.data);
    } 
    catch (err) {
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

  //Đức: Xử lí thay đổi danh mục (hết cái startEditCategory)
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === 'other') {
      setDisplayListCategory(true);
      setNewTran({...newTran, category_id: ''});
    } 
    else{
      setNewTran({...newTran, category_id: value});
    }
  };

  const saveCategory = async () => {
    if (!categoryInput.trim()) return alert("Tên không được để trống");
    try {
      if (editCategoryId) {
        await categoryApi.update(editCategoryId, {name: categoryInput});
        setEditCategoryId(null);
      } 
      else{
        await categoryApi.create({name: categoryInput});
      }
      setCategoryInput('');
      fetchCategories();
    } 
    catch (err){
      console.error(err);
    }
  };

  const deleteCategory = async (id: number) => {
    if (!window.confirm("Chắc chắn xóa danh mục này?")) return;
    try {
      await categoryApi.delete(id);
      fetchCategories();
    } 
    catch (err){
      console.error(err);
      alert("Không xóa được (có thể đang có dữ liệu liên quan)");
    }
  };

  const startEditCategory = (c: Category) => {
    setCategoryInput(c.name);
    setEditCategoryId(c.category_id);
  };

  // --- PHẦN RENDER GIAO DIỆN MỚI ---
  return (
    <section className="section-box">
      <h3>📘 Quản lý Khoản chi</h3>
      
      {/* Đức: Quản lý danh mục*/}
      <div className="form-box">
        <select
          className="form-control"
          value={newTran.category_id}
          onChange={handleCategoryChange}
        >
          <option value="">-- Chọn danh mục --</option>
          {categories.map((c) => (
            <option key={c.category_id} value={c.category_id}>{c.name}</option>
          ))}
          <option value="other" style={{color:'#2d3436'}}>Khác...</option>
        </select>

        <input
          type='number'
          onKeyDown={(event) => {
            if (event.key === '-' || event.key === 'e') { //Đức: Xử lí sự kiện khi người dùng nhập dấu âm và giá trị e
              event.preventDefault();
            }}}
          onPaste={(event) => {
              const pasteData = event.clipboardData.getData('text'); //Đức: Xử lí sự kiện khi người dùng copy paste giá trị âm/e từ bên ngoài
              if (pasteData.includes('-') || pasteData.includes('e')) {
                event.preventDefault();
              }}}
          className="form-control"
          placeholder="Số tiền (VNĐ)"
          value={newTran.amount}
          onChange={e => setNewTran({ ...newTran, amount: e.target.value })}
        />
        <input
          className="form-control"
          placeholder="Ghi chú (ngắn gọn)"
          value={newTran.note}
          onChange={e => setNewTran({ ...newTran, note: e.target.value })}
        />
        <input
          type="datetime-local"
          className="form-control"
          value={newTran.transaction_date}
          onChange={e => setNewTran({ ...newTran, transaction_date: e.target.value })}
        />
        <button className="btn btn-primary" onClick={addTransaction}>
           Thêm Mới
        </button>
      </div>

      {/* Danh sách giao dịch */}
      <ul className="list-box">
        {transactions.map(t => (
          <li key={t.transaction_id}>
            {editing && editing.transaction_id === t.transaction_id ? (
              // Form Sửa (Inline Edit) - Tận dụng lại class form-box nhưng thu gọn
              <div className='form-box' style={{ margin: 0, padding: '10px', background: '#f8f9fa', borderRadius: '10px' }}>
                <select
                  className="form-control"
                  value={editing.category_id}
                  onChange={e => setEditing({ ...editing, category_id: e.target.value })}
                >
                  <option value="">-- Chọn danh mục --</option>
                  {categories.map((cat) => (
                    <option key={cat.category_id} value={cat.category_id}>{cat.name}</option>
                  ))}
                </select>
                <input className="form-control" type="number" value={editing.amount} onChange={e => setEditing({ ...editing, amount: e.target.value })} />
                <input className="form-control" value={editing.note} onChange={e => setEditing({ ...editing, note: e.target.value })} />
                <input className="form-control" type="datetime-local" value={editing.transaction_date} onChange={e => setEditing({ ...editing, transaction_date: e.target.value })} />
                
                <div style={{display:'flex', gap: '5px'}}>
                   <button className="btn btn-primary btn-sm" onClick={updateTransaction}>Lưu</button>
                   <button className="btn btn-danger btn-sm" onClick={() => setEditing(null)}>Hủy</button>
                </div>
              </div>
            ) : (
              // Hiển thị thông tin (Read Mode)
              <div className="list-item">
                <div className="item-content">
                  <span className="item-category">{t.category_name}</span>
                  <div className="item-meta">
                     📅 {new Date(t.transaction_date).toLocaleString('vi-VN', {
                      day: '2-digit', month: '2-digit', year: 'numeric',
                      hour: '2-digit', minute: '2-digit', hour12: false
                    })}
                     {t.note && ` • 📝 ${t.note}`}
                  </div>
                </div>

                <div className="item-right">
                  <span className="item-amount">
                    -{Number(t.amount).toLocaleString('vi-VN')}đ
                  </span>
                  <div className="action-group">
                    <button className="btn btn-primary btn-sm" style={{background: '#b2bec3', color: 'black'}} onClick={() => startEdit(t)}>Sửa</button>
                    <button className="btn btn-danger btn-sm" onClick={() => deleteTransaction(t.transaction_id)}>Xóa</button>
                  </div>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>

      {/*Đức: Hiển thị giao diện chỉnh sửa danh mục*/}
      {displayListCategory && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">⚙️ Quản lý Danh mục</div>

            <div className="modal-input-group">
              <input
                className="form-control"
                value={categoryInput}
                onChange={(e) => setCategoryInput(e.target.value)}
                placeholder="Nhập tên danh mục..."
              />
              <button className="btn btn-primary" onClick={saveCategory}>{editCategoryId ? 'Lưu' : 'Thêm'}</button>
              {editCategoryId && (
                <button className="btn btn-danger" onClick={() => {setEditCategoryId(null); setCategoryInput(''); }}>Hủy</button>
              )}
            </div>

            <ul className="category-list-modal">
              {categories.map(c => (
                <li key={c.category_id} className="category-item">
                  <span>{c.name}</span>
                  <div className="action-group">
                    <button className="btn btn-sm" style={{background: '#dfe6e9'}} onClick={() => startEditCategory(c)}>Sửa</button>
                    <button className="btn btn-danger btn-sm" onClick={() => deleteCategory(c.category_id)}>Xóa</button>
                  </div>
                </li>
              ))}
            </ul>

            <button className="btn btn-sm" style={{marginTop: '20px', width: '100%', background: '#636e72', color: 'white'}} onClick={() => setDisplayListCategory(false)}>
              Đóng
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default ExpenseSection;