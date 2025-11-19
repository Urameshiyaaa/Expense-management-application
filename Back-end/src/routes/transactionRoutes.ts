// src/routes/transactionRoutes.ts
import express from 'express';
import { pool } from '../database/dbAccess.js';

const router = express.Router();

// 🟢 Lấy tất cả giao dịch của user
router.get('/:user_id', async (req, res) => {
  try {
    const { user_id } = req.params;
    //Đức: fix sql: "schema".tên bảng trên lap cá nhân
    const result = await pool.query(
      `SELECT t.*, c.name AS category_name 
       FROM "expenseManagementApp".transactions t 
       JOIN "expenseManagementApp".categories c ON t.category_id = c.category_id 
       WHERE t.user_id = $1 
       ORDER BY t.transaction_date DESC`,
      [user_id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// 🟢 Thêm giao dịch mới
router.post('/', async (req, res) => {
  try {
    const { user_id, category_id, amount, note, transaction_date } = req.body;
    console.log("Dữ liệu nhận được:", req.body);
    const result = await pool.query(
      `INSERT INTO "expenseManagementApp".transactions (user_id, category_id, amount, note, transaction_date)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
       //Đức: fix tiền: đảm bảo là số
      [user_id, parseInt(category_id), parseFloat(amount), note, transaction_date]
    );
    res.json(result.rows[0]);
  } catch (err) {
    //Đức: log lỗi ra terminal back-end để fix
    console.error("LỖI SQL:", err);
    res.status(500).json({ error: (err as Error).message });
  }
});

// 🟢 Sửa giao dịch
router.put('/:transaction_id', async (req, res) => {
  try {
    const { transaction_id } = req.params;
    const { category_id, amount, note, transaction_date } = req.body;
    const result = await pool.query(
      `UPDATE "expenseManagementApp".transactions 
       SET category_id = $1, amount = $2, note = $3, transaction_date = $4
       WHERE transaction_id = $5
       RETURNING *`,
      [category_id, amount, note, transaction_date, transaction_id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// 🟢 Xóa giao dịch
router.delete('/:transaction_id', async (req, res) => {
  try {
    const { transaction_id } = req.params;
    await pool.query('DELETE FROM "expenseManagementApp".transactions WHERE transaction_id = $1', [transaction_id]);
    res.json({ message: 'Xóa thành công' });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

export default router;
