const express = require('express'); 
const { 
    Login, 
    Register, 
    Auth, 
    UpdateProfile, 
    ForgotPassword, 
    ResetPassword 
} = require('../controllers/userController.js');
const VerifyToken = require('../middleware/verifyToken.js');
const upload = require('../middleware/uploadMiddleware.js');

const router = express.Router();

// Public routes (eg. /api/users/register)
router.post('/register', Register);
router.post('/login', Login);
router.post('/forgot-password', ForgotPassword);
router.post('/reset-password', ResetPassword);

// Protected routes
router.get("/auth", VerifyToken, Auth); 
router.put("/me", VerifyToken, upload.single("profilePicture"), UpdateProfile);

module.exports = router;