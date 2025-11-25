import { Router } from "express";
import { createCourse, deleteCourse, editCourse, getAllCourses } from "../controllers/course.controller";
import { requireAuth } from "../middlewares/auth";

const router = Router();

router.post('/', requireAuth('admin'), createCourse);
router.get('/', requireAuth('admin'), getAllCourses);
router.put('/:id', requireAuth('admin'), editCourse);
router.delete('/:id', requireAuth('admin'),  deleteCourse);

const courseRoutes = router;

export default courseRoutes;