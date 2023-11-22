const {Schema, model} = require('mongoose');
//const moment = require('moment-timezone');

const clienteSchema = new Schema({
	clienteNombre:   	{type: String},
	clienteApellido:   	{type: String},
	cedula_RIF: 		{type: String, unique: true},
	contacto: 			{type: String},
	correo: 			{type: String},
	telefono: 			{type: String},
	tipoCliente: 		{type: String},
	subido:				{type: Number}
});

clientes = model('clientes', clienteSchema, 'clientes');

module.exports = clientes;