import express from 'express';
import { pool } from '../database/dbAccess.js';

const router = express.Router();

// 🟢 Lấy ngân sách tháng hiện tại
router.get('/:user_id', async (req, res) => {
  try {
    const { user_id } = req.params;
    //Đức: fix sql: "schema".tên bảng trên lap cá nhân
    const result = await pool.query(
      `SELECT * FROM "expenseManagementApp".budgets
       WHERE user_id = $1 
       ORDER BY budget_month DESC`,
      [user_id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Lỗi Lấy Budget:", err);
    res.status(500).json({ error: (err as Error).message });
  }
});

// 🟢 Thêm hoặc cập nhật ngân sách tháng
router.post('/', async (req, res) => {
  try {
    const {user_id, limit_amount, budget_month} = req.body;
    //Đức: Fix ngày tháng để khi client nhập data vào thì sẽ khớp với datatype trong database
    const formattedDate = budget_month.length === 7 ? `${budget_month}-01` : budget_month;
    //Đức: fix tiền: đảm bảo là số
    const amount = parseFloat(limit_amount);
    console.log("Backend nhận Budget:", { user_id, amount, formattedDate });

    const result = await pool.query(
      `INSERT INTO "expenseManagementApp".budgets (user_id, limit_amount, budget_month)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, budget_month)
       DO UPDATE SET limit_amount = EXCLUDED.limit_amount
       RETURNING *`,
      [user_id, amount, formattedDate]
    );
    res.json(result.rows[0]);
  } catch (err) {
    //Đức: log lỗi ra terminal back-end để fix
    console.error("LỖI SQL BUDGET:", err); 
    res.status(500).json({ error: (err as Error).message });
  }
});

// 🟢 Xóa ngân sách
router.delete('/:budget_id', async (req, res) => {
  try {
    const { budget_id } = req.params;
    await pool.query('DELETE FROM "expenseManagementApp".budgets WHERE budget_id = $1', [budget_id]);
    res.json({ message: 'Xóa thành công' });
  } catch (err) {
    console.error("Lỗi Xóa Budget:", err);
    res.status(500).json({ error: (err as Error).message });
  }
});

export default router;