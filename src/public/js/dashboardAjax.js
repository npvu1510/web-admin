var g_period = "Week";
window.onload = getDashboard(g_period);

function getDashboard(period) {
    g_period = period;
    const url = '/api/dashboard?period=' + period;
    fetch(url, {
        method: "GET"
    }).then(r => r.json()).then(data => {
        console.log('Ajax getDashboard: ', data);

        $("#period-money-title").text(period + "'s Money");
        $("#period-order-title").text(period + "'s Orders")
        $("#period-new-client-title").text(period + "'s New Client");
        $("#top-three-user-title").text("diamond user " + period);
        $("#period-order-overview-title").text(period + "'s orders overview");
        $("#period-total-title").text(period + "'s total:")
        $("#period-total-order").text(data.period_total_order);
        $("#period-new-client").text(data.period_new_client);
        $("#total-user").text(data.total_user);
        $("#total-sales").text('$' + data.total);
        $("#total-product").text(data.total_product);
        $("#period-total").text('$' + data.period_total);
        $("#top-product-title").text("Top 5 products this " + period);
        $("#top-category-title").text("Top 5 Bags's product this " + period);

        $("#top-three-user").html("");
        $("#month-order").html("");
        $("#all-period-order").html("");

        // top 3 user
        for (let i = 0; i < 3 && i < data.top_three_user.length; i++) {
            let html = `
                <tr>
                    <td>
                        <div class="d-flex px-2 py-1">
                            <div>
                                <img src="${data.top_three_user[i][1].avatar_url}" class="avatar avatar-sm me-3"
                                    alt="xd">
                            </div>
                            <div class="d-flex flex-column justify-content-center">
                                <h6 class="mb-0 text-sm">${data.top_three_user[i][1].fullname}</h6>
                                <span class="text-xs text-muted">@${data.top_three_user[i][1].username}</span>
                            </div>
                        </div>
                    </td>
                    <td>
                        ${data.top_three_user[i][1].order}
                    </td>
                    <td class="align-middle text-center text-sm">
                        <span class="text-xs font-weight-bold"> $${data.top_three_user[i][1].total} </span>
                    </td>
                </tr>`

            $("#top-three-user").append(html);
        }

        //this period order overview
        for (let i = 0; i < 4 && i < data.period_order.length; i++) {
            if (data.period_order[i].promo !== undefined) {
                let discount = parseInt(data.period_order[i].promo.replace("%", ""));

                data.period_order[i].total = Math.round((data.period_order[i].total - (data.period_order[i].total * discount / 100)) * 100) / 100;
            }

            let html = `
                <div class="timeline-block mb-3">
                    <span class="timeline-step">
                        <i class="ni ni-money-coins text-dark text-gradient"></i>
                    </span>
                    <div class="timeline-content">
                        <h6 class="text-dark text-sm font-weight-bold mb-0">New order #${data.period_order[i].order_id}</h6>
                        <div class="d-flex font-weight-bold text-xs mt-1 mb-0">
                            <p class="text-secondary">${data.period_order[i].create_date}</p>
                            <p class="ms-3" style="font-weight: bold"> Total: $${data.period_order[i].total}</p>
                        </div>
                    </div>
                </div>`

            $("#month-order").append(html);
        }

        //all this period order 
        for (let i = 0; i < data.period_order.length; i++) {
            if (data.period_order[i].promo !== undefined) {
                let discount = parseInt(data.period_order[i].promo.replace("%", ""));

                data.period_order[i].total = Math.round((data.period_order[i].total - (data.period_order[i].total * discount / 100)) * 100) / 100;
            }

            let html = `
                <div class="timeline-block mb-3">
                    <span class="timeline-step">
                        <i class="ni ni-money-coins text-dark text-gradient"></i>
                    </span>
                    <div class="timeline-content">
                        <h6 class="text-dark text-sm font-weight-bold mb-0">New order #${data.period_order[i].order_id}</h6>
                        <div class="d-flex font-weight-bold text-xs mt-1 mb-0">
                            <p class="text-secondary">${data.period_order[i].create_date}</p>
                            <p class="ms-3" style="font-weight: bold"> Total: $${data.period_order[i].total}</p>
                        </div>
                    </div>
                </div>`

            $("#all-period-order").append(html);
        }

        // top 5 product this period 
        $("#top-product-body").html("");
        for (let i = 0; i < 5 && i < data.top_product.length; i++) {
            console.log("i:", i);
            var html = `
            <tr>
                <td class="ps-4">${i + 1}</td>
                <td>
                    <div class="d-flex py-1">
                        <div>
                            <a href="/product/${data.top_product[i][0]}">
                                <img src="${data.top_product[i][1].thumb}"
                                    class="avatar avatar-sm me-3" alt="user1">
                            </a>
                        </div>
                        <div class="d-flex flex-column justify-content-center">
                            <a href="/product/${data.top_product[i][0]}" class="mb-0 text-sm font-weight-bolder">
                                ${data.top_product[i][1].name}
                            </a>
                        </div>
                    </div>
                </td>
                <td>
                    ${data.top_product[i][1].quantity}
                </td>
            </tr>`

            $("#top-product-body").append(html);
        }

        // top 5 product of this category 
        $("#top-product-cate-body").html("");
        console.log("Bag:", data.top_product_category["Bags"]);
        for (let i = 0; i < 5 && i < data.top_product_category["Bags"].length; i++) {
            console.log("i:", i);
            var html = `
            <tr>
                <td class="ps-4">${i + 1}</td>
                <td>
                    <div class="d-flex py-1">
                        <div>
                            <a href="/product/${data.top_product_category["Bags"][i][0]}">
                                <img src="${data.top_product_category["Bags"][i][1].thumb}"
                                    class="avatar avatar-sm me-3" alt="user1">
                            </a>
                        </div>
                        <div class="d-flex flex-column justify-content-center">
                            <a href="/product/${data.top_product_category["Bags"][i][0]}" class="mb-0 text-sm font-weight-bolder">
                                ${data.top_product_category["Bags"][i][1].name}
                            </a>
                        </div>
                    </div>
                </td>
                <td>
                    ${data.top_product_category["Bags"][i][1].quantity}
                </td>
            </tr>`

            $("#top-product-cate-body").append(html);
        }

        let time;
        const now = (new Date()).toString().split(" ");
        {
            if (period === "Today") {
                time = now[2] + ' ' + now[1] + ',' + now[3];
            } else if (period === "Week") {
                time = "this Week";
            } else if (period === "Month") {
                time = now[1] + ',' + now[3];
            } else if (period === "Year") {
                time = now[3];
            }
        }

        console.log("time:", time);

        // draw line
        drawCharBars(data.chart_label, data.chart_bars_data, time);
        drawCharLine(data.chart_label, data.chart_lines_data)
    });
}

