const { Router } = require('express');
const ctrlBancos	= require('../controllers/bancos.controllers');
const router = Router();

router.route('/bancos')
		.get(ctrlBancos.bancos)

router.route('/agregarBanco')
		.post(ctrlBancos.agregarBanco)

router.route('/modificarBanco')
		.post(ctrlBancos.modificarBanco)


module.exports = router;