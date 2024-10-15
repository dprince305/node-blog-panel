const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const otpGenerator = require('otp-generator');
const nodemailer = require('nodemailer');
const randomstring = require("randomstring");

const transpoter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: "dholariyaprince15@gmail.com",
        pass: "oljqpooxmgfaffuh"
    },
});

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

    try {

        const userEmail = await userModel.findOne({ email: email });

        if (userEmail) {

            // const otp = otpGenerator.generate(4, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });
            // console.log("user OTP", otp);

            // myOTP = otp;

            const token = randomstring.generate(10);
            console.log("token", token);

            await userModel.updateOne({ _id: userEmail._id }, { tokenReset: token });


            const link = `http://localhost:3004/newPass/${userEmail._id}`;
            // console.log("link", link);

            const mailOptions = {
                from: "dholariyaprince15@gmail.com",
                to: userEmail.email,
                subject: "Reset Password",
                text: `Click on link to reset your password ${link}`,
            };

            transpoter.sendMail(mailOptions, (err, data) => {
                if (err) {
                    console.log("error", err);
                } else {
                    console.log("Email sent:", data.response);
                    res.send("Email sent check your email");
                    // res.redirect(`/otp/${userEmail._id}`);
                }
            });
        } else {
            console.log("user not found");
            res.redirect('/login');
        }
    } catch (error) {
        res.redirect('/forgotPassword');
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

const newPass = async (req, res) => {

    const { id } = req.params;
    console.log("user id", id);

    try {

        const user = await userModel.findOne({ _id: id });

        if (user) {
            console.log("user", user);
            if (user.tokenReset) {
                console.log("token", user.tokenReset);
                res.render('new-pass', { id: req.params.id });
            } else {
                console.log("invalid token");
                res.send("invalid url");
            }
        } else {
            console.log("invalid token");
        }
    } catch (error) {
        console.log("error", error);
    }
    // res.render('new-pass', { id: req.params.id });
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
                const newPass = await userModel.updateOne({ _id: req.params.id }, { password: hash, tokenReset: null });
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