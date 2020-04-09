'use strict'
var express = require('express');
var ControladorEstudiante = require('../controladores/estudiante');
var auth = require('../servicios/jwt_decode');

var api = express.Router();

api.post('/crearEstudiante', ControladorEstudiante.crearEstudiante);
api.post('/loginEs', ControladorEstudiante.loginEs);

module.exports = api;