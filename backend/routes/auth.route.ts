import { Router } from "express";
import { adminLogin, getUser, studentLogin } from "../controllers/authController";
import { requireAuth } from "../middlewares/auth";

const router = Router();

router.post('/admin', adminLogin);
router.post('/student', studentLogin);
router.get('/', requireAuth('admin', 'registrar', 'student'), getUser);

const authRoutes = router;

export default authRoutes;