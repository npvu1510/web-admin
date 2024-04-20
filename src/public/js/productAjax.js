function getProductsByFilter(page, category = null, brand = null, min_price = '0', max_price = '999999') {
    const sort_type = $('#sort-dropdown').find(":selected").val();
    if (min_price === '')
        min_price = '0'
    if (max_price == '')
        max_price = '999999'


    if (category == null || category.length == 0)
        category = null
    if (brand == null || brand.length == 0)
        brand = null

    fetch(`/api/product?sort=${sort_type}&page=${page}&category=${JSON.stringify(category)}&brand=${JSON.stringify(brand)}&min=${min_price}&max=${max_price}`, {
        method: "GET"
    }).then(r => r.json()).then(data => {

        category = JSON.stringify(category)
        brand = JSON.stringify(brand)

        $('#list-product-render').html('');
        data.result.data.forEach(function (item, index) {
            let status = `<span class="badge bg-success" style="margin-left: 10px">On stock</span>`
            const check = stockCheck(item)
            if (check == 2)
                status = `<span class="badge bg-danger" style="margin-left: 10px">Out of stock</span>`
            else if (check == 1)
                status = `<span class="badge bg-info" style="margin-left: 10px">Coming soon</span>`

            $('#list-product-render').append(`
           <div class="card mx-2 my-2" style="width: 18rem;">
						<div class="card-img">
                            <a href="/product/${item._id}">
							    <img src="${item.thumbnail}" class="card-img-top" alt="thumbnail">
                            </a>
						</div>
						<div class="card-body">
							<h6 class="card-title">
                                <a href="/product/${item._id}">${item.name}</a>
                            </h6>
							<div class="card-text mb-3">Price: <b>${item.price}$</b>${status}</div>
							<a href="/product/${item._id}" class="btn btn-primary" style="z-index: 1;">Detail</a>
						</div>
					</div>`);
        });
        $('#product-pagination').html(
            `<li class="page-item" style="${data.result.disablePrev} ">
                <button class="page-link" onClick='getProductsByFilter(${data.result.prev},${category},${brand},${min_price}, ${max_price})' aria-label="Previous">
                    <span aria-hidden="true">&laquo;</span>
                </button>
            </li>

            <li class="page-item ${data.result.hiddenPrev}"
                style="${data.result.disablePrev} ${data.result.numberPrev}">
                <button class="page-link"  onClick='getProductsByFilter(${data.result.prev},${category},${brand},${min_price}, ${max_price})'> ${data.result.prev} </button>
            </li>
            
            <li class="page-item active">
                <button class="page-link" onClick='getProductsByFilter(${data.result.page},${category},${brand},${min_price}, ${max_price})'> ${data.result.page} </button>
            </li>
            <li class="page-item ${data.result.hiddenNext}"
                style="${data.result.disableNext} ${data.result.numberNext}">
                <button class="page-link" onClick='getProductsByFilter(${data.result.next},${category},${brand},${min_price}, ${max_price})'> ${data.result.next} </button>
            </li>
            
            <li class="page-item" style="${data.result.disableNext}">
                <button class="page-link" onClick='getProductsByFilter(${data.result.next},${category},${brand},${min_price}, ${max_price})' aria-label="Next">
                    <span aria-hidden="true">&raquo;</span>
                </button>
            </li>`);
    });
}

function test(field) {
    console.log(field)

}


function checkAll() {
    let category_filter = []
    let brand_filter = []
    let min_price = 0;
    let max_price = 0;

    const size_check_boxes = $('.categories input[type=checkbox]')
    size_check_boxes.each(function () {
        const id = $(this).attr('id')
        if ($(this).is(':checked'))
            category_filter.push(id)
    })

    const brand_size_checkboxes = $('.brand input[type=checkbox]')
    brand_size_checkboxes.each(function () {
        const id = $(this).attr('id')
        if ($(this).is(':checked'))
            brand_filter.push(id)
    })

    const price_inputs = $('.price input[type=number]')
    price_inputs.each(function () {
        const name = $(this).attr('name')
        const value = $(this).val()
        if (name == 'min-price')
            min_price = value
        else
            max_price = value
    })

    return { category: category_filter, brand: brand_filter, min_price: min_price, max_price: max_price }
}

function Init() {
    const checkboxes = $('input[type=checkbox]')
    checkboxes.each(function () {
        $(this).on("input", function () {
            const result = checkAll()
            getProductsByFilter(1, result.category, result.brand, result.min_price, result.max_price)

        })
    })

    const price_inputs = $('.price input[type=number]')
    price_inputs.each(function () {
        const name = $(this).attr('name')
        if (name == 'min-price')
            $(this).attr('value', '0')
        else
            $(this).attr('value', '999999')

        $(this).on("input", function () {
            const result = checkAll()
            getProductsByFilter(1, result.category, result.brand, result.min_price, result.max_price)
        })
    })

    const select = $('#sort-dropdown')
    select.on("input", function () {
        const result = checkAll()
        getProductsByFilter(1, result.category, result.brand, result.min_price, result.max_price)
    })
}