function getTopCategory(category) {
    const url = '/api/dashboard?period=' + g_period;
    fetch(url, {
        method: "GET"
    }).then(r => r.json()).then(data => {
        console.log("---------");
        console.log('Ajax get top category: ', data);

        $("#top-product-cate-body").html("");
        $("#top-category-title").text("Top 5 " + category + "'s product this " + g_period);

        data.top_product_category[category].forEach((product, index) => {
            var html = `
            <tr>
                <td class="ps-4">${index + 1}</td>
                <td>
                    <div class="d-flex py-1">
                        <div>
                            <a href="/product/${product[0]}">
                                <img src="${product[1].thumb}"
                                    class="avatar avatar-sm me-3" alt="user1">
                            </a>
                        </div>
                        <div class="d-flex flex-column justify-content-center">
                            <a href="/product/${product[0]}" class="mb-0 text-sm font-weight-bolder">
                                ${product[1].name}
                            </a>
                        </div>
                    </div>
                </td>
                <td>
                    ${product[1].quantity}
                </td>
            </tr>`

            $("#top-product-cate-body").append(html);
        });

    });
}


function drawCharBars(label, data, period) {
    $("#chart-bars-container").html(`<canvas id="chart-bars" class="chart-canvas" height="170"></canvas>`)

    let ctx = document.getElementById("chart-bars").getContext("2d");

    new Chart(ctx, {
        type: "bar",
        data: {
            labels: label,
            datasets: [{
                label: "Sales",
                tension: 0.4,
                borderWidth: 0,
                borderRadius: 4,
                borderSkipped: false,
                backgroundColor: "#fff",
                data: data,
                maxBarThickness: 6
            },],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Sales statistics in ' + period,
                    color: "#fff"
                },
                legend: {
                    display: false,
                }
            },
            interaction: {
                intersect: false,
                mode: 'index',
            },
            scales: {
                y: {
                    grid: {
                        drawBorder: false,
                        display: false,
                        drawOnChartArea: false,
                        drawTicks: false,
                    },
                    ticks: {
                        beginAtZero: true,
                        padding: 15,
                        font: {
                            size: 14,
                            family: "Open Sans",
                            style: 'normal',
                            lineHeight: 2
                        },
                        color: "#fff"
                    },
                },
                x: {
                    grid: {
                        drawBorder: false,
                        display: false,
                        drawOnChartArea: false,
                        drawTicks: false
                    },
                    ticks: {
                        display: false
                    },
                },
            },
        },
    });
}

