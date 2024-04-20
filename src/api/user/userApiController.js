const userService = require('../../components/user/userService');
const pagination = require("../../public/js/paging");

/**
 *  get all information of admin
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
module.exports.getInfOfAdminByFilter = async (req, res) => {
    try {
        const user = await userService.getInfoByFilter('Admin',req.query.filter);
        const page = parseInt(req.query.page) || 1;
        const result = pagination.paging(user, page, 8);
        result.filter = req.query.filter;
        res.send(result);
    } catch (e) {
        res.status(500).json({message: e.message});
    }
};

/**
 *  get information of user by filter
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
module.exports.getInfOfUserByFilter = async (req, res) => {
    try {
        const user = await userService.getInfoByFilter('User',req.query.filter);
        const page = parseInt(req.query.page) || 1;
        const result = pagination.paging(user, page, 8);
        result.filter = req.query.filter;
        console.log(result.filter);
        res.send(result);
    } catch (e) {
        res.status(500).json({message: e.message});
    }
};

/**
 *  search user by name and email
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
module.exports.SearchUserByNameAndGmail = async (req, res) => {
    try {
        const user = await userService.getInfoBySearch('User',req.query.name);
        const page = parseInt(req.query.page) || 1;
        const result = pagination.paging(user, page, 8);
        res.send(result);
    } catch (e) {
        res.status(500).json({message: e.message});
    }
};

/**
 *  search user by name and email
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
module.exports.SearchAdminByNameAndGmail = async (req, res) => {
    try {
        const user = await userService.getInfoBySearch('Admin',req.query.name);
        const page = parseInt(req.query.page) || 1;
        const result = pagination.paging(user, page, 8);
        res.send(result);
    } catch (e) {
        res.status(500).json({message: e.message});
    }
};