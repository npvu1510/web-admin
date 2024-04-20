const orderService = require("../../components/order/orderService");
const userService = require("../../components/user/userService");
const productService = require('../../components/product/productService');

/**
 *  get dashboard
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
module.exports.getDashboard = async (req, res) => {
    try {
        // console.log('-- dashboard api - getDashboard');
        // fetch database
        const orders = await orderService.getOrders();
        const products = await productService.getProducts(undefined, undefined, undefined, undefined, undefined, null);
        const users = (await userService.getInfo("User")).concat(await userService.getInfo("Admin"));

        let period = req.query.period;

        // total user
        const total_user = users.length;

        //total product 
        const total_product = products.length;

        let chart_label = [];
        let chart_bars_data = [];
        let chart_lines_data = {
            "Bags": [],
            "Clothing": [],
            "Accessories": [],
            "Shoes": []
        };

        const present = new Date();
        const now = (new Date()).toString().split(" ");

        const pre = period;

        if (period == "Today") {
            period = now[2] + ' ' + now[1] + ',' + now[3];
            chart_label.push(now[2] + ' ' + now[1] + ',' + now[3]);
        } else if (period == "Week") {
            period = this.getWeek(new Date());
            chart_label.push("Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday");

        } else if (period == "Month") {
            period = now[1] + ',' + now[3];
            const date = new Date();
            const dayOfMonth = this.daysInMonth(date.getMonth() + 1, date.getFullYear());
            for (let i = 1; i <= dayOfMonth; i++)
                chart_label.push(i);

        } else if (period == "Year") {
            period = now[3];
            chart_label.push("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");
        }

        // total money + period's money + top 3 user + this period product
        let total = 0;
        let period_total = 0;
        let period_total_order = 0;
        let period_order = [];
        let top_user = {};
        let top_product = {};
        let top_product_category = {
            "Bags": {},
            "Clothing": {},
            "Accessories": {},
            "Shoes": {}
        };
        let period_new_client = 0;

        // period's new client
        users.forEach(user => {
            if ((pre == "Week" && this.isDateInWeek(user.employed)) ||
                (pre != "Week" && user.employed.includes(period))) {
                period_new_client++;
            }
        })

        // total money + period's money + top 3 user + this period product
        orders.forEach(order => {
            let discount = 0;
            if (order.promo)
                discount = parseInt(order.promo.replace("%", ""));

            // total money 
            total += order.total - (order.total * (discount / 100));

            if ((pre == "Week" && this.isDateInWeek(order.create_date)) ||
                (pre != "Week" && order.create_date.includes(period))) {
                // total + order
                period_total += order.total - (order.total * (discount / 100));
                period_total_order += 1;

                // top user
                // only find top user has account
                if (top_user[order.customer._id] === undefined) {
                    let user = users.find(element => element._id == order.customer._id);

                    if (user !== undefined) {
                        top_user[order.customer._id] = {
                            fullname: user.fullname,
                            username: user.username,
                            avatar_url: user.avatar_url,
                            total: Math.round((order.total - (order.total * (discount / 100))) * 100) / 100,
                            order: 1
                        }
                    }
                } else {
                    top_user[order.customer._id].total = Math.round((top_user[order.customer._id].total + order.total - (order.total * (discount / 100))) * 100) / 100;
                    top_user[order.customer._id].order += 1;
                }

                // top product
                for (let i = 0; i < order.products.length; i++) {
                    // top product
                    let product = products.find(element => element._id == order.products[i].product_id);
                    if (product !== undefined) {
                        if (top_product[product._id] === undefined) {
                            top_product[product._id] = {
                                name: product.name,
                                thumb: product.thumb,
                                quantity: order.products[i].quantity,
                            }
                        } else {
                            top_product[product._id].quantity += order.products[i].quantity;
                        }
                    }

                    // top product category
                    if (top_product_category[product.category][product._id] === undefined) {
                        top_product_category[product.category][product._id] = {
                            name: product.name,
                            thumb: product.thumb,
                            quantity: order.products[i].quantity,
                        }
                    } else {
                        top_product_category[product.category][product._id].quantity += order.products[i].quantity;
                    }
                }

                // this period order
                period_order.push({
                    order_id: order._id,
                    total: order.total,
                    create_date: order.create_date,
                    promo: order.promo
                })
            }
        });


        // chart
        {
            if (pre === "Today") { //done
                let category = {
                    "Bags": 0,
                    "Clothing": 0,
                    "Accessories": 0,
                    "Shoes": 0
                };

                orders.forEach(order => {
                    if (order.create_date.includes(period)) {
                        // chart lines
                        for (let j = 0; j < order.products.length; j++) {
                            category[order.products[j].detail.category] += order.products[j].quantity;
                        }
                    }
                });

                chart_bars_data.push(Math.round(period_total * 100) / 100);
                chart_lines_data["Bags"].push(category["Bags"]);
                chart_lines_data["Clothing"].push(category["Clothing"]);
                chart_lines_data["Accessories"].push(category["Accessories"]);
                chart_lines_data["Shoes"].push(category["Shoes"]);
            } else if (pre === "Week") { //done
                curr = new Date;
                let dy = curr.getDay();

                let firstday = new Date(curr.setDate(curr.getDate() - dy + (dy == 0 ? -6 : 1)))
                let lastday = new Date(curr.setDate(curr.getDate() - dy + 6))


                for (i = 0; i <= 7; i++) {
                    const d = new Date(curr.setDate(firstday.getDate() + i));
                    const dd = d.toString().split(" ");
                    var this_date = dd[2] + ' ' + dd[1] + ',' + dd[3];

                    let tt = 0;

                    let category = {
                        "Bags": 0,
                        "Clothing": 0,
                        "Accessories": 0,
                        "Shoes": 0
                    };

                    j = 0;
                    orders.forEach(order => {
                        if (this.isDateInWeek(order.create_date) && order.create_date.includes(this_date)) {
                            let discount = 0;
                            if (order.promo)
                                discount = parseInt(order.promo.replace("%", ""));

                            // chart bars
                            tt += order.total - (order.total * (discount / 100));

                            // chart lines
                            for (let j = 0; j < order.products.length; j++) {
                                category[order.products[j].detail.category] += order.products[j].quantity;
                            }
                        }
                    });

                    chart_bars_data.push(tt);
                    chart_lines_data["Bags"].push(category["Bags"]);
                    chart_lines_data["Clothing"].push(category["Clothing"]);
                    chart_lines_data["Accessories"].push(category["Accessories"]);
                    chart_lines_data["Shoes"].push(category["Shoes"]);
                }
            } else if (pre === "Month") { // done
                const date = new Date();
                const dayOfMonth = this.daysInMonth(date.getMonth() + 1, date.getFullYear());

                for (i = 1; i <= dayOfMonth; i++) {
                    const d = new Date(date.getFullYear(), date.getMonth(), i).toString().split(" ");
                    const this_date = d[2] + ' ' + d[1] + ',' + d[3];
                    let tt = 0;

                    let category = {
                        "Bags": 0,
                        "Clothing": 0,
                        "Accessories": 0,
                        "Shoes": 0
                    };

                    orders.forEach(order => {
                        if (order.create_date.includes(this_date)) {
                            let discount = 0;
                            if (order.promo)
                                discount = parseInt(order.promo.replace("%", ""));

                            // chart bars
                            tt += order.total - (order.total * (discount / 100));

                            // chart lines
                            for (let j = 0; j < order.products.length; j++) {
                                category[order.products[j].detail.category] += order.products[j].quantity;
                            }
                        }
                    });

                    chart_bars_data.push(tt);
                    chart_lines_data["Bags"].push(category["Bags"]);
                    chart_lines_data["Clothing"].push(category["Clothing"]);
                    chart_lines_data["Accessories"].push(category["Accessories"]);
                    chart_lines_data["Shoes"].push(category["Shoes"]);
                }
            } else if (pre === "Year") { // done
                const date = new Date();
                for (i = 0; i < 12; i++) {
                    const d = new Date(date.getFullYear(), i, 1).toString().split(" ");
                    const this_date = d[1] + ',' + d[3];
                    // console.log("this_date: ", this_date);
                    let tt = 0;

                    let category = {
                        "Bags": 0,
                        "Clothing": 0,
                        "Accessories": 0,
                        "Shoes": 0
                    };

                    orders.forEach(order => {
                        if (order.create_date.includes(this_date)) {
                            let discount = 0;
                            if (order.promo)
                                discount = parseInt(order.promo.replace("%", ""));

                            // chart bars
                            tt += order.total - (order.total * (discount / 100));

                            // chart lines
                            for (let j = 0; j < order.products.length; j++) {
                                category[order.products[j].detail.category] += order.products[j].quantity;
                            }
                        }
                    });

                    chart_bars_data.push(Math.round(tt * 100) / 100);
                    chart_lines_data["Bags"].push(category["Bags"]);
                    chart_lines_data["Clothing"].push(category["Clothing"]);
                    chart_lines_data["Accessories"].push(category["Accessories"]);
                    chart_lines_data["Shoes"].push(category["Shoes"]);
                }
            }
        }

        total = Math.round(total * 100) / 100;
        period_total = Math.round(period_total * 100) / 100;

        // top 3 user
        // Create items array
        var top_three_user = Object.keys(top_user).map(function (key) {
            return [key, top_user[key]];
        });

        // console.log("top 3 user:", top_three_user);

        // Sort the array based on the second element
        for (let i = 0; i < top_three_user.length - 1; i++) {
            for (let j = i + 1; j < top_three_user.length; j++) {
                if (top_three_user[i][1].total < top_three_user[j][1].total) {
                    let temp = top_three_user[i];
                    top_three_user[i] = top_three_user[j];
                    top_three_user[j] = temp;
                }
            }
        }

        // top 5 product
        top_product = this.sortTopProduct(top_product);
        top_product_category["Bags"] = this.sortTopProduct(top_product_category["Bags"]);
        top_product_category["Clothing"] = this.sortTopProduct(top_product_category["Clothing"]);
        top_product_category["Accessories"] = this.sortTopProduct(top_product_category["Accessories"]);
        top_product_category["Shoes"] = this.sortTopProduct(top_product_category["Shoes"]);

        // console.log("---------");
        // console.log("top product category: ", top_product_category);

        res.send({
            total_user, total, total_product, period_total, period_total_order, period_order, top_three_user, period_new_client, period, chart_bars_data, chart_lines_data, chart_label, top_product, top_product_category
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

module.exports.getWeek = (currentdate) => {
    var oneJan = new Date(currentdate.getFullYear(), 0, 1);
    var numberOfDays = Math.floor((currentdate - oneJan) / (24 * 60 * 60 * 1000));
    var period = Math.ceil((currentdate.getDay() + 1 + numberOfDays) / 7);

    return period;
}

module.exports.sortTopProduct = (items) => {
    // Create items array
    var top_item = Object.keys(items).map(function (key) {
        return [key, items[key]];
    });

    // Sort the array based on the second element
    for (let i = 0; i < top_item.length - 1; i++) {
        for (let j = i + 1; j < top_item.length; j++) {
            if (top_item[i][1].quantity < top_item[j][1].quantity) {
                let temp = top_item[i];
                top_item[i] = top_item[j];
                top_item[j] = temp;
            }
        }
    }

    return top_item;
}

module.exports.isDateInWeek = (date) => {
    //https://www.timeanddate.com/date/weeknumber.html
    let curr = new Date();
    let dy = curr.getDay();

    let firstday = new Date(curr.setDate(curr.getDate() - dy + (dy == 0 ? -6 : 1)))
    let lastday = new Date(curr.setDate(curr.getDate() - dy + 6))

    let d = date.split(" ");

    const day = parseInt(d[0]) + 1;
    const month = d[1].split(",")[0];
    const year = d[1].split(",")[1];

    const date_ = new Date(month + " " + day + ", " + year);

    if (date_ >= firstday && date_ <= lastday) {
        return true;
    }
    else {
        return false
    }
}

module.exports.daysInMonth = (month, year) => {
    return new Date(year, month, 0).getDate();
}