'use strict'
var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'ClaveCurso'

exports.auth = function(usuario) {
    var payload = {
        sub: usuario._id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        iat: moment().unix(), // Fecha de creación
        exp: moment().add(20,'days').unix() // Fecha de expiración
    }
    //.add(7, 'days') .add(30, 'seconds')

    return jwt.encode(payload, secret)
}