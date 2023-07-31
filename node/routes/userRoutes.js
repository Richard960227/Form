import express from 'express';
import { 
    getUserData,
    getAllUsers, 
    getUser, 
    createUser, 
    updateUser, 
    deleteUser,
    deleteAllUsers
} from '../controllers/UserController.js';

const router = express.Router();

router.get('/user',getUserData);
router.get('/', getAllUsers);
router.get('/:id', getUser);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);
router.delete('/', deleteAllUsers);

export default router;
