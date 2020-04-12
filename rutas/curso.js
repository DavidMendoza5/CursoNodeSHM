'use strict'
var express = require('express');
var ControladorCurso = require('../controladores/curso');
var { auth_decode, rol_valido } = require('../servicios/jwt_decode');
var multipart = require('connect-multiparty');

var path_images = multipart({ uploadDir: './imagenes' });
var api = express.Router();

api.post('/crearCurso', rol_valido, auth_decode, ControladorCurso.crearCurso);
api.get('/obtenerCursoDisponible/:page?/:itemPerPage?', ControladorCurso.obtenerCursoDisponible);
api.get('/obtenerCurso/:id', ControladorCurso.obtenerCurso);
api.post('/s/:id', [auth_decode, path_images], ControladorCurso.subirImagen);
api.put('/actualizarCurso/:id', rol_valido, auth_decode, ControladorCurso.actualizarCurso);
api.delete('/eliminarCurso/:id', rol_valido, auth_decode, ControladorCurso.eliminarCurso);


module.exports = api;