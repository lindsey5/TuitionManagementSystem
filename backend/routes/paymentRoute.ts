import { Router } from "express";
import { createPayment, getMyPayments, getPaymentById, getPayments } from "../controllers/payment.controller";
import { requireAuth } from "../middlewares/auth";

const router = Router();

router.post('/', requireAuth('admin', 'registrar'), createPayment);
router.get('/', requireAuth('admin', 'registrar'), getPayments);
router.get('/me', requireAuth('student'), getMyPayments);
router.get('/:id', requireAuth('admin', 'registrar', 'student'), getPaymentById);

const paymentRoutes = router;

export default paymentRoutes;