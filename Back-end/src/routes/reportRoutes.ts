// src/routes/reportRoutes.ts
import { Router } from 'express';
import { monthlyReport, yearlyReport, budgetExceededAlert } from '../controllers/reportController';

const router = Router();

router.get('/monthly', monthlyReport); // query: userId, year, month
router.get('/yearly', yearlyReport);   // query: userId, year
router.get('/alerts/budget-exceeded', budgetExceededAlert); // query: userId, year, month

export default router;
