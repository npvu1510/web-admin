const userModel = require('./userModel');
const orderModel = require('../order/orderModel');
const cloudinary = require('../../config/cloudinary.config');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

/**
 * Get all admin or user
 * @param role {string:{Admin, User}}
 * @returns {Promise<[Admin-User: model]>}
 */
module.exports.getInfo = async (role) => {
    try {
        return await userModel.find({ role }).lean();
    } catch (err) {
        throw err;
    }
}

/**
 * Get all admin or user
 * @param role {string:{Admin, User}}
 * @param filter {string}
 * @returns {Promise<[Admin-User: model]>}
 */
module.exports.getInfoByFilter = async (role, filter) => {
    try {
        if (filter === '0') {
            return await userModel.find({ role }).lean();
        } else if (filter === '1') {
            return await userModel.find({ role }).sort({ fullname: 1 }).lean();
        } else if (filter === '-1') {
            return await userModel.find({ role }).sort({ fullname: -1 }).lean();
        } else if (filter === '2') {
            return await userModel.find({ role }).sort({ email: -1 }).lean();
        } else if (filter === '-2') {
            return await userModel.find({ role }).sort({ email: 1 }).lean();
        } else if (filter === '3') {
            return await userModel.find({ role }).sort({ employed: -1 }).lean();
        } else if (filter === '-3') {
            return await userModel.find({ role }).sort({ employed: 1 }).lean();
        }
    } catch (err) {
        throw err;
    }
}


/**
 * delete admin or user
 * @param id {string: String}
 * @returns {Promise<void>}
 */
module.exports.deleteUser = async (id) => {
    try {
        await userModel.find({ _id: id }).remove();
        await orderModel.find({ 'customer._id': id }).remove();
    } catch (err) {
        throw err;
    }
}

/**
 * get user by username
 * @param username {string}
 * @returns {Promise<[Admin-User: model]>}
 */
module.exports.checkUsername = async (username) => {
    try {
        return await userModel.findOne({ username }).lean();
    } catch (err) {
        throw err;
    }
}

/**
 * change role of user
 * @param id {string: String}
 * @param to_role {string: String}
 * @returns {Promise<void>}
 */
module.exports.changeRole = async (id, to_role) => {
    try {
        await userModel.findByIdAndUpdate({ _id: id }, { $set: { role: to_role } });
    } catch (err) {
        throw err;
    }
}

/**
 * change status of user
 * @param id {string: String}
 * @param to_status {string: String}
 * @returns {Promise<void>}
 */
module.exports.changeStatus = async (id, to_status) => {
    try {
        await userModel.findByIdAndUpdate({ _id: id }, { $set: { status: to_status } });
    } catch (err) {
        throw err;
    }
}


/**
 * Get info by search
 * @param role {string:{Admin, User}}
 * @param nameOrGmail {string}
 * @returns {Promise<[Admin-User: model]>}
 */
module.exports.getInfoBySearch = async (role, nameOrGmail) => {
    try {
        return await userModel.find({
            $or: [{ fullname: { $regex: new RegExp('^' + nameOrGmail + '.*', 'i') } },
            { email: { $regex: new RegExp('^' + nameOrGmail + '.*', 'i') } }], role
        }).exec();
    } catch (err) {
        throw err;
    }
}
//