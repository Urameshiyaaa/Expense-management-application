import { Router } from 'express';
import { monthlyReport, yearlyReport, budgetExceededAlert } from '../controllers/reportController.js';

const router = Router();

router.get('/monthly', monthlyReport);
router.get('/yearly', yearlyReport);
router.get('/alerts/budget-exceeded', budgetExceededAlert);

export default router;
