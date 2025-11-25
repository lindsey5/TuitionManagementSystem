import { Router } from "express";
import { createEnrolledSubject, getEnrolledSubjects, getMyEnrolledSubjects } from "../controllers/enrolledSubject.controller";
import { requireAuth } from "../middlewares/auth";
const router = Router();

router.post('/', requireAuth('admin', 'registrar'), createEnrolledSubject);
router.get('/', requireAuth('admin', 'registrar'), getEnrolledSubjects);
router.get('/me', requireAuth('student'), getMyEnrolledSubjects);

const enrolledSubjectRoutes = router;

export default enrolledSubjectRoutes;