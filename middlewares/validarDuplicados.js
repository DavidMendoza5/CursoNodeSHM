const findDocente = require('../bd/Docente/find')

function validarDocente(request, response, next) {

    function validarDuplicados(err, duplicado) {
        try{
            if(err) throw new Error("Error al validar el docente")
            if (duplicado && duplicado.length >= 1) throw new Error("Docente duplicado")
            next()
        } catch(error) {
            response.status(500).send({ message: error.message });
        }
    }
    findDocente({ correo: request.body.correo }, validarDuplicados)
}

module.exports = validarDocente