import { Router } from "express";
import { createAdmin, getAdmin } from "../controllers/admin.controller";
import { requireAuth } from "../middlewares/auth";

const router = Router();

router.post('/', requireAuth('admin'), createAdmin);
router.get('/', requireAuth('admin'), getAdmin);

const adminRoutes = router;

export default adminRoutes;