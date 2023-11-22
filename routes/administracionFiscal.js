const { Router } = require('express');
const ctrlAdministracionFiscal	= require('../controllers/administracionFiscal.controllers');
const router = Router();

router.route('/cierreDeCajaFiscal')
		.post(ctrlAdministracionFiscal.cierreDeCajaFiscal)

router.route('/cierreDeCajaNoFiscal')
		.post(ctrlAdministracionFiscal.cierreDeCajaNoFiscal)

router.route('/cierreDeCajaConsolidado')
		.post(ctrlAdministracionFiscal.cierreDeCajaConsolidado)

router.route('/masterDeVentasFiscal')
		.post(ctrlAdministracionFiscal.masterDeVentasFiscal)

router.route('/masterDeVentasNoFiscal')
		.post(ctrlAdministracionFiscal.masterDeVentasNoFiscal)

router.route('/masterDeVentasConsolidado')
		.post(ctrlAdministracionFiscal.masterDeVentasConsolidado)

router.route('/relacionPacientePruebas')
		.post(ctrlAdministracionFiscal.relacionPacientePruebas)

router.route('/relacionPacientePruebasCliente')
		.post(ctrlAdministracionFiscal.relacionPacientePruebasCliente)

router.route('/reporteDeVentasConsolidado')
		.post(ctrlAdministracionFiscal.reporteDeVentasConsolidado)

router.route('/relacionIGTF')
		.post(ctrlAdministracionFiscal.relacionIGTF)

router.route('/reporteNotasCredito')
		.post(ctrlAdministracionFiscal.reporteNotasCredito)

router.route('/estadisticasExamenesCultivos')
		.post(ctrlAdministracionFiscal.estadisticasExamenesCultivos)

router.route('/cuentasPorCobrar')
		.post(ctrlAdministracionFiscal.cuentasPorCobrar)

router.route('/buscarDeudaFacturaClientes')
		.get(ctrlAdministracionFiscal.buscarDeudaFacturaClientes)

router.route('/cuentasPorCobrarGeneral')
		.get(ctrlAdministracionFiscal.cuentasPorCobrarGeneral)

router.route('/XD')
		.get(ctrlAdministracionFiscal.XD)

module.exports = router;