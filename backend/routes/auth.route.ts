import { Router } from "express";
import { adminLogin } from "../controllers/authController";

const router = Router();

router.post('/admin', adminLogin);

const authRoutes = router;

export default authRoutes;