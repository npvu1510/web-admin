function getInfo() {
    const url = "/api/profile/info";
    fetch(url, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(r => r.json()).then(data => {
        const $showInfo = $('#show-info');
        const $btnEdit = $('#edit-info-btn');
        if ($btnEdit.attr("value") === "true") {
            $btnEdit.val("false");
            const info = `
            <p class="text-sm">
                ${data.intro}
            </p>
            <hr class="horizontal gray-light mt-2">
            <ul class="list-group">
                <li class="list-group-item border-0 ps-0  text-sm"><strong class="text-dark">Full
                        Name:</strong>
                    &nbsp;
                    ${data.fullname}
                </li>
                <li class="list-group-item border-0 ps-0 text-sm"><strong class="text-dark">User
                        Name:</strong>
                    &nbsp;
                    ${data.username}
                </li>
                <li class="list-group-item border-0 ps-0  text-sm"><strong
                        class="text-dark">Mobile:</strong>
                    &nbsp;
                    ${data.phone}
                </li>
                <li class="list-group-item border-0 ps-0  text-sm"><strong class="text-dark">Email:</strong>
                    &nbsp;
                    ${data.email}
                </li>
                <li class="list-group-item border-0 ps-0 text-sm"><strong
                        class="text-dark">Location:</strong>
                    &nbsp;
                    ${data.address}
                </li>
                <li class="list-group-item border-0 ps-0 text-sm"><strong class="text-dark">Employed
                        :</strong>
                    &nbsp; ${data.employed}
                </li>
            </ul>`;
            $showInfo.html(info);
        } else {
            $btnEdit.val("true");

            const form = `
                <textarea class="form-control" name="intro" id="edit_intro"
                    rows="4">${data.intro}</textarea>

                <hr class="horizontal gray-light mt-2">
                <ul class="list-group">
                    <li class="list-group-item border-0 ps-0  text-sm"><strong class="text-dark">Full
                            Name:</strong>
                        &nbsp;
                        <input type="text" class="form-control" id="edit_fullname"
                            placeholder="${data.fullname}" name="edit_fullname"
                            value="${data.fullname}">

                    </li>
                    <li class="list-group-item border-0 ps-0 text-sm"><strong class="text-dark">User
                            Name:</strong>
                        &nbsp;
                        <input type="text" class="form-control" id="edit_username"
                            placeholder="${data.username}" name="edit_username"
                            value="${data.username}">
                    </li>
                    <li class="list-group-item border-0 ps-0  text-sm"><strong
                            class="text-dark">Mobile:</strong>
                        &nbsp;
                        <input type="tel" class="form-control" id="edit_phone" placeholder="${data.phone}"
                            value="${data.phone}" name="edit_phone">
                    </li>
                    <li class="list-group-item border-0 ps-0 text-sm"><strong
                            class="text-dark">Location:</strong>
                        &nbsp;
                        <input type="text" class="form-control" id="edit_addr" placeholder="${data.address}"
                            value="${data.address}" name="edit_addr">
                    </li>
                     <li class="list-group-item border-0 ps-0 text-sm"><strong class="text-dark">Email:</strong>
                        &nbsp; ${data.email}
                    </li>
                    <li class="list-group-item border-0 ps-0 text-sm"><strong class="text-dark">Employed
                            :</strong>
                        &nbsp; ${data.employed}
                    </li>
                    <li>
                        <div class="w-100 d-flex flex-row justify-content-end ">
                            <button onclick="getInfo()" class="btn btn-secondary me-2" form="form_edit_false">Cancle
                            </button>
                            <button type="submit" class="btn btn-primary"
                                onclick="editInfo()">Submit
                            </button>

                        </div>
                    </li>
                </ul>
                `;
            $showInfo.html(form);
        }
        $('#img-avatar').attr('src', data.avatar_url);
        $('#avt-fullname').html(data.fullname);
        $('#avt-role').html(data.role);
    });
}

function editInfo() {
    fetch("/api/profile/edit-info", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            intro: $('#edit_intro').val(),
            edit_fullname: $('#edit_fullname').val(),
            edit_username: $(`#edit_username`).val(),
            edit_phone: $(`#edit_phone`).val(),
            edit_addr: $(`#edit_addr`).val()
        })
    }).then(r => r.json()).then(data => {
    });

    getInfo();
    $('#edit-info-btn').val("true");


}

function changePassword() {
    if ($('#old-passwd').val() === ' ' || $('#new-passwd').val() === '' || $('#confirm-passwd').val() === '') {
        $('#cancle-pass').click();
        $('#check-profile-change-password').html(
            `<svg xmlns="http://www.w3.org/2000/svg" style="display: none;">
                    <symbol id="exclamation-triangle-fill" fill="currentColor" viewBox="0 0 16 16">
                        <path
                            d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                    </symbol>
                </svg>

            <div class="alert alert-danger d-flex align-items-center mt-3" role="alert"
                 style="background-image: linear-gradient(to right, #e09ea4, #e08d94);">
                <svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Danger:">
                    <use xlink:href="#exclamation-triangle-fill"/>
                </svg>
                <div>
                    Please enter all fields
                </div>
            </div>`
        )
        return;
    }
    fetch("/api/profile/change-password", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            new_passwd: $('#new-passwd').val(),
            old_passwd: $('#old-passwd').val()
        })
    }).then(r => r.json()).then(data => {
        $('#cancle-pass').click();
        if (data.status === "success") {
            $('#check-profile-change-password').html(
                `<svg xmlns="http://www.w3.org/2000/svg" style="display: none;">
                    <symbol id="check-circle-fill" fill="currentColor" viewBox="0 0 16 16">
                        <path
                            d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                    </symbol>
                </svg>

            <div class="alert alert-success d-flex align-items-center mt-3" role="alert">
                <svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Success:">
                    <use xlink:href="#check-circle-fill"/>
                </svg>
                <div>
                    Change password successfully
                </div>
            </div>`
            );
        } else if (data.status === "error") {
            $('#check-profile-change-password').html(
                `<svg xmlns="http://www.w3.org/2000/svg" style="display: none;">
                    <symbol id="exclamation-triangle-fill" fill="currentColor" viewBox="0 0 16 16">
                        <path
                            d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                    </symbol>
                </svg>

            <div class="alert alert-danger d-flex align-items-center mt-3" role="alert"
                 style="background-image: linear-gradient(to right, #e09ea4, #e08d94);">
                <svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Danger:">
                    <use xlink:href="#exclamation-triangle-fill"/>
                </svg>
                <div>
                    Wrong old password
                </div>
            </div>`
            );
        } else if (data.status === "invalid") {
            $('#check-profile-change-password').html(
                `<svg xmlns="http://www.w3.org/2000/svg" style="display: none;">
                    <symbol id="exclamation-triangle-fill" fill="currentColor" viewBox="0 0 16 16">
                        <path
                            d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                    </symbol>
                </svg>

            <div class="alert alert-danger d-flex align-items-center mt-3" role="alert"
                 style="background-image: linear-gradient(to right, #e09ea4, #e08d94);">
                <svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Warning:">
                    <use xlink:href="#exclamation-triangle-fill"/>
                </svg>
                <div>
                    password must be at least 5 characters and less than 20 characters
                </div>
            </div>`
            );
        }
    });
    getInfo();
}

window.onload = function () {
    getInfo();
}