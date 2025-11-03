import { Router } from "express";
import { createSemester, deleteSemester, getStudentSemesters } from "../controllers/semester.controller";
const router = Router();

router.post('/', createSemester);
router.get('/:id', getStudentSemesters);
router.delete('/:id', deleteSemester);

const semesterRoutes = router;

export default semesterRoutes;