const express = require('express');
const router =express.Router();
const authMiddleware = require('../middleware/verifyToken');
const { CreatePost, getPostsByCategory, getAllPosts, getSinglePost, getPostsByUser, updatePost, deletePost } = require('../controllers/postController');

router.post('/', authMiddleware, CreatePost);
router.put('/:id', authMiddleware, updatePost);
router.delete('/:id', authMiddleware, deletePost);

router.get('/category/:category', getPostsByCategory);
router.get('/all-posts', getAllPosts);
router.get('/user/:userId', getPostsByUser);
router.get('/:id', getSinglePost);

module.exports = router;

