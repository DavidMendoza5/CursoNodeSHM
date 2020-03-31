var ModeloComentario = require('../modelos/comentario');
var Estudiante = require('../modelos/estudiante');
var config = require('../configuracion/config');

function comentarioEstudiante(req, res) {
    var params = req.body;

    const { id, nombre } = req.body;

    //var comentarios = new ModeloComentario(params)

    let comentario = new ModeloComentario({
        descripcion: params.descripcion,
        tipo: params.tipo,
        estudiante: params.estudiante
    });

    comentario.save((err, comentarioDB) => {
        if (err) {
            return res.status(500).json({
                status: false,
                err: {
                    message: 'Error al crear comentario'
                }
            });
        }

        if (comentarioDB) {
            if (comentario.estudiante == id) {
                console.log(id);
                console.log(comentario.estudiante);
                console.log('El estudiante si existe');
            } else {
                console.log('El estudiante no existe');
                console.log(id);
                console.log(comentario.estudiante);
            }
        }
        res.json({
            ok: true,
            comentario: comentarioDB,
            message: 'Comentario añadido'
        });
        //console.log(params.comentario);

    });
}

module.exports = {
    comentarioEstudiante
}