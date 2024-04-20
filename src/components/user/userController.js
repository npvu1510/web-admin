const service = require('./userService');
const utils = require('../../public/js/paging');
const { validationResult } = require('express-validator');

/************************************* GET methods *************************************/
/**
 *  get admin information list and pagination data
 *
 * @param req request
 * @param res response
 * @returns {Promise<void>}
 */
exports.renderAdminManage = async (req, res) => {
    try {
        const admins = await service.getInfo('Admin');
        const page = parseInt(req.query.page) || 1;
        const result = utils.paging(admins, page, 8);
        if (req.session.errors !== undefined) {
            const errors = req.session.errors;
            req.session.errors = undefined;
            res.render("user/views/admin_manage", { layout: "/user/views/admin_layout", active: { AdminManage: true }, page: "Admin manage", result, errors, checkErrors: true });
        }
        else {
            req.session.errors = undefined
            res.render("user/views/admin_manage", { layout: "/user/views/admin_layout", active: { AdminManage: true }, page: "Admin manage", result });
        }
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};

/**
 *  get user information list and pagination data
 *
 * @param req request
 * @param res response
 * @returns {Promise<void>}
 */
exports.renderUserManage = async (req, res) => {
    try {
        const users = await service.getInfo('User');
        const page = parseInt(req.query.page) || 1;
        const result = utils.paging(users, page, 8);

        if (req.session.errors !== undefined) {
            const errors = req.session.errors;
            req.session.errors = undefined;
            res.render("user/views/user_manage", { layout: "/user/views/user_layout", active: { UserManage: true }, page: "User manage", result, errors, checkErrors: true });
        }
        else {
            req.session.errors = undefined
            res.render("user/views/user_manage", { layout: "/user/views/user_layout", active: { UserManage: true }, page: "User manage", result });
        }
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};


/************************************* PUT methods *************************************/
/**
 *  edit role of user
 *
 * @param req request
 * @param res response
 * @returns {Promise<void>}
 */
exports.editUser = async (req, res) => {
    try {
        console.log("--- edit user ---");
        console.log("req.body: ", req.body);

        if (req.body.to_role)
            await service.changeRole(req.params.userID, req.body.to_role);
        else if (req.body.to_status)
            await service.changeStatus(req.params.userID, req.body.to_status);

        res.redirect('back');
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};

/************************************* DELETE methods *************************************/
/**
 *  delete user
 *
 * @param req request
 * @param res response
 * @returns {Promise<void>}
 */
exports.deleteUser = async (req, res) => {
    try {
        await service.deleteUser(req.params.userID);
        res.redirect('back');
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};


