function paging(page, sort = 0, status_filter = null, start_date = null, end_date = null, user_name = null) {

    if (status_filter != null && status_filter.length == 0)
        status_filter = null

    fetch(`/api/order?page=${page}&sort=${sort}&status=${JSON.stringify(status_filter)}&start=${start_date}&end=${end_date}&username=${user_name}`, {
        method: "GET"
    }).then(r => r.json()).then(data => {

        $('#order-body').html('');
        data.result.data.forEach(function (item, index) {
            const number = (index + 1) + (page - 1) * 8;
            let str = `
            <tr id="${item._id}" data-bs-toggle="modal" data-bs-target='#order${number}'>
                <td>
                    <div class="d-flex px-2 py-1">
                        <div>
                            <span class="text-secondary text-xs font-weight-bold">${item._id}</span>
                        </div>
                    </div>
                </td>
                <td>
                    <div class="d-flex flex-column justify-content-center">
                        <h6 class="mb-0 text-sm">${item.username}</h6>
                    </div>
                </td>
                <td class="align-middle text-center">
                    <span class="text-secondary text-xs font-weight-bold">${item.create_date}</span>
                </td> `;

            if (item.status === 'Delivering') {
                str += `<td class="align-middle text-center status-bar">
                       <span class="badge badge-sm bg-gradient-secondary w-70" style="border-width: 0;">${item.status}</span>
                    </td> `;
            }
            else if (item.status === 'Processing') {
                str += `<td class="align-middle text-center status-bar">
                        <span class="badge badge-sm bg-gradient-warning w-70" style="border-width: 0;">${item.status}</span>
                    </td> `;
            } else if (item.status === 'Completed') {
                str += `<td class="align-middle text-center status-bar">
                       <span class="badge badge-sm bg-gradient-success w-70" style="border-width: 0;">${item.status}</span>
                    </td> `;
            } else if (item.status === 'Canceled') {
                str += `<td class="align-middle text-center status-bar">
                        <span class="badge badge-sm bg-gradient-danger w-70" style="border-width: 0;">${item.status}</span>
                    </td>
                `;
            }

            if (item.promo !== undefined) {
                let discount = parseInt(item.promo.replace("%", ""));
                let tt = Math.round((item.total - discount * item.total / 100) * 100) / 100;

                str +=
                    `<td class="align-middle text-center">
                    <span>${tt}$</span>
                </td>`
            } else {
                str +=
                    `<td class="align-middle text-center">
                    <span>${item.total}$</span>
                </td>`
            }

            if (item.status === 'Delivering') {
                str +=
                    `<td class="text-sm" id="status-${item._id}">
                        <div class="d-flex text-center justify-content-center">
                            <div data-bs-toggle="tooltip" data-bs-placement="top" title="Set status Complete">
                                <i class="fa fa-check-circle" aria-hidden="true" onclick="changeOrderStatus('${item._id}', 'Completed')" data-bs-toggle="modal" data-bs-target='#empty'></i>
                            </div>
                            <div data-bs-toggle="tooltip" data-bs-placement="top" title="Cancled order">
                                <i class="fa fa-ban" aria-hidden="true" onclick="changeOrderStatus('${item._id}', 'Canceled')" data-bs-toggle="modal" data-bs-target=''></i>
                            
                            </div>
                        </div>
                    </td>`
            } else if (item.status === 'Processing') {
                str +=
                    `<td class="text-sm"  id="status-${item._id}">
                        <div class="d-flex text-center justify-content-center">
                            <div data-bs-toggle="tooltip" data-bs-placement="top" title="Set status Delivering">
                                <i class="fa fa-truck" aria-hidden="true" onclick="openDeliveryModal('${item._id}')" data-bs-toggle="modal" data-bs-target='#delivery-modal'></i>
                            </div>
                            <div data-bs-toggle="tooltip" data-bs-placement="top" title="Cancled order">
                                <i class="fa fa-ban" aria-hidden="true" onclick="changeOrderStatus('${item._id}', 'Canceled')" data-bs-toggle="modal" data-bs-target=''></i>
                            </div>
                        </div>
                    </td>`
            } else
                str += `<td  id="status-${item._id}"></td>`

            str += ` 
              <td>
                <div class="modal fade" id='order${number}' tabIndex="-1"
                     aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="exampleModalLabel">Order
                                    information
                                </h5>
                            </div>
                            <div class="modal-body">
                                <h6 class="mb-2"><b>ID: ${item._id}</b></h6>`

            if (item.customer._id !== undefined)
                str += `<div class="mb-1"><b>Customer ID:</b> ${item.customer._id}</div>`

            str += `
            <div class="mb-1"><b>Customer name:</b> ${item.customer.fullname}</div>
            <div class="mb-1"><b>Customer email:</b> ${item.customer.email}</div>
            <div class="mb-1"><b>Customer phone:</b> ${item.customer.phone}</div>
            <div class="mb-1"><b>Customer address:</b> ${item.customer.address}</div>
            <div class="mb-1"><b>Create at:</b> ${item.create_date}</div> 
            
            `;

            if (item.status === 'Completed' || item.status === 'Delivering') {
                console.log("-coplete -");
                const now = (new Date(item.start_delivery)).toString().split(" ");
                console.log("now:", now);
                const start = now[2] + ' ' + now[1] + ',' + now[3];

                str += `
                <div id="delivery-time-${item._id}">
                    <div class="mb-1"><b>Start delivery at:</b> ${start}</div>
                </div>`
            } else if (item.status === "Canceled" && item.start_delivery) {
                const now = (new Date(item.start_delivery)).toString().split(" ");
                const start = now[2] + ' ' + now[1] + ',' + now[3];
                str += `
                <div id="delivery-time-${item._id}">
                    <div class="mb-1"><b>Start delivery at:</b> ${start}</div>
                    <div class="mb-1"><b>End delivery at:</b> Cancel</div>
                </div>`
            }
            if (item.status === 'Completed') {
                const now = (new Date(item.end_delivery)).toString().split(" ");
                const end = now[2] + ' ' + now[1] + ',' + now[3];
                str += `
                <div id="delivery-time-${item._id}">
                    <div class="mb-1"><b>End delivery at:</b> ${end}</div>
                </div>`
            } else {
                str += `
                 <div id="delivery-time-${item._id}"></div>`
            }


            if (item.status === 'Delivering') {
                str += `<div class="mb-3 d-flex"><b>Status:</b>
                         <div id="status-bar-${item._id}" style="width: 120px">
                            <span class="badge badge-sm bg-gradient-secondary">${item.status}</span>
                        </div>
                    </div> `;
                str += `<div className="mb-1"><b>Time: </b>${item.start_delivery.split("T")[0]} - ${item.end_delivery.split("T")[0]}</div> `;

            } else if (item.status === 'Processing') {
                str += `<div class="mb-3 d-flex"><b>Status:</b>
                        <div id="status-bar-${item._id}" style="width: 120px">
                            <span class="badge badge-sm bg-gradient-warning w-70">${item.status}</span>
                        </div>
                    </div> `;
            } else if (item.status === 'Completed') {
                str += `<div class="mb-3 d-flex"><b>Status:</b>
                        <div id="status-bar-${item._id}" style="width: 120px">
                            <span class="badge badge-sm bg-gradient-success w-70">${item.status}</span>
                        </div>
                    </div> `;
            } else if (item.status === 'Canceled') {
                str += `<div class="mb-3 d-flex"><b>Status:</b>
                        <div id="status-bar-${item._id}" style="width: 120px">
                            <span class="badge badge-sm bg-gradient-danger w-70">${item.status}</span>
                        </div>
                    </div> `;
            }

            str +=
                `<div class="custom-table p-3 mb-3">
                    <div class="row">
                        <div class="col-7 ">
                            <b>Product</b>
                        </div>
                        <div class="col-3 ">
                            <b>Quantity</b>
                        </div>
                        <div class="col-2">
                            <b>Price</b>
                        </div>
                    </div>
                    <hr>
                    <div class="row">`;

            item.products.forEach(function (e, i) {
                console.log("i:", i, " - e:", e);
                str +=
                    `<div class="col-7">
                        <div class="row">
                            <div class="col product-image">
                                <img src="${e.thumbnail}" class="avatar avatar-sm"
                                     alt="thumnail">
                            </div>
                            <div
                                class="col-9 d-flex flex-column justify-content-center">
                                <h6 class="mb-0 text-sm" style="white-space: normal;">${e.detail.name}</h6>
                                <span
                                    class="text-secondary text-xs font-weight-bold">${e.detail._id}
                                </span>
                                <div class="d-flex align-items-center text-sm">
                                    <div>
                                        Size: ${e.size}
                                    </div>
                                    <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; margin-left:5px; background-color: ${e.color}"></span>
                                </div>
                            </div>
                        </div>
                    </div>
                <div class="col-3 align-middle text-center">
					<span class="text-secondary text-xs font-weight-bold">x${e.quantity}</span>
                </div>
                <div class="col-2 align-middle">
					<span class="text-secondary text-xs font-weight-bold">${e.detail.price}$</span>
                </div>
                <hr class="my-2">`
            });
            if (item.promo !== undefined) {
                let discount = parseInt(item.promo.replace("%", ""));
                let sale = Math.round(discount * item.total) / 100;
                let tt = Math.round((item.total - sale) * 100) / 100;
                str +=
                    `</div>
                    <div class="row">
                        <h6 class="col">Total:</h6>
                        <div class="col-3">
                            <h6 class="text-secondary font-weight-bold text-end pe-3">
                                ${item.total}$</h6>
                            <h6 class="text-secondary font-weight-bold text-end pe-3">
                                - ${sale}$
                            </h6>
                            <hr>
                            <h6 class="text-primary font-weight-bold text-end pe-3">
                                ${tt}$
                            </h6>
                        </div>
                    </div>
                </div>`
            }
            else {
                str +=
                    `</div>
                    <div class="row">
                        <h6 class="col">Total:</h6>
                        <div class="col-3">
                            <h6 class="text-primary font-weight-bold text-end pe-3">
                                ${item.total}$</h6>
                        </div>
                    </div>
                </div>`
            }
            str +=
                `</div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary"
                            data-bs-dismiss="modal">Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
       </td>
    </tr>`;

            $('#order-body').append(str);
        });

        $('#order-body').append(`
            <td>
                <form id = "delivery-form" method="post" action="/api/order/update">
                    <div class="modal fade" id='delivery-modal' tabIndex="-1"
                            aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div class="modal-dialog">
                            <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" >Choose delivery time</h5>
                    </div>
                    <div class="modal-body">
                        <div class="input-group input-group-sm mb-2">
                            <input type="date" name="start_date" class="form-control" style="padding-right: 5px" oninput="deliveryCheck()" onblur="deliveryCheck()">
                            <input type="date" name="end_date" class="form-control" style="padding-left: 5px" oninput="deliveryCheck()" onblur="deliveryCheck()">
                        </div>
                        <h6 class="delivery error"></h6>
                        <div class="modal-footer">
                                <h6 class="general-error"></h6>
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel
                            </button>
                            <input type="hidden" name="order_id">
                            <button type="submit" class="btn btn-primary">Confirm
                            </button>
                        </div>
                    </div>
                </div>
                        </div>
                    </div>
                </form>
            </td>`);

        $('#order-pagination').html(
            `<li class="page-item" style="${data.result.disablePrev} ">
                <button class="page-link" onClick="paging('${data.result.prev}')" aria-label="Previous">
                    <span aria-hidden="true">&laquo;</span>
                </button>
            </li>
    
            <li class="page-item ${data.result.hiddenPrev}"
                style="${data.result.disablePrev} ${data.result.numberPrev}">
                <button class="page-link"  onClick="paging('${data.result.prev}')"> ${data.result.prev} </button>
            </li>
    
            <li class="page-item active">
                <button class="page-link" onClick="paging('${data.result.page}')"> ${data.result.page} </button>
            </li>
            <li class="page-item ${data.result.hiddenNext}"
                style="${data.result.disableNext} ${data.result.numberNext}">
                <button class="page-link" onClick="paging('${data.result.next}')"> ${data.result.next} </button>
            </li>
            
            <li class="page-item" style="${data.result.disableNext}">
                <button class="page-link" onClick="paging('${data.result.next}')" aria-label="Next">
                    <span aria-hidden="true">&raquo;</span>
                </button>
            </li>`);

        $('#wait-screen').css("background-color", "white");
        $('#wait-screen').css("z-index", "-1");
    });
}

