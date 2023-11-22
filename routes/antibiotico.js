const { Router } = require('express');
const ctrlAntibiotico	= require('../controllers/antibiotico.controllers');
const router = Router();

router.route('/antibioticos')
		.get(ctrlAntibiotico.antibioticos)

router.route('/antibioticosAnulados')
		.get(ctrlAntibiotico.antibioticosAnulados)

router.route('/buscarAntibiotico')
		.post(ctrlAntibiotico.buscarAntibiotico)

router.route('/configAntibioticos')
		.post(ctrlAntibiotico.configAntibioticos)



module.exports = router;