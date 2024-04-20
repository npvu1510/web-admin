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
                          <input type="color" class="form-control-color" name="color" oninput="colorCheck(${last_row})"
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
        size_select.append(`<option value="${size_buffer[i]}">${size_buffer[i]}</option>`)

    size_select.val(`${sizes}`)

    //set color
    const color_select = $(`#color-select-${last_row}`)
    for (let i = 0; i < color_select.length; i++)
        color_select.val(colors)
}

function isExistVariation(row) {
    const table_body = $(`#variation-table tbody`).children() // rows
    const latest_size = $(`#variation-table #size-select-${row}`).val()
    const latest_color = $(`#variation-table #color-select-${row}`).val()

    let start = 0
    let end = table_body.length - 1

    if (row != getCurrentLastRow() - 1) {
        end = table_body.length
    }


    for (let i = start; i < end; i++) {
        if (row == i)
            continue;

        const size = $(`#table-row-${i}`).find('.size-select').val()
        const color = $(`#table-row-${i}`).find(`#color-select-${i}`).val()

        console.log(i, size)
        /*        console.log(color,latest_color)*/
        if (size == latest_size && color == latest_color)
            return `Duplicate variations`
    }
    return ''
}


function sizeCheck(row, general = null) {
    const value = $(`#variation-table #size-select-${row}`).val()

    let msg = ''

    const value2 = isExistVariation(row)

    if (value2 != '')
        msg = value2;

    else if (value == null)
        msg = 'Size is required'

    if (general == null)
        $(`#variation-table .size-${row}`).text(msg)


    else {
        const size_errors = $(`#variation-table h6[class^="size"][class$="error"]`)
        size_errors.each(function () {
            $(this).text('')
        })
        $(`.general-error`).text(msg)

    }


    return msg
}

function colorCheck(row, general = null) {
    let msg = ''

    const value = isExistVariation(row)

    if (value != '')
        msg = value;

    if (general == null)
        $(`#variation-table .size-${row}`).text(msg)

    else {
        const size_errors = $(`#variation-table h6[class^="size"][class$="error"]`)
        size_errors.each(function () {
            $(this).text('')
        })
        $(`.general-error`).text(msg)
    }

    return msg
}

function stockCheck(row, general = true) {
    const positive_regex = '^[+]?\\d+([.]\\d+)?$';

    const value = $(`#variation-table input[id=stock-${row}]`).val()

    const isValid = value.match(positive_regex)

    let msg = ''

    if (isValid == null)
        msg = 'Please enter a positive number'

    if (!general)
        $(`.general-error`).text(msg)
    else
        $(`#variation-table .stock-${row}`).text(msg)

    return msg
}

function loadCurrentData() {
    const productID = $("input[name=product-id]").val()

    console.log("id:", productID)

    const url = `/api/product/get?productID=${productID}`
    $.get(url, function (data) {
        console.log("data:", data);
        const variations = data.product.variation

        // set check category
        $('input[value=' + data.product.category + ']').prop("checked", true);


        // set variation
        if (variations) {
            variations.forEach(variation => {
                addVariation(productID, variation.size, variation.color, variation.stock)
            });
        }
    })
}

function initEditBtn() {
    const form = $(`#edit-product-form`)

    const submit_btn = $(`#edit-product-btn`)
    submit_btn.on('click', function () {
        event.preventDefault()
        const table_body = $(`#variation-table tbody`).children() // rows

        for (let i = 0; i < table_body.length; i++) {
            //stock check
            const isValidSize = sizeCheck(i, true)
            if (isValidSize != '') {
                return false;
            }

            const isValidStock = stockCheck(i, true)
            if (isValidStock != '') {
                return false;
            }
        }

        let input_name = $('input[name=name]');
        let input_price = $('input[name=price]');

        if (input_name.val() == "" || input_price.val() == "") {
            alert("Please fill all the fields");
            return;
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



window.onload = function () {
    loadCurrentData()
    initEditBtn()
}