function changeOrderStatus(orderID, status, start_date = null, end_date = null) {
    const url = '/api/order/update'
    $.post(url, { orderID: orderID, status: status, start_date: start_date, end_date: end_date }, function (data) {
        console.log(data);
        console.log("start date:", start_date);

        const status_badge = $(`tr[id=${orderID}] .status-bar, #status-bar-${orderID}`);

        const status_change = $(`#status-${orderID}`)
        const delivery_time = $(`#delivery-time-${orderID}`)

        console.log("status change:", status_change);
        status_badge.empty()
        let html = ``
        let stt = ``
        let time = ``

        if (status === 'Delivering') {
            html = `<span class="badge badge-sm bg-gradient-secondary w-70" style="border-width: 0;">${status}</span>`;

            stt = `
                <div class="d-flex text-center justify-content-center">
                    <div data-bs-toggle="tooltip" data-bs-placement="top" title="Set status Complete">
                        <i class="fa fa-check-circle" aria-hidden="true" onclick="changeOrderStatus('${orderID}', 'Completed')" data-bs-toggle="modal" data-bs-target='#empty'></i>
                    </div>
                    <div data-bs-toggle="tooltip" data-bs-placement="top" title="Cancled order">
                        <i class="fa fa-ban" aria-hidden="true" onclick="changeOrderStatus('${orderID}', 'Canceled')" data-bs-toggle="modal" data-bs-target=''></i>
                    
                    </div>
                </div>`;

        } else if (status === 'Processing') {
            html = `<span class="badge badge-sm bg-gradient-warning w-70" style="border-width: 0;">${status}</span> `;

            stt = `
                <div class="d-flex text-center justify-content-center">
                    <div data-bs-toggle="tooltip" data-bs-placement="top" title="Set status Delivering">
                        <i class="fa fa-truck" aria-hidden="true" onclick="openDeliveryModal('${orderID}')" data-bs-toggle="modal" data-bs-target='#delivery-modal'></i>
                    </div>
                    <div data-bs-toggle="tooltip" data-bs-placement="top" title="Cancled order">
                        <i class="fa fa-ban" aria-hidden="true" onclick="changeOrderStatus('${orderID}', 'Canceled')" data-bs-toggle="modal" data-bs-target=''></i>
                    </div>
                </div>`;
        } else if (status === 'Completed') {
            html = `<span class="badge badge-sm bg-gradient-success w-70" style="border-width: 0;">${status}</span> `;
        } else if (status === 'Canceled') {
            html = `<span class="badge badge-sm bg-gradient-danger w-70" style="border-width: 0;">${status}</span>`;
        }

        if (status === 'Completed' || status === 'Delivering') {
            const now = (new Date(start_date)).toString().split(" ");
            const start = now[2] + ' ' + now[1] + ',' + now[3];

            time += `
                <div class="mb-1"><b>Start delivery at:</b> ${start}</div>`;
        } else if (status === "Canceled" && start_date) {
            const now = (new Date(start_date)).toString().split(" ");
            const start = now[2] + ' ' + now[1] + ',' + now[3];
            time += `
                <div class="mb-1"><b>Start delivery at:</b> ${start}</div>
                <div class="mb-1"><b>End delivery at:</b> Cancel</div>
                `
        }
        if (status === 'Completed') {
            const now = (new Date(end_date)).toString().split(" ");
            const end = now[2] + ' ' + now[1] + ',' + now[3];
            time += `
                <div class="mb-1"><b>End delivery at:</b> ${end}</div>`
        }


        console.log("time:", time);

        status_badge.html(html)
        status_change.html(stt)
        delivery_time.html(time)

    }).fail(function (data) {
        if (data.status === 500)
            alert("Failed")
    })
}

