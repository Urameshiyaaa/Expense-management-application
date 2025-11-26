// src/services/reportService.ts
import {pool} from '../database/dbAccess.js';  //Đức: fix import

export async function getMonthlyReport(userId: number, year: number, month: number) {
  const start = `${year}-${String(month).padStart(2, '0')}-01`;
  const lastDay = new Date(year, month, 0).getDate();
  const end = `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;

  // total spent in month
  const totalQ = await pool.query(
    //Đức: Fix chuẩn lại tên schemas
    `SELECT COALESCE(SUM(amount),0) AS total
     FROM "expenseManagementApp".transactions
     WHERE user_id = $1
       AND transaction_date::date BETWEEN $2::date AND $3::date`,
    [userId, start, end]
  );
  const monthTotal = parseFloat(totalQ.rows[0].total || 0);

  // budget for the month
  const budgetQ = await pool.query(
    //Đức: Fix chuẩn lại tên schemas
    `SELECT limit_amount
     FROM "expenseManagementApp".budgets
     WHERE user_id = $1
       AND date_trunc('month', budget_month) = date_trunc('month', $2::date)
     LIMIT 1`,
    [userId, start]
  );
  const budget = budgetQ.rowCount ? parseFloat(budgetQ.rows[0].limit_amount) : null;
  const pctOfBudget = (budget && budget > 0) ? Math.round((monthTotal / budget) * 10000) / 100 : null;
  const overBudget = (budget && monthTotal > budget) ? (monthTotal - budget) : 0;

  // spending by category
  const catQ = await pool.query(
    //Đức: Fix chuẩn lại tên schemas
    `SELECT COALESCE(c.name, 'Uncategorized') AS category, COALESCE(SUM(t.amount),0) AS amount
     FROM "expenseManagementApp".transactions t
     LEFT JOIN "expenseManagementApp".categories c ON t.category_id = c.category_id
     WHERE t.user_id = $1
       AND t.transaction_date::date BETWEEN $2::date AND $3::date
     GROUP BY c.name
     ORDER BY amount DESC`,
    [userId, start, end]
  );
  const byCategory = catQ.rows.map((r: any) => ({ category: r.category, amount: parseFloat(r.amount) }));

  return { monthTotal, budget, pctOfBudget, overBudget, byCategory };
}

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
