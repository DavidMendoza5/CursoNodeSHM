'use strict'
var ModelEstudiante = require('../modelos/estudiante');
var ModelDocente = require('../modelos/docente')
var ModelCurso = require('../modelos/curso');
var ModelComentarios = require('../modelos/comentario')
var bcrypt = require('bcrypt-nodejs');
var servicios = require('../servicios/datos');
var jwt = require('../servicios/jwt');

function crearEstudiante(req, res) {
    var params = req.body;
    var Estudiante = new ModelEstudiante(params);

    // Verificar duplicado
    try {
        // Verificar duplicado
        ModelEstudiante.find({ $and: [{ correo: params.correo }, { curso: params.curso }] }, (err, verificarDuplicado) => {
            if (err) return res.status(500).send({ message: 'Error al crear estudiante', status: false, err: String(err) })

            if (verificarDuplicado && verificarDuplicado.length > 0) {
                res.status(200).send({ message: 'Ya está inscrito al curso', status: false })
            }
            bcrypt.hash(params.correo + params.curso, null, null, (err, hash2) => {
                if (err) return res.status(500).send({ message: 'Error al crear estudiante', status: false, err: String(err) })
                    //Estudiante.password = hash;
                Estudiante.token_calificacion = hash2;
                Estudiante.status_calificacion = true;
                Estudiante.save(async(err, estudianteRegistrado) => {
                    if (err) res.status(500).send({ message: 'Error al crear estudiante', status: false, err: String(err) })
                        // Actualizar status, agregar registrados
                    console.log(params, String('Agregar registrados'))
                    await servicios.actualizarRegistros(params.curso, estudianteRegistrado);
                    res.status(200).send({ Estudiante: estudianteRegistrado, status: true })
                })
            });
            bcrypt.hash(params.password, null, null, (err, hash) => {
                if (err) res.status(500).send({ mensaje: 'Error al encriptar la contraseña', status: false });
                Estudiante.password = hash;
            })
        })
    } catch (err) {
        console.log(err);
    }
}

function loginEs(req, res) {
    var params = req.body;
    var p_password = params.password;
    var p_correo = params.correo; 
    // Buscar al alumno
    try{
        if(!p_password) return res.status(500).send({ message: 'Se deben llenar ambos campos', status: false });
        ModelEstudiante.findOne({ correo: p_correo }, (err, estudiante) => {
            if (err) return res.status(500).send({ message: 'Error', status: false });
            if (estudiante) {
                bcrypt.compare(p_password, estudiante.password, (err, verificado) => {
                    // Crear token de validación
                    if (err) return res.status(500).send({ message: 'Las credenciales no coinciden', status: false });
                    if (verificado) {
                        estudiante.password = undefined;
                        var token = jwt.auth(estudiante);
                        return res.status(200).send({ estudiante, token })
                    } else {
                        return res.status(404).send({ message: 'Las credenciales no coinciden', status: false });
                    }
                })
            } else {
                return res.status(404).send({ message: 'Credenciales inválidas', status: false });
            }
        })
    } catch (err){
        console.log(err)
    }
}

function actualizarEstudiante(req, res) {
    var estudianteId = req.params.id;
    var update = req.body;
    var estudianteAuth = req.docente.sub;
    
    ModelDocente.findById({ _id: estudianteAuth }, (err, docenteRol) => {
        if (err) {
            return res.status(404).send({ message: 'Error', err });
        } 
        if (docenteRol == null) {
            ModelEstudiante.findById({_id: estudianteAuth}, (err, userAuth) => {
                if (err) {
                    return res.status(404).send({ message: 'Estudiante no encontrado', err });
                } else if(estudianteId != estudianteAuth) {
                    return res.status(500).send({ message: 'No tienes permisos', status: false });
                } else {
                    ModelEstudiante.findOneAndUpdate({_id: estudianteId}, update, {new: true}, (err, estudianteActualizado) => {
                        if (err) return res.status(500).send({ message: 'Error', status: false });
        
                        res.status(200).send({ estudianteActualizado, status: true });
                    })
                }
            })
        } else if(docenteRol.role === 'ADMIN_ROLE'){
            ModelEstudiante.findOneAndUpdate({_id: estudianteId}, update, {new: true}, (err, estudianteActualizado) => {
                if (err) return res.status(500).send({ message: 'Error', status: false });

                res.status(200).send({ estudianteActualizado, status: true });
            })
        }
    })
}

async function eliminarEstudiante(req, res) {
    var params = req.params.id;
    
    if (!params) {
        return res.status(400).send({ message: 'Error del cliente' });
    } else if (ModelEstudiante.findOne({ _id: params })) {
        await ModelEstudiante.deleteOne({ _id: params });
        await ModelComentarios.deleteMany({ estudiante: params });

        res.status(200).send({ message: 'Estudiante eliminado' })
    } else {
        return res.status(404).send({ message: 'Estudiante no encontrado' });
    }
}

module.exports = {
    crearEstudiante,
    loginEs,
    actualizarEstudiante,
    eliminarEstudiante
}