function checkAll() {
    let status_filter = []
    let start_date = null
    let end_date = null
    let user_name = null

    //checkboxes check
    const status_check_boxes = $('.status input[type=checkbox]')
    status_check_boxes.each(function () {
        const id = $(this).attr('id')
        if ($(this).is(':checked'))
            status_filter.push(id)
    })

    //input date check
    const date_range_inputs = $('.date-input')
    date_range_inputs.each(function () {
        const name = $(this).attr('name')
        const value = $(this).val()
        if (name == 'start-date')
            start_date = value
        else if (name == 'end-date')
            end_date = value

    })

    //input username check
    const user_name_input = $('.user-name-input')
    const value = user_name_input.val()
    user_name = value

    //dropdown check
    const select = $('select')
    const sort = select.val()

    return { status: status_filter, start_date: start_date, end_date: end_date, sort: sort, user_name: user_name }
}

function filterInit() {
    //status checkbox init
    const checkboxes = $('.status input[type=checkbox]')
    checkboxes.each(function () {
        $(this).on("input", function () {
            const result = checkAll()
            paging(1, result.sort, result.status, result.start_date, result.end_date, result.user_name)
        })
    })

    //date range input init
    const date_range_inputs = $('.date-input')
    date_range_inputs.each(function () {
        $(this).attr('value', null)
        $(this).on("input", function () {
            const result = checkAll()
            paging(1, result.sort, result.status, result.start_date, result.end_date, result.user_name)
        })
    })

    //username input init
    const user_name_input = $('.user-name-input')
    user_name_input.attr('value', null)
    user_name_input.on("input", function () {
        const result = checkAll()
        paging(1, result.sort, result.status, result.start_date, result.end_date, result.user_name)
    })


    const select = $('select')
    select.on("input", function () {
        const result = checkAll()
        paging(1, result.sort, result.status, result.start_date, result.end_date, result.user_name)
    })
}

