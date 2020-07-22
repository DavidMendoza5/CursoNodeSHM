'use strict'
const ModelDocente = require('../modelos/docente');
const bcrypt = require('bcrypt-nodejs');
const mongoosePaginate = require('mongoose-pagination');
const servicios = require('../servicios/jwt');
const ModelCursos = require('../modelos/curso');
const ModelEstudiantes = require('../modelos/estudiante');
const ModelComentarios = require('../modelos/comentario');
const encriptar = require('../utils/encriptar')
const crearDocenteEnDB = require('../bd/Docente/crear')


// Cuando enviamos por POST es body y cuando es un GET es por params.

function crearDocente(req, res) {
    try {
        const params = req.body
        let status = 0, message = {}
        params.password = encriptar(params.password, 10)
        if(!encriptar.length > 20) throw new Error("Error al encriptar la contraseña")
        function validarRegistro(err, docenteRegistrado) {
            status = err ? 500:200
            message = err ? { message: "Error al registrar al docente" }:{ docente: docenteRegistrado}
            res.status(status).send(message);
        }
        crearDocenteEnDB(params, validarRegistro)
    } catch(err) {
        res.status(500).send({ message: error.message });
    }
}

function obtenerDocente(req, res) {
    var params = req.params;
    console.log(params);
    ModelDocente.find({ _id: params.id }, { password: 0 }, (err, docente) => { // El primer id significa WHERE id == id (el de params), el segundo parámetro en las llaves es para mostrar (1) o no mostrar el dato(0)
        if (err) res.status(500).send({ message: 'Error', status: false });
        res.status(200).send(docente);
    })
}

function obtenerDocentes(req, res) {
    ModelDocente.find({}, { password: 0 }, (err, docentes) => {
        if (err) res.status(500).send({ message: 'Error', status: false });
        res.status(200).send(docentes);
    })
    /*
    var params = req.params;
    var page = 1;
    if (params.page) {
        page = parseInt(params.page);
    }

    var itemPerPage = 2;
    if (params.itemPerPage) {
        itemPerPage = parseInt(params.itemPerPage);
    }

    ModelDocente.find({}, { password: 0 }).paginate(page, itemPerPage, (err, docentes, total) => {
        console.log(docentes);
        if (err) res.status(500).send({ message: 'Error', status: false });
        res.status(200).send({
            docentes,
            total,
            page,
            itemPerPage,
            pages: Math.ceil(total / itemPerPage)
        })
    })
    */
}

function login(req, res) {
    var params = req.body;
    var p_password = params.password;
    var p_correo = params.correo;

    // Buscar al docente
    if (!p_password) return res.status(500).send({ message: 'Se deben llenar ambos campos', status: false });
    ModelDocente.findOne({ correo: p_correo }, (err, docente) => {
        if (err) res.status(500).send({ message: 'Error', status: false });
        if (docente) {
            bcrypt.compare(p_password, docente.password, (err, verificado) => {
                // Crear token de validación
                if (err) res.status(500).send({ message: 'Las credenciales no coinciden', status: false });
                if (verificado) {
                    docente.password = undefined;
                    var token = servicios.auth(docente);
                    return res.status(200).send({ correo: docente.correo, nombre: docente.nombre, id: docente.id, rol: docente.role, token })
                } else {
                    res.status(404).send({ message: 'Las credenciales no coinciden', status: false });
                }


            })
        } else {
            res.status(404).send({ message: 'Credenciales inválidas', status: false });
        }
    })
}

function actualizarDocente(req, res) {
    var docenteId = req.params.id;
    var update = req.body;
    var id_docent_auth = req.docente.sub;

    ModelDocente.findById({ _id: id_docent_auth }, (err, docenteRol) => {
        if (err) {
            res.status(404).send({ message: 'Docente no encontrado', err });
        }
        if (docenteRol.role === 'ADMIN_ROLE') {
            ModelDocente.findOneAndUpdate({ _id: docenteId }, update, { new: true }, (err, docenteActualizado) => { // El new:true sobreescribe sólo el dato que se envió
                if (err) res.status(500).send({ message: 'Error', status: false });

                res.status(200).send({ docenteActualizado, status: true });
            });
        } else if (docenteRol.role === 'DOCENT_ROLE') {
            if (docenteId != req.docente.sub) {
                return res.status(500).send({ message: 'No tienes permisos', status: false });
            } else {
                ModelDocente.findOneAndUpdate({ _id: docenteId }, update, { new: true }, (err, docenteActualizado) => { // El new:true sobreescribe sólo el dato que se envió
                    if (err) res.status(500).send({ message: 'Error', status: false });

                    res.status(200).send({ docenteActualizado, status: true });
                })
            }
        } else {
            res.status(500).send({ message: 'Permiso denegado' })
        }
    })
}

//REVISAR ESTA FUNCIÓN POR QUE NO ESTÁ ELIMINANDO.
async function eliminarDocente(req, res) { // Necesitamos eliminar todo lo que tenga el docente debido a que mongo no hace la eliminación cascada y deja residuos
    var params = req.params.id;

    if (!params) {
        return res.status(400).send({ message: 'Error del cliente' });
    } else if (ModelDocente.findOne({ _id: params })) {
        await ModelDocente.deleteOne({ _id: params });
        await ModelComentarios.deleteOne({ receptor_docente: params });
        await ModelCursos.deleteMany({ docente: params }); // Una opción sería intentar pasarle otro objeto que contenga $in:registrados

        res.status(200).send({ message: 'Docente eliminado' })
    } else {
        return res.status(404).send({ message: 'Docente no encontrado' });
    }
}
module.exports = {
    crearDocente,
    obtenerDocente,
    obtenerDocentes,
    actualizarDocente,
    eliminarDocente,
    login
}