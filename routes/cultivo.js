const { Router } = require('express');
const ctrlCultivo	= require('../controllers/cultivo.controllers');
const router = Router();

router.route('/cultivos')
		.get(ctrlCultivo.cultivos)

router.route('/cultivosAnulados')
		.get(ctrlCultivo.cultivosAnulados)

router.route('/buscarCultivo')
		.post(ctrlCultivo.buscarCultivo)

router.route('/cultivoBacteriasAntibioticos')
		.post(ctrlCultivo.cultivoBacteriasAntibioticos)

router.route('/configCultivos')
		.post(ctrlCultivo.configCultivos)

router.route('/configCultivoBacteriasAntibioticos')
		.post(ctrlCultivo.configCultivoBacteriasAntibioticos)




module.exports = router;