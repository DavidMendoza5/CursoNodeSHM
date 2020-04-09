'use strict'
var express = require('express');
var ControladorEstudiante = require('../controladores/estudiante');
var { rol_valido } = require('../servicios/jwt_decode');

var api = express.Router();

api.post('/crearEstudiante', rol_valido, ControladorEstudiante.crearEstudiante);

module.exports = api;