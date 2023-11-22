const { Router } = require('express');
const ctrlDivisa	= require('../controllers/divisa.controllers');
const router = Router();

router.route('/divisas')
		.get(ctrlDivisa.divisas)

router.route('/registroDivisas')
		.get(ctrlDivisa.registroDivisas)

router.route('/configDivisas')
		.post(ctrlDivisa.configDivisas)

router.route('/agregarDivisa')
		.post(ctrlDivisa.agregarDivisa)

router.route('/agregarTasaDivisa')
		.post(ctrlDivisa.agregarTasaDivisa)

router.route('/historialDivisas')
		.post(ctrlDivisa.historialDivisas)


module.exports = router;