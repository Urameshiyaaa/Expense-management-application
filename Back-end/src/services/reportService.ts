// src/services/reportService.ts
import {pool} from '../database/dbAccess.js';  //Đức: fix import




import { query } from '../database/dbAccess.js';

export const getMonthlyReport = async (userId: number, year: number, month: number) => {
  // 1. Xác định ngày đầu tháng và cuối tháng
  const startDate = `${year}-${month.toString().padStart(2, '0')}-01`;
  
  // Xác định ngày cuối tháng (bằng cách lấy ngày 0 của tháng sau)
  const nextMonth = new Date(year, month, 0);
  const endDate = `${year}-${month.toString().padStart(2, '0')}-${nextMonth.getDate()} 23:59:59`;

  // Xác định budget_month (ngày 1 của tháng)
  const budgetMonthDate = startDate;

  // 2. Câu lệnh SQL "Thần thánh" (Lấy tất cả trong 1 lần)
  // - Lấy danh mục
  // - Tổng chi tiêu của danh mục đó trong khoảng thời gian (JOIN transactions)
  // - Ngân sách của danh mục đó trong tháng (JOIN budgets)
  const sql = `
    WITH CategoryStats AS (
      SELECT 
        c.category_id,
        c.name as category_name,
        COALESCE(SUM(t.amount), 0) as spent,
        COALESCE(b.limit_amount, 0) as budget
      FROM "expenseManagementApp".categories c
      LEFT JOIN "expenseManagementApp".transactions t 
        ON c.category_id = t.category_id 
        AND t.user_id = $1 
        AND t.transaction_date >= $2 
        AND t.transaction_date <= $3
      LEFT JOIN "expenseManagementApp".budgets b 
        ON c.category_id = b.category_id 
        AND b.user_id = $1 
        AND b.budget_month = $4
      WHERE c.user_id = $1 OR c.user_id IS NULL
      GROUP BY c.category_id, c.name, b.limit_amount
    )
    SELECT 
      *,
      (spent - budget) as over_amount
    FROM CategoryStats
    ORDER BY spent DESC
  `;

  const result = await query(sql, [userId, startDate, endDate, budgetMonthDate]);
  const categories = result.rows;

  // 3. Tính toán số liệu tổng hợp từ danh sách danh mục
  let monthTotal = 0;
  let totalBudget = 0;

  categories.forEach(cat => {
    monthTotal += Number(cat.spent);
    totalBudget += Number(cat.budget);
  });

  // Chi vượt tổng (Chỉ tính nếu tổng chi > tổng ngân sách)
  const overBudget = Math.max(monthTotal - totalBudget, 0);

  return {
    monthTotal,
    budget: totalBudget, // Đây là tổng ngân sách các danh mục cộng lại
    overBudget,
    categories // Trả về thêm danh sách chi tiết để hiển thị
  };
};

// (Giữ nguyên các hàm getYearlyReport, getBudgetExceededAlert cũ của bạn nếu có)
// ...

export async function getYearlyReport(userId: number, year: number) {
  const spentQ = await pool.query(
    //Đức: Fix chuẩn lại tên schemas
    `SELECT EXTRACT(MONTH FROM transaction_date)::int AS month, COALESCE(SUM(amount),0) AS spent
     FROM "expenseManagementApp".transactions
     WHERE user_id = $1 AND EXTRACT(YEAR FROM transaction_date)::int = $2
     GROUP BY month`,
    [userId, year]
  );

  const budgetQ = await pool.query(
    //Đức: Fix chuẩn lại tên schemas
    `SELECT EXTRACT(MONTH FROM budget_month)::int AS month, limit_amount
     FROM "expenseManagementApp".budgets
     WHERE user_id = $1 AND EXTRACT(YEAR FROM budget_month)::int = $2`,
    [userId, year]
  );

  const spentMap = new Map(spentQ.rows.map((r: any) => [r.month, parseFloat(r.spent)]));
  const budgetMap = new Map(budgetQ.rows.map((r: any) => [r.month, parseFloat(r.limit_amount)]));

  const out = [];
  for (let m = 1; m <= 12; m++) {
    const spent = spentMap.get(m) || 0;
    const budget = budgetMap.has(m) ? budgetMap.get(m) : 0;
    const overrun = (budget && spent > budget) ? (spent - budget) : 0;
    out.push({ month: m, spent, budget, overrun });
  }

  return out;
}

export async function getBudgetExceededAlert(userId: number, year: number, month: number) {
  const report = await getMonthlyReport(userId, year, month);
  return {
    exceeded: report.overBudget > 0,
    overBudget: report.overBudget,
    budget: report.budget,
  };
}
