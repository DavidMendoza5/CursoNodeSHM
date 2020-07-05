//EXECUTE CONNECTION SOCKET.IO
$(function() {
    const socket = io(); //SOCKET CLIENT

    //'DOM' ELEMENTS FROM THE INTERFACE (1)
    const $messageForm = $('#message-form');
    const $message = $('#message');
    const $chat = $('#chat');

    //'DOM' ELEMENTS FROM THE NICKFORM (2)
    const $nickForm = $('#nickForm');
    const $nickError = $('#nickError');
    const $nickname = $('#nickname');

    //LIST USERS
    const $usernames = $('#usernames');

    //EVENTS USERS (2)
    $nickForm.submit(e => {
        e.preventDefault();
        socket.emit('new user', $nickname.val(), data => {
            if (data) {
                $('#nickWrap').hide(); //HIDE FORM
                $('#contentWrap').show(); //SHOW FORM CHAT
            } else {
                $nickError.html(`
                <div class="alert alert-danger">
                    That username alredy exist.
                </div>`);
            }
            $nickname.val('');
        });
    });

    //EVENTS (1)
    $messageForm.submit(e => {
        e.preventDefault();
        socket.emit('send message', $message.val());
        $message.val('');
    });

    //SHOW MESSAGE IN THE CARD-BODY
    socket.on('new message', data => {
        $chat.append('<b>' + data.nick + '</b>: ' + data.msg + '<br/>');
    });

    //SHOW USERS IN THE CARD-USERS
    socket.on('usernames', data => {
        let html = '';
        for (let i = 0; i < data.length; i++) {
            html += `<p><i class="fas fa-user"></i> ${data[i]}</p>`
        }
        $usernames.html(html); //ADD ALL USERS CONNECTED
    });
});