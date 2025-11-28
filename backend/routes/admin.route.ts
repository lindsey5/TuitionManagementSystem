import { Router } from "express";
import { createAdmin, getAdmin, updateAdminProfile } from "../controllers/admin.controller";
import { requireAuth } from "../middlewares/auth";

const router = Router();

router.post('/', requireAuth('admin'), createAdmin);
router.get('/', requireAuth('admin'), getAdmin);
router.put('/', requireAuth('admin'), updateAdminProfile);

const adminRoutes = router;

export default adminRoutes;