const { Router } = require('express');
const ctrlCliente	= require('../controllers/cliente.controllers');
const router = Router();

router.route('/clientes')
		.get(ctrlCliente.clientes)

router.route('/clientesAnulados')
		.get(ctrlCliente.clientesAnulados)

router.route('/clientesConvenios')
		.get(ctrlCliente.clientesConvenios)

router.route('/tipoCliente')
		.get(ctrlCliente.tipoCliente)

router.route('/configCliente')
		.post(ctrlCliente.configCliente)

router.route('/crearYEnviarCliente')
		.post(ctrlCliente.crearYEnviarCliente)

router.route('/buscarCliente')
		.post(ctrlCliente.buscarCliente)

router.route('/buscarClientePorCedula')
		.post(ctrlCliente.buscarClientePorCedula)

router.route('/buscarClientePorCedula')
		.post(ctrlCliente.buscarClientePorCedula)

router.route('/deudasConvenios')
		.get(ctrlCliente.deudasConvenios)



module.exports = router;