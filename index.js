'use strict'
const http = require('http');
const app = require('./app');
var mongoose = require('mongoose');
var configuracion = require('./configuracion/config');

var socketIO = require('socket.io');

//CHANGE PROPERTIES OF APP TO HTTP
const server = http.createServer(app);
//CONNECTION CREATED FOR CHAT
const io = socketIO.listen(server);

mongoose.Promise = global.Promise; // Se declara como una promesa porque de ese tipo serán los datos devueltos

// Conectarnos a la base de datos
mongoose.connect(configuracion.connexion, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Conexión exitosa de Mongo');
        //PORT
        server.listen(configuracion.port, () => {
            console.log('Servidor corriendo', configuracion.port)
        });
    })
    .catch(err => { console.log(err) })

//CONNECTION WITH THE FILE SOCKETS.JS
require('./sockets')(io);