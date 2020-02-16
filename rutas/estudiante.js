'use strict'
var express = require('express');
var ControladorEstudiante = require('../controladores/estudiante');

var api = express.Router();

api.post('/crearEstudiante', ControladorEstudiante.crearEstudiante);

module.exports = api;