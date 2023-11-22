const { Router } = require('express');
const ctrlFacturacion	= require('../controllers/facturacion.controllers');
const router = Router();

router.route('/crearFacturaOrdenTrabajo')
		.post(ctrlFacturacion.crearFacturaOrdenTrabajo)

router.route('/facturas')
		.get(ctrlFacturacion.facturas)

router.route('/ordenesDeTrabajo')
		.get(ctrlFacturacion.ordenesDeTrabajo)

router.route('/facturasAnuladas')
		.get(ctrlFacturacion.facturasAnuladas)

router.route('/pruebaQr')
		.get(ctrlFacturacion.pruebaQr)


router.route('/facturasCredito')
		.get(ctrlFacturacion.facturasCredito)

router.route('/buscarFactura')
		.post(ctrlFacturacion.buscarFactura)

router.route('/buscarFacturaFullDetalle')
		.post(ctrlFacturacion.buscarFacturaFullDetalle)

router.route('/buscarFacturaPorNumero')
		.post(ctrlFacturacion.buscarFacturaPorNumero)

router.route('/cancelarFactura')
		.post(ctrlFacturacion.cancelarFactura)

router.route('/modificarPago')
		.post(ctrlFacturacion.modificarPago)

router.route('/crearFacturaOrdenTrabajoConvenios')
		.post(ctrlFacturacion.crearFacturaOrdenTrabajoConvenios)

router.route('/imprimirFactura/:id_factura/:id_tipo_factura')
		.get(ctrlFacturacion.imprimirFactura)

router.route('/ordenesImpresion/:id_factura')
		.get(ctrlFacturacion.ordenesImpresion)

router.route('/ordenesImpresionRegistroConvenio/:id_registro_convenio')
		.get(ctrlFacturacion.ordenesImpresionRegistroConvenio)


router.route('/imprimirNotaCredito/:id_factura/:id_nota_credito')
		.get(ctrlFacturacion.imprimirNotaCredito)

/*
router.route('/imprimirNotaCredito/:id_nota_credito')
		.get(ctrlFacturacion.imprimirNotaCredito)
*/
router.route('/imprimirFacturaConvenio/:id_factura/:id_tipo_factura')
		.get(ctrlFacturacion.imprimirFacturaConvenio)

router.route('/imprimirRegistroConvenio/:id_registro_convenio')
		.get(ctrlFacturacion.imprimirRegistroConvenio)

router.route('/crearNotaCredito')
		.post(ctrlFacturacion.crearNotaCredito)

router.route('/crearNotaDebito')
		.post(ctrlFacturacion.crearNotaDebito)

router.route('/anulacionFactura')
		.post(ctrlFacturacion.anulacionFactura)

router.route('/anulacionRegistroConvenio')
		.post(ctrlFacturacion.anulacionRegistroConvenio)

router.route('/crearFacturaPorOrdenTrabajo')
		.post(ctrlFacturacion.crearFacturaPorOrdenTrabajo)

router.route('/facturarReciboRegistroConvenio')
		.post(ctrlFacturacion.facturarReciboRegistroConvenio)

router.route('/modificacionClienteFacturasOrdenesTrabajo')
		.post(ctrlFacturacion.modificacionClienteFacturasOrdenesTrabajo)

router.route('/notasCredito')
		.get(ctrlFacturacion.notasCredito)
		

module.exports = router;