'use strict'
var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'ClaveCurso'; // Se tiene que poner la misma clave que en el encode (jwt.js)
var Docente = require('../modelos/docente');

exports.auth_decode = function(req, res, next) {
    if (!req.headers.authorization) {
        res.status(403).send({ message: 'La petición no tiene las cabeceras de autorización' });
    } else {
        var token = req.headers.authorization.replace(/['"]+/g, '')
        try {
            var payload = jwt.decode(token, secret); // Si tira error se cambia req.header.Authorization por token
        } catch (ex) {
            console.log(ex)
            res.status(401).send({ message: 'Token inválido', error: String(ex) });
        }
        req.docente = payload;
        next(); // Si no se pone se queda en el middleware y no ejecuta los demás
    }
}

exports.rol_valido = function(req, res, next) {

    if (req.headers.authorization) {
        var token = req.headers.authorization.replace(/['"]+/g, '')
        try {
            var payload = jwt.decode(token, secret); // Si tira error se cambia req.header.Authorization por token
        } catch (ex) {
            console.log(ex)
            res.status(401).send({ message: 'Token inválido', error: String(ex) });
        }

        req.docente = payload; //Nos ayuda con el ID del docente
        let docente = req.docente;

        Docente.findById({ _id: docente.sub }, (err, docenteRol) => {
            if (err) {
                res.status(404).send({ message: 'Docente no encontrado', err });
            }

            if (docenteRol.role === 'ADMIN_ROLE') {
                next();
            } else {
                res.json({
                    ok: false,
                    err: {
                        message: 'El docente no es administrador'
                    }
                });
            }
        })
    }
}