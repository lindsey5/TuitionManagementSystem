import { Router } from "express";
import { changeAdminPassword, createAdmin, getAdmin, updateAdminProfile } from "../controllers/admin.controller";
import { requireAuth } from "../middlewares/auth";

const router = Router();

router.post('/', requireAuth('admin'), createAdmin);
router.get('/', requireAuth('admin'), getAdmin);
router.put('/', requireAuth('admin'), updateAdminProfile);
router.put('/password', requireAuth('admin'), changeAdminPassword);

const adminRoutes = router;

export default adminRoutes;