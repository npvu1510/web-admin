const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const adminService = require("../components/user/userService");
const bcrypt = require('bcrypt');

passport.use(new LocalStrategy(async function valid(username, password, done) {
        const user = await adminService.checkUsername(username);
        if (!user) {
            return done(null, false);
        }
        if (!(await bcrypt.compare(password, user.password))) {
            return done(null, false);
        }
        if (user.role !== "Admin") {
            return done(null, false);
        }
        return done(null, user);
    })
);

passport.serializeUser(function (user, done) {
    done(null, {
        _id: user._id,
        username: user.username,
        fullname: user.fullname,
        phone: user.phone,
        address: user.address,
        email: user.email,
        avatar_url: user.avatar_url,
        employed: user.employed,
        intro: user.intro
    });
});

passport.deserializeUser(async function (user, done) {
    done(null, user);
});

module.exports = passport;