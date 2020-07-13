//EXECUTE CONNECTION SOCKET.IO
$(function() {
    const socket = io(); //SOCKET CLIENT

    //'DOM' ELEMENTS FROM THE INTERFACE (1)
    const $messageForm = $('#message-form');
    const $message = $('#message');
    const $chat = $('#chat');
    const $msgError = $('#msgError');
    const $scroll = $('#scroll');

    //'DOM' ELEMENTS FROM THE NICKFORM (2)
    const $nickForm = $('#nickForm');
    const $nickError = $('#nickError');
    const $nickname = $('#nickname'); //REPEATED USER
    const $userError = $('#userError'); //UNDEFINED USER

    //LIST USERS
    const $usernames = $('#usernames');

    //EVENTS USERS (2)
    $nickForm.submit(e => {
        e.preventDefault();
        if ($nickname.val() === '') {
            $userError.html(`
            <div class="alert alert-danger mt-2">
                <strong>Insert a user</strong>
            </div>`);
            alertTime();
        } else {
            socket.emit('new user', $nickname.val(), data => {
                if (data) {
                    $('#nickWrap').hide(); //HIDE FORM
                    $('#contentWrap').show(); //SHOW FORM CHAT
                } else {
                    $nickError.html(`
                    <div class="alert alert-danger">
                        That username alredy exist.
                    </div>`);
                    alertTime();
                }
                $nickname.val('');
            });
        }

    });

    //EVENTS (1) SEND MESSAGE VACÍO
    $messageForm.submit(e => {
        e.preventDefault();
        if ($message.val() === '') {
            $msgError.html(`
            <div class="alert alert-danger mt-2">
                <strong>Write a message</strong>
            </div>`);
            alertTime();
        } else {
            socket.emit('send message', $message.val());
            $message.val('');
        }
    });

    //SHOW MESSAGE IN THE CARD-BODY
    socket.on('new message', data => {
        var html = '';
        var fecha = new Date();
        var hora = fecha.getHours() + ':' + fecha.getMinutes();

        html += `<div class="row mt-3">`;
        html += `<div class="col-md-1">
                    <img src="assets/users/5.jpg" class="rounded-circle" style="width: 75px; height: 75px;" />
                </div>`;
        html += `<div class="col-md-10">`;
        html += `<div class="chat-content">
                    <h5 class="mx-3">${data.nick}</h5>
                    <div class="text-success mx-3"><strong>${data.msg}</strong></div>
                </div>`;
        html += `<div class="chat-time mx-3">${hora}</div>`;
        html += `</div>`;
        html += `</div>`;

        $chat.append(html);
        scrollBottom();
        //$chat.append('<b>' + data.nick + '</b>: ' + data.msg + '<br/>'); //SEND NEW MESSAGE TO CONTENT-CHAT
    });

    //SHOW USERS IN THE CARD-USERS
    socket.on('usernames', data => {
        let html = '';
        for (let i = 0; i < data.length; i++) {
            html += `<div class="row mt-2">`;
            html += `<div class="col-md-1">
                        <img src="assets/users/5.jpg" class="rounded-circle" style="width: 35px; height: 35px;" />
                    </div>`;
            html += `<div class="col-md-10">
                        <p class="mx-2">${data[i]}</p>
                        <p class="text-info mx-2 mt-n3">online</p>
                    </div>`
            html += `</div>`;
        }
        $usernames.html(html); //ADD ALL USERS CONNECTED
    });

    //TIME || REMOVE ALERT AFTER 2 SECONDS
    function alertTime() {
        setTimeout(function() {
            document.querySelector('.alert').remove();
        }, 2000);
    }

    //PLACES THE OFFSET IN THE LAST POSITION
    function scrollBottom() {
        var scrolled = document.querySelector('.scroll');
        var scrollHeight = scrolled.scrollHeight;
        scrolled.scrollTop = scrollHeight;
    }
});