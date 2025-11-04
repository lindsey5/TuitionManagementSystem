import { Router } from "express";
import { createEnrolledSubject, getEnrolledSubjects } from "../controllers/enrolledSubject.controller";
const router = Router();

router.post('/', createEnrolledSubject);
router.get('/', getEnrolledSubjects);

const enrolledSubjectRoutes = router;

export default enrolledSubjectRoutes;