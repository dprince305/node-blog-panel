// controllers/commentController.js
const Blog = require('../models/blogModel');
const Comment = require('../models/comentsce');

// Add a new comment
const addComment = async (req, res) => {
    console.log(req.body); // Debugging line
    const { text } = req.body;

    if (!text) {
        return res.status(400).json({ message: 'Comment text is required' });
    }

    const blogId = req.params.id;

    try {
        const comment = new Comment({
            user: req.user._id,
            blog: blogId,
            text
        });

        await comment.save();
        await Blog.findByIdAndUpdate(blogId, { $push: { comments: comment._id } });
        res.redirect('/blog');
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};



const getComments = async (req, res) => {
    const blogId = req.params.id; // The ID of the blog post

    try {
        const comments = await Comment.find({ blog: blogId }).populate('user', 'username'); // Populate user information
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    addComment,
    getComments
}