import { Router } from "express";
import { createSubject, deleteSubject, editSubject, getAllSubjects } from "../controllers/subject.controller";
import { adminRequireAuth } from "../middlewares/adminRequireAuth";
import { createStudent, deleteStudent, editStudent, getAllStudents } from "../controllers/student.controller";

const router = Router();

router.post('/', createStudent);
router.get('/', getAllStudents);
router.put('/:id', editStudent);
router.delete('/:id', deleteStudent);

const studentRoutes = router;

export default studentRoutes;