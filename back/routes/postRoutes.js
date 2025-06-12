const express = require('express');
const router =express.Router();
const authMiddleware = require('../middleware/verifyToken');
const { CreatePost, getPostsByCategory, getAllPosts } = require('../controllers/postController');

router.post('/', authMiddleware, CreatePost);

router.get('/category/:category', getPostsByCategory);
router.get('/all-posts', getAllPosts);

module.exports = router;

