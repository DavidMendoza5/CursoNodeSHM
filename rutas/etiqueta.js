'use strict'

var express = require('express');

var ControladorEtiqueta = require('../controladores/etiqueta');

var api = express.Router();
var {auth_decode, rol_valido} = require('../servicios/jwt_decode');

api.post('/crearEtiqueta', rol_valido, auth_decode, ControladorEtiqueta.crearEtiqueta); 
api.get('/obtenerEtiquetas/:referenciaId', auth_decode, ControladorEtiqueta.obtenerEtiquetas);
api.get('/busquedaEtiquetas/:etiqueta', auth_decode, ControladorEtiqueta.busquedaEtiquetas);
api.delete('/eliminarEtiqueta/:referenciaId/:etiqueta', rol_valido, auth_decode, ControladorEtiqueta.eliminarEtiqueta); 


// Exportamos la configuración
module.exports = api;