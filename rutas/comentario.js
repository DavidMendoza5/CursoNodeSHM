var express = require('express');
var controladorComentario = require('../controladores/comentario')
var auth = require('../servicios/jwt_decode');

var api = express.Router();

api.post('/comentarioEstudiante', controladorComentario.comentarioEstudiante);

module.exports = api;