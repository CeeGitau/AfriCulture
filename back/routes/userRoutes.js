import express from 'express';
import { Register, Login, Auth } from '../controllers/userController';
import { VerifyToken } from '../middleware/verifyToken';

const router = express.Router();

// Public routes
router.post('/register', Register);
router.post('/login', Login);

// Protected routes
router.get('/auth', VerifyToken, Auth);

export default router;