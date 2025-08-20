const express = require('express'); 
const { Login, Register, Auth, UpdateProfile } = require('../controllers/userController.js');
const VerifyToken = require('../middleware/verifyToken.js');
const upload = require('../middleware/uploadMiddleware.js');

const router = express.Router();

// Public routes (eg. /api/users/register)
router.post('/register', Register);
router.post('/login', Login);

// Protected routes
router.get("/auth", VerifyToken, Auth); 
router.put("/me", VerifyToken, upload.single("profilePicture"), UpdateProfile);

module.exports = router;