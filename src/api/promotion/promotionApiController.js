const promotionService = require('../../components/promotion/promotionService')
const pagination = require("../../public/js/paging");

module.exports.getInfoPromotion = async (req, res) => {
    try {
        const promotions = await promotionService.getAllPromotion();
        const page =  parseInt(req.query.page || 1);
        const result = pagination.paging(promotions,page,4);
        res.send(result);
    } catch (e) {
        res.status(500).json({message: e.message});
    }
};