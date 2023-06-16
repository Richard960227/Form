import express from 'express';

import { 
    getAllTeachers,
    getTeacher
} from '../controllers/TeacherController.js';

const router = express.Router();

router.get('/', getAllTeachers);
router.get('/:id', getTeacher);
export default router;