const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const otpGenerator = require('otp-generator');

let myOTP = null;

const changePassword = (req, res) => {
    res.render('change-password');
}

const changePasswordData = (req, res) => {

    const { password } = req.user;

    const { current_pwd, new_pwd, con_new_pwd } = req.body;

    bcrypt.compare(current_pwd, password, (err, result) => {

        if (result) {
            if (con_new_pwd === new_pwd) {
                console.log("paasword Match");

                bcrypt.hash(new_pwd, saltRounds, async (err, hash) => {

                    const newPass = await userModel.updateOne({ _id: req.user._id }, { password: hash });

                    console.log("newPass", newPass);

                    res.redirect('/login');


                })

            } else {
                console.log("password not match");

                res.redirect('/change-password');

            }
        } else {
            res.redirect('/change-password');
        }
    })
}

const forgotPassword = (req, res) => {
    res.render('forgot-password');
}

const forgotPasswordData = async (req, res) => {

    const { email } = req.body;
    const userEmail = await userModel.findOne({ email: email });

    if (userEmail) {

        const otp = otpGenerator.generate(4, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });
        console.log("user OTP", otp);

        myOTP = otp;

        res.redirect(`/otp/${userEmail._id}`);

    } else {

        res.redirect('/login');
    }
}

const otp = (req, res) => {
    res.render('otp', { id: req.params.id });
}

const otpCheck = (req, res) => {

    const { id } = req.params;
    const { otp } = req.body;

    if (otp == myOTP) {
        res.redirect(`/newPass/${id}`);
    } else {
        res.redirect(`/login/${id}`);
    }

}

const newPass = (req, res) => {
    res.render('new-pass', { id: req.params.id });
}

const newPassWord = (req, res) => {

    const { pwd, new_pwd } = req.body;

    if (pwd === new_pwd) {
        console.log("paasword Match");

        bcrypt.hash(pwd, saltRounds, async (err, hash) => {

            if (err) {
                console.log("err", err);
                res.redirect('/forgotPassword');
            }

            try {
                const newPass = await userModel.updateOne({ _id: req.params.id }, { password: hash });
                console.log("newPass", newPass);

                res.redirect('/login');

            } catch (error) {
                console.log("password not matchhh", error);
                res.redirect('/forgotPassword');
            }
        })

    } else {
        console.log("password not match");

        res.redirect('/forgotPassword');

    }

}

module.exports = { changePassword, changePasswordData, forgotPassword, forgotPasswordData, otp, otpCheck, newPass, newPassWord };