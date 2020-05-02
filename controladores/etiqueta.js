'use strict'

var Etiqueta = require('../modelos/etiqueta');


function crearEtiqueta(req,res){

    var params = req.body;
    var etiqueta = new Etiqueta();
    etiqueta.etiqueta = params.etiqueta;
    etiqueta.referenciaId = params.referenciaId;
    
    Etiqueta.find({etiqueta: params.etiqueta},(err, duplicado)=>{
        if(err) return res.status(500).send({message: 'Error en la petición'});

        if(duplicado && duplicado.length >= 1){
            Etiqueta.findOneAndUpdate({etiqueta:  params.etiqueta}, { $push: { referenciaId:  params.referenciaId }},(err, etiqueta) => {
                if(err) return res.status(500).send({message: 'Error en la petición'});
    
                if(!etiqueta) return res.status(404).send({message: 'No hay etiqueta'});
                
                return res.status(200).send({mensaje: 'Etiqueta Actualizada', status: true});
    
            });	

        }else{

            etiqueta.save((err, etiquetaRegistrado)=>{
                if (err) return res.status(500).send({mensaje:'crearEtiqueta()> verificar duplicados > insertar' , status: false})
                //si el callback de la insercion retorna datos correctos lo devolvemos con status 200
                if(etiquetaRegistrado){
                    res.status(200).send({etiqueta: etiquetaRegistrado, status: true});
                } else {
                    res.status(404).send({mensaje:'No se pudo registrar la etiqueta' , status: false});
                }        
            });

        }
    })    
    
}


function obtenerEtiquetas(req,res) {
    
    var params = req.params;
    if(params.referenciaId) {
        Etiqueta.find({$and:[{referenciaId: params.referenciaId}]},(err, etiquetas) => {
            if(err) return res.status(500).send({message: 'Error en la petición'});

            if(etiquetas.length === 0) return res.status(404).send({message: 'No hay etiquetas disponibles'});
            console.log(etiquetas);
            
            return res.status(200).send({etiquetas: etiquetas, status: true});

        });	
    }

}

function busquedaEtiquetas(req,res) {
    
    var params = req.params;
    if(params.etiqueta){
        //Etiqueta.find({etiqueta : {$regex: new RegExp(params.etiqueta), $options: 'im'}},(err, etiquetas) => { //el regex es muy útil para realizar búsquedas
        Etiqueta.find({$and: [{etiqueta : params.etiqueta}]},(err, etiquetas) => {
            if(err) return res.status(500).send({message: 'Error en la petición'});

            if(etiquetas.length === 0) return res.status(404).send({message: 'No hay etiquetas disponibles'});
            
            return res.status(200).send({etiquetas: etiquetas, status: true});

        });	
    }
}

function eliminarEtiqueta(req,res) {
    //var etiqueta = req.params.etiqueta;
    var etiquetaId = req.params.referenciaId;
  
    //Etiqueta.findOneAndDelete({etiqueta: etiqueta}, { $pull: { referenciaId: etiquetaId }},(err, etiqueta) => {
    Etiqueta.deleteOne({referenciaId:etiquetaId},(err, etiqueta) => {
        console.log(etiquetaId);
        if(err) return res.status(500).send({message: 'Error en la petición'});
        console.log(etiqueta);
        if(!etiqueta) return res.status(404).send({message: 'No hay etiqueta'});

        
        return res.status(200).send({mensaje: 'Etiqueta Eliminada', status: true});

    });	
    

}

    module.exports = {
       crearEtiqueta,
       obtenerEtiquetas,
       busquedaEtiquetas,
       eliminarEtiqueta
      };