function deliveryCheck(field) {
    const start_date = $(`#delivery-form input[name=start_date]`)
    const end_date = $(`#delivery-form input[name=end_date]`)

    let msg = ''

    if (start_date.val() == '')
        msg = 'Start delivery is required'

    else if (end_date.val() == '')
        msg = 'End delivery is required'

    else if (start_date.val() != '' && end_date.val() != '') {
        if (start_date.val() == end_date.val())
            msg = 'Start delivery and end delivery coincide'
        else if (end_date.val() < start_date.val())
            msg = 'Invalid'
    }

    $('#delivery-modal .error').text(msg)
    return msg
}

function openDeliveryModal(orderID) {
    //clear errors if exist
    const errors = $(`#delivery-form .error`)
    errors.each(function () {
        errors.text('')
    })


    const url = `/api/order/get-by-id?orderID=${orderID}`
    $.get(url, function (data) {
        const start_input = $(`#delivery-form input[name=start_date]`)
        const end_input = $(`#delivery-form input[name=end_date]`)

        if (data.order != null && data.order.status == 'Delivering' && data.order.start_delivery) {
            start_input.val(data.order.start_delivery.split("T")[0])
            end_input.val(data.order.end_delivery.split("T")[0])
        }
        else {
            start_input.val('')
            end_input.val('')
        }

    })

    // prevent editing when there are still input errors
    const delivery_submit = $('#delivery-form button[type=submit]')
    delivery_submit.unbind()
    delivery_submit.on('click', function () {
        event.preventDefault()
        const error = deliveryCheck()
        if (error != '')
            $('#delivery-form .error').text(error)
        else {
            changeOrderStatus(orderID, 'Delivering', $('#delivery-form input[name=start_date]').val(), $('#delivery-form input[name=end_date]').val())
            $('#delivery-modal').modal('hide');
        }


    })

}

window.onload = function () {
    paging(1);
    filterInit()
}
