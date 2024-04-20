const userModel = require('../user/userModel');
const cloudinary = require('../../config/cloudinary.config');
const bcrypt = require("bcrypt");

/**
 *  edit profile page
 *
 * @param body {object}
 * @param id {string}
 * @returns {Promise<void>}
 */
module.exports.editDetailInfo = async (id, body) => {
    try {
        await userModel.findByIdAndUpdate(id,
            {
                $set: {
                    intro: body.intro,
                    fullname: body.edit_fullname,
                    username: body.edit_username,
                    phone: body.edit_phone,
                    address: body.edit_addr
                }
            });
    } catch (err) {
        throw err;
    }
};

/**
 *  change password of user
 *
 * @param newPass {string}
 * @param id {string}
 * @returns {Promise<void>}
 */
module.exports.changePassword = async (id, newPass) => {
    try {
        await bcrypt.hash(newPass, 4).then(async (hash) => {
            await userModel.findOneAndUpdate(
                { _id: id },
                { $set: { password: hash } });
        });
    } catch (err) {
        throw err;
    }

};

/**
 *  change avatar of user
 *
 * @param file {object}
 * @param id {string}
 * @returns {Promise<void>}
 */
module.exports.changeAvatar = async (id, file) => {
    try {
        // upload image
        if (!file) return;
        const url = await cloudinary.upload(file.path, 'user_avatar');
        await userModel.findByIdAndUpdate(id, { avatar_url: url });
    } catch (err) {
        throw err;
    }
};

/**
 *  change avatar of user
 *
 * @param id {string}
 * @returns {Promise<void>}
 */
module.exports.getInfoByID = async (id) => {
    try {
        const user = await userModel.findById(id).lean();
        console.log("user: ", user);
        return user;

    } catch (err) {
        throw err;
    }
};
