import { Router } from "express";
import { requireAuth } from "../middlewares/auth";
import { getDashboardData, getMonthlyIncomes } from "../controllers/income.controller";

const router = Router();

router.get('/monthly', requireAuth('admin'), getMonthlyIncomes);

const incomeRoutes = router;

export default incomeRoutes;