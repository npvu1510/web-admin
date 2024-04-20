const orderService = require('../../components/order/orderService');
const pagination = require('../../public/js/paging');


module.exports.getOrders = async (req, res) => {
    try {
        const sort = parseInt(req.query.sort || 0)
        const status_filter = JSON.parse(req.query.status)

        const product = await orderService.getOrders(sort, status_filter, req.query.start, req.query.end, req.query.username);
        const page = parseInt(req.query.page || 1);
        const result = pagination.paging(product, page, 10);

        res.send({ result });
    } catch (error) {
        res.status(500).send({ message: 'Error in the request' });
    }
}

module.exports.updateOrderStatus = async (req, res) => {
    try {
        await orderService.updateOrderStatus(req.body.orderID, req.body.status, req.body.start_date, req.body.end_date)
        res.send({ message: "success" })
    }
    catch (e) {
        res.status(500).json({ message: e.message });
    }
}

module.exports.getOrdersByID = async (req, res) => {
    try {
        const order = await orderService.getOrderByID(req.query.orderID)
        res.send({ order: order })
    }
    catch (e) {
        res.status(500).json({ message: e.message });
    }
}
