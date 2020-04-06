'use strict'

var express = require('express');

var ControladorEtiqueta = require('../controladores/etiqueta');

var api = express.Router();
var md_auth = require('../servicios/jwt_decode');

api.post('/crearEtiqueta', ControladorEtiqueta.crearEtiqueta);
api.get('/obtenerEtiquetas/:referenciaId',ControladorEtiqueta.obtenerEtiquetas);
api.get('/busquedaEtiquetas/:etiqueta',ControladorEtiqueta.busquedaEtiquetas);
api.delete('/eliminarEtiqueta/:referenciaId', md_auth.auth_decode, ControladorEtiqueta.eliminarEtiqueta); 


// Exportamos la configuración
module.exports = api;