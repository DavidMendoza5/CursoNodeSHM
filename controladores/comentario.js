var ModeloComentario = require('../modelos/comentario');
var config = require('../configuracion/config');

function comentarioEstudiante(req, res) {
    var params = req.body;

    let comentario = new ModeloComentario({
        descripcion: params.descripcion,
        tipo: params.tipo,
        estudiante: params.estudiante
    });

    comentario.save((err, comentarioDB) => {
        if (err) {
            return res.status(500).send({ message: 'Error al crear el comentario', err })
        }

        res.json({
            ok: true,
            comentario: comentarioDB,
            message: 'Comentario añadido'
        });
    });
}

module.exports = {
    comentarioEstudiante
}