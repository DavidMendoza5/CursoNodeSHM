'use strict'
var express = require('express');
var ControladorCurso = require('../controladores/curso');
var auth = require('../servicios/jwt_decode');

var api = express.Router();

api.post('/crearCurso',auth.auth_decode, ControladorCurso.crearCurso);

module.exports = api;