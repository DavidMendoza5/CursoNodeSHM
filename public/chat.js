var socket = io();
let message = document.getElementById('message');
let username = document.getElementById('username');
let btn = document.getElementById('send');
let output = document.getElementById('output');
let actions = document.getElementById('actions');


btn.addEventListener('click', function(){
    socket.emit('escuchaMensaje', {
        username:username.value, message:message.value
    })
    // console.log({username:username.value, message:message.value})
})

message.addEventListener('keypress', function(){
    socket.emit('escuchaTyping', username.value)
});


socket.on('enviaMensaje', function(data){
    console.log('chats' , data)
    actions.innerHTML = ''
    output.innerHTML += `<p>
    <strong>${ data.username }</strong>: ${ data.message }
    </p>`;
})

socket.on('enviaTyping', function(data){
    actions.innerHTML = `<p>
    <em>${ data } is typing a message ...</em>
    </p>`;
})