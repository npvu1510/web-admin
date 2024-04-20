/**
 * render the order page
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.renderOrder = async (req, res) => {
    try {
        res.render("order/views/order", { layout: "/order/views/order_layout", active: { Order: true }, page: "Order" });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};


