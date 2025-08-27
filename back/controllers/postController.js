const Post = require('../models/Post');

const CreatePost = async (req, res) => {
    try {
        const { title, content, category, image, audio, community } = req.body;

        if (!title || !content || !category || !community) {
            return res.status(400).json({ message: "All fields except audio are required" });
        }

        const newPost = new Post({
            user: req.user.id,
            title,
            content,
            category,
            community,
            image,
            audio
        });

        await newPost.save();
        res.status(201).json(newPost);
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ message: 'Server error. Could not create post' });
    }
};

const getPostsByCategory = async (req, res) => {
    const { category } = req.params;

    try {
        const posts = await Post.find({ category }).populate("user", "username profilePicture").populate("user", "username profilePicture").populate("comments.user", "username");
        res.status(200).json(posts);
    } catch (err) {
        console.error("Error fetching posts by category:", err);
        res.status(500).json({ message: "Server error" });
    }
};

const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find().populate("user", "username profilePicture").sort({ createdAt: -1 });
        res.status(200).json(posts);
    } catch (error) {
        console.error("Error fetching all posts:", error);
        res.status(500).json({ message: "Server error" });
    }
};

const getSinglePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate("user", "username profilePicture").populate("comments.user", "username");
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        res.json(post);
    } catch (error) {
        console.error("Error fetching post:", error);
        res.status(500).json({ message: "Server error" });
    }
};

const getPostsByUser = async (req, res) => {
    const { userId } = req.params;

    try {
        const posts = await Post.find({ user: userId })
            .populate("user", "username profilePicture")
            .sort({ createdAt: -1 });

        res.status(200).json(posts);
    } catch (error) {
        console.error("Error fetching user's posts:", error);
        res.status(500).json({ message: "Server error", error });
    }
};

const updatePost = async (req, res) => {
    try {
        const { content } = req.body;

        // Find the post
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Ensure the logged-in user is the owner
        if (post.user.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized to edit this post" });
        }

        // Update content only
        if (content) post.content = content;

        const updatedPost = await post.save();
        res.status(200).json(updatedPost);
    } catch (error) {
        console.error("Error updating post:", error);
        res.status(500).json({ message: "Server error while updating post" });
    }
};

const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // make sure only the owner can delete
        if (post.user.toString() !== req.user.id) {
            return res.status(401).json({ message: "Not authorized to delete this post" });
        }

        await post.deleteOne();
        res.json({ message: "Post removed successfully" });
    } catch (error) {
        console.error("Error deleting post:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// helper to repopulate post
const populatePost = (postId) => {
    return Post.findById(postId)
        .populate("user", "username profilePicture")
        .populate("comments.user", "username");
};

// Likes and Comments
const toggleLikePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) return res.status(404).json({ message: "Post not found" });

        const userId = req.user.id;

        if (post.likes.includes(userId)) {
            // Unlike
            post.likes = post.likes.filter(id => id.toString() !== userId);
        } else {
            // Like
            post.likes.push(userId);
        }

        await post.save();

        const populatedPost = await populatePost(post._id);
        res.json({ post: populatedPost });
    } catch (error) {
        console.error("Error liking post:", error);
        res.status(500).json({ message: "Server error" });
    }
};

const addComment = async (req, res) => {
    try {
        const { text } = req.body;

        if (!text) return res.status(400).json({ message: "Comment text required" });

        const post = await Post.findById(req.params.id);

        if (!post) return res.status(404).json({ message: "Post not found" });

        const newComment = {
            user: req.user.id,
            text
        };

        post.comments.push(newComment);
        await post.save();

        const populatedPost = await populatePost(post._id);
        res.status(201).json(post);
    } catch (error) {
        console.error("Error adding comment:", error);
        res.status(500).json({ message: "Server error" });
    }
};

const deleteComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const post = await Post.findById(req.params.id);

        if (!post) return res.status(404).json({ message: "Post not found" });

        const comment = post.comments.id(commentId);
        if (!comment) return res.status(404).json({ message: "Comment not found" });

        // Ensure only the owner of the comment or post owner can delete
        if (comment.user.toString() !== req.user.id && post.user.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized to delete this comment" });
        }

        comment.deleteOne();
        await post.save();

        const populatedPost = await populatePost(post._id);
        res.json({ message: "Comment deleted", post });
    } catch (error) {
        console.error("Error deleting comment:", error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = {
    CreatePost,
    getPostsByCategory,
    getAllPosts,
    getSinglePost,
    getPostsByUser,
    updatePost,
    deletePost,
    toggleLikePost,
    addComment,
    deleteComment
};