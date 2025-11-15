// src/routes/budgetRoutes.ts
import express from 'express';
import { pool } from '../database/dbAccess.js';

const router = express.Router();

// 🟢 Lấy ngân sách tháng hiện tại
router.get('/:user_id', async (req, res) => {
  try {
    const { user_id } = req.params;
    const result = await pool.query(
      `SELECT * FROM budgets 
       WHERE user_id = $1 
       ORDER BY budget_month DESC`,
      [user_id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// 🟢 Thêm hoặc cập nhật ngân sách tháng
router.post('/', async (req, res) => {
  try {
    const { user_id, limit_amount, budget_month } = req.body;
    const result = await pool.query(
      `INSERT INTO budgets (user_id, limit_amount, budget_month)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, budget_month)
       DO UPDATE SET limit_amount = EXCLUDED.limit_amount
       RETURNING *`,
      [user_id, limit_amount, budget_month]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// 🟢 Xóa ngân sách
router.delete('/:budget_id', async (req, res) => {
  try {
    const { budget_id } = req.params;
    await pool.query('DELETE FROM budgets WHERE budget_id = $1', [budget_id]);
    res.json({ message: 'Xóa thành công' });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

export default router;
