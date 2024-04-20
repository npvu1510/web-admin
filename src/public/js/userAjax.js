function pagingAdmin(page, filter) {
    let url = '/api/user/admin?filter=' + filter + '&page=' + page;
    if (filter === 0) {
        url = '/api/user/admin?filter=' + 0 + '&page=' + page
    }
    fetch(url, {
        method: "GET"
    }).then(r => r.json()).then(data => {
        $('#admin-body').html('');
        data.data.forEach(function (item, index) {
            $('#admin-body').append(
                `<tr>
                    <td>
                        <div class="d-flex px-2 py-1">
                            <div>
                                <img src="${item.avatar_url}" class="avatar avatar-sm me-3" alt="user1">
                            </div>
                            <div class="d-flex flex-column justify-content-center">
                                <h6 class="mb-0 text-sm">${item.username}</h6>
                                <p class="text-xs text-secondary mb-0">${item.email}</p>
                            </div>
                        </div>
                    </td>
                    <td>
                        <p class="text-xs font-weight-bold mb-0">${item.role}</p>
                        <p class="text-xs text-secondary mb-0">Organization</p>
                    </td>
                    <td class="align-middle text-center">
                        <span class="text-secondary text-xs font-weight-bold">${item.employed}</span>
                    </td>
                    <td class="align-middle text-center text-sm">
                        <button class="button-add btn-view badge badge-sm bg-gradient-secondary"
                                data-bs-toggle="modal" data-bs-target='#account${index}'>View
                        </button>
                    </td>
                    <!-- User Modal -->
                    <td>
                        <div class="modal fade" id='account${index}' tabIndex="-1"
                             aria-labelledby="exampleModalLabel" aria-hidden="true">
                            <div class="modal-dialog">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <h5 class="modal-title" id="exampleModalLabel">Account
                                            information
                                        </h5>
    
                                    </div>
                                    <div class="modal-body">
                                        <h5 style=" margin-bottom: -3px;">${item.fullname}</h5>
                                        <h6 class="mb-1" style="font-weight: 500;">@${item.username} </h6>
                                        <div><b>UserID:</b> ${item._id}</div>
                                        <div><b>Role:</b> ${item.role}</div>
                                        <div><b>Email:</b> ${item.email}</div>
                                        <div><b>Create at:</b> ${item.employed}</div>
                                        <div><b>Avatar URL:</b>
                                            <a style="text-decoration: underline; color: #67748E;"
                                               href="{{avatar_url}}" target="_blank">
                                                ${item.avatar_url}</a>
                                        </div>
                                        <div><b>Status:</b> Active</div>
                                        <div><b>Address:</b> ${item.address} </div>
                                        <div><b>Phone number:</b> ${item.phone}</div>
                                    </div>
                                    <div class="modal-footer">
                                        <button type="button" class="btn btn-secondary"
                                                data-bs-dismiss="modal">Close
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </td>
                </tr>`
            )
        })

        $('#admin-pagination').html(
            `<li class="page-item" style="${data.disablePrev}">
                <button class="page-link" onClick="pagingAdmin('${data.prev}','${data.filter}')" aria-label="Previous">
                    <span aria-hidden="true">&laquo;</span>
                </button>
            </li>
    
            <li class="page-item ${data.hiddenPrev}"
                style="${data.disablePrev} ${data.numberPrev}">
                <button class="page-link"  onClick="pagingAdmin('${data.prev}','${data.filter}')"> ${data.prev} </button>
            </li>
    
            <li class="page-item active">
                <button class="page-link" onClick="pagingAdmin('${data.page}','${data.filter}')"> ${data.page} </button>
            </li>
            <li class="page-item ${data.hiddenNext}"
                style="${data.disableNext} ${data.numberNext}">
                <button class="page-link" onClick="pagingAdmin('${data.next}','${data.filter}')"> ${data.next} </button>
            </li>
            
            <li class="page-item" style="${data.disableNext}">
                <button class="page-link" onClick="pagingAdmin('${data.next}','${data.filter}')" aria-label="Next">
                    <span aria-hidden="true">&raquo;</span>
                </button>
            </li>`);
    })
}

