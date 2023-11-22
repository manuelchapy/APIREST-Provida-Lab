const { Router } = require('express');
const ctrlPrueba	= require('../controllers/prueba.controllers');
const router = Router();

router.route('/pruebas')
		.get(ctrlPrueba.pruebas)

router.route('/pruebasAnuladas')
		.get(ctrlPrueba.pruebasAnuladas)

router.route('/buscarPrueba')
		.post(ctrlPrueba.buscarPrueba)

router.route('/configPruebas')
		.post(ctrlPrueba.configPruebas)



module.exports = router;