const profileService = require("./profileService");
/******************************** GET methods ********************************/
/**
 *  render profile page checking if user changed his password, avatar
 *
 * @param req request
 * @param res response
 * @returns {Promise<void>}
 */
module.exports.renderProfile = async (req, res) => {
    try {
        const profile = req.user;

        if (!profile) res.redirect('/auth/login');

        if (req.query.invalid === "email-error") {
            res.render("profile/views/profile", { active: { Profile: true, invalid: true }, page: "Profile", profile });
        } else if (req.query.error === "wrong-pass") {
            res.render("profile/views/profile", { active: { Profile: true, error: true }, page: "Profile", profile });
        } else if (req.query.error === "wrong-pass") {
            res.render("profile/views/profile", { active: { Profile: true, error: true }, page: "Profile", profile });
        } else if (req.query.change_pass === "success") {
            res.render("profile/views/profile", { active: { Profile: true, success: true }, page: "Profile", profile });
        } else {
            res.render("profile/views/profile", { active: { Profile: true }, page: "Profile", profile });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
/******************************** POST methods ********************************/

/**
 *  change avatar page
 *
 * @param req request
 * @param res response
 * @returns {Promise<void>}
 */
module.exports.changeAvatar = async (req, res) => {
    try {
        await profileService.changeAvatar(req.user._id, req.file);
        res.redirect('/profile');
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

