const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    path: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: String, required: true, default: new Date() }
});

module.exports = mongoose.model('blog', blogSchema);