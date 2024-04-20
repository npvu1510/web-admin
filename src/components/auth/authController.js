// render login page
exports.renderLogin = (req, res) => {
    try{
        req.logout();
        const invalidAccount = (req.query['invalid-account'] !== undefined)||false;
        res.render("auth/views/login", { layout: '/auth/views/login-layout', invalidAccount });
    }catch (err) {
        res.status(500).send({ message: err.message });
    }

}

// log out user
exports.logout = (req, res) => {
    req.logout();
    res.redirect('/');
}



