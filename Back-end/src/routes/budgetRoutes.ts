import express from 'express';
import { pool } from '../database/dbAccess.js';

const router = express.Router();

// 🟢 Lấy danh sách ngân sách (Kèm tên danh mục)
router.get('/:user_id', async (req, res) => {
  try {
    const { user_id } = req.params;
    const result = await pool.query(
      // JOIN với bảng categories để lấy tên danh mục (c.name)
      //Đức: fix lại tên schemas
      `SELECT b.*, c.name as category_name
       FROM "expenseManagementApp".budgets b
       JOIN "expenseManagementApp".categories c ON b.category_id = c.category_id
       WHERE b.user_id = $1 
       ORDER BY b.budget_month DESC`,
      [user_id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Lỗi Lấy Budget:", err);
    res.status(500).json({ error: (err as Error).message });
  }
});

// 🟢 Thêm hoặc cập nhật ngân sách theo danh mục
router.post('/', async (req, res) => {
  try {
    const { user_id, limit_amount, budget_month, category_id } = req.body;

    const formattedDate = budget_month.length === 7 ? `${budget_month}-01` : budget_month;
    const amount = parseFloat(limit_amount);

    console.log("Backend nhận Budget:", { user_id, amount, formattedDate, category_id });

    const result = await pool.query(
      `INSERT INTO "expenseManagementApp".budgets (user_id, limit_amount, budget_month, category_id)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (user_id, budget_month, category_id) 
       DO UPDATE SET limit_amount = EXCLUDED.limit_amount
       RETURNING *`,
      [user_id, amount, formattedDate, parseInt(category_id)]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Lỗi SQL BUDGET:", err); 
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