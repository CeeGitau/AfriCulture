const express = require('express');
const router =express.Router();
const authMiddleware = require('../middleware/verifyToken');
const { CreatePost } = require('../controllers/postController');

router.post('/', authMiddleware, CreatePost);

module.exports = router;

