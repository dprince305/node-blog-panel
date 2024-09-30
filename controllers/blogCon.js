
const blogModel = require('../models/blogModel');

const blog = async (req, res) => {

    let blogData = await blogModel.find();
    // console.log("blogData", blogData);


    res.render('blog', { userImg: req.user.path, fname: req.user.fname, lname: req.user.lname, email: req.user.email, blogData: blogData });

}

const myblog = async (req, res) => {

    let blogData = await blogModel.find({ user_id: req.user._id });
    // console.log("blogData", blogData);

    res.render('myblog', { userImg: req.user.path, fname: req.user.fname, lname: req.user.lname, email: req.user.email, blogData: blogData });
}

module.exports = { blog, myblog };
