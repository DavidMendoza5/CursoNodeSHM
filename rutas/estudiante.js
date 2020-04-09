'use strict'
var express = require('express');
var ControladorEstudiante = require('../controladores/estudiante');
//var { rol_valido, auth_decode } = require('../servicios/jwt_decode');

var api = express.Router();

api.post('/crearEstudiante', ControladorEstudiante.crearEstudiante);

//api.post('/crearEstudiante', rol_valido, auth_decode, ControladorEstudiante.crearEstudiante);

module.exports = api;