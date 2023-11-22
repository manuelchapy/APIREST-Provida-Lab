const { Router } = require('express');
const ordenesCtrl = require('../controllers/ordenes.controllers');
const router = Router();

router.route('/ordenes')
		.post(ordenesCtrl.ordenes)

router.route('/ordenesTomaMuestra')
		.get(ordenesCtrl.ordenesTomaMuestra)

router.route('/ordenesSueros')
		.get(ordenesCtrl.ordenesSueros)

router.route('/ordenesLaboratorios')
		.get(ordenesCtrl.ordenesLaboratorios)

router.route('/ordenesVerificadas')
		.get(ordenesCtrl.ordenesVerificadas)

router.route('/buscarOrden')
		.post(ordenesCtrl.buscarOrden)

router.route('/verificarTomaMuestra')
		.post(ordenesCtrl.verificarTomaMuestra)

router.route('/verificarSueros')
		.post(ordenesCtrl.verificarSueros)

router.route('/verificarLaboratorios')
		.post(ordenesCtrl.verificarLaboratorios)

router.route('/enviarTipoBusquedaOrdenes')
		.get(ordenesCtrl.enviarTipoBusquedaOrdenes)

router.route('/impresionDeOrdenes')
		.post(ordenesCtrl.impresionDeOrdenes)

router.route('/buscarOrdenDepHematologia')
		.get(ordenesCtrl.buscarOrdenDepHematologia)

router.route('/buscarOrdenDepBioquimica')
		.get(ordenesCtrl.buscarOrdenDepBioquimica)

router.route('/buscarOrdenDepEspeciales')
		.get(ordenesCtrl.buscarOrdenDepEspeciales)

router.route('/buscarOrdenDepBacteriologia')
		.get(ordenesCtrl.buscarOrdenDepBacteriologia)

router.route('/buscarOrdenDepCoproUro')
		.get(ordenesCtrl.buscarOrdenDepCoproUro)

module.exports = router;