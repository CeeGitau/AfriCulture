const express = require('express');
const router =express.Router();
const authMiddleware = require('../middleware/verifyToken');
const { CreatePost, getPostsByCategory } = require('../controllers/postController');

router.post('/', authMiddleware, CreatePost);

router.get('category/:category', getPostsByCategory);

module.exports = router;

