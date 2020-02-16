'use strict'
var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'ClaveCurso'; // Se tiene que poner la misma clave que en el encode (jwt.js)

exports.auth_decode = function(req, res, next) {
    if(!req.headers.authorization){
        res.status(403).send({message: 'La petición no tiene las cabeceras de autorización'});
    } else {
        var token = req.headers.authorization.replace(/['"]+/g, '')
        try {
            var payload = jwt.decode(req.headers.authorization, secret); // Si tira error se cambia req.header.Authorization por token

            if(payload.exp <= moment().unix()) {
                res.status(401).send({message: 'El token ha expirado'});
            }
        } catch(ex) {
            res.status(401).send({message: 'Token inválido'});
        }
        req.docente = payload;
        next(); // Si no se pone se queda en el middleware y no ejecuta los demás
    }
}