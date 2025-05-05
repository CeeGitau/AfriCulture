const Post = require('../models/Post');

const CreatePost = async (req, res) => {
    try {
        const { title, content, category, image, audio } = req.body;

        if (!title || !content || !category) {
            return res.status(400).json({ message: "Title, content, and category are required"});
        }

        const newPost = new Post({
            user: req.user.id,
            title,
            content,
            category,
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

module.exports = {
    CreatePost
};