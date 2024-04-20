const promotionService = require("../promotion/promotionService");
const utils = require("../../public/js/paging");
/**
 *  get promo list and pagination data
 *
 * @param req request
 * @param res response
 * @returns {Promise<void>}
 */
exports.renderPromotionManage = async (req, res) => {
    try {
        if (req.session.errors !== undefined) {
            const error_msg = req.session.errors;
            req.session.errors = undefined
            res.render("promotion/views/promotion_manage", { active: { PromotionManage: true }, page: "Promotion manage", result, error_msg: error_msg });
        }
        else
            res.render("promotion/views/promotion_manage", { active: { PromotionManage: true }, page: "Promotion manage"});
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};


exports.addPromotion = async (req,res) => {
    try
    {
        const code = req.body.code
        const level = req.body.level + "%"
        const slot = req.body.slot
        const start_date = req.body.start_date
        const end_date = req.body.end_date

        const isExist = await promotionService.getPromotionByCode(code)
        if (isExist.length == 0)
        {
            await promotionService.createPromotion(code,level,slot,start_date,end_date)
            res.redirect('/manage/promotion')
        }
        else
        {
            res.redirect('/manage/promotion')
        }

    }catch (e)
    {
        res.status(500).json({ message: e.message });
    }
}

exports.deletePromotion = async (req, res) => {
    try {
        console.log(req.body.delete_code)
        await promotionService.deletePromotion(req.body.delete_code);
        res.redirect('back');
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};

exports.editPromotion = async (req,res) => {
    try
    {
        const current_code = req.body.edit_code
        const new_code = req.body.code
        const level = req.body.level
        const slot = req.body.slot
        const start_date = req.body.start_date
        const end_date = req.body.end_date

        await promotionService.editPromotion(current_code,new_code,level,slot,start_date,end_date)

        res.redirect('/manage/promotion')

    }catch (e)
    {
        throw e
    }
}