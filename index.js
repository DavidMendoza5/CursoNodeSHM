'use strict'
var mongoose = require('mongoose');
var configuracion = require('./configuracion/config');
var app = require('./app');
var socketIO = require('socket.io');

mongoose.Promise = global.Promise; // Se declara como una promesa porque de ese tipo serán los datos devueltos

// Conectarnos a la base de datos
mongoose.connect(configuracion.connexion) 
.then(() => {
    console.log('conexión exitosa');
    const server = app.listen(configuracion.port, () => {
        console.log('Servidor corriendo')
    })
    const io = socketIO.listen(server);
    //const io = socketIO(server);
    io.on('connection',(socket) => {
        console.log('new connection', socket.id)
        // Reenviar a todos los usuarios
        socket.on('escuchaMensaje', (data) => {
            io.sockets.emit('enviaMensaje', data)
        })

        socket.on('escuchaTyping', (data) => {
            socket.broadcast.emit('enviaTyping', data)
        })

        io.sockets.emit('test event', 'here is some data')
    })
})
.catch(err => {console.log(err)})