function drawCharLine(label, data) {
    $("#chart-line-container").html(`<canvas id="chart-line" class="chart-canvas" height="300"></canvas>`);
    let ctx2 = document.getElementById("chart-line").getContext("2d");

    let gradientStroke1 = ctx2.createLinearGradient(0, 230, 0, 50);

    gradientStroke1.addColorStop(1, 'rgba(203,12,159,0.2)');
    gradientStroke1.addColorStop(0.2, 'rgba(72,72,176,0.0)');
    gradientStroke1.addColorStop(0, 'rgba(203,12,159,0)'); //purple colors

    let gradientStroke2 = ctx2.createLinearGradient(0, 230, 0, 50);

    gradientStroke2.addColorStop(1, 'rgba(20,23,39,0.2)');
    gradientStroke2.addColorStop(0.2, 'rgba(72,72,176,0.0)');
    gradientStroke2.addColorStop(0, 'rgba(20,23,39,0)'); //purple colors

    new Chart(ctx2, {
        type: "line",
        data: {
            labels: label,
            datasets: [{
                label: "Bags",
                tension: 0.4,
                pointRadius: 0,
                borderColor: "#cb0c9f",
                borderWidth: 3,
                backgroundColor: gradientStroke1,
                fill: true,
                data: data["Bags"],
                maxBarThickness: 6

            },
            {
                label: "Clothing",
                tension: 0.4,
                pointRadius: 0,
                borderColor: "#e4f478",
                borderWidth: 3,
                backgroundColor: gradientStroke2,
                fill: true,
                data: data["Clothing"],
                maxBarThickness: 6
            },
            {
                label: "Accessories",
                tension: 0.4,
                pointRadius: 0,
                borderColor: "#3A416F",
                borderWidth: 3,
                backgroundColor: gradientStroke2,
                fill: true,
                data: data["Accessories"],
                maxBarThickness: 6
            },
            {
                label: "Shoes",
                tension: 0.4,
                pointRadius: 0,
                borderColor: "#3A416F",
                borderWidth: 3,
                backgroundColor: gradientStroke2,
                fill: true,
                data: data["Shoes"],
                maxBarThickness: 6
            },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false,
                }
            },
            interaction: {
                intersect: false,
                mode: 'index',
            },
            scales: {
                y: {
                    grid: {
                        drawBorder: false,
                        display: true,
                        drawOnChartArea: true,
                        drawTicks: false,
                        borderDash: [5, 5]
                    },
                    ticks: {
                        display: true,
                        padding: 10,
                        color: '#b2b9bf',
                        font: {
                            size: 11,
                            family: "Open Sans",
                            style: 'normal',
                            lineHeight: 2
                        },
                    }
                },
                x: {
                    grid: {
                        drawBorder: false,
                        display: false,
                        drawOnChartArea: false,
                        drawTicks: false,
                        borderDash: [5, 5]
                    },
                    ticks: {
                        display: true,
                        color: '#b2b9bf',
                        padding: 20,
                        font: {
                            size: 11,
                            family: "Open Sans",
                            style: 'normal',
                            lineHeight: 2
                        },
                    }
                },
            },
        },
    });
}