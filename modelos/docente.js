'use strict'
var mongoose = require('mongoose');

var Schema = mongoose.Schema; // Se carga la base de datos

var validarCorreo = function(correo) { // Se debe crear una carpeta aparte para las funciones
    var re = /^.+@huasteco.com+$/
    return re.test(correo);
}

let rolesValidos = {
    values: ['ADMIN_ROLE', 'DOCENT_ROLE'],
    message: '{VALUE} Rol no válido'
};

var DocentesSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    role: {
        type: String,
        default: 'DOCENT_ROLE',
        enum: rolesValidos
    },
    resumen: {
        type: String,
        maxlength: [200, 'Fuera de rango']
    }, // Forma de validar desde el schema
    total_estudiantes: Number,
    imagen_perfil: {
        type: String,
        required: false
    },
    correo: {
        type: String,
        lowercase: true, //Siempre se pone en minúscula
        unique: true,
        required: [true, 'El correo es necesario'],
        validate: [validarCorreo, 'Este correo no es valido']
    },
    password: {
        type: String,
        required: [true, 'El password es necesario']
    },
    redes_sociales: {
        facebook: { type: String, default: null },
        youtube: { type: String, default: null },
        twitter: { type: String, default: null },
        linkedin: { type: String, default: null }
    }
})

//Elimina la contraseña del objeto, para que no se imprima la contraseña en el JSON
DocentesSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
}

//DocentesSchema.plugin(uniqueValidator, { message: '{PATH} Debe ser único' });

module.exports = mongoose.model('docentes', DocentesSchema); // Nombre del modelo y su schema