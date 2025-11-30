import { Router } from "express";
import { createStudent, deleteStudent, editStudent, editStudentProfile, getAllStudents, getOverdueStudents, getStudentThroughParams, notifiyStudentOverdue, searchStudent } from "../controllers/student.controller";
import { requireAuth } from "../middlewares/auth";

const router = Router();

router.post('/', requireAuth('admin', 'registrar'), createStudent);
router.post('/notify/:id', requireAuth('admin', 'registrar'), notifiyStudentOverdue);
router.get('/', requireAuth('admin', 'registrar'), getAllStudents);
router.get('/overdue', requireAuth('admin', 'registrar'), getOverdueStudents);
router.get('/search', requireAuth('admin', 'registrar'), searchStudent);
router.get('/:id', requireAuth('admin', 'registrar'), getStudentThroughParams);
router.put('/', requireAuth('student'), editStudentProfile);
router.put('/:id', requireAuth('admin', 'registrar'), editStudent);
router.delete('/:id', requireAuth('admin', 'registrar'), deleteStudent);

const studentRoutes = router;

export default studentRoutes;