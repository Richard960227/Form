import express from 'express';
import { 
    login,
    getStudentInfo
} from '../controllers/LoginController.js';

const router = express.Router();

router.post('/', login);
router.get('/student-info', getStudentInfo);

export default router;
