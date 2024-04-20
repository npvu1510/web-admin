module.exports = function loggedInGuard(req, res, next)  {
    if (req.user) {
        next();
    } else {
        res.redirect('/login');
    }
}