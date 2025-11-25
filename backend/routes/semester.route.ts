import { Router } from "express";
import { createSemester, deleteSemester, getMySemesters, getSemesterById, getStudentSemesters } from "../controllers/semester.controller";
import { requireAuth } from "../middlewares/auth";
const router = Router();

router.post('/', requireAuth('admin', 'registrar'), createSemester);
router.get('/', requireAuth('student'), getMySemesters);
router.get('/data/:id', requireAuth('admin', 'registrar', 'student'), getSemesterById);
router.get('/:id', requireAuth('admin', 'registrar'), getStudentSemesters);
router.delete('/:id' ,requireAuth('admin', 'registrar'), deleteSemester);

const semesterRoutes = router;

export default semesterRoutes;