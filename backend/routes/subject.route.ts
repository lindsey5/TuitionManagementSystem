import { Router } from "express";
import { createSubject, deleteSubject, editSubject, getAllSubjects } from "../controllers/subject.controller";
import { adminRequireAuth } from "../middlewares/adminRequireAuth";

const router = Router();

router.post('/', adminRequireAuth, createSubject);
router.get('/', adminRequireAuth, getAllSubjects);
router.put('/:id', adminRequireAuth, editSubject);
router.delete('/:id', adminRequireAuth, deleteSubject);

const subjectRoutes = router;

export default subjectRoutes;