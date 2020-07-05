//SOCKET SERVER
module.exports = function(io) {
    let users = []; //ARRAY OF CONNECTED USERS

    io.on('connection', socket => {
        console.log('new client connected');

        socket.on('new user', (data, cb) => {
            if (users.indexOf(data) != -1) {
                cb(false); //DOES NOT DISPLAY THE CHAT FORM || USER EXIST
            } else {
                cb(true);
                socket.nickname = data; //SAVE NAME-USER IN SOCKET
                users.push(socket.nickname); //SAVE IN users ARRAY
                updateUsernames();
            }
        });

        socket.on('send message', data => {
            io.sockets.emit('new message', {
                msg: data,
                nick: socket.nickname
            });
        });

        //USER DISCONNECTED
        socket.on('disconnect', data => {
            if (!socket.nickname) return;
            users.splice(users.indexOf(socket.nickname), 1);
            updateUsernames();
        });

        function updateUsernames() {
            io.sockets.emit('usernames', users);
        }
    });
}