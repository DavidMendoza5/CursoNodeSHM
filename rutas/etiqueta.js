'use strict'

var express = require('express');

var ControladorEtiqueta = require('../controladores/etiqueta');

var api = express.Router();
var md_auth = require('../servicios/jwt_decode');

api.post('/crearEtiqueta', md_auth.auth_decode, ControladorEtiqueta.crearEtiqueta); 
api.get('/obtenerEtiquetas/:referenciaId', md_auth.auth_decode, ControladorEtiqueta.obtenerEtiquetas);
api.get('/busquedaEtiquetas/:etiqueta', md_auth.auth_decode, ControladorEtiqueta.busquedaEtiquetas);
api.delete('/eliminarEtiqueta/:referenciaId/:etiqueta', md_auth.auth_decode, ControladorEtiqueta.eliminarEtiqueta); 


// Exportamos la configuración
module.exports = api;