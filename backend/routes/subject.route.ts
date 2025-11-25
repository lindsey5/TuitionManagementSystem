import { Router } from "express";
import { createSubject, deleteSubject, editSubject, getAllSubjects } from "../controllers/subject.controller";
import { requireAuth } from "../middlewares/auth";

const router = Router();

router.post('/', requireAuth('admin', 'registrar'), createSubject);
router.get('/', requireAuth('admin', 'registrar'), getAllSubjects);
router.put('/:id', requireAuth('admin', 'registrar'), editSubject);
router.delete('/:id', requireAuth('admin', 'registrar'), deleteSubject);

const subjectRoutes = router;

export default subjectRoutes;