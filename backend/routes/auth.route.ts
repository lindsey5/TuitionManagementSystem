import { Router } from "express";
import { adminLogin, getUser, registrarLogin, studentLogin } from "../controllers/auth.controller";
import { requireAuth } from "../middlewares/auth";

const router = Router();

router.post('/admin', adminLogin);
router.post('/student', studentLogin);
router.post('/registrar', registrarLogin);
router.get('/', requireAuth('admin', 'registrar', 'student'), getUser);

const authRoutes = router;

export default authRoutes;