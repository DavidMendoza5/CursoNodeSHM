'use strict'
var mongoose = require('mongoose');
var configuracion = require('./configuracion/config');
var app = require('./app');

mongoose.Promise = global.Promise; // Se declara como una promesa porque de ese tipo serán los datos devueltos

// Conectarnos a la base de datos
mongoose.connect(configuracion.connexion) 
.then(() => {
    console.log('conexión exitosa');
    app.listen(configuracion.port, () => {
        console.log('Servidor corriendo')
    })
})
.catch(err => {console.log(err)})