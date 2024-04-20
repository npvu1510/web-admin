function loadPromotion(page) {
    fetch('/api/promotion?page=' + page, {
        method: "GET"
    }).then(r => r.json()).then(data => {
        $('#promotion-body').html('');
        data.data.forEach(function (item, index) {
            let start_date = item.start_date.substring(0, item.start_date.indexOf("T"))
            let end_date = item.end_date.substring(0, item.end_date.indexOf("T"))
            $('#promotion-body').append(
                `<tr>
                    <td>
                        <div class="d-flex px-2 py-1">
                            <div class="d-flex flex-column justify-content-center">
                                <h6 class="mb-0 text-sm" id="code-cell-${index}">${item.code}</h6>
                            </div>
                        </div>
                    </td>
                    <td>
                        <p class="text-xs font-weight-bold mb-0" id="level-cell-${index}">${item.level}</p>
                    </td>
                    <td class="align-middle text-center">
                        <span class="text-secondary text-xs font-weight-bold" id="slot-cell-${index}">${item.slot}</span>
                    </td>
                    <td class="align-middle text-center">
                        <p class="text-xs font-weight-bold mb-0" id="date-cell-${index}">${start_date} - ${end_date}</p>
                    </td>
                    <td class="align-middle text-center text-sm">
                        <i class="fa fa-pencil-square-o" onclick="openEditModal(${index})" aria-hidden="true" data-bs-toggle="modal" data-bs-target='#promotion-edit'></i>
                        <i onclick="deletePromotion('${item.code}')" id="Layer_1" class="fa fa-trash-o" aria-hidden="true" data-bs-toggle="modal" data-bs-target='#promotion-delete' data-name="Layer 1"></i>
                        
                    </td>
                </tr>`
            )
        })
        $('#promotion-body').append(`
                    <!-- Delete Modal -->
                    <td>
                        <form id ="delete-form" action = '/manage/promotion/delete' method="post">
                            <div class="modal fade" id="promotion-delete" tabIndex="-1"
                                 aria-labelledby="exampleModalLabel" aria-hidden="true">
                                <div class="modal-dialog">
                                    <div class="modal-content">
                                        <div class="modal-header">
                                            <h5 class="modal-title" id="exampleModalLabel">Are you sure?
                                            </h5>
                                        </div>
                                        <div class="modal-body">
                                            Are you sure to delete this promotion?
                                        </div>
                                        <div class="modal-footer"  style="height:70px">
                                            <input type="hidden" name="delete_code">
                                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancle
                                            </button>
                                            <button type="submit" class="btn btn-primary" style="background-color: red" data-bs-dismiss="modal">Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </td>
                    
                    <!-- Edit Modal -->
                    <td>
                        <form id = "edit-form" action = '/manage/promotion/edit' method="post">
                            <div class="modal fade" id='promotion-edit' tabIndex="-1"
                                 aria-labelledby="exampleModalLabel" aria-hidden="true">
                                <div class="modal-dialog">
                                    <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title">Edit</h5>
                            </div>

                            <div class="modal-body">
                                <b>Code:</b> <span class="red-start">*</span>
                                <input type="text" class="form-control"  aria-label="Code" name="code" oninput="editCheck('code')" onblur="editCheck('code')">
                                <h6 class="code error"></h6>
    
                                <b>Level:</b> <span class="red-start">*</span>
                                <input type="text" class="form-control"  aria-label="Level" name="level" oninput="editCheck('level')" onblur="editCheck('level')">
                                <h6 class="level error"></h6>
    
                                <b>Slot:</b> <span class="red-start">*</span>
                                <input type="text" class="form-control"  aria-label="Slot" name="slot" oninput="editCheck('slot')" onblur="editCheck('slot')">
                                <h6 class="slot error"></h6>
    
                                <b>Duration:</b> <span class="red-start">*</span>
                                <div class="input-group input-group-sm mb-2">
                                    <input type="date" name="start_date" class="form-control" style="padding-right: 5px" oninput="editCheck('start_date')" onblur="editCheck('start_date')">
                                    <input type="date" name="end_date" class="form-control" style="padding-left: 5px" oninput="editCheck('end_date')" onblur="editCheck('end_date')">
                                </div>
                                <h6 class="start_date error"></h6>
                                <h6 class="end_date error"></h6>
    
                                <div class="modal-footer">
                                     <h6 class="general-error" style="color: red"></h6>
                                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel
                                    </button>
                                   <input type="hidden" name="edit_code">
                                    <button type="submit" class="btn btn-primary">Edit
                                    </button>
                                </div>
                            </div>
                        </div>
                                </div>
                            </div>
                        </form>
                    </td>`)

        $('#promotion-pagination').html(
            `<li class="page-item" style="${data.disablePrev} ">
                <button class="page-link" onClick="loadPromotion('${data.prev}')" aria-label="Previous">
                    <span aria-hidden="true">&laquo;</span>
                </button>
            </li>
    
            <li class="page-item ${data.hiddenPrev}"
                style="${data.disablePrev} ${data.numberPrev}">
                <button class="page-link"  onClick="loadPromotion('${data.prev}')"> ${data.prev} </button>
            </li>
    
            <li class="page-item active">
                <button class="page-link" onClick="loadPromotion('${data.page}')"> ${data.page} </button>
            </li>
            <li class="page-item ${data.hiddenNext}"
                style="${data.disableNext} ${data.numberNext}">
                <button class="page-link" onClick="loadPromotion('${data.next}')"> ${data.next} </button>
            </li>
            
            <li class="page-item" style="${data.disableNext}">
                <button class="page-link" onClick="loadPromotion('${data.next}')" aria-label="Next">
                    <span aria-hidden="true">&raquo;</span>
                </button>
            </li>`);
    })
}

