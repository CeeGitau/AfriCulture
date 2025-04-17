import express from 'express';
import { Register, Login, Auth } from '../controllers/userController';
import VerifyToken from '../middleware/verifyToken';

const router = express.Router();

// Public routes (eg. /api/users/register)
router.post('/register', Register);
router.post('/login', Login);

// Protected routes
router.get("/auth", VerifyToken, (req, res) => {
    return res.status(200).json({ success: true, user: req.user });
});

export default router;