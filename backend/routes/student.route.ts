import { Router } from "express";
import { createStudent, deleteStudent, editStudent, getAllStudents, getStudentThroughParams } from "../controllers/student.controller";

const router = Router();

router.post('/', createStudent);
router.get('/', getAllStudents);
router.get('/:id', getStudentThroughParams);
router.put('/:id', editStudent);
router.delete('/:id', deleteStudent);

const studentRoutes = router;

export default studentRoutes;