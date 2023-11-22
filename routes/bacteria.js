const { Router } = require('express');
const ctrlBacteria	= require('../controllers/bacteria.controllers');
const router = Router();

router.route('/bacterias')
		.get(ctrlBacteria.bacterias)

router.route('/bacteriasAnuladas')
		.get(ctrlBacteria.bacteriasAnuladas)

router.route('/buscarBacteria')
		.post(ctrlBacteria.buscarBacteria)

router.route('/configBacterias')
		.post(ctrlBacteria.configBacterias)

router.route('/configBacteriaAntibioticos')
		.post(ctrlBacteria.configBacteriaAntibioticos)

router.route('/bacteriaAntibioticos')
		.post(ctrlBacteria.bacteriaAntibioticos)

router.route('/relacionesBacteriasAntibioticos')
		.get(ctrlBacteria.relacionesBacteriasAntibioticos)



module.exports = router;