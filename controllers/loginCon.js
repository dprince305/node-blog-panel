const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');

const login = (req, res) => {

    res.render('login.ejs')
}

const loginData = async (req, res) => {

    res.redirect('/');

}

module.exports = { login, loginData };