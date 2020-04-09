'use strict'
var ModelEstudiante = require('../modelos/estudiante');
var ModelCurso = require('../modelos/curso');
var bcrypt = require('bcrypt-nodejs');
var servicios = require('../servicios/datos');
var jwt = require('../servicios/jwt');

function crearEstudiante(req, res) {
    var params = req.body;
    var Estudiante = new ModelEstudiante(params);

    // Verificar duplicado
    ModelEstudiante.find({ $and: [{ correo: params.correo }, { curso: params.curso }] }, (err, verificarDuplicado) => {
        if (err) return res.status(500).send({ message: 'Error al crear estudiante', status: false, err: String(err) })

        if (verificarDuplicado && verificarDuplicado.length > 0) {
            res.status(200).send({ message: 'Ya está inscrito al curso', status: false })
        }
        bcrypt.hash(params.correo + params.curso, null, null, (err, hash) => {
            if (err) return res.status(500).send({ message: 'Error al crear estudiante', status: false, err: String(err) })
            Estudiante.token_calificacion = hash;
            Estudiante.status_calificacion = true;
            Estudiante.save(async(err, estudianteRegistrado) => {
                if (err) res.status(500).send({ message: 'Error al crear estudiante', status: false, err: String(err) })
                    // Actualizar status, agregar registrados
                console.log(params, String('hhhhhhhhhhhhhhh'))
                await servicios.actualizarRegistros(params.curso, estudianteRegistrado);
                res.status(200).send({ Estudiante: estudianteRegistrado, status: true })
            })
        });
        bcrypt.hash(params.password, null, null, (err, hash) => {
            if (err) res.status(500).send({ mensaje: 'Error al encriptar la contraseña', status: false });
            Estudiante.password = hash;
        })
    })
}

function loginEs(req, res) {
    var params = req.body;
    var p_password = params.password;
    var p_correo = params.correo;

    // Buscar al alumno
    ModelEstudiante.findOne({ correo: p_correo }, (err, estudiante) => {
        if (err) res.status(500).send({ message: 'Error', status: false });
        if (estudiante) {
            bcrypt.compare(p_password, estudiante.password, (err, verificado) => {
                // Crear token de validación
                if (err) res.status(500).send({ message: 'Las credenciales no coinciden', status: false });
                if (verificado) {
                    estudiante.password = undefined;
                    var token = jwt.auth(estudiante);
                    return res.status(200).send({ estudiante, token })
                } else {
                    res.status(404).send({ message: 'Las credenciales no coinciden', status: false });
                }


            })
        } else {
            res.status(404).send({ message: 'Credenciales inválidas', status: false });
        }
    })
}

module.exports = {
    crearEstudiante,
    loginEs
}