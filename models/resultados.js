const {Schema, model} = require('mongoose');
//const moment = require('moment-timezone');

const resultadoSchema = new Schema({
    resultados:             [],
    datosPaciente:          [],
    qr_documento:		    {type: String},
    qr_orden:		        {},
    fecha_orden:            {type: String},
    tipo:                   {type: Number}, //1 PARA EXAMEN 2 PARA CULTIVO
    modificado:             {type: Number},  //0 PARA PENDIENTE POR MODIFICAR EN CLOUD, 1 PARA MODIFICAO EN CLOUD
    subido:				    {type: Number}
});

clientes = model('resultados', resultadoSchema, 'resultados');

module.exports = clientes;