function getCurrentLastRow() {
    return $(`#variation-table tbody`).children().length
}

function addVariation(productID, sizes = null, colors = null, stock = 0) {
    if (stock == null)
        stock = 0

    const table = $(`.table tbody`)
    const last_row = getCurrentLastRow() || 0
    table.append(`                                                    
                <tr id="table-row-${last_row}">
                    <td>
                        <select class="size-select" aria-label="Default select example" id="size-select-${last_row}" 
                            style="border: 1px solid lightgray !important; border-radius: 5px" name="size" onchange="sizeCheck(${last_row})">
                        </select>
                        <h6 class="size-${last_row} error"></h6>
                    </td>
                    <td>
                          <input type="color" class="form-control-color" name="color"
                          id="color-select-${last_row}">
                    </td>

                    <td>
                        <input type="number"
                        style="border: 1px solid lightgray !important; border-radius: 5px"
                        id="stock-${last_row}" name="stock" value="${stock}" oninput="stockCheck(${last_row})">
                        <h6 class="stock-${last_row} error"></h6>
                    </td>
                  
                </tr>`)
    const size_buffer = ['S', 'M', 'L', 'XL', '2XL', '3XL']

    //set size default
    const size_select = $(`#size-select-${last_row}`)

    for (let i = 0; i < size_buffer.length; i++)
        if (i == 0)
            size_select.append(`<option value="${size_buffer[i]}">${size_buffer[i]}</option>`)
        else
            size_select.append(`<option value="${size_buffer[i]}">${size_buffer[i]}</option>`)

    size_select.val(`${sizes}`)

    //set color
    const color_select = $(`#color-select-${last_row}`)
    for (let i = 0; i < color_select.length; i++)
        color_select.val(colors)
}

function sizeCheck(row) {
    const value = $(`#variation-table #size-select-${row}`).val()
    const error = $(`#variation-table .size-${row}`)

    let msg = ''
    if (value == null)
        msg = 'Size is required'

    error.text(msg)
    return msg
}

function stockCheck(row) {
    console.log("stockCheck");

    const positive_regex = '^[+]?\\d+([.]\\d+)?$';

    console.log("positive_regex", positive_regex);

    const value = $(`#variation-table input[id=stock-${row}]`).val()

    const isValid = value.match(positive_regex)

    const error = $(`#variation-table .stock-${row}`)

    let msg = ''

    if (isValid == null)
        msg = 'Please enter a positive number'

    error.text(msg)

    return msg
}

function loadCurrentData() {
    const productID = $("input[name=product-id]").val()

    console.log("id:", productID)

    const url = `/api/product/get?productID=${productID}`
    $.get(url, function (data) {
        const variations = data.product.variation
        if (variations) {
            variations.forEach(variation => {
                addVariation(productID, variation.size, variation.color, variation.stock)
            });
        }
    })
}

function initEditBtn() {
    const productID = $("input[name=product-id]").val()
    const form = $(`#edit-product-form`)

    const submit_btn = $(`#edit-product-btn`)
    submit_btn.on('click', function () {
        event.preventDefault()
        const table_body = $(`#variation-table tbody`).children() // rows

        for (let i = 0; i < table_body.length; i++) {
            //stock check
            const isValidSize = sizeCheck(i)
            if (isValidSize != '') {
                $(`.general-error`).text(isValidSize)
                return false;
            }

            const isValidStock = stockCheck(i)
            if (isValidStock != '') {
                $(`.general-error`).text(isValidStock)
                return false;
            }
        }

        //get all value
        let variations = []
        for (let i = 0; i < table_body.length; i++) {
            const row = $(`#table-row-${i}`)

            //get size
            const size = row.find('.size-select').val()

            //get size
            const color = row.find(`#color-select-${i}`).val()

            //get size
            const stock = row.find(`#stock-${i}`).val()

            variations.push({ size: size, color: color, stock: stock })
        }
        const temp = JSON.stringify(variations)
        $(`#variation-table tbody`).append(`<input type=hidden name='variation' value='${temp}'>`)
        form.submit()
    })
}

function checkPrice(e) {
    if (e.value === '') return
    if (isNaN(e.value)) {
        e.value = 0
    }
    if (e.value > 9999999)
        e.value = 9999999
    if (e.value < 1)
        e.value = 0
}

function stockCheck(product) {
    const variation = product.variation

    if (variation == undefined || variation.length == 0)
        return 1 // coming soon

    for (let i = 0; i < variation.length; i++)
        if (variation[i].stock > 0)
            return 0 // on stock

    return 2 //out of stock
}

function checkAndSubmit(form_id) {
    console.log("--- check and submit ---");
    let form = $('#' + form_id);
    let input_name = $('input[name=name]');
    let input_price = $('input[name=price]');
    let input_img = $('input[name=img]');

    if (input_name.val() == "" || input_price.val() == "" || input_img.val() == undefined) {
        alert("Please fill all the fields");
        return false;
    }

    form.submit()

}

window.onload = function () {
    const category = ['Bags', 'Accessories']
    getProductsByFilter(1)
    Init()
}
