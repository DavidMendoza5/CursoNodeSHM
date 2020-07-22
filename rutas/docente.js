'use strict'
const express = require('express');
const ControladorDocente = require('../controladores/docente');
const { auth_decode, rol_valido, rol_ADMIN } = require('../servicios/jwt_decode');
const validarDocente = require('../middlewares/validarDuplicados')

const api = express.Router(); // Sirve para no carga uno por uno los endpoints

//api.get('/home', ControladorDocente.home);
//api.post('/insert', ControladorDocente.insert);
api.post('/crearDocente', rol_ADMIN, auth_decode,  validarDocente, ControladorDocente.crearDocente);
api.get('/obtenerDocente/:id', ControladorDocente.obtenerDocente); // Los dos puntos con el id indica que esperamos datos de regreso, si se pone el signo de interrogación quiere decir que no puede no allar el dato
//api.get('/obtenerDocentes/:page?/:itemPerPage?', ControladorDocente.obtenerDocentes);
api.get('/obtenerDocentes', ControladorDocente.obtenerDocentes);
api.post('/login', ControladorDocente.login);
api.put('/actualizarDocente/:id', rol_valido, auth_decode, ControladorDocente.actualizarDocente); // Los middleware van entre el nombre de la función y la función que se va a usar, si se usan varios se separan por comas
api.delete('/eliminarDocente/:id', rol_ADMIN, auth_decode, ControladorDocente.eliminarDocente);

module.exports = api;