window.onload = function () {
    loadPromotion(1)
    Init()
}

function isValid(input, field) {
    const regex = /[0-9]/g;
    const valid = input.match(regex)

    switch (field) {
        case 'code':
            if (input == "")
                return 'Code is required'
            break;

        case 'level':
            if (input == "")
                return 'Level is required'
            if (!valid || input.match(regex).length < input.length)
                return 'Please enter only digits'
            break;

        case 'slot':
            if (input == "")
                return 'Slot is required'
            if (!valid || input.match(regex).length < input.length)
                return 'Please enter only digits'
            break;

        case 'start_date':
            if (!input)
                return 'Start date is required'
            break;

        case 'end_date':
            if (!input)
                return 'End date is required'
            break;
    }
    return ''
}

function Init() {
    const inputs = $(`#add-form input`)

    inputs.each(function () {
        const name = $(this).attr("name")

        $(this).on("input", function () {
            const input = $(this).val()
            const error_msg = isValid(input, name)
            $(`#add-form .${name}`).text(error_msg)
        })

        $(this).blur(function () {
            const input = $(this).val()
            const error_msg = isValid(input, name)
            $(`#add-form .${name}`).text(error_msg)
        })
    })
    const submit = $(`#add-form .modal-footer button[type=submit]`)
    submit.on('click', function () {
        inputs.each(function () {
            const error_msg = isValid($(this).val(), $(this).attr("name"))
            if (error_msg != '') {
                event.preventDefault()
                $('#add-form .general-error').text(error_msg)
                return false
            }
            else
                submit.submit()

        })
    })
}

function openAddModal() {
    //clear errors if exist
    const errors = $(`#add-form .error`)
    errors.each(function () {
        errors.text('')
    })

    //init
    const inputs = $(`#add-form input`)
    inputs.each(function () {
        inputs.val('')
    })

}

function openEditModal(index) {
    //clear errors if exist
    const error = $(`#edit-form .error`)
    error.each(function () {
        error.text('')
    })

    //set default val
    const inputs = $(`#edit-form input`)
    inputs.each(function () {
        const field = $(this).attr("name")
        let current_text = $(`#${field}-cell-${index}`).text()

        if (current_text.endsWith('%'))
            current_text = current_text.slice(0,current_text.length-1)

        $(this).val(current_text)
    })

    //set up hidden value
    const input_hidden = $(`#edit-form input[name=edit_code]`)
    const current_code_val = $(`#code-cell-${index}`).text()
    input_hidden.val(current_code_val)

    // prevent editing when there are still input errors
    const edit_btn = $('#edit-form button[type=submit]')
    edit_btn.on('click', function () {
        inputs.each(function () {
            const error_msg = isValid($(this).val(), $(this).attr("name"))
            if (error_msg != '') {
                event.preventDefault()
                $('#edit-form .general-error').text(error_msg)
                return false
            }
            else
                edit_btn.submit()

        })
    })


}

function editCheck(field) {
    const input = $(`#edit-form input[name=${field}]`)

    const msg = isValid(input.val(), field)

    const error = $(`#edit-form .${field}`)
    error.text(msg)
}

function deletePromotion(code) {
    $(`#delete-form .modal-footer input[type=hidden]`).val(code)
}




