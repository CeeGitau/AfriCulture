const express = require('express');
const router =express.Router();
const authMiddleware = require('../middleware/verifyToken');
const { 
    CreatePost, getPostsByCategory, getAllPosts, getSinglePost, 
    getPostsByUser, updatePost, deletePost ,
    toggleLikePost, addComment, deleteComment
} = require('../controllers/postController');

router.post('/', authMiddleware, CreatePost);
router.put('/:id', authMiddleware, updatePost);
router.delete('/:id', authMiddleware, deletePost);

router.get('/category/:category', getPostsByCategory);
router.get('/all-posts', getAllPosts);
router.get('/user/:userId', getPostsByUser);
router.get('/:id', getSinglePost);

// Likes and comments
router.put('/:id/like', authMiddleware, toggleLikePost);
router.post('/:id/comment', authMiddleware, addComment);
router.delete('/:id/comment/:commentId', authMiddleware, deleteComment);

module.exports = router;

