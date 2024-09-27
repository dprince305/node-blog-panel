const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('../models/userModel');
const bcrypt = require('bcrypt');

passport.use(new LocalStrategy({ usernameField: 'email', passwordField: 'pwd' },
    async function (email, password, done) {
        const userData = await User.findOne({ email: email })
        if (userData) {
            bcrypt.compare(password, userData.password, async (err, result) => {
                if (err) {
                    done(null, false);
                }

                if (result) {
                    done(null, userData)
                } else {
                    done(null, false)
                }
            });
        } else {
            done(null, false)
        }
    }
));

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id)
        // console.log("user", user);

        done(null, user);
    } catch (err) {
        done(err)
    }


});

module.exports = passport;
