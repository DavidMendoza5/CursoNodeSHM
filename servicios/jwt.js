'use strict'
var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'ClaveCurso'

exports.auth = function(docente) {
    var payload = {
        sub: docente._id,
        nombre: docente.nombre,
        correo: docente.correo,
        iat: moment().unix(), // Fecha de creación
        exp: moment().add(5,'minutes').unix() // Fecha de expiración
    }
    //.add(7, 'days') .add(30, 'seconds')

    return jwt.encode(payload, secret)
}