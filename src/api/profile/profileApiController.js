const profileService = require('../../components/profile/profileService');
const adminService = require("../../components/user/userService");
const bcrypt = require("bcrypt");
const { validationResult } = require('express-validator');
const service = require("../../components/profile/profileService");

/**
 *  get profile
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
module.exports.getInfo = async (req, res) => {
    try {
        console.log("--- get info ---");
        const user = await profileService.getInfoByID(req.user._id);

        console.log("user: ", user);
        res.send(user);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};

/**
 *  edit info of user
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
module.exports.editInfo = async (req, res) => {
    try {
        await profileService.editDetailInfo(req.user._id, req.body);
        res.status(200);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};

/**
 *  change password
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
module.exports.changePassword = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.send({ status: "invalid" });
            return;
        }
        const user = await adminService.checkUsername(req.user.username);
        if (!(await bcrypt.compare(req.body.old_passwd, user.password))) {
            res.send({ status: "error" });
        } else {
            await service.changePassword(req.user._id, req.body.new_passwd);
            res.send({ status: "success" });
        }
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};
