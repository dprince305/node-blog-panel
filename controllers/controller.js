const index = async (req, res) => {

    if (req.isAuthenticated()) {
        res.render('index', { userImg: req.user.path, fname: req.user.fname, lname: req.user.lname, email: req.user.email });
    } else {
        res.redirect('/login');
    }


}

module.exports = { index };