import { Router } from "express";
import { adminRequireAuth } from "../middlewares/adminRequireAuth";
import { createAdmin, getAdmin } from "../controllers/admin.controller";

const router = Router();

router.post('/', createAdmin);
router.get('/', adminRequireAuth, getAdmin);

const adminRoutes = router;

export default adminRoutes;