const Post = require('../models/Post');

const CreatePost = async (req, res) => {
    try {
        const { title, content, category, image, audio, community } = req.body;

        if (!title || !content || !category || !community) {
            return res.status(400).json({ message: "All fields except audio are required"});
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
        res.status(500).json({ message: 'Server error. Could not create post'});
    }
};

const getPostsByCategory = async (req, res) => {
    const { category } = req.params;

    try {
        const posts = await Post.find({ category }).populate("user", "username");
        res.status(200).json(posts);
    } catch (err) {
        console.error("Error fetching posts by category:", err);
        res.status(500).json({ message: "Server error" });
    }
};

const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find().populate("user", "username").sort({ createdAt: -1});
        res.status(200).json(posts);
    } catch (error) {
        console.error("Error fetching all posts:", error);
        res.status(500).json({ message: "Server error"});
    }
};

const getSinglePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate("user", "username");
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        res.json(post);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

const getPostsByUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const posts = await Post.find({ user: userId }).sort({ createdAt: -1 });
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


module.exports = {
    CreatePost,
    getPostsByCategory, 
    getAllPosts,
    getSinglePost,
    getPostsByUser,
    updatePost,
};