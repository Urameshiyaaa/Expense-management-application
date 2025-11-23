import { Request, Response } from 'express';
import { getMonthlyReport, getYearlyReport, getBudgetExceededAlert } from '../services/reportService.js';

export const monthlyReport = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.query.userId);
    const year = Number(req.query.year);
    const month = Number(req.query.month);
    if (!userId || !year || !month) return res.status(400).json({ error: 'Missing params' });

    const data = await getMonthlyReport(userId, year, month);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

export const yearlyReport = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.query.userId);
    const year = Number(req.query.year);
    if (!userId || !year) return res.status(400).json({ error: 'Missing params' });

    const data = await getYearlyReport(userId, year);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

export const budgetExceededAlert = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.query.userId);
    const year = Number(req.query.year);
    const month = Number(req.query.month);
    if (!userId || !year || !month) return res.status(400).json({ error: 'Missing params' });

    const alert = await getBudgetExceededAlert(userId, year, month);
    res.json(alert);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};
