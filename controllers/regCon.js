const userModel = require('../models/userModel');
const fs = require('fs');
const bcrypt = require('bcrypt');
const saltRounds = 10;


const register = (req, res) => {

    res.render('register.ejs')
}

const registerData = async (req, res) => {

    if (req.body.pwd === req.body.con_pwd) {

        bcrypt.hash(req.body.pwd, saltRounds, async (err, hash) => {

            const userData = new userModel({
                path: req.file.path,
                fname: req.body.fname,
                lname: req.body.lname,
                email: req.body.email,
                password: hash
            })
            console.log(userData);

            try {
                const user = await userData.save();
            } catch (error) {
                res.redirect('/login');
            }
        });

    } else {
        res.redirect('/register');
    }
}


module.exports = { register, registerData }