var express = require('express');
var ControladorComentario = require('../controladores/comentario');

var api = express.Router();

api.post('/comentario', ControladorComentario.comentarioEstudiante);

module.exports = api;