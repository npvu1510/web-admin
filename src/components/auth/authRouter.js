const router = require("express").Router();
const authController = require("./authController");
const passport = require("../../config/passport.config");

/*************************** GET methods ***************************/
// render login page
router.get("/login", authController.renderLogin);

// Logout
router.get('/logout', authController.logout);

/*************************** POST methods ***************************/
// login
router.post("/login", passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login?invalid-account'
}));

module.exports = router;