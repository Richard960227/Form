import express from 'express';

import {
    getTeacherData,
    getAllTeachers,
    getTeacher,
    saveTeacherRating,
    saveTeachersRatings,
} from '../controllers/TeacherController.js';

const router = express.Router();

router.get('/teacher', getTeacherData);
router.get('/', getAllTeachers);
router.get('/:id', getTeacher);
router.post('/', saveTeacherRating);
router.post('/ratings', saveTeachersRatings);

export default router;