function pagingUser(page, filter) {
    let url = '/api/user/user?filter=' + filter + '&page=' + page;
    if (filter === 0) {
        url = '/api/user/user?filter=' + 0 + '&page=' + page
    }
    fetch(url, {
        method: "GET"
    }).then(r => r.json()).then(data => {
        $('#user-body').html('');
        data.data.forEach(function (item, index) {
            str = `<tr>`;

            // < div class="d-flex flex-column justify-content-center" >
            if (item.status === "Banned") {
                str += `
                    <td>
                        <div class="d-flex px-2 py-1">
                            <div>
                                <img src="${item.avatar_url}" class="avatar avatar-sm me-3" alt="user1">
                            </div>
                            <div class="d-flex flex-column justify-content-center">
                                <div class="d-flex">
                                    <h6 class="mb-0 me-3 text-sm">${item.username}</h6>
                                    <span class="ms-4 mt-2 translate-middle badge rounded-pill bg-danger" style="font-size:10px">
                                        Banned
                                    </span >
                                </div>
                                <p class="text-xs text-secondary mb-0">${item.email}</p>
                            </div>
                        </div>
                    </td>`
            } else {
                str += `
                    <td>
                        <div class="d-flex px-2 py-1">
                            <div>
                                <img src="${item.avatar_url}" class="avatar avatar-sm me-3" alt="user1">
                            </div>
                            <div class="d-flex flex-column justify-content-center">
                                <h6 class="mb-0 text-sm">${item.username}</h6>
                                <p class="text-xs text-secondary mb-0">${item.email}</p>
                            </div>
                        </div>
                    </td>`
            }

            str += `
                    <td>
                        <p class="text-xs font-weight-bold mb-0">${item.role}</p>
                        <p class="text-xs text-secondary mb-0">Organization</p>
                    </td>
                    <td class="align-middle text-center">
                        <span class="text-secondary text-xs font-weight-bold">${item.employed}</span>
                    </td>
                    <td class="align-middle text-center text-sm">
                        <button class="button-add btn-view badge badge-sm bg-gradient-secondary"
                                data-bs-toggle="modal" data-bs-target='#account${index}'>View
                        </button>
                    </td>
                     <td class="align-middle">
                        <div class="dropdown-toggle" id="dropdownMenuButton1"
                                data-bs-toggle="dropdown" aria-expanded="false">
                            Edit
                        </div>
                        <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                            <li>
                                <form action="edit/${item._id}?_method=DELETE" method="post">
                                    <button class="dropdown-item" type="submit" name="delete"
                                            value="delete">Delete
                                    </button>
                                </form>
                            </li>
                             <li >
                                <form action="edit/${item._id}?_method=PUT" method="post">
                                    <select class="form-select" name="to_status"
                                        onChange='if(this.value !== 0) { this.form.submit();}'>
                                        <option value="0">Change status</option>
                                        <option value="Banned">Banned</option>
                                        <option value="Unbanned">Unbanned</option>
                                    </select>
                                </form> 
                            </li >`

            if (item.status !== "Banned") {
                str += `<li>
                            <form action="edit/${item._id}?_method=PUT" method="post">
                                <select class="form-select" name="to_role"
                                    onChange='if(this.value !== 0) { this.form.submit();}'>
                                    <option value="0">Change role</option>
                                    <option value="User">User</option>
                                    <option value="Admin">Admin</option>
                                </select>
                            </form>
                        </li >
                    </ul >
                </td >`
            }

            str += `
                    <td>
                        <div class="modal fade" id='account${index}' tabIndex="-1"
                            aria-labelledby="exampleModalLabel" aria-hidden="true">
                            <div class="modal-dialog">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <h5 class="modal-title" id="exampleModalLabel">Account
                                            information
                                        </h5>

                                    </div>
                                    <div class="modal-body">
                                        <h5 style=" margin-bottom: -3px;">${item.fullname}</h5>
                                        <h6 class="mb-1" style="font-weight: 500;">@${item.username} </h6>
                                        <div><b>UserID:</b> ${item._id}</div>
                                        <div><b>Role:</b> ${item.role}</div>
                                        <div><b>Email:</b> ${item.email}</div>
                                        <div><b>Create at:</b> ${item.employed}</div>
                                        <div><b>Avatar URL:</b>
                                            <a style="text-decoration: underline; color: #67748E;"
                                                href="{{avatar_url}}" target="_blank">
                                                ${item.avatar_url}</a>
                                        </div>
                                        <div><b>Status:</b> Active</div>
                                        <div><b>Address:</b> ${item.address} </div>
                                        <div><b>Phone number:</b> ${item.phone}</div>
                                    </div>
                                    <div class="modal-footer">
                                        <button type="button" class="btn btn-secondary"
                                            data-bs-dismiss="modal">Close
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </td>
                </tr > `

            $("#user-body").append(str)
        })

        if (data.checkErrors) {
            let str =
                `< svg xmlns = "http://www.w3.org/2000/svg" style = "display: none;" >
                    <symbol id="exclamation-triangle-fill" fill="currentColor" viewBox="0 0 16 16">
                        <path
                            d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
                    </symbol>
                </svg >

                    <div class="alert alert-danger d-flex align-items-center mt-3" role="alert"
                        style="background-image: linear-gradient(to right, #e09ea4, #e08d94);">
                        <svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Danger:">
                            <use xlink:href="#exclamation-triangle-fill" />
                        </svg>`

            if (data.errors.username) {
                str +=
                    `<div class="mx-4">
                        <b>Username:</b>
                        <span> ${data.errors.username}</span>
                    </div>`;

            } else if (data.errors.password) {
                str +=
                    `<div class="mx-4">
                        <b>Password:</b>
                        <span> ${data.errors.password}</span>
                    </div>`
            } else if (data.errors.confirm_password) {
                str +=
                    `<div class="mx-4">
                        <b>Confirm password:</b>
                        <span> ${data.errors.confirm_password}</span>
                    </div>`
            }
            str += `</div>`;
            $('#errors').html(str);
        }

        $('#user-pagination').html(
            `<li class="page-item" style = "${data.disablePrev}" >
                <button class="page-link" onClick="pagingUser('${data.prev}','${data.filter}')" aria-label="Previous">
                    <span aria-hidden="true">&laquo;</span>
                </button>
            </li >
    
            <li class="page-item ${data.hiddenPrev}"
                style="${data.disablePrev} ${data.numberPrev}">
                <button class="page-link"  onClick="pagingUser('${data.prev}','${data.filter}')"> ${data.prev} </button>
            </li>
    
            <li class="page-item active">
                <button class="page-link" onClick="pagingUser('${data.page}','${data.filter}')"> ${data.page} </button>
            </li>
            <li class="page-item ${data.hiddenNext}"
                style="${data.disableNext} ${data.numberNext}">
                <button class="page-link" onClick="pagingUser('${data.next}','${data.filter}')"> ${data.next} </button>
            </li>
            
            <li class="page-item" style="${data.disableNext}">
                <button class="page-link" onClick="pagingUser('${data.next}','${data.filter}')" aria-label="Next">
                    <span aria-hidden="true">&raquo;</span>
                </button>
            </li>`);
    })
}

