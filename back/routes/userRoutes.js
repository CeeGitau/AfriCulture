const express = require('express'); 
const { Login, Register, Auth } = require('../controllers/userController.js');
const VerifyToken = require('../middleware/verifyToken.js');

const router = express.Router();

// Public routes (eg. /api/users/register)
router.post('/register', Register);
router.post('/login', Login);

// Protected routes
router.get("/auth", VerifyToken, Auth); 

module.exports = router;