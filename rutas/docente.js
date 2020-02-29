'use strict'
var express = require('express');
var ControladorDocente = require('../controladores/docente');
var auth = require('../servicios/jwt_decode');

var api = express.Router(); // Sirve para no carga uno por uno los endpoints

//api.get('/home', ControladorDocente.home);
//api.post('/insert', ControladorDocente.insert);
api.post('/crearDocente', ControladorDocente.crearDocente);
api.get('/obtenerDocente/:id', ControladorDocente.obtenerDocente); // Los dos puntos con el id indica que esperamos datos de regreso, si se pone el signo de interrogación quiere decir que no puede no haya el dato
api.get('/obtenerDocentes/:page?/:itemPerPage?', ControladorDocente.obtenerDocentes);
api.post('/login', ControladorDocente.login);
api.put('/actualizarDocente/:id', auth.auth_decode, ControladorDocente.actualizarDocente); // Los middleware van entre el nombre de la función y la función que se va a usar, si se usan varios se separan por comas
api.delete('/eliminarDocente/:id', ControladorDocente.eliminarDocente);

module.exports = api;