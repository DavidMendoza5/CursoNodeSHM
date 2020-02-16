'use strict'
var mongoose = require('mongoose');

var Schema = mongoose.Schema; // Se carga la base de datos

var DocentesSchema = new Schema({
    nombre: String,
    cargo: String,
    resumen: {type: String, maxlength: [200, 'Fuera de rango']}, // Forma de validar desde el schema
    total_estudiantes: Number,
    imagen_perfil: String,
    correo: {
        type: String,
        lowercase: true, //Siempre se pone en minúscula
        unique: true
    },
    password: String,
    redes_sociales: {
        facebook: {type: String, default: null},
        youtube: {type: String, default: null},
        twitter: {type: String, default: null},
        linkedin: {type: String, default: null}
    }
})

module.exports = mongoose.model('docentes', DocentesSchema); // Nombre del modelo y su schema
