const express = require('express');
const router =express.Router();
const authMiddleware = require('../middleware/verifyToken');
const { CreatePost, getPostsByCategory, getAllPosts, getSinglePost, getPostsByUser } = require('../controllers/postController');

router.post('/', authMiddleware, CreatePost);

router.get('/category/:category', getPostsByCategory);
router.get('/all-posts', getAllPosts);
router.get('/:id', getSinglePost);
router.get('/user/:userId', getPostsByUser);

module.exports = router;