function SearchUserByNameAndGmail(e) {
    fetch('/api/user/search-user?name=' + e.value, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(r => r.json()).then(data => {
        $('#user-body').html('');
        $('#user-pagination').html('');
        data.data.forEach(function (item, index) {
            $('#user-body').append(
                `<tr>
                    <td>
                        <div class="d-flex px-2 py-1">
                            <div>
                                <img src="${item.avatar_url}" class="avatar avatar-sm me-3" alt="user1">
                            </div>
                            <div class="d-flex flex-column justify-content-center">
                                <h6 class="mb-0 text-sm">${item.username}</h6>
                                <p class="text-xs text-secondary mb-0">${item.email}</p>
                            </div>
                        </div>
                    </td>
                    <td>
                        <p class="text-xs font-weight-bold mb-0">${item.role}</p>
                        <p class="text-xs text-secondary mb-0">Organization</p>
                    </td>
                    <td class="align-middle text-center">
                        <span class="text-secondary text-xs font-weight-bold">${item.employed}</span>
                    </td>
                    <td class="align-middle text-center text-sm">
                        <button class="button-add btn-view badge badge-sm bg-gradient-secondary"
                                data-bs-toggle="modal" data-bs-target='#account${index}'>View
                        </button>
                    </td>
                    <td class="align-middle">
                        <div class="dropdown-toggle" id="dropdownMenuButton1"
                             data-bs-toggle="dropdown" aria-expanded="false">
                            Edit
                        </div>
                        <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                            <li>
                                <form action="edit/${item._id}?_method=DELETE" method="post">
                                    <button class="dropdown-item" type="submit" name="delete"
                                            value="delete">Delete
                                    </button>
                                </form>
                            </li>
                            <li>
                                <form action="edit/${item._id}?_method=PUT" method="post">
                                    <select class="form-select" name="to_role"
                                            onChange='if(this.value !== 0) { this.form.submit();}'>
                                        <option value="0">Change role</option>
                                        <option value="User">User</option>
                                        <option value="Admin">Admin</option>
                                    </select>
                                </form> 
                            </li>
                        </ul>
                    </td>
                    <td>
                        <div class="modal fade" id='account${index}' tabIndex="-1"
                            aria-labelledby="exampleModalLabel" aria-hidden="true">
                            <div class="modal-dialog">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <h5 class="modal-title" id="exampleModalLabel">Account
                                            information
                                        </h5>

                                    </div>
                                    <div class="modal-body">
                                        <h5 style=" margin-bottom: -3px;">${item.fullname}</h5>
                                        <h6 class="mb-1" style="font-weight: 500;">@${item.username} </h6>
                                        <div><b>UserID:</b> ${item._id}</div>
                                        <div><b>Role:</b> ${item.role}</div>
                                        <div><b>Email:</b> ${item.email}</div>
                                        <div><b>Create at:</b> ${item.employed}</div>
                                        <div><b>Avatar URL:</b>
                                            <a style="text-decoration: underline; color: #67748E;"
                                                href="{{avatar_url}}" target="_blank">
                                                ${item.avatar_url}</a>
                                        </div>
                                        <div><b>Status:</b> Active</div>
                                        <div><b>Address:</b> ${item.address} </div>
                                        <div><b>Phone number:</b> ${item.phone}</div>
                                    </div>
                                    <div class="modal-footer">
                                        <button type="button" class="btn btn-secondary"
                                            data-bs-dismiss="modal">Close
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </td>
                </tr> `
            )
        })

        if (data.checkErrors) {
            let str =
                `<svg xmlns = "http://www.w3.org/2000/svg" style = "display: none;">
                    <symbol id="exclamation-triangle-fill" fill="currentColor" viewBox="0 0 16 16">
                        <path
                            d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
                    </symbol>
                </svg >

                    <div class="alert alert-danger d-flex align-items-center mt-3" role="alert"
                        style="background-image: linear-gradient(to right, #e09ea4, #e08d94);">
                        <svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Danger:">
                            <use xlink:href="#exclamation-triangle-fill" />
                        </svg>`

            if (data.errors.username) {
                str +=
                    `<div class="mx-4">
                        <b>Username:</b>
                        <span> ${data.errors.username}</span>
                    </div>`;

            } else if (data.errors.password) {
                str +=
                    `<div class="mx-4">
                        <b>Password:</b>
                        <span> ${data.errors.password}</span>
                    </div>`
            } else if (data.errors.confirm_password) {
                str +=
                    `<div class="mx-4">
                        <b>Confirm password:</b>
                        <span> ${data.errors.confirm_password}</span>
                    </div>`
            }
            str += `</div>`;
            $('#errors').html(str);
        }
    })
}

function SearchAdminByNameAndGmail(e) {
    fetch('/api/user/search-admin?name=' + e.value, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(r => r.json()).then(data => {
        $('#admin-body').html('');
        $('#admin-pagination').html('');
        data.data.forEach(function (item, index) {
            $('#admin-body').append(
                `<tr>
                    <td>
                        <div class="d-flex px-2 py-1">
                            <div>
                                <img src="${item.avatar_url}" class="avatar avatar-sm me-3" alt="user1">
                            </div>
                            <div class="d-flex flex-column justify-content-center">
                                <h6 class="mb-0 text-sm">${item.username}</h6>
                                <p class="text-xs text-secondary mb-0">${item.email}</p>
                            </div>
                        </div>
                    </td>
                    <td>
                        <p class="text-xs font-weight-bold mb-0">${item.role}</p>
                        <p class="text-xs text-secondary mb-0">Organization</p>
                    </td>
                    <td class="align-middle text-center">
                        <span class="text-secondary text-xs font-weight-bold">${item.employed}</span>
                    </td>
                    <td class="align-middle text-center text-sm">
                        <button class="button-add btn-view badge badge-sm bg-gradient-secondary"
                                data-bs-toggle="modal" data-bs-target='#account${index}'>View
                        </button>
                    </td>
                    <td>
                        <div class="modal fade" id='account${index}' tabIndex="-1"
                            aria-labelledby="exampleModalLabel" aria-hidden="true">
                            <div class="modal-dialog">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <h5 class="modal-title" id="exampleModalLabel">Account
                                            information
                                        </h5>

                                    </div>
                                    <div class="modal-body">
                                        <h5 style=" margin-bottom: -3px;">${item.fullname}</h5>
                                        <h6 class="mb-1" style="font-weight: 500;">@${item.username} </h6>
                                        <div><b>UserID:</b> ${item._id}</div>
                                        <div><b>Role:</b> ${item.role}</div>
                                        <div><b>Email:</b> ${item.email}</div>
                                        <div><b>Create at:</b> ${item.employed}</div>
                                        <div><b>Avatar URL:</b>
                                            <a style="text-decoration: underline; color: #67748E;"
                                                href="{{avatar_url}}" target="_blank">
                                                ${item.avatar_url}</a>
                                        </div>
                                        <div><b>Status:</b> Active</div>
                                        <div><b>Address:</b> ${item.address} </div>
                                        <div><b>Phone number:</b> ${item.phone}</div>
                                    </div>
                                    <div class="modal-footer">
                                        <button type="button" class="btn btn-secondary"
                                            data-bs-dismiss="modal">Close
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </td>
                </tr> `
            )
        })
    })
}

window.onload = function () {
    pagingUser(1, '0');
    pagingAdmin(1, '0');
}