const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    path: { type: String, required: true },
    fname: { type: String, required: true },
    lname: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    tokenReset: { type: String }
});

module.exports = mongoose.model('user', userSchema);