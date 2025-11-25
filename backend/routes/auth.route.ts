import { Router } from "express";
import { adminLogin, getUser } from "../controllers/authController";
import { requireAuth } from "../middlewares/auth";

const router = Router();

router.post('/admin', adminLogin);
router.get('/', requireAuth('admin', 'registrar', 'student'), getUser);

const authRoutes = router;

export default authRoutes;