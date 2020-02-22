'use strict'
var express = require('express');
var ControladorCurso = require('../controladores/curso');
var auth = require('../servicios/jwt_decode');
var multipart = require('connect-multiparty');

var path_images = multipart({uploadDir: './imagenes'});
var api = express.Router();

api.post('/crearCurso',auth.auth_decode, ControladorCurso.crearCurso);
api.get('/obtenerCursoDisponible/:page?/:itemPerPage?', ControladorCurso.obtenerCursoDisponible);
api.get('/obtenerCurso/:id', ControladorCurso.obtenerCurso);
api.post('/s/:id', [auth.auth_decode, path_images], ControladorCurso.subirImagen);
api.put('/actualizarCurso/:id', auth.auth_decode, ControladorCurso.actualizarCurso);

module.exports = api;