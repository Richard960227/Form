import express from 'express';
import multer from 'multer';

import { 
    getAllStudents,
    getStudent,
    createStudent,
    updateStudent,
    deleteStudent,
    deleteAllStudents,
    uploadFileStudents,
} from '../controllers/StudentController.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.get('/', getAllStudents);
router.get('/:id', getStudent);
router.post('/', createStudent);
router.post('/upload', upload.single('file'), uploadFileStudents);
router.put('/:id', updateStudent);
router.delete('/:id', deleteStudent);
router.delete('/', deleteAllStudents);
export default router;
