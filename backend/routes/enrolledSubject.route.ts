import { Router } from "express";
import { createEnrolledSubject } from "../controllers/enrolledSubject.controller";
const router = Router();

router.post('/', createEnrolledSubject);

const enrolledSubjectRoutes = router;

export default enrolledSubjectRoutes;