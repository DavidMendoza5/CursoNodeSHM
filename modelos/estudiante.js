'use strict'
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var validarCorreo = function(correo) { // Se debe crear una carpeta aparte para las funciones
    var re = /^.+@.+$/
    return re.test(correo);
}

var EstudianteSchema = new Schema ({
    nombre: {
        type: String, 
        minlength: 10, 
        required: true,
        match: [/^[a-zA-Z ]+$/]  // Se puede usar regex101.com para verificar que la expresión regular funciona bien
    },
    cargo: {type: String},
    correo: {
        type: String,
        lowercase: true,
        validate: [validarCorreo, 'Este correo no es valido'] // Es otra forma de validar pero con un correo
    },
    telefono: {
        type: String, 
        match: [/\d{3}-\d{3}-\d{4}/] // Se valida que el telefono lo pongan en formato de 000-000-0000
    },
    conocimientos_previos: {type: String},
    curso: {type: Schema.ObjectId, ref: 'cursos'},
    token_calificacion: {type: String},
    status_calificacion: {type: Boolean}
})

module.exports = mongoose.model('estudiantes', EstudianteSchema);

