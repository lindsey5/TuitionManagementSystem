import { Router } from "express";
import { requireAuth } from "../middlewares/auth";
import { changeRegistrarPassword, createRegistrar, deleteRegistrar, editRegistrar, getAllRegistrars, updateRegistrarProfile } from "../controllers/registrar.controller";

const router = Router();

router.post('/', requireAuth('admin'), createRegistrar);
router.get('/', requireAuth('admin'), getAllRegistrars);
router.put('/', requireAuth('registrar'), updateRegistrarProfile);
router.put('/password', requireAuth('registrar'), changeRegistrarPassword);
router.put('/:id', requireAuth('admin'), editRegistrar);
router.delete('/:id', requireAuth('admin'), deleteRegistrar);

const registrarRoutes = router;

export default registrarRoutes;