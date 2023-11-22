const { Router } = require('express');
const ctrlRecibo	= require('../controllers/recibo.controllers');
const router = Router();

router.route('/recibos')
		.get(ctrlRecibo.recibos)

router.route('/detallesRecibo')
		.post(ctrlRecibo.detallesRecibo)

router.route('/recibosRegistroConvenio')
		.get(ctrlRecibo.recibosRegistroConvenio)

router.route('/recibosFacturasCredito')
		.get(ctrlRecibo.recibosFacturasCredito)

router.route('/crearRecibo')
		.post(ctrlRecibo.crearRecibo)

router.route('/crearReciboRegistroConvenio')
		.post(ctrlRecibo.crearReciboRegistroConvenio)

router.route('/imprimirRecibo/:id_recibo')
		.get(ctrlRecibo.imprimirRecibo)

router.route('/imprimirReciboRegistroConvenio/:id_recibo')
		.get(ctrlRecibo.imprimirReciboRegistroConvenio)

module.exports = router;