const { Router } = require('express');
const ctrlconvenios	= require('../controllers/convenios.controllers');
const router = Router();

router.route('/buscarRegistroConvenio')
		.post(ctrlconvenios.buscarRegistroConvenio)

router.route('/registrosConveniosCliente')
		.post(ctrlconvenios.registrosConveniosCliente)

router.route('/convenios')
		.get(ctrlconvenios.convenios)

router.route('/buscarConvenio')
		.post(ctrlconvenios.buscarConvenio)

router.route('/facturarRegistroConvenio')
		.post(ctrlconvenios.facturarRegistroConvenio)

router.route('/imprimirFacturaRegistroConvenio')
		.post(ctrlconvenios.imprimirFacturaRegistroConvenio)

router.route('/reporteGeneralConvenios')
		.post(ctrlconvenios.reporteGeneralConvenios)

module.exports = router;