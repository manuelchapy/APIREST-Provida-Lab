const administracionFiscalCtrl = {};
const session = require('express-session');
const { updateLocale } = require('moment');
const connection = require('../src/database');
const uniqid = require('uniqid');
const qrcode = require('qrcode');
const { registroDivisas } = require('./divisa.controllers');
const { or } = require('ip');
const axios = require('axios').default;
const dbFunctionsAdminFiscal = require('../public/functions/db_functions_administracionFiscal')


administracionFiscalCtrl.cierreDeCajaFiscal = async(req, res) =>{
    //const sql = "SELECT * FROM `tbl_factura` WHERE fecha_creacion between '2021-01-20' and '2021-12-24'";
    //////////////////////////////////////////////////TODOS LOS USUARIOS/////////////////////////////////////////////
    //const sql = "SELECT id_factura, numero_factura, orden_trabajo, id_cliente, DATE_FORMAT(fecha_creacion, '%d-%m-%Y %T') FROM `tbl_factura` WHERE fecha_creacion between '2021-01-20' and '2021-12-24'";
    let sql, sqlRecibos;
    if(req.body.tipo == 1){
        sql = "SELECT tbl_factura.id_factura, tbl_factura.numero_factura, tbl_factura.total_bolivares, tbl_factura.total_dolares, tbl_factura.total_pesos, tbl_factura.id_usuario, tbl_factura.id_cliente, tbl_factura.id_tipo_factura, tbl_factura.id_estado_factura, DATE_FORMAT(tbl_factura.fecha_creacion_factura, '%d-%m-%Y %T') AS fecha_creacion_factura, DATE_FORMAT(tbl_factura.fecha_cancelacion, '%d-%m-%Y %T') AS fecha_cencelacion_factura, tbl_factura.id_estado_factura, tbl_factura.descuento_bolivares, tbl_factura.descuento_dolares, tbl_factura.descuento_pesos, tbl_factura.anulacion_motivo, tbl_tipo_factura.tipo_factura_nombre, tbl_cliente.cliente_nombre, tbl_cliente.cliente_apellido, tbl_cliente.id_tipo_cliente FROM `tbl_factura` LEFT JOIN tbl_tipo_factura ON tbl_tipo_factura.id_tipo_factura = tbl_factura.id_tipo_factura LEFT JOIN tbl_cliente ON tbl_cliente.id_cliente = tbl_factura.id_cliente WHERE (fecha_creacion_factura BETWEEN '"+req.body.from+"' AND '"+req.body.to+"') ORDER BY id_factura ASC"
        sqlRecibos = "SELECT tbl_recibo.id_recibo, tbl_recibo.id_factura, tbl_recibo.numero_recibo, tbl_recibo.fecha_creacion, tbl_recibo.fecha_cancelacion, tbl_recibo.monto_bolivares, tbl_recibo.monto_dolares, tbl_recibo.monto_pesos, tbl_recibo.descuento_bolivares, tbl_recibo.descuento_pesos, tbl_recibo.IGTF_bolivares, tbl_recibo.IGTF_dolares, tbl_recibo.IGTF_pesos, tbl_recibo.tasa_bolivar_dia, tbl_recibo.tasa_pesos_dia, tbl_recibo.id_usuario FROM tbl_recibo WHERE (fecha_creacion BETWEEN '"+req.body.from+"' AND '"+req.body.to+"' AND id_factura IS NOT NULL) ORDER BY id_recibo ASC"
    }else if(req.body.tipo == 2){
        sql = "SELECT tbl_factura.id_factura, tbl_factura.numero_factura, tbl_factura.total_bolivares, tbl_factura.total_dolares, tbl_factura.total_pesos, tbl_factura.id_usuario, tbl_factura.id_cliente, tbl_factura.id_tipo_factura, tbl_factura.id_estado_factura, DATE_FORMAT(tbl_factura.fecha_creacion_factura, '%d-%m-%Y %T') AS fecha_creacion_factura, DATE_FORMAT(tbl_factura.fecha_cancelacion, '%d-%m-%Y %T') AS fecha_cencelacion_factura, tbl_factura.id_estado_factura, tbl_factura.descuento_bolivares, tbl_factura.descuento_dolares, tbl_factura.descuento_pesos, tbl_factura.anulacion_motivo, tbl_tipo_factura.tipo_factura_nombre, tbl_cliente.cliente_nombre, tbl_cliente.cliente_apellido, tbl_cliente.id_tipo_cliente FROM `tbl_factura` LEFT JOIN tbl_tipo_factura ON tbl_tipo_factura.id_tipo_factura = tbl_factura.id_tipo_factura LEFT JOIN tbl_cliente ON tbl_cliente.id_cliente = tbl_factura.id_cliente WHERE (fecha_creacion_factura BETWEEN '"+req.body.from+"' AND '"+req.body.to+"') AND (id_usuario = '"+req.body.id_usuario+"') ORDER BY id_factura ASC"
        sqlRecibos = "SELECT tbl_recibo.id_recibo, tbl_recibo.id_factura, tbl_recibo.numero_recibo, tbl_recibo.fecha_creacion, tbl_recibo.fecha_cancelacion, tbl_recibo.monto_bolivares, tbl_recibo.monto_dolares, tbl_recibo.monto_pesos, tbl_recibo.descuento_bolivares, tbl_recibo.descuento_pesos, tbl_recibo.IGTF_bolivares, tbl_recibo.IGTF_dolares, tbl_recibo.IGTF_pesos, tbl_recibo.tasa_bolivar_dia, tbl_recibo.tasa_pesos_dia, tbl_recibo.id_usuario FROM tbl_recibo WHERE (fecha_creacion BETWEEN '"+req.body.from+"' AND '"+req.body.to+"' AND id_usuario = '"+req.body.id_usuario+"' AND id_factura IS NOT NULL ) ORDER BY id_recibo ASC"
    }else if(req.body.tipo == 3){
        sql = "SELECT tbl_factura.id_factura, tbl_factura.numero_factura, tbl_factura.total_bolivares, tbl_factura.total_dolares, tbl_factura.total_pesos, tbl_factura.id_usuario, tbl_factura.id_cliente, tbl_factura.id_tipo_factura, tbl_factura.id_estado_factura, DATE_FORMAT(tbl_factura.fecha_creacion_factura, '%d-%m-%Y %T') AS fecha_creacion_factura, DATE_FORMAT(tbl_factura.fecha_cancelacion, '%d-%m-%Y %T') AS fecha_cencelacion_factura, tbl_factura.id_estado_factura, tbl_factura.descuento_bolivares, tbl_factura.descuento_dolares, tbl_factura.descuento_pesos, tbl_factura.anulacion_motivo, tbl_tipo_factura.tipo_factura_nombre, tbl_cliente.cliente_nombre, tbl_cliente.cliente_apellido, tbl_cliente.id_tipo_cliente FROM `tbl_factura` LEFT JOIN tbl_tipo_factura ON tbl_tipo_factura.id_tipo_factura = tbl_factura.id_tipo_factura LEFT JOIN tbl_cliente ON tbl_cliente.id_cliente = tbl_factura.id_cliente WHERE (fecha_creacion_factura BETWEEN '"+req.body.from+"' AND '"+req.body.to+"') AND (id_usuario = '"+req.body.id_usuario+"' OR id_usuario = '"+req.body.id_usuario2+"') ORDER BY id_factura ASC"
        sqlRecibos = "SELECT tbl_recibo.id_recibo, tbl_recibo.id_factura, tbl_recibo.numero_recibo, tbl_recibo.fecha_creacion, tbl_recibo.fecha_cancelacion, tbl_recibo.monto_bolivares, tbl_recibo.monto_dolares, tbl_recibo.monto_pesos, tbl_recibo.descuento_bolivares, tbl_recibo.descuento_pesos, tbl_recibo.IGTF_bolivares, tbl_recibo.IGTF_dolares, tbl_recibo.IGTF_pesos, tbl_recibo.tasa_bolivar_dia, tbl_recibo.tasa_pesos_dia, tbl_recibo.id_usuario FROM tbl_recibo WHERE (fecha_creacion BETWEEN '"+req.body.from+"' AND '"+req.body.to+"' AND (id_usuario = '"+req.body.id_usuario+"' OR id_usuario = '"+req.body.id_usuario2+"') AND id_factura IS NOT NULL ) ORDER BY id_recibo ASC"
    }else if(req.body.tipo == 4){
        sql = "SELECT tbl_factura.id_factura, tbl_factura.numero_factura, tbl_factura.total_bolivares, tbl_factura.total_dolares, tbl_factura.total_pesos, tbl_factura.id_usuario, tbl_factura.id_cliente, tbl_factura.id_tipo_factura, tbl_factura.id_estado_factura, DATE_FORMAT(tbl_factura.fecha_creacion_factura, '%d-%m-%Y %T') AS fecha_creacion_factura, DATE_FORMAT(tbl_factura.fecha_cancelacion, '%d-%m-%Y %T') AS fecha_cencelacion_factura, tbl_factura.id_estado_factura, tbl_factura.descuento_bolivares, tbl_factura.descuento_dolares, tbl_factura.descuento_pesos, tbl_factura.anulacion_motivo, tbl_tipo_factura.tipo_factura_nombre, tbl_cliente.cliente_nombre, tbl_cliente.cliente_apellido, tbl_cliente.id_tipo_cliente FROM `tbl_factura` LEFT JOIN tbl_tipo_factura ON tbl_tipo_factura.id_tipo_factura = tbl_factura.id_tipo_factura LEFT JOIN tbl_cliente ON tbl_cliente.id_cliente = tbl_factura.id_cliente WHERE (fecha_creacion_factura BETWEEN '"+req.body.from+"' AND '"+req.body.to+"') AND (id_usuario = '"+req.body.id_usuario+"' OR id_usuario = '"+req.body.id_usuario2+"' OR id_usuario = '"+req.body.id_usuario3+"') ORDER BY id_factura ASC"
        sqlRecibos = "SELECT tbl_recibo.id_recibo, tbl_recibo.id_factura, tbl_recibo.numero_recibo, tbl_recibo.fecha_creacion, tbl_recibo.fecha_cancelacion, tbl_recibo.monto_bolivares, tbl_recibo.monto_dolares, tbl_recibo.monto_pesos, tbl_recibo.descuento_bolivares, tbl_recibo.descuento_pesos, tbl_recibo.IGTF_bolivares, tbl_recibo.IGTF_dolares, tbl_recibo.IGTF_pesos, tbl_recibo.tasa_bolivar_dia, tbl_recibo.tasa_pesos_dia, tbl_recibo.id_usuario FROM tbl_recibo WHERE (fecha_creacion BETWEEN '"+req.body.from+"' AND '"+req.body.to+"' AND (id_usuario = '"+req.body.id_usuario+"' OR id_usuario = '"+req.body.id_usuario2+"' OR id_usuario = '"+req.body.id_usuario3+"') AND id_factura IS NOT NULL ) ORDER BY id_recibo ASC"
    }

    sqlNotasCredito = "SELECT tbl_nota_credito.id_nota_credito, tbl_nota_credito.nota_credito_numero, tbl_nota_credito.id_factura, DATE_FORMAT(tbl_nota_credito.fecha_emision, '%d-%m-%Y %T') AS fecha_emision, tbl_nota_credito.monto_bolivares, tbl_nota_credito.monto_pesos, tbl_nota_credito.monto_dolares, tbl_nota_credito.concepto, tbl_factura.numero_factura, tbl_factura.id_factura, tbl_cliente.cliente_nombre, tbl_cliente.cliente_apellido, tbl_cliente.cedula_RIF FROM tbl_nota_credito LEFT JOIN tbl_factura ON tbl_factura.id_factura = tbl_nota_credito.id_factura LEFT JOIN tbl_cliente ON tbl_factura.id_cliente = tbl_cliente.id_cliente WHERE (fecha_emision BETWEEN '"+req.body.from+"' AND '"+req.body.to+"') ORDER BY tbl_nota_credito.id_nota_credito ASC"
    let facturas;
    let notasCredito;
    let registroPago = [];
    let i = 0;
    let balance = {};
    let efectivoD = 0, efectivoP = 0, efectivoB = 0, zelle = 0, paypal = 0, bancolombia = 0, contadoB = 0, contadoP = 0, contadoD = 0, contadoBOrdenTrabajo = 0, contadoPOrdenTrabajo = 0, contadoDOrdenTrabajo = 0, creditoB = 0, creditoP =0, creditoD = 0, creditoBConvenio = 0, creditoPConvenio = 0, creditoDConvenio = 0, cantidadFacturaCreditoConvenio = 0, cantidadFacturaCreditoParticular = 0, creditoBParticular = 0, creditoPParticular = 0, creditoDParticular = 0, anuladoB = 0, anuladoP = 0, anuladoD = 0, NC = 0, transferencia = 0;
    let provincial = 0, transPronvincial = 0, sofitasa = 0, transSofitasa = 0, mercantil = 0, transMercantil = 0, banesco = 0, transBanesco = 0, venezuela = 0, transVenezuela = 0, trans100Banco = 0;
    let debitoProvincial = 0, creditoProvincial = 0, creditoSofitasa = 0, debitoSofitasa = 0, creditoMercantil = 0, debitoMercantil = 0, creditoBanesco = 0, debitoBanesco = 0, debitoVenezuela = 0, creditoVenezuela = 0, debito100banco = 0, credito100Banco = 0;
    let ttProvincial = 0, ttSofitasa = 0, ttMercantil = 0, ttBanesco = 0;
    let descuentoP = 0, descuentoB = 0, descuentoD = 0, cantidadFacturasDescuentos = 0;
    let abonadoD = 0, abonadoP = 0, abonadoB = 0;
    let facturaPRI, facturaULT;
    let detallesAnuladas = [];
    let detallesDescontadas = [];

    //////////////////SUMATORIA DE IGTF TOTALES/////////////////////////////
    let igtfBTransferencia= 0, igtfPTransferencia= 0, igtfDTransferencia= 0, igtfBCredito = 0, igtfPCredito = 0, igtfDCredito = 0, igtfB = 0, igtfP = 0, igtfD = 0;
    let igtfBEfectivo= 0, igtfPEfectivo= 0, igtfDEfectivo= 0, igtfBDebito= 0, igtfPDebito= 0, igtfDDebito= 0
    ///////////////////////////////////////////////////////////////////////
    /////////////////SUMATORIA DE IGTF POR FACTURAS A CREDITO////////////////////////////////
    let igtfBTransferenciaFacturaCredito= 0, igtfPTransferenciaFacturaCredito= 0, igtfDTransferenciaFacturaCredito= 0, igtfBCreditoFacturaCredito = 0, igtfPCreditoFacturaCredito = 0, igtfDCreditoFacturaCredito = 0, igtfBFacturaCredito = 0, igtfPFacturaCredito = 0, igtfDFacturaCredito = 0;
    let igtfBEfectivoFacturaCredito= 0, igtfPEfectivoFacturaCredito= 0, igtfDEfectivoFacturaCredito= 0, igtfBDebitoFacturaCredito= 0, igtfPDebitoFacturaCredito= 0, igtfDDebitoFacturaCredito= 0
    /////////////////////////////////////////////////////////////////////////////////////////
    /////////////////SUMATORIA DE IGTF POR FACTURAS A CONTADO////////////////////////////////
    let igtfBTransferenciaFacturaContado= 0, igtfPTransferenciaFacturaContado= 0, igtfDTransferenciaFacturaContado= 0, igtfBCreditoFacturaContado = 0, igtfPCreditoFacturaContado = 0, igtfDCreditoFacturaContado = 0, igtfBFacturaContado = 0, igtfPFacturaContado = 0, igtfDFacturaContado = 0;
    let igtfBEfectivoFacturaContado= 0, igtfPEfectivoFacturaContado= 0, igtfDEfectivoFacturaContado= 0, igtfBDebitoFacturaContado= 0, igtfPDebitoFacturaContado= 0, igtfDDebitoFacturaContado= 0
    /////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////SUMATORIA DE IGTF POR PAYPAL Y ZELLE////////////////////////////
    let igtfPaypal = 0, igtfZelle = 0;
    /////////////////////////////////////////////////////////////////////////////////////////
    let vueltosB= 0, vueltosP= 0, vueltosD= 0;

    //////////////////////////SUMATORIA DE BOLIVARES, PESOS Y DOLARES DE LOS RECIBOS///////////////////////////
    let pesosR = 0, dolaresR = 0, bolivaresR = 0;

    //////////////////////////////////////////////////PRIMER RECUADRO FALTANTE////////////////////////////////////////
    let monto_total_facturas_pesos = 0, monto_total_facturas_dolares = 0, monto_total_facturas_bolivares = 0;
    let descuento_pesos_factura_contado = 0, descuento_dolares_factura_contado = 0, descuento_bolivares_factura_contado = 0;
    let descuento_pesos_factura_credito = 0, descuento_dolares_factura_credito = 0, descuento_bolivares_factura_credito = 0;
    let descuento_pesos_factura_anulado = 0, descuento_dolares_factura_anulado = 0, descuento_bolivares_factura_anulado = 0;
    let cantidad_facturas_contado = 0, cantidad_facturas_credito = 0, cantidad_facturas_anuladas = 0;
    let sumatoria_cantidad_credito_contado = 0;
    let registrosDivisa;

    ///////////////////////////////////////////////SEGUNDO RECUADRO FALTANTE///////////////////////////////////////////
    let total_transBancos_factura_contado = 0, trans100Banco_factura_contado = 0, transBanesco_factura_contado = 0, transProvincial_factura_contado = 0, transSofitasa_factura_contado = 0, transMercantil_factura_contado = 0, transVenezuela_factura_contado = 0, bancolombiaFacturaContado = 0, paypalFacturaContado = 0, zelleFacturaContado = 0;
    let total_debitoBancos_factura_contado = 0, debito100BancoContado = 0, debitoBanescoContado = 0, debitoProvincialContado = 0, debitoMercantilContado = 0, debitoVenezuelaContado = 0, debitoSofitasaContado = 0;
    let total_creditoBancos_factura_contado = 0, credito100BancoContado = 0, creditoBanescoContado = 0, creditoProvincialContado = 0, creditoMercantilContado = 0, creditoVenezuelaContado = 0, creditoSofitasaContado = 0;
    let efectivoPContado = 0, efectivoBContado = 0, efectivoDContado = 0;

    /////////////////////////////////////////////////TERCER RECUADRO///////////////////////////////////////////////////
    let total_transBancos_factura_credito = 0, trans100Banco_factura_credito = 0, transBanesco_factura_credito = 0, transProvincial_factura_credito = 0, transSofitasa_factura_credito = 0, transMercantil_factura_credito = 0, transVenezuela_factura_credito = 0, bancolombiaFacturaCredito = 0, paypalFacturaCredito = 0, zelleFacturaCredito = 0;
    let total_debitoBancos_factura_credito = 0, debito100BancoCredito = 0, debitoBanescoCredito = 0, debitoProvincialCredito = 0, debitoMercantilCredito = 0, debitoVenezuelaCredito = 0, debitoSofitasaCredito = 0;
    let total_creditoBancos_factura_credito = 0, credito100BancoCredito = 0, creditoBanescoCredito = 0, creditoProvincialCredito = 0, creditoMercantilCredito = 0, creditoVenezuelaCredito = 0, creditoSofitasaCredito = 0;
    let efectivoPCredito = 0, efectivoBCredito = 0, efectivoDCredito = 0;

    //////////////////////////////////////////EXTRAS//////////////////////////////////////////////////
    //DE ORDENES DE TRABAJO:
    //el total en bs, dolares, y pesos
    //la cantidad total de ordenes de trabajo
    let totalOrdenesTrabajo = 0, totalBsOrdenesTrabajo = 0, totalPesosOrdenesTrabajo = 0, totalDolaresOrdenesTrabajo = 0;

    ///////////////////////////////////RECIBOS Y DETALLES RECIBOS////////////////////////////////////////
    /////////main///////
    let recibos, registroPagoRecibo;
    /////clasificacion de sumatoria de montos de recibo//////
    let totalBolivaresReciboRegistroConvenio = 0, totalPesosReciboRegistroConvenio = 0, totalDolaresReciboRegistroConvenio = 0;
    let totalBolivaresReciboFacturasCredito = 0, totalPesosReciboFacturasCredito = 0, totalDolaresReciboFacturasCredito = 0;

    ////////////////////////////////ABONOS PARA FACTURAS A CREDITO/////////////////////////////
    let abono_bolivares_efectivo = 0;
    let abono_dolares_efectivo = 0;
    let abono_pesos_efectivo = 0;
    //console.log("!!!!!!!!!!!!!!!!!!!!!!", recibos)

    registrosDivisa = await buscarRegistroDivisas(registrosDivisa);
    //console.log("!!!!!!!!!!!!!!!!!!!!!!!", registrosDivisa)
    let dolares, pesos, bolivares;
    for(const divisa of registrosDivisa){
        if(divisa.divisa_nombre == 'DOLARES'){
            dolares = divisa.tasa_actual;
        }else
        if(divisa.divisa_nombre == 'BOLIVARES'){
            bolivares = divisa.tasa_actual;
        }else
        if(divisa.divisa_nombre == 'PESOS'){
            pesos = divisa.tasa_actual;
        }
    }
    //console.log("BOLIVARES?", bolivares, dolares, pesos)
    
    notasCredito = await buscarNotasCreditoCC(notasCredito, sqlNotasCredito);
    facturas = await buscarFacturas(facturas, sql)
    if(facturas.length == 0){
        res.send("0")
    }else{
        for(const item of facturas){
            registroPago = await buscarRegistrosPago(item, registroPago);
            facturas[i].registro_pagos = registroPago;
            i++
        }
        i = 0;
        //res.send(facturas)
        recibos = await buscarRecibos(recibos, sqlRecibos)
        //console.log("??????", recibos)

            for(const item of recibos){
                registroPagoRecibo = await buscarRegistrosPagoRecibo(item, registroPagoRecibo);
                recibos[i].registros_pago = registroPagoRecibo;
                i++;
            }
        
        //console.log("[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[", facturas)
        let abonosOutRango
        //console.log("!!!!!!!!!!!!!!!!!!!!!!", recibos, "HELICOPTER HELICOPTER", abonosOutRango)
        //console.log("!!!!!!!!!!!!!!!!!!!!!!", recibos)

        //////////////////////////SUMAR LOS ABONOS DE PAGOS DE FACTURA OUT OF RANGO////////////////////////
        if(facturas.length > 0){
            abonosOutRango = await buscarRegistrosPagoOutRango(facturas[0].id_factura, facturas[facturas.length - 1].id_factura, req.body.id_usuario, req.body.id_usuario2, req.body.id_usuario3)
            if(abonosOutRango.length > 0){
                //console.log("WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW", abonosOutRango)
                for(const abono of abonosOutRango){
                    ///////////////////////////////////IGTF DE ABONOS OUT OF RANGO////////////////////////////////////////
                    if(abono.igtf_pago == 1){
                        if(abono.id_divisa == 1){
                            igtfPFacturaCredito = igtfPFacturaCredito + abono.monto;
                        }
                        if(abono.id_divisa == 2){
                            igtfDFacturaCredito = igtfDFacturaCredito + abono.monto;
                        }
                        if(abono.id_divisa == 3){
                            igtfBFacturaCredito = igtfBFacturaCredito + abono.monto;
                        }
                        ////////////////////////////IGTF EN TRANSFERENCIA//////////////////////////////
                        if(abono.id_tipo_pago == 1 && abono.igtf_pago == 1){
                            ////////////////PESOS//////////////
                            if(abono.id_divisa == 1){
                                igtfPTransferenciaFacturaCredito = igtfPTransferenciaFacturaCredito + abono.monto;
                            } 
                            if(abono.id_divisa == 2){
                                igtfDTransferenciaFacturaCredito = igtfDTransferenciaFacturaCredito + abono.monto;
                            } 
                            if(abono.id_divisa == 3){
                                igtfBTransferenciaFacturaCredito = igtfBTransferenciaFacturaCredito + abono.monto;
                            } 
                        }
                        ///////////////////////////////////////////////////////////////////////////////
                        //////////////////////////EFECTIVO////////////////////////////////////////////
                        if(abono.id_tipo_pago == 2 && abono.igtf_pago == 1){
                            ////////////////PESOS//////////////
                            if(abono.id_divisa == 1){
                                igtfPEfectivoFacturaCredito = igtfPEfectivoFacturaCredito + abono.monto;
                            } 
                            if(abono.id_divisa == 2){
                                igtfDEfectivoFacturaCredito = igtfDEfectivoFacturaCredito + abono.monto;
                            } 
                            if(abono.id_divisa == 3){
                                igtfBEfectivoFacturaCredito = igtfBEfectivoFacturaCredito + abono.monto;
                            } 
                        }
                        if(abono.id_tipo_pago == 3 && abono.igtf_pago == 1){
                            if(abono.id_divisa == 1){
                                igtfPDebitoFacturaCredito = igtfPDebitoFacturaCredito + abono.monto;
                            } 
                            if(abono.id_divisa == 2){
                                igtfDDebitoFacturaCredito = igtfDDebitoFacturaCredito + abono.monto;
                            } 
                            if(abono.id_divisa == 3){
                                igtfBDebitoFacturaCredito = igtfBDebitoFacturaCredito + abono.monto;
                            } 
                        }
                        if(abono.id_tipo_pago == 4 && abono.igtf_pago == 1){
                            if(abono.id_divisa == 1){
                                igtfPCreditoFacturaCredito = igtfPCreditoFacturaCredito + abono.monto;
                            } 
                            if(abono.id_divisa == 2){
                                igtfDCreditoFacturaCredito = igtfDCreditoFacturaCredito + abono.monto;
                            } 
                            if(abono.id_divisa == 3){
                                igtfBCreditoFacturaCredito = igtfBCreditoFacturaCredito + abono.monto;
                            } 
                        }
                    }
                    ////////////////////////////////////////////////////////////////////////////////////////////////////    
                    //console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<")
                    if(abono.igtf_pago == 0 && abono.tipo_registro == 0 && abono.igtf_pago == 0){
                                ///////ABONO PESOS//////
                                if(abono.id_divisa == 1){
                                    if(abono.tipo_registro == 0){
                                        abonadoP = abonadoP + abono.monto
                                        creditoP = creditoP + abono.monto
                                    }else{
                                        abonadoP = abonadoP - abono.monto
                                        creditoP = creditoP - abono.monto
                                    }
                                }else if(abono.id_divisa == 2){
                                //////ABONO DOLARES/////
                                    if(abono.tipo_registro == 0){
                                        abonadoD = abonadoD + abono.monto
                                        creditoD = creditoD + abono.monto
                                    }else{
                                        abonadoD = abonadoD - abono.monto
                                        creditoD = creditoD - abono.monto
                                    }
                                }else if(abono.id_divisa == 3){
                                //////ABONO BOLIVARES////
                                    if(abono.tipo_registro == 0){
                                        abonadoB = abonadoB + abono.monto
                                        creditoB = creditoB + abono.monto
                                    }else{
                                        abonadoB = abonadoB - abono.monto
                                        creditoB = creditoB - abono.monto
                                    }
                                }
                    }
                    ///////////////////////////INGRESO POR EFECTIVO FACTURAS A CREDITO////////////////////////////////
                    if(abono.id_usuario == req.body.id_usuario || abono.id_usuario == req.body.id_usuario2 || abono.id_usuario == req.body.id_usuario3){
                        if(abono.id_tipo_pago == 2 /*&& abono.igtf_pago == 0*/ && abono.tipo_registro == 0){
                            ///////EFECTIVO PESOS//////
                            if(abono.id_divisa == 1){
                                efectivoPCredito = efectivoPCredito + abono.monto
                            }else if(abono.id_divisa == 2){
                            //////EFECITVO DOLAEES/////
                                efectivoDCredito = efectivoDCredito + abono.monto
                            }else if(abono.id_divisa == 3){
                            //////EFECTIVO BOLIVARES////
                                efectivoBCredito = efectivoBCredito + abono.monto
                            }
                        }
                        ////////////////////////INGRESOS EN TRANSFERENCIAS EN BOLIVARES Y OTROS EN FACTURAS A CREDITO//////////////////
                        if(abono.id_tipo_pago == 1 && abono.igtf_pago == 0 && abono.tipo_registro == 0){
                            if(abono.id_banco == 1){
                            transBanesco_factura_credito = transBanesco_factura_credito + abono.monto;
                            /////////PROVINCIAL////////
                            }else if(abono.id_banco == 2){
                                transProvincial_factura_credito = transProvincial_factura_credito + abono.monto;
                            }else if(abono.id_banco == 3){
                            /////////MERCANTIL////////
                            transMercantil_factura_credito =transMercantil_factura_credito + abono.monto;
                            }else if(abono.id_banco == 4){
                            /////////VENEZUELA////////
                                transVenezuela_factura_credito = transVenezuela_factura_credito + abono.monto;
                            }else if(abono.id_banco == 5){
                            /////////SOFITASA////////
                                transSofitasa_factura_credito = transSofitasa_factura_credito + abono.monto;
                            }else if(abono.id_banco == 6){
                                /////////ZELLE////////
                                    zelleFacturaCredito = zelleFacturaCredito + abono.monto;
                            }else if(abono.id_banco == 7){
                                /////////BANCOLOMBIA////////
                                    bancolombiaFacturaCredito = bancolombiaFacturaCredito + abono.monto;
                            }else if(abono.id_banco == 8){
                                /////////paypal////////
                                    paypalFacturaCredito = paypalFacturaCredito + abono.monto;
                            }else if(abono.id_banco == 9){
                                /////////paypal////////
                                    trans100Banco_factura_credito = trans100Banco_factura_credito + abono.monto;
                            }
                        }
                        //console.log("KKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK", transSofitasa_factura_credito)
                        /////////////////////////////INGRESOS TARJETAS DE DEBITO FACTURAS A CREDITO///////////////////////////
                        if(abono.id_tipo_pago == 3 && abono.igtf_pago == 0 && abono.tipo_registro == 0){
                            /////////BANESCO////////
                            if(abono.id_banco == 1){
                                debitoBanescoCredito = debitoBanescoCredito + abono.monto;
                            /////////PROVINCIAL////////
                            }else if(abono.id_banco == 2){
                                debitoProvincialCredito = debitoProvincialCredito + abono.monto;
                            }else if(abono.id_banco == 3){
                            /////////MERCANTIL////////
                                debitoMercantilCredito = debitoMercantilCredito + abono.monto;
                            }else if(abono.id_banco == 4){
                            /////////VENEZUELA////////
                                debitoVenezuelaCredito = debitoVenezuelaCredito + abono.monto;
                            }else if(abono.id_banco == 5){
                            /////////SOFITASA////////
                                debitoSofitasaCredito = debitoSofitasaCredito + abono.monto;
                            }else if(abono.id_banco == 9){
                                /////////SOFITASA////////
                                    debito100BancoCredito = debito100BancoCredito + abono.monto;
                                }
                                    
                        }
                        ///////////////////////////INGRESOS TARJETAS DE CREDITO FACTURAS A CREDITO////////////////////////////
                        if(abono.id_tipo_pago == 4 && abono.igtf_pago == 0 && abono.tipo_registro == 0){
                            /////////BANESCO////////
                            if(abono.id_banco == 1){
                                creditoBanescoCredito = creditoBanescoCredito + abono.monto;
                            /////////PROVINCIAL////////
                            }else if(abono.id_banco == 2){
                                creditoProvincialCredito = creditoProvincialCredito + abono.monto;
                            }else if(abono.id_banco == 3){
                            /////////MERCANTIL////////
                                creditoMercantilCredito = creditoMercantilCredito + abono.monto;
                            }else if(abono.id_banco == 4){
                            /////////VENEZUELA////////
                                creditoVenezuelaCredito = creditoVenezuelaCredito + abono.monto;
                            }else if(abono.id_banco == 5){
                            /////////SOFITASA////////
                                creditoSofitasaCredito = creditoSofitasaCredito + abono.monto;
                            }else if(abono.id_banco == 5){
                                /////////100% banco////////
                                    credito100BancoCredito = credito100BancoCredito + abono.monto;
                            }
                        }
                    }
                }
            }
        }else if(facturas.length == 0){
            abonosOutRango = await buscarRegistrosPagoOutRangoNoFacturas(facturas[0].id_factura, facturas[facturas.length - 1].id_factura, req.body.id_usuario, req.body.id_usuario2, req.body.id_usuario3)
                //console.log("WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW", abonosOutRango)
                for(const abono of abonosOutRango){
                    ///////////////////////////////////IGTF DE ABONOS OUT OF RANGO////////////////////////////////////////
                    if(abono.igtf_pago == 1){
                        if(abono.id_divisa == 1){
                            igtfPFacturaCredito = igtfPFacturaCredito + abono.monto;
                        }
                        if(abono.id_divisa == 2){
                            igtfDFacturaCredito = igtfDFacturaCredito + abono.monto;
                        }
                        if(abono.id_divisa == 3){
                            igtfBFacturaCredito = igtfBFacturaCredito + abono.monto;
                        }
                        ////////////////////////////IGTF EN TRANSFERENCIA//////////////////////////////
                        if(abono.id_tipo_pago == 1 && abono.igtf_pago == 1){
                            ////////////////PESOS//////////////
                            if(abono.id_divisa == 1){
                                igtfPTransferenciaFacturaCredito = igtfPTransferenciaFacturaCredito + abono.monto;
                            } 
                            if(abono.id_divisa == 2){
                                igtfDTransferenciaFacturaCredito = igtfDTransferenciaFacturaCredito + abono.monto;
                            } 
                            if(abono.id_divisa == 3){
                                igtfBTransferenciaFacturaCredito = igtfBTransferenciaFacturaCredito + abono.monto;
                            } 
                        }
                        ///////////////////////////////////////////////////////////////////////////////
                        //////////////////////////EFECTIVO////////////////////////////////////////////
                        if(abono.id_tipo_pago == 2 && abono.igtf_pago == 1){
                            ////////////////PESOS//////////////
                            if(abono.id_divisa == 1){
                                igtfPEfectivoFacturaCredito = igtfPEfectivoFacturaCredito + abono.monto;
                            } 
                            if(abono.id_divisa == 2){
                                igtfDEfectivoFacturaCredito = igtfDEfectivoFacturaCredito + abono.monto;
                            } 
                            if(abono.id_divisa == 3){
                                igtfBEfectivoFacturaCredito = igtfBEfectivoFacturaCredito + abono.monto;
                            } 
                        }
                        if(abono.id_tipo_pago == 3 && abono.igtf_pago == 1){
                            if(abono.id_divisa == 1){
                                igtfPDebitoFacturaCredito = igtfPDebitoFacturaCredito + abono.monto;
                            } 
                            if(abono.id_divisa == 2){
                                igtfDDebitoFacturaCredito = igtfDDebitoFacturaCredito + abono.monto;
                            } 
                            if(abono.id_divisa == 3){
                                igtfBDebitoFacturaCredito = igtfBDebitoFacturaCredito + abono.monto;
                            } 
                        }
                        if(abono.id_tipo_pago == 4 && abono.igtf_pago == 1){
                            if(abono.id_divisa == 1){
                                igtfPCreditoFacturaCredito = igtfPCreditoFacturaCredito + abono.monto;
                            } 
                            if(abono.id_divisa == 2){
                                igtfDCreditoFacturaCredito = igtfDCreditoFacturaCredito + abono.monto;
                            } 
                            if(abono.id_divisa == 3){
                                igtfBCreditoFacturaCredito = igtfBCreditoFacturaCredito + abono.monto;
                            } 
                        }
                    }
                    ////////////////////////////////////////////////////////////////////////////////////////////////////    
                    //console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<")
                    if(abono.igtf_pago == 0 && abono.tipo_registro == 0 && abono.igtf_pago == 0){
                                ///////ABONO PESOS//////
                                if(abono.id_divisa == 1){
                                    if(abono.tipo_registro == 0){
                                        abonadoP = abonadoP + abono.monto
                                        creditoP = creditoP + abono.monto
                                    }else{
                                        abonadoP = abonadoP - abono.monto
                                        creditoP = creditoP - abono.monto
                                    }
                                }else if(abono.id_divisa == 2){
                                //////ABONO DOLARES/////
                                    if(abono.tipo_registro == 0){
                                        abonadoD = abonadoD + abono.monto
                                        creditoD = creditoD + abono.monto
                                    }else{
                                        abonadoD = abonadoD - abono.monto
                                        creditoD = creditoD - abono.monto
                                    }
                                }else if(abono.id_divisa == 3){
                                //////ABONO BOLIVARES////
                                    if(abono.tipo_registro == 0){
                                        abonadoB = abonadoB + abono.monto
                                        creditoB = creditoB + abono.monto
                                    }else{
                                        abonadoB = abonadoB - abono.monto
                                        creditoB = creditoB - abono.monto
                                    }
                                }
                    }
                    ///////////////////////////INGRESO POR EFECTIVO FACTURAS A CREDITO////////////////////////////////
                    if(abono.id_usuario == req.body.id_usuario || abono.id_usuario == req.body.id_usuario2 || abono.id_usuario == req.body.id_usuario3){
                        if(abono.id_tipo_pago == 2 /*&& abono.igtf_pago == 0*/ && abono.tipo_registro == 0){
                            ///////EFECTIVO PESOS//////
                            if(abono.id_divisa == 1){
                                efectivoPCredito = efectivoPCredito + abono.monto
                            }else if(abono.id_divisa == 2){
                            //////EFECITVO DOLAEES/////
                                efectivoDCredito = efectivoDCredito + abono.monto
                            }else if(abono.id_divisa == 3){
                            //////EFECTIVO BOLIVARES////
                                efectivoBCredito = efectivoBCredito + abono.monto
                            }
                        }
                        ////////////////////////INGRESOS EN TRANSFERENCIAS EN BOLIVARES Y OTROS EN FACTURAS A CREDITO//////////////////
                        if(abono.id_tipo_pago == 1 && abono.igtf_pago == 0 && abono.tipo_registro == 0){
                            if(abono.id_banco == 1){
                            transBanesco_factura_credito = transBanesco_factura_credito + abono.monto;
                            /////////PROVINCIAL////////
                            }else if(abono.id_banco == 2){
                                transProvincial_factura_credito = transProvincial_factura_credito + abono.monto;
                            }else if(abono.id_banco == 3){
                            /////////MERCANTIL////////
                            transMercantil_factura_credito =transMercantil_factura_credito + abono.monto;
                            }else if(abono.id_banco == 4){
                            /////////VENEZUELA////////
                                transVenezuela_factura_credito = transVenezuela_factura_credito + abono.monto;
                            }else if(abono.id_banco == 5){
                            /////////SOFITASA////////
                                transSofitasa_factura_credito = transSofitasa_factura_credito + abono.monto;
                            }else if(abono.id_banco == 6){
                                /////////ZELLE////////
                                    zelleFacturaCredito = zelleFacturaCredito + abono.monto;
                            }else if(abono.id_banco == 7){
                                /////////BANCOLOMBIA////////
                                    bancolombiaFacturaCredito = bancolombiaFacturaCredito + abono.monto;
                            }else if(abono.id_banco == 8){
                                /////////paypal////////
                                    paypalFacturaCredito = paypalFacturaCredito + abono.monto;
                            }else if(abono.id_banco == 9){
                                /////////paypal////////
                                    trans100Banco_factura_credito = trans100Banco_factura_credito + abono.monto;
                            }
                        }
                        //console.log("KKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK", transSofitasa_factura_credito)
                        /////////////////////////////INGRESOS TARJETAS DE DEBITO FACTURAS A CREDITO///////////////////////////
                        if(abono.id_tipo_pago == 3 && abono.igtf_pago == 0 && abono.tipo_registro == 0){
                            /////////BANESCO////////
                            if(abono.id_banco == 1){
                                debitoBanescoCredito = debitoBanescoCredito + abono.monto;
                            /////////PROVINCIAL////////
                            }else if(abono.id_banco == 2){
                                debitoProvincialCredito = debitoProvincialCredito + abono.monto;
                            }else if(abono.id_banco == 3){
                            /////////MERCANTIL////////
                                debitoMercantilCredito = debitoMercantilCredito + abono.monto;
                            }else if(abono.id_banco == 4){
                            /////////VENEZUELA////////
                                debitoVenezuelaCredito = debitoVenezuelaCredito + abono.monto;
                            }else if(abono.id_banco == 5){
                            /////////SOFITASA////////
                                debitoSofitasaCredito = debitoSofitasaCredito + abono.monto;
                            }else if(abono.id_banco == 9){
                                /////////SOFITASA////////
                                    debito100BancoCredito = debito100BancoCredito + abono.monto;
                                }
                                    
                        }
                        ///////////////////////////INGRESOS TARJETAS DE CREDITO FACTURAS A CREDITO////////////////////////////
                        if(abono.id_tipo_pago == 4 && abono.igtf_pago == 0 && abono.tipo_registro == 0){
                            /////////BANESCO////////
                            if(abono.id_banco == 1){
                                creditoBanescoCredito = creditoBanescoCredito + abono.monto;
                            /////////PROVINCIAL////////
                            }else if(abono.id_banco == 2){
                                creditoProvincialCredito = creditoProvincialCredito + abono.monto;
                            }else if(abono.id_banco == 3){
                            /////////MERCANTIL////////
                                creditoMercantilCredito = creditoMercantilCredito + abono.monto;
                            }else if(abono.id_banco == 4){
                            /////////VENEZUELA////////
                                creditoVenezuelaCredito = creditoVenezuelaCredito + abono.monto;
                            }else if(abono.id_banco == 5){
                            /////////SOFITASA////////
                                creditoSofitasaCredito = creditoSofitasaCredito + abono.monto;
                            }else if(abono.id_banco == 5){
                                /////////100% banco////////
                                    credito100BancoCredito = credito100BancoCredito + abono.monto;
                            }
                        }
                    }
                }
        }
        ///////////////////////////////////////////////////////////////////////////////////////////////////

        //////////////////////////SUMANDO INDIVIDUALMENTE LOS TIPOS DE REGISTRO////////////////////////////
        for(const item of recibos){
            ////////////////////SUMATORIA GENERAL PARA RECIBOS DE REGISTRO CONVENIO Y PARA FACTURAS A CREDITO///////////////
            ////////RECIBOS PARA FACTURA A CREDITO///////
            pesosR = pesosR  + item.monto_pesos, 
            dolaresR = dolaresR  + item.monto_bolivares, 
            bolivaresR = bolivaresR  + item.monto_bolivares;
            if(item.id_tipo_recibo == 1){
                totalBolivaresReciboRegistroConvenio = totalBolivaresReciboRegistroConvenio + item.monto_bolivares
                totalPesosReciboRegistroConvenio = totalPesosReciboRegistroConvenio + item.monto_pesos
                totalDolaresReciboRegistroConvenio = totalDolaresReciboRegistroConvenio + item.monto_dolares

            ///////////RECIBOS PARA REGISTROS CONVENIOS//////////////
            }else if(item.id_tipo_recibo == 2){
                totalBolivaresReciboFacturasCredito = totalBolivaresReciboFacturasCredito + item.monto_bolivares, 
                totalPesosReciboFacturasCredito = + totalPesosReciboFacturasCredito + item.monto_pesos, 
                totalDolaresReciboFacturasCredito = totalDolaresReciboFacturasCredito + item.monto_dolares
            }

            for(const pago of item.registros_pago){
                //console.log("MEN AT WORK", pago.tipo_registro)
                if(pago.id_tipo_pago == 2 /*&& pago.igtf_pago == 0*/){
                    ///////EFECTIVO PESOS//////
                    if(pago.id_divisa == 1){
                        if(pago.tipo_registro == 0){
                            //efectivoPContado = efectivoPContado + pago.monto
                            //abonadoP = abonadoP + pago.monto;
                            efectivoPCredito = efectivoPCredito + pago.monto
                        }else{
                            //efectivoPContado = efectivoPContado - pago.monto
                            //abonadoP = abonadoP - pago.monto;
                            efectivoPCredito = efectivoPCredito + pago.monto
                        }
                    }else if(pago.id_divisa == 2){
                    //////EFECITVO DOLAEES/////
                    if(pago.tipo_registro == 0){
                        //efectivoDContado = efectivoDContado + pago.monto
                        //abonadoD = abonadoD + pago.monto;
                        efectivoDCredito = efectivoDCredito + pago.monto
                    }else{
                        //efectivoDContado = efectivoDContado - pago.monto
                        //abonadoD = abonadoD - pago.monto;
                        efectivoDCredito = efectivoDCredito + pago.monto
                    } 
                    //console.log("ENTRO A MENT A DOLARES", efectivoDContado);
                    }else if(pago.id_divisa == 3){
                    //////EFECTIVO BOLIVARES////
                        if(pago.tipo_registro == 0){
                            //efectivoBContado = efectivoBContado + pago.monto
                            //abonadoB = abonadoB + pago.monto;
                            efectivoBCredito = efectivoPCredito + pago.monto
                        }else{
                            //efectivoBContado = efectivoBContado - pago.monto
                            //abonadoB = abonadoB - pago.monto;
                            efectivoBCredito = efectivoPCredito + pago.monto
                        }
                    }
                }
                /////////////////////////////////INGRESOS DE RECIBO POR BANCOS////////////////////////////////
                if(pago.id_tipo_pago == 1 && pago.igtf_pago == 0 && pago.tipo_registro == 0){
                    if(pago.id_banco == 1){
                    transBanesco_factura_credito = transBanesco_factura_credito + pago.monto;
                    /////////PROVINCIAL////////
                    }else if(pago.id_banco == 2){
                        transProvincial_factura_credito = transProvincial_factura_credito + pago.monto;
                    }else if(pago.id_banco == 3){
                    /////////MERCANTIL////////
                    transMercantil_factura_credito =transMercantil_factura_credito + pago.monto;
                    }else if(pago.id_banco == 4){
                    /////////VENEZUELA////////
                        transVenezuela_factura_credito = transVenezuela_factura_credito + pago.monto;
                    }else if(pago.id_banco == 5){
                    /////////SOFITASA////////
                        transSofitasa_factura_credito = transSofitasa_factura_credito + pago.monto;
                    }else if(pago.id_banco == 6){
                        /////////ZELLE////////
                            zelleFacturaCredito = zelleFacturaCredito + pago.monto;
                    }else if(pago.id_banco == 7){
                        /////////BANCOLOMBIA////////
                            bancolombiaFacturaCredito = bancolombiaFacturaCredito + pago.monto;
                    }else if(pago.id_banco == 8){
                        /////////paypal////////
                        paypalFacturaCredito = paypalFacturaCredito + pago.monto;
                    }else if(pago.id_banco == 9){
                        /////////paypal////////
                        trans100Banco_factura_credito = trans100Banco_factura_credito + pago.monto;
                    }
                }
                ///////////////////////////////////////////////////////////////////////
                ///////////////////////////INGRESOS TARJETAS DE CREDITO FACTURAS A CONTADO LOOP PARA RECIBOS////////////////////////////
                if(pago.id_tipo_pago == 4 && pago.igtf_pago == 0 && pago.tipo_registro == 0){
                    /////////BANESCO////////
                    if(pago.id_banco == 1){
                        creditoBanescoCredito = creditoBanescoContado + pago.monto;
                    /////////PROVINCIAL////////
                    }else if(pago.id_banco == 2){
                        creditoProvincialCredito = creditoProvincialCredito + pago.monto;
                    }else if(pago.id_banco == 3){
                    /////////MERCANTIL////////
                        creditoMercantilCredito = creditoMercantilCredito + pago.monto;
                    }else if(pago.id_banco == 4){
                    /////////VENEZUELA////////
                        creditoVenezuelaCredito = creditoVenezuelaCredito + pago.monto;
                    }else if(pago.id_banco == 5){
                    /////////SOFITASA////////
                        creditoSofitasaCredito = creditoSofitasaCredito + pago.monto;
                    }else if(pago.id_banco == 9){
                        /////////SOFITASA////////
                            credito100BancoCredito = credito100BancoCredito + pago.monto;
                        }
                }
            }
        }
        /////////////////////////////////////////SUMATORIA DE IGTF DE FACTURAS CON VUELTOS///////////////////////////////////
        let sumaBolivaresIGTFVueltosEfectivo = 0, sumaDolaresIGTFVueltosEfectivo = 0, sumaPesosIGTFVueltosEfectivo = 0;
        for(const item of facturas){
            let vueltos = 0;
            ////////////////////////FOR PARA VERIFICAR QUE LA LOS PAGOS TENGAN VUELTOS/////////////////////////////
            for(const pago of item.registro_pagos){
                if(pago.tipo_registro == 1){
                    vueltos = 1;
                    break;
                }
            }
            if(vueltos == 0){
                if((item.id_tipo_factura == 1 || item.id_tipo_factura == 3) && item.id_estado_factura != 3){
                    for(const pago of item.registro_pagos){
                        if(pago.id_tipo_pago == 2){
                            if(pago.id_divisa == 1 && pago.igtf_pago == 1){
                                sumaPesosIGTFVueltosEfectivo = sumaPesosIGTFVueltosEfectivo + pago.monto;
                            }if(pago.id_divisa == 2 && pago.igtf_pago == 1){
                                sumaDolaresIGTFVueltosEfectivo = sumaDolaresIGTFVueltosEfectivo + pago.monto;
                            }if(pago.id_divisa == 3 && pago.igtf_pago == 1){
                                sumaBolivaresIGTFVueltosEfectivo = sumaBolivaresIGTFVueltosEfectivo + pago.monto;
                            }
                        }
                    }
                }
            }
            vueltos = 0;
        }
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        ///////////////////////////////////SUMATORIA DE PAGOS POR IGTF/////////////////////////////
        for(const item of facturas){
            //console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", item)
            ////////////////////////////////////TOTAL IGTF (FACTURAS A CREDITO Y DEBITO)/////////////////////////////////////
            for(const pago of item.registro_pagos){
                if(item.id_tipo_factura != 3){
                        if(pago.id_divisa == 1 && pago.igtf_pago == 1){
                            igtfP = igtfP + pago.monto;
                        }if(pago.id_divisa == 2 && pago.igtf_pago == 1){
                            igtfD = igtfD + pago.monto;
                        }
                        //console.log(igtfP, igtfD)
                        if(pago.id_divisa == 3 && pago.igtf_pago == 1){
                            igtfB = igtfB + pago.monto;
                        }
                    ////////////////////////////IGTF EN TRANSFERENCIA//////////////////////////////
                    if(pago.id_tipo_pago == 1 && pago.igtf_pago == 1){
                        ////////////////PESOS//////////////
                        if(pago.id_divisa == 1 && pago.igtf_pago == 1){
                            igtfPTransferencia = igtfPTransferencia + pago.monto;
                        } 
                        if(pago.id_divisa == 2 && pago.igtf_pago == 1){
                            igtfDTransferencia = igtfDTransferencia + pago.monto;
                        } 
                        if(pago.id_divisa == 3 && pago.igtf_pago == 1){
                            igtfBTransferencia = igtfBTransferencia + pago.monto;
                        } 
                        /////////////////////////PARA PAYPAL Y ZELLE//////////////////////////////
                        if(pago.id_divisa == 2 && pago.igtf_pago == 1 && pago.id_banco == 8){
                            igtfPaypal = igtfPaypal + pago.monto;
                        }
                        if(pago.id_divisa == 2 && pago.igtf_pago == 1 && pago.id_banco == 6){
                            igtfZelle = igtfZelle + pago.monto;
                        } 
                        //////////////////////////////////////////////////////////////////////////
                    }
                    ////////////////////////////////
                    ///////////////////////////////////////////////////////////////////////////////
                    //////////////////////////EFECTIVO////////////////////////////////////////////
                    if(pago.id_tipo_pago == 2 && pago.igtf_pago == 1){
                        ////////////////PESOS//////////////
                        if(pago.id_divisa == 1 && pago.igtf_pago == 1){
                            igtfPEfectivo = igtfPEfectivo + pago.monto;
                        } 
                        if(pago.id_divisa == 2 && pago.igtf_pago == 1){
                            igtfDEfectivo = igtfDEfectivo + pago.monto;
                        } 
                        if(pago.id_divisa == 3 && pago.igtf_pago == 1){
                            igtfBEfectivo = igtfBEfectivo + pago.monto;
                        } 
                    }
                    if(pago.id_tipo_pago == 3 && pago.igtf_pago == 1){
                        if(pago.id_divisa == 1 && pago.igtf_pago == 1){
                            igtfPDebito = igtfPDebito + pago.monto;
                        } 
                        if(pago.id_divisa == 2 && pago.igtf_pago == 1){
                            igtfDDebito = igtfDDebito + pago.monto;
                        } 
                        if(pago.id_divisa == 3 && pago.igtf_pago == 1){
                            igtfBDebito = igtfBDebito + pago.monto;
                        } 
                    }
                    if(pago.id_tipo_pago == 4 && pago.igtf_pago == 1){
                        if(pago.id_divisa == 1 && pago.igtf_pago == 1){
                            igtfPCredito = igtfPCredito + pago.monto;
                        } 
                        if(pago.id_divisa == 2 && pago.igtf_pago == 1){
                            igtfDCredito = igtfDCredito + pago.monto;
                        } 
                        if(pago.id_divisa == 3 && pago.igtf_pago == 1){
                            igtfBCredito = igtfBCredito + pago.monto;
                        } 
                    }
                    /////////////////////////////////////////////////////////////////////////////////////////////////////
                    ///////////////////////////////////IGTF DE FACTURAS A CONTADO///////////////////////////////////////
                    if(item.id_tipo_factura == 1 && pago.igtf_pago == 1){
                        if(pago.id_divisa == 1 && pago.igtf_pago == 1){
                            igtfPFacturaContado = igtfPFacturaContado + pago.monto;
                        }
                        if(pago.id_divisa == 2 && pago.igtf_pago == 1){
                            igtfDFacturaContado = igtfDFacturaContado + pago.monto;
                        }
                        if(pago.id_divisa == 3 && pago.igtf_pago == 1){
                            igtfBFacturaContado = igtfBFacturaContado + pago.monto;
                        }
                        if(pago.id_tipo_pago == 1 && pago.igtf_pago == 1){
                            ////////////////PESOS//////////////
                            if(pago.id_divisa == 1 && pago.igtf_pago == 1){
                                igtfPTransferenciaFacturaContado = igtfPTransferenciaFacturaContado + pago.monto;
                            } 
                            if(pago.id_divisa == 2 && pago.igtf_pago == 1){
                                igtfDTransferenciaFacturaContado = igtfDTransferenciaFacturaContado + pago.monto;
                            } 
                            if(pago.id_divisa == 3 && pago.igtf_pago == 1){
                                igtfBTransferenciaFacturaContado = igtfBTransferenciaFacturaContado + pago.monto;
                            } 
                        }
                        ///////////////////////////////////////////////////////////////////////////////
                        //////////////////////////EFECTIVO////////////////////////////////////////////
                        if(pago.id_tipo_pago == 2 && pago.igtf_pago == 1){
                            ////////////////PESOS//////////////
                            if(pago.id_divisa == 1 && pago.igtf_pago == 1){
                                igtfPEfectivoFacturaContado = igtfPEfectivoFacturaContado + pago.monto;
                            } 
                            if(pago.id_divisa == 2 && pago.igtf_pago == 1){
                                igtfDEfectivoFacturaContado = igtfDEfectivoFacturaContado + pago.monto;
                            } 
                            if(pago.id_divisa == 3 && pago.igtf_pago == 1){
                                igtfBEfectivoFacturaContado = igtfBEfectivoFacturaContado + pago.monto;
                            } 
                        }
                        if(pago.id_tipo_pago == 3 && pago.igtf_pago == 1){
                            if(pago.id_divisa == 1 && pago.igtf_pago){
                                igtfPDebitoFacturaContado = igtfPDebitoFacturaContado + pago.monto;
                            } 
                            if(pago.id_divisa == 2 && pago.igtf_pago){
                                igtfDDebitoFacturaContado = igtfDDebitoFacturaContado + pago.monto;
                            } 
                            if(pago.id_divisa == 3 && pago.igtf_pago){
                                igtfBDebitoFacturaContado = igtfBDebitoFacturaContado + pago.monto;
                            } 
                        }
                        if(pago.id_tipo_pago == 4 && pago.igtf_pago == 1){
                            if(pago.id_divisa == 1 && pago.igtf_pago){
                                igtfPCreditoFacturaContado = igtfPCreditoFacturaContado + pago.monto;
                            } 
                            if(pago.id_divisa == 2 && pago.igtf_pago){
                                igtfDCreditoFacturaContado = igtfDCreditoFacturaContado + pago.monto;
                            } 
                            if(pago.id_divisa == 3 && pago.igtf_pago){
                                igtfBCreditoFacturaContado = igtfBCreditoFacturaContado + pago.monto;
                            } 
                        }
                    }
                    ////////////////////////////////////////////////////////////////////////////////////////////////////
                    ///////////////////////////////////IGTF DE FACTURAS A CREDITO////////////////////////////////////////
                    if(item.id_tipo_factura == 2 && pago.igtf_pago == 1){
                        if(pago.id_divisa == 1){
                            igtfPFacturaCredito = igtfPFacturaCredito + pago.monto;
                        }
                        if(pago.id_divisa == 2){
                            igtfDFacturaCredito = igtfDFacturaCredito + pago.monto;
                        }
                        if(pago.id_divisa == 3){
                            igtfBFacturaCredito = igtfBFacturaCredito + pago.monto;
                        }
                        ////////////////////////////IGTF EN TRANSFERENCIA//////////////////////////////
                        if(pago.id_tipo_pago == 1 && pago.igtf_pago == 1){
                            ////////////////PESOS//////////////
                            if(pago.id_divisa == 1){
                                igtfPTransferenciaFacturaCredito = igtfPTransferenciaFacturaCredito + pago.monto;
                            } 
                            if(pago.id_divisa == 2){
                                igtfDTransferenciaFacturaCredito = igtfDTransferenciaFacturaCredito + pago.monto;
                            } 
                            if(pago.id_divisa == 3){
                                igtfBTransferenciaFacturaCredito = igtfBTransferenciaFacturaCredito + pago.monto;
                            } 
                        }
                        ///////////////////////////////////////////////////////////////////////////////
                        //////////////////////////EFECTIVO////////////////////////////////////////////
                        if(pago.id_tipo_pago == 2 && pago.igtf_pago == 1){
                            ////////////////PESOS//////////////
                            if(pago.id_divisa == 1){
                                igtfPEfectivoFacturaCredito = igtfPEfectivoFacturaCredito + pago.monto;
                            } 
                            if(pago.id_divisa == 2){
                                igtfDEfectivoFacturaCredito = igtfDEfectivoFacturaCredito + pago.monto;
                            } 
                            if(pago.id_divisa == 3){
                                igtfBEfectivoFacturaCredito = igtfBEfectivoFacturaCredito + pago.monto;
                            } 
                        }
                        if(pago.id_tipo_pago == 3 && pago.igtf_pago == 1){
                            if(pago.id_divisa == 1){
                                igtfPDebitoFacturaCredito = igtfPDebitoFacturaCredito + pago.monto;
                            } 
                            if(pago.id_divisa == 2){
                                igtfDDebitoFacturaCredito = igtfDDebitoFacturaCredito + pago.monto;
                            } 
                            if(pago.id_divisa == 3){
                                igtfBDebitoFacturaCredito = igtfBDebitoFacturaCredito + pago.monto;
                            } 
                        }
                        if(pago.id_tipo_pago == 4 && pago.igtf_pago == 1){
                            if(pago.id_divisa == 1){
                                igtfPCreditoFacturaCredito = igtfPCreditoFacturaCredito + pago.monto;
                            } 
                            if(pago.id_divisa == 2){
                                igtfDCreditoFacturaCredito = igtfDCreditoFacturaCredito + pago.monto;
                            } 
                            if(pago.id_divisa == 3){
                                igtfBCreditoFacturaCredito = igtfBCreditoFacturaCredito + pago.monto;
                            } 
                        }
                    }
                    ////////////////////////////////////////////////////////////////////////////////////////////////////
                }
            }
        }
        
        ////////////////////////////////////SUMATORIA DE COSAS/////////////////////////////////////
        for(const item of facturas){
            //console.log(item);
            ///////////////////////////////ORDENES DE TRABAJO/////////////////////////
            if(item.numero_factura == null && item.orden_trabajo != null){
                totalOrdenesTrabajo = totalOrdenesTrabajo + 1, 
                totalBsOrdenesTrabajo = totalBsOrdenesTrabajo + item.total_bolivares, 
                totalPesosOrdenesTrabajo = totalPesosOrdenesTrabajo + item.total_pesos, 
                totalDolaresOrdenesTrabajo = totalDolaresOrdenesTrabajo + item.total_dolares;
            }

            ///////////////////////////////DESCUENTOS TOTALES/////////////////////////
                if(item.descuento_bolivares > 0 || item.descuento_pesos > 0 || item.descuento_dolares > 0){
                    cantidadFacturasDescuentos = cantidadFacturasDescuentos + 1;
                    detallesDescontadas.push({
                        id_factura: item.id_factura,
                        numero_factura: item.numero_factura,
                        orden_trabajo: item.orden_trabajo,
                        total_bolivares: item.total_bolivares,
                        total_dolares: item.total_dolares,
                        total_pesos: item.total_pesos,
                        id_usuario: item.id_usuario,
                        id_cliente: item.id_cliente,
                        id_tipo_factura: item.id_tipo_factura,
                        id_estado_factura: item.id_estado_factura,
                        fecha_creacion_factura: item.fecha_creacion_factura,
                        fecha_cencelacion_factura: item.fecha_cencelacion_factura,
                        descuento_bolivares: item.descuento_bolivares,
                        descuento_dolares: item.descuento_dolares,
                        descuento_pesos: item.descuento_pesos,
                        anulacion_motivo: item.anulacion_motivo,
                        tipo_factura_nombre: item.tipo_factura_nombre,
                        cliente_nombre: item.cliente_nombre,
                        cliente_apellido: item.cliente_apellido,
                        id_tipo_cliente: item.id_tipo_cliente,
                    })
                }
                descuentoD = descuentoD + item.descuento_dolares;
                descuentoB = descuentoB + item.descuento_bolivares;
                descuentoP = descuentoP + item.descuento_pesos;
            
            //////////////////////////////FACTURAS AL CONTADO////////////////////////
            if(item.id_tipo_factura == 1 && item.id_estado_factura != 3){
                cantidad_facturas_contado ++;
                contadoB = contadoB + (item.total_bolivares - item.descuento_bolivares)
                contadoD = contadoD + (item.total_dolares - item.descuento_dolares)
                contadoP = contadoP + (item.total_pesos - item.descuento_pesos)
            }
            if(item.id_tipo_factura == 3 && item.id_estado_factura != 3){
                contadoBOrdenTrabajo = contadoBOrdenTrabajo + item.total_bolivares
                contadoDOrdenTrabajo = contadoDOrdenTrabajo + item.total_dolares
                contadoPOrdenTrabajo = contadoPOrdenTrabajo + item.total_pesos
            }
            if((item.id_tipo_factura == 1 || item.id_tipo_factura == 3) && item.id_estado_factura != 3){
            // console.log("WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW")

                /////////////////////////////DESCUENTOS EN FACTURAS A CONTADO///////////////////////////
                descuento_pesos_factura_contado = descuento_pesos_factura_contado + item.descuento_pesos, 
                descuento_dolares_factura_contado = descuento_dolares_factura_contado + item.descuento_dolares, 
                descuento_bolivares_factura_contado = descuento_bolivares_factura_contado + item.descuento_bolivares
                for(const pago of item.registro_pagos){
                    //console.log("EN REGISTRO_ PAGOS!!!", pago);
                    /////////////////////////////INGRESOS POR TRANSFERENCIAS EN BOLIVARES DE BANCOS NACIONALES FACTURAS A CONTADO///////////////////
                    if(pago.id_tipo_pago == 1 && pago.tipo_registro == 0){
                        if(pago.id_banco == 1){
                        transBanesco_factura_contado = transBanesco_factura_contado + pago.monto;
                        /////////PROVINCIAL////////
                        }else if(pago.id_banco == 2){
                            transProvincial_factura_contado = transProvincial_factura_contado + pago.monto;
                        }else if(pago.id_banco == 3){
                        /////////MERCANTIL////////
                        transMercantil_factura_contado =transMercantil_factura_contado + pago.monto;
                        }else if(pago.id_banco == 4){
                        /////////VENEZUELA////////
                            transVenezuela_factura_contado = transVenezuela_factura_contado + pago.monto;
                        }else if(pago.id_banco == 5){
                        /////////SOFITASA////////
                            transSofitasa_factura_contado = transSofitasa_factura_contado + pago.monto;
                        }else if(pago.id_banco == 6){
                            /////////ZELLE////////
                                zelleFacturaContado = zelleFacturaContado + pago.monto;
                        }else if(pago.id_banco == 7){
                            /////////BANCOLOMBIA////////
                                bancolombiaFacturaContado = bancolombiaFacturaContado + pago.monto;
                        }else if(pago.id_banco == 8){
                            /////////paypal////////
                            paypalFacturaContado =paypalFacturaContado + pago.monto;
                        }else if(pago.id_banco == 9){
                            /////////paypal////////
                            trans100Banco_factura_contado = trans100Banco_factura_contado + pago.monto;
                        }
                    }
                    /////////////////////////////INGRESOS TARJETAS DE DEBITO FACTURAS A CONTADO///////////////////////////
                    if(pago.id_tipo_pago == 3 && pago.igtf_pago == 0 && pago.tipo_registro == 0){
                        /////////BANESCO////////
                        if(pago.id_banco == 1){
                            debitoBanescoContado = debitoBanescoContado + pago.monto;
                        /////////PROVINCIAL////////
                        }else if(pago.id_banco == 2){
                            debitoProvincialContado = debitoProvincialContado + pago.monto;
                        }else if(pago.id_banco == 3){
                        /////////MERCANTIL////////
                            debitoMercantilContado = debitoMercantilContado + pago.monto;
                        }else if(pago.id_banco == 4){
                        /////////VENEZUELA////////
                            debitoVenezuelaContado = debitoVenezuelaContado + pago.monto;
                        }else if(pago.id_banco == 5){
                        /////////SOFITASA////////
                            debitoSofitasaContado = debitoSofitasaContado + pago.monto;
                        }else if(pago.id_banco == 9){
                            /////////SOFITASA////////
                                debito100BancoContado = debito100BancoContado + pago.monto;
                            }
                    }
                    ///////////////////////////INGRESOS TARJETAS DE CREDITO FACTURAS A CONTADO////////////////////////////
                    if(pago.id_tipo_pago == 4 && pago.igtf_pago == 0 && pago.tipo_registro == 0){
                        /////////BANESCO////////
                        if(pago.id_banco == 1){
                            creditoBanescoContado = creditoBanescoContado + pago.monto;
                        /////////PROVINCIAL////////
                        }else if(pago.id_banco == 2){
                            creditoProvincialContado = creditoProvincialContado + pago.monto;
                        }else if(pago.id_banco == 3){
                        /////////MERCANTIL////////
                            creditoMercantilContado = creditoMercantilContado + pago.monto;
                        }else if(pago.id_banco == 4){
                        /////////VENEZUELA////////
                            creditoVenezuelaContado = creditoVenezuelaContado + pago.monto;
                        }else if(pago.id_banco == 5){
                        /////////SOFITASA////////
                            creditoSofitasaContado = creditoSofitasaContado + pago.monto;
                        }else if(pago.id_banco == 9){
                            /////////SOFITASA////////
                                credito100BancoContado = credito100BancoContado + pago.monto;
                            }
                    }
                    ///////////////////////////INGRESO POR EFECTIVO FACTURAS A CONTADO////////////////////////////////
                    if(pago.id_tipo_pago == 2 && pago.igtf_pago == 0){
                        ///////EFECTIVO PESOS//////
                        if(pago.id_divisa == 1){
                            if(pago.tipo_registro == 0){
                                efectivoPContado = efectivoPContado + pago.monto
                            }else{
                                efectivoPContado = efectivoPContado - pago.monto
                            }
                        }else if(pago.id_divisa == 2){
                        //////EFECITVO DOLAEES/////
                        //console.log("MMMMMMMMMMMMMMMMMMMMM", pago)
                        if(pago.tipo_registro == 0){
                            efectivoDContado = efectivoDContado + pago.monto
                        }else{
                            efectivoDContado = efectivoDContado - pago.monto
                        } 
                        }else if(pago.id_divisa == 3){
                        //////EFECTIVO BOLIVARES////
                            if(pago.tipo_registro == 0){
                                efectivoBContado = efectivoBContado + pago.monto
                            }else{
                                efectivoBContado = efectivoBContado - pago.monto
                            }
                        }
                    }
                    //console.log(efectivoPContado, efectivoDContado, efectivoBContado)
                }
            }
            /////////////////////////////FACTURAS A CREDITO/////////////////////////
            //console.log("??????????????????????????????????????????????????????????", item)
            if(item.id_tipo_factura == 2 && item.id_estado_factura != 3){
                cantidad_facturas_credito ++;
                creditoB = creditoB + item.total_bolivares
                creditoD = creditoD + item.total_dolares
                creditoP = creditoP + item.total_pesos
                if(item.id_tipo_cliente == 2){
                    creditoBConvenio = creditoBConvenio + item.total_bolivares,
                    creditoPConvenio = creditoPConvenio + item.total_pesos,
                    creditoDConvenio = creditoDConvenio + item.total_dolares,
                    cantidadFacturaCreditoConvenio = cantidadFacturaCreditoConvenio + 1;
                } 
                if(item.id_tipo_cliente == 1 ){
                    creditoBParticular = creditoBParticular + item.total_bolivares,
                    creditoPParticular = creditoPParticular + item.total_pesos,
                    creditoDParticular = creditoDParticular + item.total_dolares,
                    cantidadFacturaCreditoParticular = cantidadFacturaCreditoParticular + 1;
                }
                ////////////////////////////DESCUENTO EN FACTURAS A CREDITO/////////////////////////////
                descuento_pesos_factura_credito = descuento_pesos_factura_credito + item.descuento_pesos, 
                descuento_dolares_factura_credito = descuento_dolares_factura_credito + item.descuento_dolares, 
                descuento_bolivares_factura_credito = descuento_bolivares_factura_credito + item.descuento_bolivares
                ////////////////////////ABONOS EN FACTURAS A CREDITO//////////////////
                for(const abono of item.registro_pagos){
                    //console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<")
                    if(abono.id_usuario == req.body.id_usuario || abono.id_usuario == req.body.id_usuario2 || abono.id_usuario == req.body.id_usuario3){
                        if(abono.igtf_pago == 0 && abono.tipo_registro == 0 && abono.igtf_pago == 0){
                            ///////ABONO PESOS//////
                            if(abono.id_divisa == 1){
                                if(abono.tipo_registro == 0){
                                    abonadoP = abonadoP + abono.monto
                                }else{
                                    abonadoP = abonadoP - abono.monto
                                }
                            }else if(abono.id_divisa == 2){
                            //////ABONO DOLAEES/////
                                if(abono.tipo_registro == 0){
                                    abonadoD = abonadoD + abono.monto
                                }else{
                                    abonadoD = abonadoD - abono.monto
                                }
                            }else if(abono.id_divisa == 3){
                            //////ABONO BOLIVARES////
                                if(abono.tipo_registro == 0){
                                    abonadoB = abonadoB + abono.monto
                                }else{
                                    abonadoB = abonadoB - abono.monto
                                }
                            }
                        }
                        ///////////////////////////INGRESO POR EFECTIVO FACTURAS A CREDITO////////////////////////////////
                        if(abono.id_tipo_pago == 2 /*&& abono.igtf_pago == 0*/ && abono.tipo_registro == 0){
                            ///////EFECTIVO PESOS//////
                            if(abono.id_divisa == 1){
                                efectivoPCredito = efectivoPCredito + abono.monto
                            }else if(abono.id_divisa == 2){
                            //////EFECITVO DOLAEES/////
                                efectivoDCredito = efectivoDCredito + abono.monto
                            }else if(abono.id_divisa == 3){
                            //////EFECTIVO BOLIVARES////
                                efectivoBCredito = efectivoBCredito + abono.monto
                            }
                        }
                        ////////////////////////INGRESOS EN TRANSFERENCIAS EN BOLIVARES Y OTROS EN FACTURAS A CREDITO//////////////////
                        if(abono.id_tipo_pago == 1 && abono.igtf_pago == 0 && abono.tipo_registro == 0){
                            if(abono.id_banco == 1){
                            transBanesco_factura_credito = transBanesco_factura_credito + abono.monto;
                            /////////PROVINCIAL////////
                            }else if(abono.id_banco == 2){
                                transProvincial_factura_credito = transProvincial_factura_credito + abono.monto;
                            }else if(abono.id_banco == 3){
                            /////////MERCANTIL////////
                            transMercantil_factura_credito =transMercantil_factura_credito + abono.monto;
                            }else if(abono.id_banco == 4){
                            /////////VENEZUELA////////
                                transVenezuela_factura_credito = transVenezuela_factura_credito + abono.monto;
                            }else if(abono.id_banco == 5){
                            /////////SOFITASA////////
                                transSofitasa_factura_credito = transSofitasa_factura_credito + abono.monto;
                            }else if(abono.id_banco == 6){
                                /////////ZELLE////////
                                    zelleFacturaCredito = zelleFacturaCredito + abono.monto;
                            }else if(abono.id_banco == 7){
                                /////////BANCOLOMBIA////////
                                    bancolombiaFacturaCredito = bancolombiaFacturaCredito + abono.monto;
                            }else if(abono.id_banco == 8){
                                /////////paypal////////
                                paypalFacturaCredito = paypalFacturaCredito + abono.monto;
                            }else if(abono.id_banco == 9){
                                /////////paypal////////
                                trans100Banco_factura_credito = trans100Banco_factura_credito + abono.monto;
                            }
                        }
                        //console.log("KKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK", transSofitasa_factura_credito)
                        /////////////////////////////INGRESOS TARJETAS DE DEBITO FACTURAS A CREDITO///////////////////////////
                        if(abono.id_tipo_pago == 3 && abono.igtf_pago == 0 && abono.tipo_registro == 0){
                            /////////BANESCO////////
                            if(abono.id_banco == 1){
                                debitoBanescoCredito = debitoBanescoCredito + abono.monto;
                            /////////PROVINCIAL////////
                            }else if(abono.id_banco == 2){
                                debitoProvincialCredito = debitoProvincialCredito + abono.monto;
                            }else if(abono.id_banco == 3){
                            /////////MERCANTIL////////
                                debitoMercantilCredito = debitoMercantilCredito + abono.monto;
                            }else if(abono.id_banco == 4){
                            /////////VENEZUELA////////
                                debitoVenezuelaCredito = debitoVenezuelaCredito + abono.monto;
                            }else if(abono.id_banco == 5){
                            /////////SOFITASA////////
                                debitoSofitasaCredito = debitoSofitasaCredito + abono.monto;
                            }else if(abono.id_banco == 9){
                                /////////SOFITASA////////
                                    debito100BancoCredito = debito100BancoCredito + abono.monto;
                                }
                            
                        }
                        ///////////////////////////INGRESOS TARJETAS DE CREDITO FACTURAS A CREDITO////////////////////////////
                        if(abono.id_tipo_pago == 4 && abono.igtf_pago == 0 && abono.tipo_registro == 0){
                            /////////BANESCO////////
                            if(abono.id_banco == 1){
                                creditoBanescoCredito = creditoBanescoCredito + abono.monto;
                            /////////PROVINCIAL////////
                            }else if(abono.id_banco == 2){
                                creditoProvincialCredito = creditoProvincialCredito + abono.monto;
                            }else if(abono.id_banco == 3){
                            /////////MERCANTIL////////
                                creditoMercantilCredito = creditoMercantilCredito + abono.monto;
                            }else if(abono.id_banco == 4){
                            /////////VENEZUELA////////
                                creditoVenezuelaCredito = creditoVenezuelaCredito + abono.monto;
                            }else if(abono.id_banco == 5){
                            /////////SOFITASA////////
                                creditoSofitasaCredito = creditoSofitasaCredito + abono.monto;
                            }else if(abono.id_banco == 5){
                                /////////100% banco////////
                                    credito100BancoCredito = credito100BancoCredito + abono.monto;
                                }
                        }
                    }
                }
            }
            
            //////////////////////SUMATORIAS DE FACTURAS CREDITO Y CONTADO///////////////////////////
            monto_total_facturas_pesos = contadoP + creditoP + contadoPOrdenTrabajo;
            monto_total_facturas_dolares = contadoD + creditoD + contadoDOrdenTrabajo;
            monto_total_facturas_bolivares = contadoB + creditoB + contadoBOrdenTrabajo;
            //////////////////////////FACTURAS ANULADAS/////////////////////////////
            if(item.id_estado_factura == 3){
                cantidad_facturas_anuladas++;
                anuladoB = anuladoB + (item.total_bolivares - item.descuento_bolivares)
                anuladoD = anuladoD + (item.total_dolares - item.descuento_dolares)
                anuladoP = anuladoP + (item.total_pesos - item.descuento_pesos)
                detallesAnuladas.push({
                    numero_factura: item.numero_factura,
                    cliente: item.cliente_nombre +" "+item.cliente_apellido,
                    motivo: item.anulacion_motivo
                })
                //////////////////////////DESCUENTO DE FACTURAS ANULADAS////////////////////////////////
                descuento_pesos_factura_anulado = descuento_pesos_factura_anulado + item.descuento_pesos, 
                descuento_dolares_factura_anulado = descuento_dolares_factura_anulado + item.descuento_dolares, 
                descuento_bolivares_factura_anulado = descuento_bolivares_factura_anulado + item.descuento_bolivares;
            }
            
            for(const pago of item.registro_pagos){
            // console.log("pago", pago)
            /////////////////////////////INGRESOS TARJETAS DE DEBITO///////////////////////////
            if(item.id_estado_factura != 3){
                    if(pago.id_tipo_pago == 3 && pago.tipo_registro == 0){
                        /////////BANESCO////////
                        if(pago.id_banco == 1){
                            debitoBanesco = debitoBanesco + pago.monto;
                        /////////PROVINCIAL////////
                        }else if(pago.id_banco == 2){
                            debitoProvincial = debitoProvincial + pago.monto;
                        }else if(pago.id_banco == 3){
                        /////////MERCANTIL////////
                            debitoMercantil = debitoMercantil + pago.monto;
                        }else if(pago.id_banco == 4){
                        /////////VENEZUELA////////
                            debitoVenezuela = debitoVenezuela + pago.monto;
                        }else if(pago.id_banco == 5){
                        /////////SOFITASA////////
                            debitoSofitasa = debitoSofitasa + pago.monto;
                        }else if(pago.id_banco == 9){
                            /////////100 SOFITASA////////
                            debito100banco =debito100banco + pago.monto;
                            }
                    }
                    ///////////////////////////////////////////////////////////////////////////////////
                    ///////////////////////////INGRESOS TARJETAS DE CREDITO////////////////////////////
                    if(pago.id_tipo_pago == 4 && pago.tipo_registro == 0){
                        /////////BANESCO////////
                        if(pago.id_banco == 1){
                            creditoBanesco = creditoBanesco + pago.monto;
                        /////////PROVINCIAL////////
                        }else if(pago.id_banco == 2){
                            creditoProvincial = creditoProvincial + pago.monto;
                        }else if(pago.id_banco == 3){
                        /////////MERCANTIL////////
                            creditoMercantil = creditoMercantil + pago.monto;
                        }else if(pago.id_banco == 4){
                        /////////VENEZUELA////////
                            creditoVenezuela = creditoVenezuela + pago.monto;
                        }else if(pago.id_banco == 5){
                        /////////SOFITASA////////
                            creditoSofitasa = creditoSofitasa + pago.monto;
                        }else if(pago.id_banco == 9){
                            /////////100 BANCO////////
                                credito100Banco = credito100Banco + pago.monto;
                            }
                    }
                    ///////////////////////////////////////////////////////////////////////////////////
                    ///////////////////////////INGRESOS TRANSFERENCIAS/////////////////////////////////
                    if(pago.id_tipo_pago == 1 && pago.tipo_registro == 0){
                        if(pago.id_banco == 1){
                        transBanesco = transBanesco + pago.monto;
                        /////////PROVINCIAL////////
                        }else if(pago.id_banco == 2){
                            transPronvincial = transPronvincial + pago.monto;
                        }else if(pago.id_banco == 3){
                        /////////MERCANTIL////////
                        transMercantil =transMercantil + pago.monto;
                        }else if(pago.id_banco == 4){
                        /////////VENEZUELA////////
                            transVenezuela = transVenezuela + pago.monto;
                        }else if(pago.id_banco == 5){
                        /////////SOFITASA////////
                            transSofitasa = transSofitasa + pago.monto;
                        }else if(pago.id_banco == 6){
                            /////////ZELLE////////
                                zelle = zelle + pago.monto;
                        }else if(pago.id_banco == 7){
                            /////////BANCOLOMBIA////////
                                bancolombia = bancolombia + pago.monto;
                        }else if(pago.id_banco == 8){
                            /////////paypal////////
                            paypal =paypal + pago.monto;
                        }else if(pago.id_banco == 9){
                            /////////100 banco////////
                            trans100Banco = trans100Banco + pago.monto;
                        }
                    }
                    ///////////////////////////////////////////////////////////////////////////////////
                    /////////////////////////EFECTIVO PESOS, DOLARES, BOLIVARES////////////////////////
                    if(pago.id_tipo_pago == 2 && pago.igtf_pago == 0){
                        ///////EFECTIVO PESOS//////
                        if(pago.id_divisa == 1){
                            if(pago.tipo_registro == 0){
                                efectivoP = efectivoP + pago.monto
                            }else{
                                efectivoP = efectivoP - pago.monto
                            }
                        }else if(pago.id_divisa == 2){
                        //////EFECITVO DOLAEES/////
                            if(pago.tipo_registro == 0){
                                efectivoD = efectivoD + pago.monto
                            }else{
                                efectivoD = efectivoD - pago.monto
                            }
                        }else if(pago.id_divisa == 3){
                        //////EFECTIVO BOLIVARES////
                            if(pago.tipo_registro == 0){
                                efectivoB = efectivoB + pago.monto
                            }else{
                                efectivoB = efectivoB - pago.monto
                            }
                        }
                    }
            }
            }
        }
        //////////////////////////SUMATORIAS TOTALES EN FACTURAS A CONTADO///////////////////////////////////////
        total_transBancos_factura_contado = Number(Math.round((transBanesco_factura_contado + transProvincial_factura_contado + transMercantil_factura_contado + transVenezuela_factura_contado + transSofitasa_factura_contado + trans100Banco_factura_contado) + "e+2") + "e-2");
        total_debitoBancos_factura_contado = debitoBanescoContado + debitoProvincialContado + debitoMercantilContado + debitoVenezuelaContado + debitoSofitasaContado + debito100BancoContado;
        total_creditoBancos_factura_contado = creditoBanescoContado + creditoProvincialContado + creditoMercantilContado + creditoVenezuelaContado + creditoSofitasaContado + credito100BancoContado;
        /////CONVERSIONES FACTURAS A CONTADO/////
        const efectivoDContadoAB = efectivoDContado * bolivares;
        const efectivoPContadoAB = (efectivoPContado / pesos) * bolivares;
        const paypalContadoABolivares = paypalFacturaContado * bolivares;
        const bancolombiaContadoABolivares = (bancolombiaFacturaContado / pesos) * bolivares;
        const zelleContadoABolivares = zelleFacturaContado * bolivares;
        let igtf_total_factura_contado = Number(Math.round((igtfBFacturaContado + (((igtfPFacturaContado / pesos) * bolivares) + (igtfDFacturaContado * bolivares))) + "e+2") + "e-2");
        let total_factura_contado =  contadoB + totalBsOrdenesTrabajo + igtf_total_factura_contado;//efectivoBContado + efectivoDContadoAB + efectivoPContadoAB + paypalContadoABolivares + bancolombiaContadoABolivares + zelleContadoABolivares + total_transBancos_factura_contado + total_debitoBancos_factura_contado + total_creditoBancos_factura_contado;
        if(isNaN(total_factura_contado)){
            total_factura_contado = 0;
        }
        //////////////////////////SUMATORIAS TOTALES EN FACTURAS A CREDITO///////////////////////////////////////
        total_transBancos_factura_credito = Number(Math.round((transBanesco_factura_credito + transProvincial_factura_credito + transMercantil_factura_credito + transVenezuela_factura_credito + transSofitasa_factura_credito + trans100Banco_factura_credito) + "e+2") + "e-2")
        total_debitoBancos_factura_credito = Number(Math.round((debitoBanescoCredito + debitoProvincialCredito + debitoMercantilCredito + debitoVenezuelaCredito + debitoSofitasaCredito + debito100BancoCredito) + "e+2") + "e-2");
        total_creditoBancos_factura_credito = Number(Math.round((creditoBanescoCredito + creditoProvincialCredito + creditoMercantilCredito + creditoVenezuelaCredito + creditoSofitasaCredito + credito100BancoCredito) + "e+2") + "e-2");
        /////CONVERSIONES FACTURAS A CONTADO/////
        const efectivoDCreditoAB = efectivoDCredito * bolivares;
        const efectivoPCreditoAB = (efectivoPCredito / pesos) * bolivares;
        const paypalCreditoABolivares = paypalFacturaCredito * bolivares;
        const bancolombiaCreditoABolivares = (bancolombiaFacturaCredito / pesos) * bolivares;
        const zelleCreditoABolivares = zelleFacturaCredito * bolivares;

        
        //let total_factura_credito = creditoB;//efectivoBCredito + efectivoDCreditoAB + efectivoPCreditoAB + paypalCreditoABolivares + bancolombiaCreditoABolivares + zelleCreditoABolivares + total_transBancos_factura_credito + total_debitoBancos_factura_credito + total_creditoBancos_factura_credito + 0;
        total_factura_credito = efectivoBCredito + ((efectivoDCredito) * bolivares) + (((efectivoPCredito) / pesos) * bolivares) + (((bancolombiaFacturaCredito) / pesos) * bolivares) + ((zelleFacturaCredito) * bolivares) + ((paypalFacturaCredito) * bolivares) + total_transBancos_factura_credito + total_debitoBancos_factura_credito + total_creditoBancos_factura_credito + igtfBEfectivoFacturaCredito + igtfBEfectivoFacturaCredito + igtfBDebitoFacturaCredito + igtfBTransferenciaFacturaCredito + (((igtfPEfectivoFacturaCredito + igtfPCreditoFacturaCredito + igtfPDebitoFacturaCredito + igtfPTransferenciaFacturaCredito) / pesos) * bolivares) + ((igtfDEfectivoFacturaCredito + igtfDCreditoFacturaCredito + igtfDDebitoFacturaCredito + igtfDTransferenciaFacturaCredito) * bolivares)
        if(isNaN(total_factura_credito)){
            total_factura_credito = 0;
        }
        //////////////////////////////////SUMATORIAS DE RECUADRO CUATRO//////////////////////////////////////////
        const sumatoria_debito_facturas_credito_contado = debitoBanescoContado + debitoBanescoCredito + debitoProvincialContado + debitoProvincialCredito + debitoMercantilContado + debitoMercantilCredito + debitoVenezuelaContado + debitoVenezuelaCredito + debitoSofitasaContado + debitoSofitasaCredito;
        const sumatoria_credito_facturas_credito_contado = creditoBanescoContado + creditoBanescoCredito + creditoProvincialContado + creditoProvincialCredito + creditoMercantilContado + creditoMercantilCredito + creditoVenezuelaContado + creditoVenezuelaCredito + creditoSofitasaContado + creditoSofitasaCredito;

        //////////////////////////////////SUMATORIAS DE RECUADRO QUINTO//////////////////////////////////////////
        let sumatoria_total_provincial = transPronvincial + debitoProvincial + creditoProvincial;
        let sumatoria_total_sofitasa = transSofitasa + debitoSofitasa + creditoSofitasa;
        let sumatoria_total_mercantil = transMercantil + debitoMercantil + creditoMercantil;
        let sumatoria_total_banesco = transBanesco + debitoBanesco + creditoBanesco;
        let sumatoria_total_venezuela = transVenezuela + debitoVenezuela + creditoVenezuela;
        let sumatoria_total_100_banco = trans100Banco + debito100banco + credito100Banco;

        //////////////////////PRIMER Y ULTIMA FACTURA/////////////////////////
        if(facturas.length == 1){
            facturaPRI = facturas[0]
            facturaULT = facturas[0]
        }else if(facturas.length > 1){
            facturaPRI = facturas.shift();
            facturaULT = facturas.pop();
        }else if(facturas.length == 0){
            facturaPRI = 0
            facturaULT = 0
        }

        //console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!", facturaPRI, facturaULT)
        /////////////ABONOS EFECTIVO////////////////
        balance.abonos_bolivares_efectivo = efectivoBCredito //+ abonadoB;
        balance.abonos_pesos_efectivo = efectivoPCredito //+ abonadoP;
        balance.abonos_dolares_efectivo = Number(Math.round(efectivoDCredito + "e+2") + "e-2").toLocaleString('de-DE'); //+ abonadoD;
        ////////////DESCUENTO TOTAL/////////////////
        balance.descuento_total_dolares = Number(Math.round(descuentoD + "e+2") + "e-2").toLocaleString('de-DE');
        balance.descuento_total_bolivares = Number(Math.round(descuentoB + "e+2") + "e-2").toLocaleString('de-DE');
        balance.descuento_total_pesos =  Number(Math.round(descuentoP + "e+2") + "e-2").toLocaleString('de-DE');
        balance.cantidad_facturas_con_descuento = cantidadFacturasDescuentos;
        balance.facturas_con_descuento = detallesDescontadas;
        ////////////GANANCIA TARJETAS DE DEBITO NACIONALES////////
        balance.ganancia_debito_banesco = Number(Math.round((debitoBanesco) + "e+2") + "e-2");;
        balance.ganancia_debito_provincial = Number(Math.round((debitoProvincial) + "e+2") + "e-2");
        balance.ganancia_debito_mercantil = Number(Math.round((debitoMercantil) + "e+2") + "e-2");;
        balance.ganancia_debito_venezuela = Number(Math.round((debitoVenezuela) + "e+2") + "e-2")
        balance.ganancia_debito_sofitasa = Number(Math.round((debitoSofitasa) + "e+2") + "e-2")
        balance.ganancia_debito_100_banco = Number(Math.round((debito100banco) + "e+2") + "e-2")
        balance.total_tarjeta_debito_bancos_nacionales = Number(Math.round((debitoBanesco + debitoProvincial + debitoMercantil + debitoVenezuela + debitoSofitasa + debito100banco) + "e+2") + "e-2");
        //////////GANANCIA TARJETAS DE CREDITO NACIONALES////////
        balance.ganancia_credito_banesco = Number(Math.round((creditoBanesco) + "e+2") + "e-2")
        balance.ganancia_credito_provincial = Number(Math.round((creditoProvincial) + "e+2") + "e-2")
        balance.ganancia_credito_mercantil = Number(Math.round((creditoMercantil) + "e+2") + "e-2")
        balance.ganancia_credito_venezuela = Number(Math.round((creditoVenezuela) + "e+2") + "e-2")
        balance.ganancia_credito_sofitasa = Number(Math.round((creditoSofitasa) + "e+2") + "e-2")
        balance.ganancia_credito_100_banco = Number(Math.round((credito100Banco) + "e+2") + "e-2")
        balance.total_tarjeta_credito_bancos_nacionales = Number(Math.round((creditoBanesco + creditoProvincial + creditoMercantil + creditoVenezuela + creditoSofitasa + credito100Banco) + "e+2") + "e-2");

        /////////GANANCIA TRANSFERENCIAS NACIONALES//////////////
        balance.ganancia_transferencia_banesco = Number(Math.round((transBanesco) + "e+2") + "e-2");
        balance.ganancia_transferencia_provincial = Number(Math.round((transPronvincial) + "e+2") + "e-2");
        balance.ganancia_transferencia_mercantil = Number(Math.round((transMercantil) + "e+2") + "e-2");
        balance.ganancia_transferencia_venezuela = Number(Math.round((transVenezuela) + "e+2") + "e-2");
        balance.ganancia_transferencia_sofitasa = Number(Math.round((transSofitasa) + "e+2") + "e-2");
        balance.ganancia_transferencia_100_banco = Number(Math.round((trans100Banco) + "e+2") + "e-2");
        //balance.total_transferencias_bancos_nacionales = Number(Math.round((transBanesco + transPronvincial + transMercantil + transVenezuela + transSofitasa + trans100Banco) + "e+2") + "e-2");
        balance.total_transferencias_bancos_nacionales = Number(Math.round((total_transBancos_factura_contado + igtfBTransferencia + total_transBancos_factura_credito) + "e+2") + "e-2");
        /////////GANANCIA TRANSFERENCIAS INTERNACIONALES//////////////
        balance.ganancia_transferencia_zelle = Number(Math.round((zelle) + "e+2") + "e-2");
        balance.ganancia_transferencia_bancolombia = Number(Math.round((bancolombia /*+ igtfPTransferencia*/) + "e+2") + "e-2");
        balance.ganancia_transferencia_paypal = Number(Math.round((paypal) + "e+2") + "e-2");
        ////////TOTAL DE GANANCIAS POR TRANSFERENCIAS EN BOLIVARES DE BANCOS NACIONALES FACTURAS AL CONTADO///////////////////
        balance.total_transBancos_factura_contado = Number(Math.round((total_transBancos_factura_contado + igtfBTransferencia) + "e+2") + "e-2");
        ////////TOTAL DE GANANCIAS POR TARJETA DE DEBITO EN BOLIVARES DE BANCOS NACIONALES FACTURAS AL CONTADO///////////////////
        balance.total_debitoBancos_factura_contado = Number(Math.round((total_debitoBancos_factura_contado + igtfBDebito) + "e+2") + "e-2");
        ////////TOTAL DE GANANCIAS POR TARJETA DE CREDITO EN BOLIVARES DE BANCOS NACIONALES FACTURAS AL CONTADO///////////////////
        balance.total_creditoBancos_factura_contado = Number(Math.round((total_creditoBancos_factura_contado) + "e+2") + "e-2");
        ////////TOTAL DE EFECTIVO EN BOLIVARES, PESOS Y DOLARES DE FACTURAS AL CONTADO///////////////////
        balance.efectivo_pesos_factura_contado = Number(Math.round((efectivoPContado + sumaPesosIGTFVueltosEfectivo) + "e+2") + "e-2");
        balance.efectivo_dolares_factura_contado = Number(Math.round((efectivoDContado + sumaDolaresIGTFVueltosEfectivo) + "e+2") + "e-2");
        balance.efectivo_bolivares_factura_contado = Number(Math.round((efectivoBContado + sumaBolivaresIGTFVueltosEfectivo) + "e+2") + "e-2");
        ///////////////////////////TOTAL DE TRANSFERENCIAS EN BANCOLOMBIA ZELLE Y PAYPAL FACTURAS AL CONTADO///////////////////////
        balance.zelle_factura_contado = Number(Math.round((zelleFacturaContado) + "e+2") + "e-2");
        balance.bancolombia_factura_contado = Number(Math.round((bancolombiaFacturaContado) + "e+2") + "e-2");
        balance.paypal_factura_contado = Number(Math.round((paypalFacturaContado) + "e+2") + "e-2");
        /////////////INGRESOS POR FACTURAS AL CONTADO////////////////
        balance.ganancia_factura_contado_bolivares = Number(Math.round(contadoB + "e+2") + "e-2");
        balance.ganancia_orden_trabajo_bolivares = Number(Math.round(contadoBOrdenTrabajo + "e+2") + "e-2");
        //balance.ganancia_factura_contado_dolares = Number(Math.round(contadoD + "e+2") + "e-2");
        //balance.ganancia_factura_contado_pesos = Number(Math.round(contadoP + "e+2") + "e-2");
        ////////////DESCUENTO POR FACTURAS AL CONTADO/////////////////
        balance.descuento_pesos_factura_contado = Number(Math.round((descuento_pesos_factura_contado) + "e+2") + "e-2");
        balance.descuento_dolares_factura_contado = Number(Math.round((descuento_dolares_factura_contado) + "e+2") + "e-2");
        balance.descuento_bolivares_factura_contado = Number(Math.round((descuento_bolivares_factura_contado) + "e+2") + "e-2");
        //////////////CANTIDAD DE FACTURAS AL CONTADO///////////////
        balance.cantidad_facturas_contado = Number(Math.round((cantidad_facturas_contado) + "e+2") + "e-2");
        /////////////SUMA TOTAL DE GANANCIAS DE FACTURAS AL CONTADO///////////////////////
        
        balance.total_factura_contado = Number(Math.round(total_factura_contado + "e+2") + "e-2");
        /////////////INGRESOS POR FACTURAS A CREDITO////////////////
        balance.ganancia_factura_credito_bolivares = Number(Math.round((creditoB) + "e+2") + "e-2");
        balance.ganancia_factura_credito_dolares = Number(Math.round(creditoD + "e+2") + "e-2");
        balance.ganancia_factura_credito_pesos = Number(Math.round(creditoP + "e+2") + "e-2");
        ////////////DESCUENTO POR FACTURAS A CREDITO/////////////////
        balance.descuento_pesos_factura_credito = Number(Math.round((descuento_pesos_factura_credito) + "e+2") + "e-2"); 
        balance.descuento_dolares_factura_credito = Number(Math.round((descuento_dolares_factura_credito) + "e+2") + "e-2");
        balance.descuento_bolivares_factura_credito = Number(Math.round((descuento_bolivares_factura_credito) + "e+2") + "e-2");
        ///////////////////CANTIDAD FACTURAS A CREDITO///////////////////////
        balance.cantidad_facturas_credito = Number(Math.round((cantidad_facturas_credito) + "e+2") + "e-2");
        //////////////////SUMATORIA TOTAL DE TRANSFERENCIAS A FACTURAS A CREDITO//////////////////////////////////
        balance.total_transBancos_factura_credito = Number(Math.round((total_transBancos_factura_credito) + "e+2") + "e-2");
        /////////////////SUMATORIA TOTAL EN TARJETAS DE DEBITO A FACTURAS A CREDITO////////////////////////////////
        balance.total_debitoBancos_factura_credito = Number(Math.round((total_debitoBancos_factura_credito) + "e+2") + "e-2");
        ////////TOTAL DE GANANCIAS POR TARJETA DE CREDITO EN BOLIVARES DE BANCOS NACIONALES A FACTURAS A CREDITO////////////////
        balance.total_creditoBancos_factura_credito = Number(Math.round((total_creditoBancos_factura_credito) + "e+2") + "e-2");
        /////////////////TRANSFERENCIA EN BANCOLOMBIA, ZELLE Y PAYPAL EN FACTURAS A CREDITO///////////////////////
        balance.zelleFacturaCredito = Number(Math.round((zelleFacturaCredito) + "e+2") + "e-2");
        balance.bancolombiaFacturaCredito = Number(Math.round((bancolombiaFacturaCredito) + "e+2") + "e-2");
        balance.paypalFacturaCredito = Number(Math.round((paypalFacturaCredito) + "e+2") + "e-2");
        /////////////SUMA TOTAL DE GANANCIAS DE FACTURAS A CREDITO///////////////////////
        balance.total_factura_credito = Number(Math.round((total_factura_credito) + "e+2") + "e-2");
        /////////////SUMA DE FACTURAS A CREDITO Y CONTADO////////////////
        balance.monto_total_facturas_pesos = Number(Math.round(monto_total_facturas_pesos + "e+2") + "e-2");
        balance.monto_total_facturas_dolares = Number(Math.round(monto_total_facturas_dolares + "e+2") + "e-2");
        balance.monto_total_facturas_bolivares = Number(Math.round(monto_total_facturas_bolivares + "e+2") + "e-2");
        ///////////////////SUMATORIA DE TARJETAS DE DEBITO Y CREDITO EN FACTURAS AL CONTADO////////////////////////////////////////////
        balance.sumatoria_debito_facturas_credito_contado = Number(Math.round((sumatoria_debito_facturas_credito_contado) + "e+2") + "e-2");
        ///////////////////SUMATORIA DE TARJETAS DE CREDITO Y CREDITO EN FACTURAS AL CONTADO////////////////////////////////////////////
        balance.sumatoria_credito_facturas_credito_contado = Number(Math.round((sumatoria_credito_facturas_credito_contado) + "e+2") + "e-2");
        ////////////SUMA DE CANTIDADES DE FACTURAS A CONTADO Y CREDITO////////
        balance.sumatoria_cantidad_credito_contado = Number(Math.round((cantidad_facturas_contado + cantidad_facturas_credito) + "e+2") + "e-2");
        /////////////FACTURAS ANULADAS////////////////////////////
        balance.factura_anulada_bolivares = Number(Math.round(anuladoB + "e+2") + "e-2");
        balance.factura_anulada_dolares = Number(Math.round(anuladoD + "e+2") + "e-2");
        balance.factura_anulada_pesos = Number(Math.round(anuladoP + "e+2") + "e-2");
        ///////////////DESCUENTOS DE FACTURAS ANULADAS//////////////////////
        balance.descuento_pesos_factura_anulado = Number(Math.round(descuento_pesos_factura_anulado + "e+2") + "e-2");
        balance.descuento_dolares_factura_anulado = Number(Math.round(descuento_dolares_factura_anulado + "e+2") + "e-2");
        balance.descuento_bolivares_factura_anulado = Number(Math.round(descuento_bolivares_factura_anulado + "e+2") + "e-2");
        /////////////////CANTIDAD DE FACTURAS ANULADAS///////////////////////////
        balance.cantidad_facturas_anuladas = cantidad_facturas_anuladas;
        /////////////EFECTIVO RECAUDADO////////////////////////////
        balance.efectivo_dolares = Number(Math.round((/*efectivoD*/efectivoDContado + efectivoDCredito + sumaDolaresIGTFVueltosEfectivo) + "e+2") + "e-2");
        balance.efectivo_pesos = Number(Math.round((/*efectivoP*/efectivoPContado + efectivoPCredito + sumaPesosIGTFVueltosEfectivo) + "e+2") + "e-2");
        balance.efectivo_bolivares = Number(Math.round((/*efectivoB*/efectivoBContado + /*efectivoBCredito +*/ sumaBolivaresIGTFVueltosEfectivo) + "e+2") + "e-2");
        ///////////////////SUMATORIA TOTAL DE TARJETAS DE DEBITO Y CREDITO Y TRANSFERENCIAS DE BANCOS NACIONALES///////////////////////////
        balance.sumatoria_total_provincial = Number(Math.round(sumatoria_total_provincial + "e+2") + "e-2");
        balance.sumatoria_total_sofitasa = Number(Math.round(sumatoria_total_sofitasa + "e+2") + "e-2");
        balance.sumatoria_total_mercantil = Number(Math.round(sumatoria_total_mercantil + "e+2") + "e-2");
        balance.sumatoria_total_banesco = Number(Math.round(sumatoria_total_banesco + "e+2") + "e-2");
        balance.sumatoria_total_venezuela = Number(Math.round(sumatoria_total_venezuela + "e+2") + "e-2");
        balance.sumatoria_total_100_banco = Number(Math.round(sumatoria_total_100_banco + "e+2") + "e-2");
        /////////////ABONOS HECHOS EN LA FECHA/////////////////////
        balance.abonos_dolares = Number(Math.round(abonadoD + "e+2") + "e-2");
        balance.abonos_pesos = Number(Math.round(abonadoP + "e+2") + "e-2");
        balance.abonos_bolivares = Number(Math.round(abonadoB + "e+2") + "e-2");
        ////////////////////PRIMERA Y ULTIMA FACTURA/////////////////
        balance.primera_factura = facturaPRI;
        balance.segunda_factura = facturaULT;
        //////////////DESTELLES DE FACTURAS ANULADAS/////////////////
        //console.log("DETALLES ANULADAS!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!", balance.detalles_facturas_anuladas)
        balance.detalles_facturas_anuladas = detallesAnuladas;
        //////////////FACTURAS A CREDITO DE CONVENIOS///////////////////
        balance.sumatoria_bolivares_factura_credito_convenio = Number(Math.round(creditoBConvenio + "e+2") + "e-2"),
        balance.sumatoria_pesos_factura_credito_convenio = Number(Math.round(creditoPConvenio + "e+2") + "e-2"),
        balance.sumatoria_dolares_factura_credito_convenio = Number(Math.round(creditoDConvenio + "e+2") + "e-2"),
        balance.cantidad_facturas_credito_convenio = cantidadFacturaCreditoConvenio,
        //////////////FACTURAS A CREDITO DE PARTICULARES////////////////
        balance.sumatoria_bolivares_factura_credito_particulares = Number(Math.round(creditoBParticular + "e+2") + "e-2"),
        balance.sumatoria_pesos_factura_credito_particulares = Number(Math.round(creditoPParticular + "e+2") + "e-2"),
        balance.sumatoria_dolares_factura_credito_particulares =  Number(Math.round(creditoDParticular + "e+2") + "e-2"),
        balance.cantidad_facturas_credito_particulares = cantidadFacturaCreditoParticular,
        /////////////////////////////DESCRIPCION DE ORDENES DE TRABAJO///////////////////////////////////
        balance.total_ordenes_trabajo = totalOrdenesTrabajo, 
        balance.total_bolivares_ordenes_trabajo_bolivares = Number(Math.round((totalBsOrdenesTrabajo) + "e+2") + "e-2"),
        balance.total_pesos_ordenes_trabajo = Number(Math.round(totalPesosOrdenesTrabajo + "e+2") + "e-2"),
        balance.total_dolares_ordenes_trabajo = Number(Math.round(totalDolaresOrdenesTrabajo + "e+2") + "e-2")
    //////////////SECCION DE IGTF///////////////////////
        //////////////////SUMATORIA DE IGTF TOTALES/////////////////////////////
        balance.IGTF_bolivares_transferencia = Number(Math.round((igtfBTransferencia) + "e+2") + "e-2");
        balance.IGTF_pesos_transferencia = Number(Math.round((igtfPTransferencia) + "e+2") + "e-2");
        balance.IGTF_dolares_transferencia = Number(Math.round((igtfDTransferencia) + "e+2") + "e-2");
        balance.IGTF_bolivares_tarjeta_credito = Number(Math.round((igtfBEfectivo) + "e+2") + "e-2");
        balance.IGTF_pesos_tarjeta_credito = Number(Math.round(igtfPCredito + "e+2") + "e-2");
        balance.IGTF_dolares_tarjeta_credito = Number(Math.round(igtfDCredito + "e+2") + "e-2");
        balance.IGTF_bolivares = Number(Math.round((igtfB + (igtfD * bolivares) + ((igtfP / pesos)) * bolivares) + "e+2") + "e-2")
        balance.IGTF_pesos = Number(Math.round(igtfP + "e+2") + "e-2"),
        balance.IGTF_dolares = igtfD//Number(Math.round(igtfD + "e+2") + "e-2"),
        balance.IGTF_bolivares_efectivo = Number(Math.round(igtfBEfectivo + "e+2") + "e-2");
        balance.IGTF_pesos_efectivo = Number(Math.round(igtfPEfectivo + "e+2") + "e-2"); 
        balance.IGTF_dolares_efectivo = Number(Math.round(igtfDEfectivo + "e+2") + "e-2"); 
        balance.IGTF_bolivares_tarjeta_debito = Number(Math.round(igtfBDebito + "e+2") + "e-2");
        balance.IGTF_pesos_tarjeta_debito = Number(Math.round(igtfPDebito + "e+2") + "e-2"); 
        balance.IGTF_dolares_factura_debito = Number(Math.round(igtfDDebito + "e+2") + "e-2");
        ///////////////////////////////////////////////////////////////////////
        /////////////////SUMATORIA DE IGTF POR FACTURAS A CREDITO////////////////////////////////
        balance.IGTF_bolivares_transferencia_factura_credito = Number(Math.round(igtfBTransferenciaFacturaCredito + "e+2") + "e-2");
        balance.IGTF_pesos_transferencia_factura_credito = Number(Math.round(igtfPTransferenciaFacturaCredito + "e+2") + "e-2");
        balance.IGTF_dolares_transferencia_factura_credito = Number(Math.round(igtfDTransferenciaFacturaCredito + "e+2") + "e-2");
        balance.IGTF_bolivares_tarjeta_credito_factura_credito = Number(Math.round(igtfBEfectivoFacturaCredito + "e+2") + "e-2");
        balance.IGTF_pesos_tarjeta_credito_factura_credito = Number(Math.round(igtfPCreditoFacturaCredito + "e+2") + "e-2");
        balance.IGTF_dolares_tarjeta_credito_factura_credito = Number(Math.round(igtfDCreditoFacturaCredito + "e+2") + "e-2"),
        balance.IGTF_bolivares_factura_credito = Number(Math.round((igtfBFacturaCredito + (((igtfPFacturaCredito / pesos) * bolivares) + (igtfDFacturaCredito * bolivares))) + "e+2") + "e-2"), //Number(Math.round(igtfBFacturaCredito + "e+2") + "e-2"),
        balance.IGTF_pesos_factura_credito =  Number(Math.round(igtfPFacturaCredito + "e+2") + "e-2"),
        balance.IGTF_dolares_factura_credito = Number(Math.round(igtfDFacturaCredito + "e+2") + "e-2"),
        balance.IGTF_bolivares_efectivo_factura_credito = Number(Math.round(igtfBEfectivoFacturaCredito + "e+2") + "e-2");
        balance.IGTF_pesos_efectivo_factura_credito = Number(Math.round(igtfPEfectivoFacturaCredito + "e+2") + "e-2"); 
        balance.IGTF_dolares_efectivo_factura_credito = Number(Math.round(igtfDEfectivoFacturaCredito + "e+2") + "e-2"); 
        balance.IGTF_bolivares_tarjeta_debito_factura_credito = Number(Math.round(igtfBDebitoFacturaCredito + "e+2") + "e-2");
        balance.IGTF_pesos_tarjeta_debito_factura_credito = Number(Math.round(igtfPDebitoFacturaCredito + "e+2") + "e-2"); 
        balance.IGTF_dolares_factura_debito_factura_credito = Number(Math.round(igtfDDebitoFacturaCredito + "e+2") + "e-2");
        /////////////////////////////////////////////////////////////////////////////////////////
        /////////////////SUMATORIA DE IGTF POR FACTURAS A CONTADO////////////////////////////////
        balance.IGTF_bolivares_transferencia_factura_contado = Number(Math.round(igtfBTransferenciaFacturaContado + "e+2") + "e-2");
        balance.IGTF_pesos_transferencia_factura_contado = Number(Math.round(igtfPTransferenciaFacturaContado + "e+2") + "e-2");
        balance.IGTF_dolares_transferencia_factura_contado = Number(Math.round(igtfDTransferenciaFacturaContado + "e+2") + "e-2");
        balance.IGTF_bolivares_tarjeta_credito_factura_contado = Number(Math.round(igtfBCreditoFacturaContado + "e+2") + "e-2");
        balance.IGTF_pesos_tarjeta_credito_factura_contado = Number(Math.round(igtfPCreditoFacturaContado + "e+2") + "e-2");
        balance.IGTF_dolares_tarjeta_credito_factura_contado = Number(Math.round(igtfDCreditoFacturaContado + "e+2") + "e-2");
        balance.IGTF_bolivares_factura_contado = Number(Math.round((igtfBFacturaContado + (((igtfPFacturaContado / pesos) * bolivares) + (igtfDFacturaContado * bolivares))) + "e+2") + "e-2"),
        //balance.IGTF_pesos_factura_contado = Number(Math.round(igtfPFacturaContado + "e+2") + "e-2"),
        //balance.IGTF_dolares_factura_contado = Number(Math.round(igtfDFacturaContado + "e+2") + "e-2"),
        balance.IGTF_bolivares_efectivo_factura_contado = igtfBEfectivoFacturaContado,
        balance.IGTF_pesos_efectivo_factura_contado = Number(Math.round(igtfPEfectivoFacturaContado + "e+2") + "e-2"); 
        balance.IGTF_dolares_efectivo_factura_contado = Number(Math.round(igtfDEfectivoFacturaContado + "e+2") + "e-2"); 
        balance.IGTF_bolivares_tarjeta_debito_factura_contado = Number(Math.round(igtfBDebitoFacturaContado + "e+2") + "e-2");
        balance.IGTF_pesos_tarjeta_debito_factura_contado = Number(Math.round(igtfPDebitoFacturaContado + "e+2") + "e-2"); 
        balance.IGTF_dolares_factura_debito_factura_contado = Number(Math.round(igtfDDebitoFacturaContado + "e+2") + "e-2");
        /////////////////////////////////////////////////////////////////////////////////////////
        ////////////////////////////////SUMATORIAS TOTALES DE IGTF//////////////////////////////
        balance.IGTF_total_bolivares = Number(Math.round((igtfBFacturaContado + igtfBFacturaCredito) + "e+2") + "e-2"),
        balance.IGTF_total_pesos = Number(Math.round((igtfPFacturaContado + igtfPFacturaCredito) + "e+2") + "e-2"),
        balance.IGTF_total_dolares =  Number(Math.round((igtfDFacturaContado + igtfDFacturaCredito) + "e+2") + "e-2"),
        balance.IGTF_total_bolivares_transferencia = Number(Math.round((igtfBTransferenciaFacturaContado + igtfBTransferenciaFacturaCredito) + "e+2") + "e-2");
        balance.IGTF_total_pesos_transferencia = Number(Math.round((igtfPTransferenciaFacturaContado + igtfPTransferenciaFacturaCredito) + "e+2") + "e-2");
        balance.IGTF_total_dolares_transferencia = Number(Math.round((igtfDTransferenciaFacturaContado + igtfDTransferenciaFacturaCredito) + "e+2") + "e-2");
        balance.IGTF_total_bolivares_tarjetas_credito = Number(Math.round((igtfBCreditoFacturaContado + igtfBCreditoFacturaCredito) + "e+2") + "e-2");
        balance.IGTF_total_pesos_tarjetas_credito = Number(Math.round((igtfPCreditoFacturaContado + igtfPCreditoFacturaCredito) + "e+2") + "e-2");
        balance.IGTF_total_dolares_tarjetas_credito = Number(Math.round((igtfDCreditoFacturaContado + igtfDCreditoFacturaCredito) + "e+2") + "e-2");
        balance.IGTF_total_bolivares_tarjetas_debito = Number(Math.round((igtfBDebitoFacturaContado + igtfBDebitoFacturaCredito) + "e+2") + "e-2");
        balance.IGTF_total_pesos_tarjetas_debito = Number(Math.round((igtfPDebitoFacturaContado + igtfPDebitoFacturaCredito) + "e+2") + "e-2");
        balance.IGTF_total_dolares_tarjetas_debito = Number(Math.round((igtfDDebitoFacturaContado + igtfDDebitoFacturaCredito) + "e+2") + "e-2");

        ////////////////////////////SECCION DE RECIBOS/////////////////////////////////
        ////////////////////////////SUMATORIA DE DIVISAS GENERAL DE RECIBOS////////////////////////
        /////////////SUMATORIA DE REGISTROS CONVENIOS////////////////////
        balance.total_recibos_bolivares_registro_convenio = Number(Math.round((totalBolivaresReciboRegistroConvenio) + "e+2") + "e-2");
        balance.total_recibos_pesos_registro_convenio = Number(Math.round((totalPesosReciboRegistroConvenio) + "e+2") + "e-2");
        balance.total_recibos_dolares_registro_convenio = Number(Math.round((totalDolaresReciboRegistroConvenio) + "e+2") + "e-2");
        ////////////SUMATORIA DE FACTURAS A CREDITO//////////////////////
        balance.total_recibos_bolivares_facturas_credito = Number(Math.round((totalBolivaresReciboFacturasCredito) + "e+2") + "e-2");
        balance.total_recibos_pesos_facturas_credito = Number(Math.round((totalPesosReciboFacturasCredito) + "e+2") + "e-2");
        balance.total_recibos_dolares_facturas_credito = Number(Math.round((totalDolaresReciboFacturasCredito) + "e+2") + "e-2");
        /////////////////////NOTAS A CREDITO/////////////////////////////
        balance.notas_a_credito = notasCredito;
        //res.send(facturas);
        res.send(balance);
    }

    async function buscarNotasCreditoCC(notasCredito, sqlNotasCredito) {
        return new Promise((resolve, reject) => {
            connection.query(sqlNotasCredito, function (err, result, fields) {
                if (err) {
                    console.log('ERROR en CheckTemplate', err);
                    res.send('3');
                }
                if(result){
                    notasCredito = result;
                    //console.log("!!!!!!!!!!!!!!!!!", result)
                    resolve(notasCredito);
                    //res.send(result)
                }
            });
        })
    }

    async function buscarFacturas(facturas, sql) {
        return new Promise((resolve, reject) => {
            connection.query(sql, function (err, result, fields) {
                if (err) {
                    console.log('ERROR en CheckTemplate', err);
                    res.send('3');
                }
                if(result){
                    facturas = result;
                    //console.log("!!!!!!!!!!!!!!!!!", result)
                    resolve(facturas);
                    //res.send(result)
                }
            });
        })
    }

    async function buscarRegistrosPagoOutRango(primerId, ultimoId, idUsuario, idUsuario2, idUsuario3) {
        return new Promise((resolve, reject) => {
            let sql = "SELECT tbl_registro_pago.id_registro_pago, CAST(tbl_registro_pago.tipo_registro AS INT) AS tipo_registro, DATE_FORMAT(tbl_registro_pago.fecha_creacion, '%d-%m-%Y %T') AS fecha_creacion, tbl_registro_pago.id_factura, tbl_registro_pago.id_nota_credito, tbl_registro_pago.id_nota_debito, tbl_registro_pago.id_recibo, tbl_registro_pago.id_registro_divisa, tbl_registro_pago.id_tipo_pago, tbl_registro_pago.id_banco, tbl_registro_pago.numero_referencia, tbl_registro_pago.monto, tbl_registro_pago.id_usuario, tbl_tipo_pago.tipo_pago_nombre, tbl_banco.banco_nombre, tbl_registro_divisa.id_divisa, CAST(tbl_registro_pago.igtf_pago AS INT) AS igtf_pago, tbl_divisa.divisa_nombre FROM tbl_registro_pago LEFT JOIN tbl_tipo_pago ON tbl_tipo_pago.id_tipo_pago = tbl_registro_pago.id_tipo_pago LEFT JOIN tbl_banco ON tbl_banco.id_banco = tbl_registro_pago.id_banco LEFT JOIN tbl_registro_divisa ON tbl_registro_pago.id_registro_divisa = tbl_registro_divisa.id_registro_divisa LEFT JOIN tbl_divisa ON tbl_divisa.id_divisa = tbl_registro_divisa.id_divisa WHERE (tbl_registro_pago.id_factura NOT BETWEEN '"+primerId+"' AND '"+ultimoId+"') AND (tbl_registro_pago.fecha_creacion BETWEEN '"+req.body.from+"' AND '"+req.body.to+"') AND (tbl_registro_pago.id_usuario = '"+idUsuario+"' OR tbl_registro_pago.id_usuario = '"+idUsuario2+"' OR tbl_registro_pago.id_usuario = '"+idUsuario3+"')";
            //console.log("-----------------------", sql)
            connection.query(sql, function (err, result, fields) {
                if (err) {
                    console.log('ERROR en CheckTemplate', err);
                    res.send('3');
                }
                if(result){
                    registroPago = result
                    resolve(registroPago);
                    //res.send(result)
                }
            });
        })
    }

    async function buscarRegistrosPagoOutRangoNoFacturas(idUsuario, idUsuario2, idUsuario3) {
        return new Promise((resolve, reject) => {
            let sql = "SELECT tbl_registro_pago.id_registro_pago, CAST(tbl_registro_pago.tipo_registro AS INT) AS tipo_registro, DATE_FORMAT(tbl_registro_pago.fecha_creacion, '%d-%m-%Y %T') AS fecha_creacion, tbl_registro_pago.id_factura, tbl_registro_pago.id_nota_credito, tbl_registro_pago.id_nota_debito, tbl_registro_pago.id_recibo, tbl_registro_pago.id_registro_divisa, tbl_registro_pago.id_tipo_pago, tbl_registro_pago.id_banco, tbl_registro_pago.numero_referencia, tbl_registro_pago.monto, tbl_registro_pago.id_usuario, tbl_tipo_pago.tipo_pago_nombre, tbl_banco.banco_nombre, tbl_registro_divisa.id_divisa, CAST(tbl_registro_pago.igtf_pago AS INT) AS igtf_pago, tbl_divisa.divisa_nombre FROM tbl_registro_pago LEFT JOIN tbl_tipo_pago ON tbl_tipo_pago.id_tipo_pago = tbl_registro_pago.id_tipo_pago LEFT JOIN tbl_banco ON tbl_banco.id_banco = tbl_registro_pago.id_banco LEFT JOIN tbl_registro_divisa ON tbl_registro_pago.id_registro_divisa = tbl_registro_divisa.id_registro_divisa LEFT JOIN tbl_divisa ON tbl_divisa.id_divisa = tbl_registro_divisa.id_divisa WHERE (tbl_registro_pago.fecha_creacion BETWEEN '"+req.body.from+"' AND '"+req.body.to+"') AND (tbl_registro_pago.fecha_creacion BETWEEN '"+req.body.from+"' AND '"+req.body.to+"') AND (tbl_registro_pago.id_usuario = '"+idUsuario+"' OR tbl_registro_pago.id_usuario = '"+idUsuario2+"' OR tbl_registro_pago.id_usuario = '"+idUsuario3+"')";
            //console.log("-----------------------", sql)
            connection.query(sql, function (err, result, fields) {
                if (err) {
                    console.log('ERROR en CheckTemplate', err);
                    res.send('3');
                }
                if(result){
                    registroPago = result
                    resolve(registroPago);
                    //res.send(result)
                }
            });
        })
    }


    async function buscarRegistrosPago(item, registroPago) {
        return new Promise((resolve, reject) => {
            let sql = "SELECT tbl_registro_pago.id_registro_pago, CAST(tbl_registro_pago.tipo_registro AS INT) AS tipo_registro, DATE_FORMAT(tbl_registro_pago.fecha_creacion, '%d-%m-%Y %T') AS fecha_creacion, tbl_registro_pago.id_factura, tbl_registro_pago.id_nota_credito, tbl_registro_pago.id_nota_debito, tbl_registro_pago.id_recibo, tbl_registro_pago.id_registro_divisa, tbl_registro_pago.id_tipo_pago, tbl_registro_pago.id_banco, tbl_registro_pago.numero_referencia, tbl_registro_pago.monto, tbl_tipo_pago.tipo_pago_nombre, tbl_registro_pago.id_usuario, tbl_banco.banco_nombre, tbl_registro_divisa.id_divisa, CAST(tbl_registro_pago.igtf_pago AS INT) AS igtf_pago, tbl_divisa.divisa_nombre FROM tbl_registro_pago LEFT JOIN tbl_tipo_pago ON tbl_tipo_pago.id_tipo_pago = tbl_registro_pago.id_tipo_pago LEFT JOIN tbl_banco ON tbl_banco.id_banco = tbl_registro_pago.id_banco LEFT JOIN tbl_registro_divisa ON tbl_registro_pago.id_registro_divisa = tbl_registro_divisa.id_registro_divisa LEFT JOIN tbl_divisa ON tbl_divisa.id_divisa = tbl_registro_divisa.id_divisa WHERE tbl_registro_pago.id_factura='" + item.id_factura + "' AND (tbl_registro_pago.fecha_creacion BETWEEN '"+req.body.from+"' AND '"+req.body.to+"')";
            connection.query(sql, function (err, result, fields) {
                if (err) {
                    console.log('ERROR en CheckTemplate', err);
                    res.send('3');
                }
                if(result){
                    registroPago = result
                    resolve(registroPago);
                    //res.send(result)
                }
            });
        })
    }
    async function buscarRegistrosPagoRecibo(item, registroPago) {
        return new Promise((resolve, reject) => {
            let sql = "SELECT tbl_registro_pago.id_registro_pago, tbl_registro_pago.id_usuario, DATE_FORMAT(tbl_registro_pago.fecha_creacion, '%d-%m-%Y %T') AS fecha_creacion, tbl_registro_pago.igtf_pago, tbl_registro_pago.id_factura, CAST(tbl_registro_pago.tipo_registro AS INT) AS tipo_registro, tbl_registro_pago.id_nota_credito, tbl_registro_pago.id_nota_debito, tbl_registro_pago.id_recibo, tbl_registro_pago.id_registro_divisa, tbl_registro_pago.id_tipo_pago, tbl_registro_pago.id_banco, tbl_registro_pago.numero_referencia, tbl_registro_pago.monto, tbl_tipo_pago.tipo_pago_nombre, tbl_banco.banco_nombre, tbl_registro_divisa.id_divisa, tbl_divisa.divisa_nombre FROM tbl_registro_pago LEFT JOIN tbl_tipo_pago ON tbl_tipo_pago.id_tipo_pago = tbl_registro_pago.id_tipo_pago LEFT JOIN tbl_banco ON tbl_banco.id_banco = tbl_registro_pago.id_banco LEFT JOIN tbl_registro_divisa ON tbl_registro_pago.id_registro_divisa = tbl_registro_divisa.id_registro_divisa LEFT JOIN tbl_divisa ON tbl_divisa.id_divisa = tbl_registro_divisa.id_divisa WHERE tbl_registro_pago.id_recibo='" + item.id_recibo + "' AND (tbl_registro_pago.fecha_creacion BETWEEN '"+req.body.from+"' AND '"+req.body.to+"')";
            connection.query(sql, function (err, result, fields) {
                if (err) {
                    console.log('ERROR en CheckTemplate', err);
                    res.send('3');
                }
                if(result){
                    registroPago = result
                    resolve(registroPago);
                    //res.send(result)
                }
            });
        })
    }
    async function buscarRegistroDivisas(registros) {
        return new Promise((resolve, reject) => {
            const sql = "SELECT a.tasa_actual, a.id_registro_divisa, a.id_divisa, c.divisa_nombre FROM tbl_registro_divisa a LEFT JOIN tbl_divisa c ON c.id_divisa = a.id_divisa WHERE id_registro_divisa = (SELECT MAX(id_registro_divisa) FROM `tbl_registro_divisa` b WHERE a.id_divisa = b.id_divisa)"
            connection.query(sql, function (err, result, fie) {
                if (err) {
                    console.log('error en la conexion intente de nuevo', err)
                    res.send('3')
                }
                //console.log("EL RESULT!!!!!!!", result)
                registros = result;
                resolve(registros);
            })
        })
    }

    async function buscarRecibos(recibos, sqlRecibos) {
        return new Promise((resolve, reject) => {
            connection.query(sqlRecibos, function (err, result, fie) {
                if (err) {
                    console.log('error en la conexion intente de nuevo', err)
                    res.send('3')
                }else{
                    //console.log("EL RESULT!!!!!!!", result)
                    recibos = result;
                    resolve(recibos);
                }
            })
        })
    }
    
    
}

administracionFiscalCtrl.cierreDeCajaNoFiscal = async(req, res) =>{
    let sql, sqlRecibos
    if(req.body.tipo == 1){
        sql = "SELECT tbl_factura.id_factura, tbl_factura.numero_factura, tbl_factura.orden_trabajo, tbl_factura.total_bolivares, tbl_factura.total_dolares, tbl_factura.total_pesos, tbl_factura.id_usuario, tbl_factura.id_cliente, tbl_factura.id_tipo_factura, tbl_factura.id_estado_factura, DATE_FORMAT(tbl_factura.fecha_creacion_factura, '%d-%m-%Y %T') AS fecha_creacion_factura, DATE_FORMAT(tbl_factura.fecha_cancelacion, '%d-%m-%Y %T') AS fecha_cencelacion_factura, tbl_factura.id_estado_factura, tbl_factura.descuento_bolivares, tbl_factura.descuento_dolares, tbl_factura.descuento_pesos, tbl_factura.anulacion_motivo, tbl_tipo_factura.tipo_factura_nombre, tbl_cliente.cliente_nombre, tbl_cliente.cliente_apellido FROM `tbl_factura` LEFT JOIN tbl_tipo_factura ON tbl_tipo_factura.id_tipo_factura = tbl_factura.id_tipo_factura LEFT JOIN tbl_cliente ON tbl_cliente.id_cliente = tbl_factura.id_cliente WHERE (fecha_creacion_orden_trabajo BETWEEN '"+req.body.from+"' AND '"+req.body.to+"') AND (numero_factura IS NULL)  ORDER BY id_factura ASC"
        sqlRecibos = "SELECT tbl_recibo.id_recibo, tbl_recibo.id_tipo_recibo, tbl_recibo.id_factura, tbl_recibo.numero_recibo, tbl_recibo.fecha_creacion, tbl_recibo.fecha_cancelacion, tbl_recibo.monto_bolivares, tbl_recibo.monto_dolares, tbl_recibo.monto_pesos, tbl_recibo.descuento_bolivares, tbl_recibo.descuento_pesos, tbl_recibo.IGTF_bolivares, tbl_recibo.IGTF_dolares, tbl_recibo.IGTF_pesos, tbl_recibo.tasa_bolivar_dia, tbl_recibo.tasa_pesos_dia, tbl_recibo.id_usuario FROM tbl_recibo WHERE (fecha_creacion BETWEEN '"+req.body.from+"' AND '"+req.body.to+"' AND tbl_recibo.id_factura IS NULL) ORDER BY id_recibo ASC"
    }else if(req.body.tipo == 2){
        sql = "SELECT tbl_factura.id_factura, tbl_factura.numero_factura, tbl_factura.orden_trabajo, tbl_factura.total_bolivares, tbl_factura.total_dolares, tbl_factura.total_pesos, tbl_factura.id_usuario, tbl_factura.id_cliente, tbl_factura.id_tipo_factura, tbl_factura.id_estado_factura, DATE_FORMAT(tbl_factura.fecha_creacion_factura, '%d-%m-%Y %T') AS fecha_creacion_factura, DATE_FORMAT(tbl_factura.fecha_cancelacion, '%d-%m-%Y %T') AS fecha_cencelacion_factura, tbl_factura.id_estado_factura, tbl_factura.descuento_bolivares, tbl_factura.descuento_dolares, tbl_factura.descuento_pesos, tbl_factura.anulacion_motivo, tbl_tipo_factura.tipo_factura_nombre, tbl_cliente.cliente_nombre, tbl_cliente.cliente_apellido FROM `tbl_factura` LEFT JOIN tbl_tipo_factura ON tbl_tipo_factura.id_tipo_factura = tbl_factura.id_tipo_factura LEFT JOIN tbl_cliente ON tbl_cliente.id_cliente = tbl_factura.id_cliente WHERE (fecha_creacion_orden_trabajo BETWEEN '"+req.body.from+"' AND '"+req.body.to+"' AND id_usuario = '"+req.body.id_usuario+"') AND (numero_factura IS NULL) ORDER BY id_factura ASC"
        sqlRecibos = "SELECT tbl_recibo.id_recibo, tbl_recibo.id_tipo_recibo, tbl_recibo.id_factura, tbl_recibo.numero_recibo, tbl_recibo.fecha_creacion, tbl_recibo.fecha_cancelacion, tbl_recibo.monto_bolivares, tbl_recibo.monto_dolares, tbl_recibo.monto_pesos, tbl_recibo.descuento_bolivares, tbl_recibo.descuento_pesos, tbl_recibo.IGTF_bolivares, tbl_recibo.IGTF_dolares, tbl_recibo.IGTF_pesos, tbl_recibo.tasa_bolivar_dia, tbl_recibo.tasa_pesos_dia, tbl_recibo.id_usuario FROM tbl_recibo WHERE (fecha_creacion BETWEEN '"+req.body.from+"' AND '"+req.body.to+"' AND id_usuario = '"+req.body.id_usuario+"' AND tbl_recibo.id_factura IS NULL) ORDER BY id_recibo ASC"
    }else if(req.body.tipo == 3){
        sql = "SELECT tbl_factura.id_factura, tbl_factura.numero_factura, tbl_factura.orden_trabajo, tbl_factura.total_bolivares, tbl_factura.total_dolares, tbl_factura.total_pesos, tbl_factura.id_usuario, tbl_factura.id_cliente, tbl_factura.id_tipo_factura, tbl_factura.id_estado_factura, DATE_FORMAT(tbl_factura.fecha_creacion_factura, '%d-%m-%Y %T') AS fecha_creacion_factura, DATE_FORMAT(tbl_factura.fecha_cancelacion, '%d-%m-%Y %T') AS fecha_cencelacion_factura, tbl_factura.id_estado_factura, tbl_factura.descuento_bolivares, tbl_factura.descuento_dolares, tbl_factura.descuento_pesos, tbl_factura.anulacion_motivo, tbl_tipo_factura.tipo_factura_nombre, tbl_cliente.cliente_nombre, tbl_cliente.cliente_apellido FROM `tbl_factura` LEFT JOIN tbl_tipo_factura ON tbl_tipo_factura.id_tipo_factura = tbl_factura.id_tipo_factura LEFT JOIN tbl_cliente ON tbl_cliente.id_cliente = tbl_factura.id_cliente WHERE (fecha_creacion_orden_trabajo BETWEEN '"+req.body.from+"' AND '"+req.body.to+"') AND (id_usuario = '"+req.body.id_usuario+"' OR id_usuario = '"+req.body.id_usuario2+"') AND (numero_factura IS NULL) ORDER BY id_factura ASC"
        sqlRecibos = "SELECT tbl_recibo.id_recibo, tbl_recibo.id_tipo_recibo, tbl_recibo.id_factura, tbl_recibo.numero_recibo, tbl_recibo.fecha_creacion, tbl_recibo.fecha_cancelacion, tbl_recibo.monto_bolivares, tbl_recibo.monto_dolares, tbl_recibo.monto_pesos, tbl_recibo.descuento_bolivares, tbl_recibo.descuento_pesos, tbl_recibo.IGTF_bolivares, tbl_recibo.IGTF_dolares, tbl_recibo.IGTF_pesos, tbl_recibo.tasa_bolivar_dia, tbl_recibo.tasa_pesos_dia, tbl_recibo.id_usuario FROM tbl_recibo WHERE (fecha_creacion BETWEEN '"+req.body.from+"' AND '"+req.body.to+"' AND (id_usuario = '"+req.body.id_usuario+"' OR id_usuario = '"+req.body.id_usuario2+"' AND tbl_recibo.id_factura IS NULL)) ORDER BY id_recibo ASC"
    }else if(req.body.tipo == 4){
        sql = "SELECT tbl_factura.id_factura, tbl_factura.numero_factura, tbl_factura.orden_trabajo, tbl_factura.total_bolivares, tbl_factura.total_dolares, tbl_factura.total_pesos, tbl_factura.id_usuario, tbl_factura.id_cliente, tbl_factura.id_tipo_factura, tbl_factura.id_estado_factura, DATE_FORMAT(tbl_factura.fecha_creacion_factura, '%d-%m-%Y %T') AS fecha_creacion_factura, DATE_FORMAT(tbl_factura.fecha_cancelacion, '%d-%m-%Y %T') AS fecha_cencelacion_factura, tbl_factura.id_estado_factura, tbl_factura.descuento_bolivares, tbl_factura.descuento_dolares, tbl_factura.descuento_pesos, tbl_factura.anulacion_motivo, tbl_tipo_factura.tipo_factura_nombre, tbl_cliente.cliente_nombre, tbl_cliente.cliente_apellido FROM `tbl_factura` LEFT JOIN tbl_tipo_factura ON tbl_tipo_factura.id_tipo_factura = tbl_factura.id_tipo_factura LEFT JOIN tbl_cliente ON tbl_cliente.id_cliente = tbl_factura.id_cliente WHERE (fecha_creacion_orden_trabajo BETWEEN '"+req.body.from+"' AND '"+req.body.to+"') AND (id_usuario = '"+req.body.id_usuario+"' OR id_usuario = '"+req.body.id_usuario2+"' OR id_usuario = '"+req.body.id_usuario3+"') AND (numero_factura IS NULL)  ORDER BY id_factura ASC"
        sqlRecibos = "SELECT tbl_recibo.id_recibo, tbl_recibo.id_tipo_recibo, tbl_recibo.id_factura, tbl_recibo.numero_recibo, tbl_recibo.fecha_creacion, tbl_recibo.fecha_cancelacion, tbl_recibo.monto_bolivares, tbl_recibo.monto_dolares, tbl_recibo.monto_pesos, tbl_recibo.descuento_bolivares, tbl_recibo.descuento_pesos, tbl_recibo.IGTF_bolivares, tbl_recibo.IGTF_dolares, tbl_recibo.IGTF_pesos, tbl_recibo.tasa_bolivar_dia, tbl_recibo.tasa_pesos_dia, tbl_recibo.id_usuario FROM tbl_recibo WHERE (fecha_creacion BETWEEN '"+req.body.from+"' AND '"+req.body.to+"') AND (id_usuario = '"+req.body.id_usuario+"' OR id_usuario = '"+req.body.id_usuario2+"' OR id_usuario = '"+req.body.id_usuario3+"' AND tbl_recibo.id_factura IS NULL) ORDER BY id_recibo ASC"
    }
    let sqlNotasCredito = "SELECT tbl_nota_credito.id_nota_credito, tbl_nota_credito.nota_credito_numero, tbl_nota_credito.id_factura, DATE_FORMAT(tbl_nota_credito.fecha_emision, '%d-%m-%Y %T') AS fecha_emision, tbl_nota_credito.monto_bolivares, tbl_nota_credito.monto_pesos, tbl_nota_credito.monto_dolares, tbl_nota_credito.concepto, tbl_factura.numero_factura, tbl_factura.id_factura, tbl_cliente.cliente_nombre, tbl_cliente.cliente_apellido, tbl_cliente.cedula_RIF FROM tbl_nota_credito LEFT JOIN tbl_factura ON tbl_factura.id_factura = tbl_nota_credito.id_factura LEFT JOIN tbl_cliente ON tbl_factura.id_cliente = tbl_cliente.id_cliente WHERE (fecha_emision BETWEEN '"+req.body.from+"' AND '"+req.body.to+"') ORDER BY tbl_nota_credito.id_nota_credito ASC"
    let facturas;
    let notasCredito;
    let registroPago = [];
    let i = 0;
    let balance = {};
    let efectivoD = 0, efectivoP = 0, efectivoB = 0, zelle = 0, paypal = 0, bancolombia = 0, contadoB = 0, contadoP = 0, contadoD = 0, contadoBOrdenTrabajo = 0, contadoPOrdenTrabajo = 0, contadoDOrdenTrabajo = 0, creditoB = 0, creditoP =0, creditoD = 0, creditoBConvenio = 0, creditoPConvenio = 0, creditoDConvenio = 0, cantidadFacturaCreditoConvenio = 0, cantidadFacturaCreditoParticular = 0, creditoBParticular = 0, creditoPParticular = 0, creditoDParticular = 0, anuladoB = 0, anuladoP = 0, anuladoD = 0, NC = 0, transferencia = 0;
    let provincial = 0, transPronvincial = 0, sofitasa = 0, transSofitasa = 0, mercantil = 0, transMercantil = 0, banesco = 0, transBanesco = 0, venezuela = 0, transVenezuela = 0, trans100Banco = 0;
    let debitoProvincial = 0, creditoProvincial = 0, creditoSofitasa = 0, debitoSofitasa = 0, creditoMercantil = 0, debitoMercantil = 0, creditoBanesco = 0, debitoBanesco = 0, debitoVenezuela = 0, creditoVenezuela = 0, debito100banco = 0, credito100Banco = 0;
    let ttProvincial = 0, ttSofitasa = 0, ttMercantil = 0, ttBanesco = 0;
    let descuentoP = 0, descuentoB = 0, descuentoD = 0, cantidadFacturasDescuentos = 0;
    let abonadoD = 0, abonadoP = 0, abonadoB = 0;
    let facturaPRI, facturaULT;
    let detallesAnuladas = [];
    let detallesDescontadas = [];

    //////////////////SUMATORIA DE IGTF TOTALES/////////////////////////////
    let igtfBTransferencia= 0, igtfPTransferencia= 0, igtfDTransferencia= 0, igtfBCredito = 0, igtfPCredito = 0, igtfDCredito = 0, igtfB = 0, igtfP = 0, igtfD = 0;
    let igtfBEfectivo= 0, igtfPEfectivo= 0, igtfDEfectivo= 0, igtfBDebito= 0, igtfPDebito= 0, igtfDDebito= 0
    ///////////////////////////////////////////////////////////////////////
    /////////////////SUMATORIA DE IGTF POR FACTURAS A CREDITO////////////////////////////////
    let igtfBTransferenciaFacturaCredito= 0, igtfPTransferenciaFacturaCredito= 0, igtfDTransferenciaFacturaCredito= 0, igtfBCreditoFacturaCredito = 0, igtfPCreditoFacturaCredito = 0, igtfDCreditoFacturaCredito = 0, igtfBFacturaCredito = 0, igtfPFacturaCredito = 0, igtfDFacturaCredito = 0;
    let igtfBEfectivoFacturaCredito= 0, igtfPEfectivoFacturaCredito= 0, igtfDEfectivoFacturaCredito= 0, igtfBDebitoFacturaCredito= 0, igtfPDebitoFacturaCredito= 0, igtfDDebitoFacturaCredito= 0
    /////////////////////////////////////////////////////////////////////////////////////////
    /////////////////SUMATORIA DE IGTF POR FACTURAS A CONTADO////////////////////////////////
    let igtfBTransferenciaFacturaContado= 0, igtfPTransferenciaFacturaContado= 0, igtfDTransferenciaFacturaContado= 0, igtfBCreditoFacturaContado = 0, igtfPCreditoFacturaContado = 0, igtfDCreditoFacturaContado = 0, igtfBFacturaContado = 0, igtfPFacturaContado = 0, igtfDFacturaContado = 0;
    let igtfBEfectivoFacturaContado= 0, igtfPEfectivoFacturaContado= 0, igtfDEfectivoFacturaContado= 0, igtfBDebitoFacturaContado= 0, igtfPDebitoFacturaContado= 0, igtfDDebitoFacturaContado= 0
    /////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////SUMATORIA DE IGTF POR PAYPAL Y ZELLE////////////////////////////
    let igtfPaypal = 0, igtfZelle = 0;
    /////////////////////////////////////////////////////////////////////////////////////////
    let vueltosB= 0, vueltosP= 0, vueltosD= 0;

    //////////////////////////SUMATORIA DE BOLIVARES, PESOS Y DOLARES DE LOS RECIBOS///////////////////////////
    let pesosR = 0, dolaresR = 0, bolivaresR = 0;

    //////////////////////////////////////////////////PRIMER RECUADRO FALTANTE////////////////////////////////////////
    let monto_total_facturas_pesos = 0, monto_total_facturas_dolares = 0, monto_total_facturas_bolivares = 0;
    let descuento_pesos_factura_contado = 0, descuento_dolares_factura_contado = 0, descuento_bolivares_factura_contado = 0;
    let descuento_pesos_factura_credito = 0, descuento_dolares_factura_credito = 0, descuento_bolivares_factura_credito = 0;
    let descuento_pesos_factura_anulado = 0, descuento_dolares_factura_anulado = 0, descuento_bolivares_factura_anulado = 0;
    let cantidad_facturas_contado = 0, cantidad_facturas_credito = 0, cantidad_facturas_anuladas = 0;
    let sumatoria_cantidad_credito_contado = 0;
    let registrosDivisa;

    ///////////////////////////////////////////////SEGUNDO RECUADRO FALTANTE///////////////////////////////////////////
    let total_transBancos_factura_contado = 0, trans100Banco_factura_contado = 0, transBanesco_factura_contado = 0, transProvincial_factura_contado = 0, transSofitasa_factura_contado = 0, transMercantil_factura_contado = 0, transVenezuela_factura_contado = 0, bancolombiaFacturaContado = 0, paypalFacturaContado = 0, zelleFacturaContado = 0;
    let total_debitoBancos_factura_contado = 0, debito100BancoContado = 0, debitoBanescoContado = 0, debitoProvincialContado = 0, debitoMercantilContado = 0, debitoVenezuelaContado = 0, debitoSofitasaContado = 0;
    let total_creditoBancos_factura_contado = 0, credito100BancoContado = 0, creditoBanescoContado = 0, creditoProvincialContado = 0, creditoMercantilContado = 0, creditoVenezuelaContado = 0, creditoSofitasaContado = 0;
    let efectivoPContado = 0, efectivoBContado = 0, efectivoDContado = 0;

    /////////////////////////////////////////////////TERCER RECUADRO///////////////////////////////////////////////////
    let total_transBancos_factura_credito = 0, trans100Banco_factura_credito = 0, transBanesco_factura_credito = 0, transProvincial_factura_credito = 0, transSofitasa_factura_credito = 0, transMercantil_factura_credito = 0, transVenezuela_factura_credito = 0, bancolombiaFacturaCredito = 0, paypalFacturaCredito = 0, zelleFacturaCredito = 0;
    let total_debitoBancos_factura_credito = 0, debito100BancoCredito = 0, debitoBanescoCredito = 0, debitoProvincialCredito = 0, debitoMercantilCredito = 0, debitoVenezuelaCredito = 0, debitoSofitasaCredito = 0;
    let total_creditoBancos_factura_credito = 0, credito100BancoCredito = 0, creditoBanescoCredito = 0, creditoProvincialCredito = 0, creditoMercantilCredito = 0, creditoVenezuelaCredito = 0, creditoSofitasaCredito = 0;
    let efectivoPCredito = 0, efectivoBCredito = 0, efectivoDCredito = 0;

    //////////////////////////////////////////EXTRAS//////////////////////////////////////////////////
    //DE ORDENES DE TRABAJO:
    //el total en bs, dolares, y pesos
    //la cantidad total de ordenes de trabajo
    let totalOrdenesTrabajo = 0, totalBsOrdenesTrabajo = 0, totalPesosOrdenesTrabajo = 0, totalDolaresOrdenesTrabajo = 0;

    ///////////////////////////////////RECIBOS Y DETALLES RECIBOS////////////////////////////////////////
    /////////main///////
    let recibos, registroPagoRecibo;
    /////clasificacion de sumatoria de montos de recibo//////
    let totalBolivaresReciboRegistroConvenio = 0, totalPesosReciboRegistroConvenio = 0, totalDolaresReciboRegistroConvenio = 0;
    let totalBolivaresReciboFacturasCredito = 0, totalPesosReciboFacturasCredito = 0, totalDolaresReciboFacturasCredito = 0;

    ////////////////////////////////ABONOS PARA FACTURAS A CREDITO/////////////////////////////
    let abono_bolivares_efectivo = 0;
    let abono_dolares_efectivo = 0;
    let abono_pesos_efectivo = 0;
    //console.log("!!!!!!!!!!!!!!!!!!!!!!", recibos)

    registrosDivisa = await buscarRegistroDivisas(registrosDivisa);
    //console.log("!!!!!!!!!!!!!!!!!!!!!!!", registrosDivisa)
    let dolares, pesos, bolivares;
    for(const divisa of registrosDivisa){
        if(divisa.divisa_nombre == 'DOLARES'){
            dolares = divisa.tasa_actual;
        }else
        if(divisa.divisa_nombre == 'BOLIVARES'){
            bolivares = divisa.tasa_actual;
        }else
        if(divisa.divisa_nombre == 'PESOS'){
            pesos = divisa.tasa_actual;
        }
    }
    //console.log("BOLIVARES?", bolivares, dolares, pesos)
    
    notasCredito = await buscarNotasCreditoCC(notasCredito, sqlNotasCredito);
    facturas = await buscarFacturas(facturas, sql)
    //console.log("UUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU", facturas.length)
    if(facturas.length == 0){
        res.send("0")
    }else{
        for(const item of facturas){
            registroPago = await buscarRegistrosPago(item, registroPago);
            facturas[i].registro_pagos = registroPago;
            i++
        }
        i = 0;
        //res.send(facturas)
        recibos = await buscarRecibos(recibos, sqlRecibos)
        //console.log("??????", recibos)

            for(const item of recibos){
                registroPagoRecibo = await buscarRegistrosPagoRecibo(item, registroPagoRecibo);
                recibos[i].registros_pago = registroPagoRecibo;
                i++;
            }
        
        //console.log("[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[", facturas)
        let abonosOutRango
        //console.log("!!!!!!!!!!!!!!!!!!!!!!", recibos, "HELICOPTER HELICOPTER", abonosOutRango)
        //console.log("!!!!!!!!!!!!!!!!!!!!!!", recibos)

        //////////////////////////SUMAR LOS ABONOS DE PAGOS DE FACTURA OUT OF RANGO////////////////////////
        if(facturas.length > 0){
            abonosOutRango = await buscarRegistrosPagoOutRango(facturas[0].id_factura, facturas[facturas.length - 1].id_factura, req.body.id_usuario, req.body.id_usuario2, req.body.id_usuario3)
            if(abonosOutRango.length > 0){
                //console.log("WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW", abonosOutRango)
                for(const abono of abonosOutRango){
                    ///////////////////////////////////IGTF DE ABONOS OUT OF RANGO////////////////////////////////////////
                    if(abono.igtf_pago == 1){
                        if(abono.id_divisa == 1){
                            igtfPFacturaCredito = igtfPFacturaCredito + abono.monto;
                        }
                        if(abono.id_divisa == 2){
                            igtfDFacturaCredito = igtfDFacturaCredito + abono.monto;
                        }
                        if(abono.id_divisa == 3){
                            igtfBFacturaCredito = igtfBFacturaCredito + abono.monto;
                        }
                        ////////////////////////////IGTF EN TRANSFERENCIA//////////////////////////////
                        if(abono.id_tipo_pago == 1 && abono.igtf_pago == 1){
                            ////////////////PESOS//////////////
                            if(abono.id_divisa == 1){
                                igtfPTransferenciaFacturaCredito = igtfPTransferenciaFacturaCredito + abono.monto;
                            } 
                            if(abono.id_divisa == 2){
                                igtfDTransferenciaFacturaCredito = igtfDTransferenciaFacturaCredito + abono.monto;
                            } 
                            if(abono.id_divisa == 3){
                                igtfBTransferenciaFacturaCredito = igtfBTransferenciaFacturaCredito + abono.monto;
                            } 
                        }
                        ///////////////////////////////////////////////////////////////////////////////
                        //////////////////////////EFECTIVO////////////////////////////////////////////
                        if(abono.id_tipo_pago == 2 && abono.igtf_pago == 1){
                            ////////////////PESOS//////////////
                            if(abono.id_divisa == 1){
                                igtfPEfectivoFacturaCredito = igtfPEfectivoFacturaCredito + abono.monto;
                            } 
                            if(abono.id_divisa == 2){
                                igtfDEfectivoFacturaCredito = igtfDEfectivoFacturaCredito + abono.monto;
                            } 
                            if(abono.id_divisa == 3){
                                igtfBEfectivoFacturaCredito = igtfBEfectivoFacturaCredito + abono.monto;
                            } 
                        }
                        if(abono.id_tipo_pago == 3 && abono.igtf_pago == 1){
                            if(abono.id_divisa == 1){
                                igtfPDebitoFacturaCredito = igtfPDebitoFacturaCredito + abono.monto;
                            } 
                            if(abono.id_divisa == 2){
                                igtfDDebitoFacturaCredito = igtfDDebitoFacturaCredito + abono.monto;
                            } 
                            if(abono.id_divisa == 3){
                                igtfBDebitoFacturaCredito = igtfBDebitoFacturaCredito + abono.monto;
                            } 
                        }
                        if(abono.id_tipo_pago == 4 && abono.igtf_pago == 1){
                            if(abono.id_divisa == 1){
                                igtfPCreditoFacturaCredito = igtfPCreditoFacturaCredito + abono.monto;
                            } 
                            if(abono.id_divisa == 2){
                                igtfDCreditoFacturaCredito = igtfDCreditoFacturaCredito + abono.monto;
                            } 
                            if(abono.id_divisa == 3){
                                igtfBCreditoFacturaCredito = igtfBCreditoFacturaCredito + abono.monto;
                            } 
                        }
                    }
                    ////////////////////////////////////////////////////////////////////////////////////////////////////    
                    //console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<")
                    if(abono.igtf_pago == 0 && abono.tipo_registro == 0 && abono.igtf_pago == 0){
                                ///////ABONO PESOS//////
                                if(abono.id_divisa == 1){
                                    if(abono.tipo_registro == 0){
                                        abonadoP = abonadoP + abono.monto
                                        creditoP = creditoP + abono.monto
                                    }else{
                                        abonadoP = abonadoP - abono.monto
                                        creditoP = creditoP - abono.monto
                                    }
                                }else if(abono.id_divisa == 2){
                                //////ABONO DOLARES/////
                                    if(abono.tipo_registro == 0){
                                        abonadoD = abonadoD + abono.monto
                                        creditoD = creditoD + abono.monto
                                    }else{
                                        abonadoD = abonadoD - abono.monto
                                        creditoD = creditoD - abono.monto
                                    }
                                }else if(abono.id_divisa == 3){
                                //////ABONO BOLIVARES////
                                    if(abono.tipo_registro == 0){
                                        abonadoB = abonadoB + abono.monto
                                        creditoB = creditoB + abono.monto
                                    }else{
                                        abonadoB = abonadoB - abono.monto
                                        creditoB = creditoB - abono.monto
                                    }
                                }
                    }
                    ///////////////////////////INGRESO POR EFECTIVO FACTURAS A CREDITO////////////////////////////////
                    if(abono.id_usuario == req.body.id_usuario || abono.id_usuario == req.body.id_usuario2 || abono.id_usuario == req.body.id_usuario3){
                        if(abono.id_tipo_pago == 2 /*&& abono.igtf_pago == 0*/ && abono.tipo_registro == 0){
                            ///////EFECTIVO PESOS//////
                            if(abono.id_divisa == 1){
                                efectivoPCredito = efectivoPCredito + abono.monto
                            }else if(abono.id_divisa == 2){
                            //////EFECITVO DOLAEES/////
                                efectivoDCredito = efectivoDCredito + abono.monto
                            }else if(abono.id_divisa == 3){
                            //////EFECTIVO BOLIVARES////
                                efectivoBCredito = efectivoBCredito + abono.monto
                            }
                        }
                        ////////////////////////INGRESOS EN TRANSFERENCIAS EN BOLIVARES Y OTROS EN FACTURAS A CREDITO//////////////////
                        if(abono.id_tipo_pago == 1 && abono.igtf_pago == 0 && abono.tipo_registro == 0){
                            if(abono.id_banco == 1){
                            transBanesco_factura_credito = transBanesco_factura_credito + abono.monto;
                            /////////PROVINCIAL////////
                            }else if(abono.id_banco == 2){
                                transProvincial_factura_credito = transProvincial_factura_credito + abono.monto;
                            }else if(abono.id_banco == 3){
                            /////////MERCANTIL////////
                            transMercantil_factura_credito =transMercantil_factura_credito + abono.monto;
                            }else if(abono.id_banco == 4){
                            /////////VENEZUELA////////
                                transVenezuela_factura_credito = transVenezuela_factura_credito + abono.monto;
                            }else if(abono.id_banco == 5){
                            /////////SOFITASA////////
                                transSofitasa_factura_credito = transSofitasa_factura_credito + abono.monto;
                            }else if(abono.id_banco == 6){
                                /////////ZELLE////////
                                    zelleFacturaCredito = zelleFacturaCredito + abono.monto;
                            }else if(abono.id_banco == 7){
                                /////////BANCOLOMBIA////////
                                    bancolombiaFacturaCredito = bancolombiaFacturaCredito + abono.monto;
                            }else if(abono.id_banco == 8){
                                /////////paypal////////
                                    paypalFacturaCredito = paypalFacturaCredito + abono.monto;
                            }else if(abono.id_banco == 9){
                                /////////paypal////////
                                    trans100Banco_factura_credito = trans100Banco_factura_credito + abono.monto;
                            }
                        }
                        //console.log("KKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK", transSofitasa_factura_credito)
                        /////////////////////////////INGRESOS TARJETAS DE DEBITO FACTURAS A CREDITO///////////////////////////
                        if(abono.id_tipo_pago == 3 && abono.igtf_pago == 0 && abono.tipo_registro == 0){
                            /////////BANESCO////////
                            if(abono.id_banco == 1){
                                debitoBanescoCredito = debitoBanescoCredito + abono.monto;
                            /////////PROVINCIAL////////
                            }else if(abono.id_banco == 2){
                                debitoProvincialCredito = debitoProvincialCredito + abono.monto;
                            }else if(abono.id_banco == 3){
                            /////////MERCANTIL////////
                                debitoMercantilCredito = debitoMercantilCredito + abono.monto;
                            }else if(abono.id_banco == 4){
                            /////////VENEZUELA////////
                                debitoVenezuelaCredito = debitoVenezuelaCredito + abono.monto;
                            }else if(abono.id_banco == 5){
                            /////////SOFITASA////////
                                debitoSofitasaCredito = debitoSofitasaCredito + abono.monto;
                            }else if(abono.id_banco == 9){
                                /////////SOFITASA////////
                                    debito100BancoCredito = debito100BancoCredito + abono.monto;
                                }
                                    
                        }
                        ///////////////////////////INGRESOS TARJETAS DE CREDITO FACTURAS A CREDITO////////////////////////////
                        if(abono.id_tipo_pago == 4 && abono.igtf_pago == 0 && abono.tipo_registro == 0){
                            /////////BANESCO////////
                            if(abono.id_banco == 1){
                                creditoBanescoCredito = creditoBanescoCredito + abono.monto;
                            /////////PROVINCIAL////////
                            }else if(abono.id_banco == 2){
                                creditoProvincialCredito = creditoProvincialCredito + abono.monto;
                            }else if(abono.id_banco == 3){
                            /////////MERCANTIL////////
                                creditoMercantilCredito = creditoMercantilCredito + abono.monto;
                            }else if(abono.id_banco == 4){
                            /////////VENEZUELA////////
                                creditoVenezuelaCredito = creditoVenezuelaCredito + abono.monto;
                            }else if(abono.id_banco == 5){
                            /////////SOFITASA////////
                                creditoSofitasaCredito = creditoSofitasaCredito + abono.monto;
                            }else if(abono.id_banco == 5){
                                /////////100% banco////////
                                    credito100BancoCredito = credito100BancoCredito + abono.monto;
                            }
                        }
                    }
                }
            }
        }else if(facturas.length == 0){
            abonosOutRango = await buscarRegistrosPagoOutRangoNoFacturas(facturas[0].id_factura, facturas[facturas.length - 1].id_factura, req.body.id_usuario, req.body.id_usuario2, req.body.id_usuario3)
                //console.log("WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW", abonosOutRango)
                for(const abono of abonosOutRango){
                    ///////////////////////////////////IGTF DE ABONOS OUT OF RANGO////////////////////////////////////////
                    if(abono.igtf_pago == 1){
                        if(abono.id_divisa == 1){
                            igtfPFacturaCredito = igtfPFacturaCredito + abono.monto;
                        }
                        if(abono.id_divisa == 2){
                            igtfDFacturaCredito = igtfDFacturaCredito + abono.monto;
                        }
                        if(abono.id_divisa == 3){
                            igtfBFacturaCredito = igtfBFacturaCredito + abono.monto;
                        }
                        ////////////////////////////IGTF EN TRANSFERENCIA//////////////////////////////
                        if(abono.id_tipo_pago == 1 && abono.igtf_pago == 1){
                            ////////////////PESOS//////////////
                            if(abono.id_divisa == 1){
                                igtfPTransferenciaFacturaCredito = igtfPTransferenciaFacturaCredito + abono.monto;
                            } 
                            if(abono.id_divisa == 2){
                                igtfDTransferenciaFacturaCredito = igtfDTransferenciaFacturaCredito + abono.monto;
                            } 
                            if(abono.id_divisa == 3){
                                igtfBTransferenciaFacturaCredito = igtfBTransferenciaFacturaCredito + abono.monto;
                            } 
                        }
                        ///////////////////////////////////////////////////////////////////////////////
                        //////////////////////////EFECTIVO////////////////////////////////////////////
                        if(abono.id_tipo_pago == 2 && abono.igtf_pago == 1){
                            ////////////////PESOS//////////////
                            if(abono.id_divisa == 1){
                                igtfPEfectivoFacturaCredito = igtfPEfectivoFacturaCredito + abono.monto;
                            } 
                            if(abono.id_divisa == 2){
                                igtfDEfectivoFacturaCredito = igtfDEfectivoFacturaCredito + abono.monto;
                            } 
                            if(abono.id_divisa == 3){
                                igtfBEfectivoFacturaCredito = igtfBEfectivoFacturaCredito + abono.monto;
                            } 
                        }
                        if(abono.id_tipo_pago == 3 && abono.igtf_pago == 1){
                            if(abono.id_divisa == 1){
                                igtfPDebitoFacturaCredito = igtfPDebitoFacturaCredito + abono.monto;
                            } 
                            if(abono.id_divisa == 2){
                                igtfDDebitoFacturaCredito = igtfDDebitoFacturaCredito + abono.monto;
                            } 
                            if(abono.id_divisa == 3){
                                igtfBDebitoFacturaCredito = igtfBDebitoFacturaCredito + abono.monto;
                            } 
                        }
                        if(abono.id_tipo_pago == 4 && abono.igtf_pago == 1){
                            if(abono.id_divisa == 1){
                                igtfPCreditoFacturaCredito = igtfPCreditoFacturaCredito + abono.monto;
                            } 
                            if(abono.id_divisa == 2){
                                igtfDCreditoFacturaCredito = igtfDCreditoFacturaCredito + abono.monto;
                            } 
                            if(abono.id_divisa == 3){
                                igtfBCreditoFacturaCredito = igtfBCreditoFacturaCredito + abono.monto;
                            } 
                        }
                    }
                    ////////////////////////////////////////////////////////////////////////////////////////////////////    
                    //console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<")
                    if(abono.igtf_pago == 0 && abono.tipo_registro == 0 && abono.igtf_pago == 0){
                                ///////ABONO PESOS//////
                                if(abono.id_divisa == 1){
                                    if(abono.tipo_registro == 0){
                                        abonadoP = abonadoP + abono.monto
                                        creditoP = creditoP + abono.monto
                                    }else{
                                        abonadoP = abonadoP - abono.monto
                                        creditoP = creditoP - abono.monto
                                    }
                                }else if(abono.id_divisa == 2){
                                //////ABONO DOLARES/////
                                    if(abono.tipo_registro == 0){
                                        abonadoD = abonadoD + abono.monto
                                        creditoD = creditoD + abono.monto
                                    }else{
                                        abonadoD = abonadoD - abono.monto
                                        creditoD = creditoD - abono.monto
                                    }
                                }else if(abono.id_divisa == 3){
                                //////ABONO BOLIVARES////
                                    if(abono.tipo_registro == 0){
                                        abonadoB = abonadoB + abono.monto
                                        creditoB = creditoB + abono.monto
                                    }else{
                                        abonadoB = abonadoB - abono.monto
                                        creditoB = creditoB - abono.monto
                                    }
                                }
                    }
                    ///////////////////////////INGRESO POR EFECTIVO FACTURAS A CREDITO////////////////////////////////
                    if(abono.id_usuario == req.body.id_usuario || abono.id_usuario == req.body.id_usuario2 || abono.id_usuario == req.body.id_usuario3){
                        if(abono.id_tipo_pago == 2 /*&& abono.igtf_pago == 0*/ && abono.tipo_registro == 0){
                            ///////EFECTIVO PESOS//////
                            if(abono.id_divisa == 1){
                                efectivoPCredito = efectivoPCredito + abono.monto
                            }else if(abono.id_divisa == 2){
                            //////EFECITVO DOLAEES/////
                                efectivoDCredito = efectivoDCredito + abono.monto
                            }else if(abono.id_divisa == 3){
                            //////EFECTIVO BOLIVARES////
                                efectivoBCredito = efectivoBCredito + abono.monto
                            }
                        }
                        ////////////////////////INGRESOS EN TRANSFERENCIAS EN BOLIVARES Y OTROS EN FACTURAS A CREDITO//////////////////
                        if(abono.id_tipo_pago == 1 && abono.igtf_pago == 0 && abono.tipo_registro == 0){
                            if(abono.id_banco == 1){
                            transBanesco_factura_credito = transBanesco_factura_credito + abono.monto;
                            /////////PROVINCIAL////////
                            }else if(abono.id_banco == 2){
                                transProvincial_factura_credito = transProvincial_factura_credito + abono.monto;
                            }else if(abono.id_banco == 3){
                            /////////MERCANTIL////////
                            transMercantil_factura_credito =transMercantil_factura_credito + abono.monto;
                            }else if(abono.id_banco == 4){
                            /////////VENEZUELA////////
                                transVenezuela_factura_credito = transVenezuela_factura_credito + abono.monto;
                            }else if(abono.id_banco == 5){
                            /////////SOFITASA////////
                                transSofitasa_factura_credito = transSofitasa_factura_credito + abono.monto;
                            }else if(abono.id_banco == 6){
                                /////////ZELLE////////
                                    zelleFacturaCredito = zelleFacturaCredito + abono.monto;
                            }else if(abono.id_banco == 7){
                                /////////BANCOLOMBIA////////
                                    bancolombiaFacturaCredito = bancolombiaFacturaCredito + abono.monto;
                            }else if(abono.id_banco == 8){
                                /////////paypal////////
                                    paypalFacturaCredito = paypalFacturaCredito + abono.monto;
                            }else if(abono.id_banco == 9){
                                /////////paypal////////
                                    trans100Banco_factura_credito = trans100Banco_factura_credito + abono.monto;
                            }
                        }
                        //console.log("KKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK", transSofitasa_factura_credito)
                        /////////////////////////////INGRESOS TARJETAS DE DEBITO FACTURAS A CREDITO///////////////////////////
                        if(abono.id_tipo_pago == 3 && abono.igtf_pago == 0 && abono.tipo_registro == 0){
                            /////////BANESCO////////
                            if(abono.id_banco == 1){
                                debitoBanescoCredito = debitoBanescoCredito + abono.monto;
                            /////////PROVINCIAL////////
                            }else if(abono.id_banco == 2){
                                debitoProvincialCredito = debitoProvincialCredito + abono.monto;
                            }else if(abono.id_banco == 3){
                            /////////MERCANTIL////////
                                debitoMercantilCredito = debitoMercantilCredito + abono.monto;
                            }else if(abono.id_banco == 4){
                            /////////VENEZUELA////////
                                debitoVenezuelaCredito = debitoVenezuelaCredito + abono.monto;
                            }else if(abono.id_banco == 5){
                            /////////SOFITASA////////
                                debitoSofitasaCredito = debitoSofitasaCredito + abono.monto;
                            }else if(abono.id_banco == 9){
                                /////////SOFITASA////////
                                    debito100BancoCredito = debito100BancoCredito + abono.monto;
                                }
                                    
                        }
                        ///////////////////////////INGRESOS TARJETAS DE CREDITO FACTURAS A CREDITO////////////////////////////
                        if(abono.id_tipo_pago == 4 && abono.igtf_pago == 0 && abono.tipo_registro == 0){
                            /////////BANESCO////////
                            if(abono.id_banco == 1){
                                creditoBanescoCredito = creditoBanescoCredito + abono.monto;
                            /////////PROVINCIAL////////
                            }else if(abono.id_banco == 2){
                                creditoProvincialCredito = creditoProvincialCredito + abono.monto;
                            }else if(abono.id_banco == 3){
                            /////////MERCANTIL////////
                                creditoMercantilCredito = creditoMercantilCredito + abono.monto;
                            }else if(abono.id_banco == 4){
                            /////////VENEZUELA////////
                                creditoVenezuelaCredito = creditoVenezuelaCredito + abono.monto;
                            }else if(abono.id_banco == 5){
                            /////////SOFITASA////////
                                creditoSofitasaCredito = creditoSofitasaCredito + abono.monto;
                            }else if(abono.id_banco == 5){
                                /////////100% banco////////
                                    credito100BancoCredito = credito100BancoCredito + abono.monto;
                            }
                        }
                    }
                }
        }
        ///////////////////////////////////////////////////////////////////////////////////////////////////

        //////////////////////////SUMANDO INDIVIDUALMENTE LOS TIPOS DE REGISTRO////////////////////////////
        for(const item of recibos){
            ////////////////////SUMATORIA GENERAL PARA RECIBOS DE REGISTRO CONVENIO Y PARA FACTURAS A CREDITO///////////////
            ////////RECIBOS PARA FACTURA A CREDITO///////
            pesosR = pesosR  + item.monto_pesos, 
            dolaresR = dolaresR  + item.monto_bolivares, 
            bolivaresR = bolivaresR  + item.monto_bolivares;
            if(item.id_tipo_recibo == 1){
                totalBolivaresReciboRegistroConvenio = totalBolivaresReciboRegistroConvenio + item.monto_bolivares
                totalPesosReciboRegistroConvenio = totalPesosReciboRegistroConvenio + item.monto_pesos
                totalDolaresReciboRegistroConvenio = totalDolaresReciboRegistroConvenio + item.monto_dolares

            ///////////RECIBOS PARA REGISTROS CONVENIOS//////////////
            }else if(item.id_tipo_recibo == 2){
                totalBolivaresReciboFacturasCredito = totalBolivaresReciboFacturasCredito + item.monto_bolivares, 
                totalPesosReciboFacturasCredito = + totalPesosReciboFacturasCredito + item.monto_pesos, 
                totalDolaresReciboFacturasCredito = totalDolaresReciboFacturasCredito + item.monto_dolares
            }

            for(const pago of item.registros_pago){
                //console.log("MEN AT WORK", pago.tipo_registro)
                if(pago.id_tipo_pago == 2 /*&& pago.igtf_pago == 0*/){
                    ///////EFECTIVO PESOS//////
                    if(pago.id_divisa == 1){
                        if(pago.tipo_registro == 0){
                            //efectivoPContado = efectivoPContado + pago.monto
                            //abonadoP = abonadoP + pago.monto;
                            efectivoPCredito = efectivoPCredito + pago.monto
                        }else{
                            //efectivoPContado = efectivoPContado - pago.monto
                            //abonadoP = abonadoP - pago.monto;
                            efectivoPCredito = efectivoPCredito + pago.monto
                        }
                    }else if(pago.id_divisa == 2){
                    //////EFECITVO DOLAEES/////
                    if(pago.tipo_registro == 0){
                        //efectivoDContado = efectivoDContado + pago.monto
                        //abonadoD = abonadoD + pago.monto;
                        efectivoDCredito = efectivoDCredito + pago.monto
                    }else{
                        //efectivoDContado = efectivoDContado - pago.monto
                        //abonadoD = abonadoD - pago.monto;
                        efectivoDCredito = efectivoDCredito + pago.monto
                    } 
                    //console.log("ENTRO A MENT A DOLARES", efectivoDContado);
                    }else if(pago.id_divisa == 3){
                    //////EFECTIVO BOLIVARES////
                        if(pago.tipo_registro == 0){
                            //efectivoBContado = efectivoBContado + pago.monto
                            //abonadoB = abonadoB + pago.monto;
                            efectivoBCredito = efectivoPCredito + pago.monto
                        }else{
                            //efectivoBContado = efectivoBContado - pago.monto
                            //abonadoB = abonadoB - pago.monto;
                            efectivoBCredito = efectivoPCredito + pago.monto
                        }
                    }
                }
                /////////////////////////////////INGRESOS DE RECIBO POR BANCOS////////////////////////////////
                if(pago.id_tipo_pago == 1 && pago.igtf_pago == 0 && pago.tipo_registro == 0){
                    if(pago.id_banco == 1){
                    transBanesco_factura_credito = transBanesco_factura_credito + pago.monto;
                    /////////PROVINCIAL////////
                    }else if(pago.id_banco == 2){
                        transProvincial_factura_credito = transProvincial_factura_credito + pago.monto;
                    }else if(pago.id_banco == 3){
                    /////////MERCANTIL////////
                    transMercantil_factura_credito =transMercantil_factura_credito + pago.monto;
                    }else if(pago.id_banco == 4){
                    /////////VENEZUELA////////
                        transVenezuela_factura_credito = transVenezuela_factura_credito + pago.monto;
                    }else if(pago.id_banco == 5){
                    /////////SOFITASA////////
                        transSofitasa_factura_credito = transSofitasa_factura_credito + pago.monto;
                    }else if(pago.id_banco == 6){
                        /////////ZELLE////////
                            zelleFacturaCredito = zelleFacturaCredito + pago.monto;
                    }else if(pago.id_banco == 7){
                        /////////BANCOLOMBIA////////
                            bancolombiaFacturaCredito = bancolombiaFacturaCredito + pago.monto;
                    }else if(pago.id_banco == 8){
                        /////////paypal////////
                        paypalFacturaCredito = paypalFacturaCredito + pago.monto;
                    }else if(pago.id_banco == 9){
                        /////////paypal////////
                        trans100Banco_factura_credito = trans100Banco_factura_credito + pago.monto;
                    }
                }
                ///////////////////////////////////////////////////////////////////////
                ///////////////////////////INGRESOS TARJETAS DE CREDITO FACTURAS A CONTADO LOOP PARA RECIBOS////////////////////////////
                if(pago.id_tipo_pago == 4 && pago.igtf_pago == 0 && pago.tipo_registro == 0){
                    /////////BANESCO////////
                    if(pago.id_banco == 1){
                        creditoBanescoCredito = creditoBanescoContado + pago.monto;
                    /////////PROVINCIAL////////
                    }else if(pago.id_banco == 2){
                        creditoProvincialCredito = creditoProvincialCredito + pago.monto;
                    }else if(pago.id_banco == 3){
                    /////////MERCANTIL////////
                        creditoMercantilCredito = creditoMercantilCredito + pago.monto;
                    }else if(pago.id_banco == 4){
                    /////////VENEZUELA////////
                        creditoVenezuelaCredito = creditoVenezuelaCredito + pago.monto;
                    }else if(pago.id_banco == 5){
                    /////////SOFITASA////////
                        creditoSofitasaCredito = creditoSofitasaCredito + pago.monto;
                    }else if(pago.id_banco == 9){
                        /////////SOFITASA////////
                            credito100BancoCredito = credito100BancoCredito + pago.monto;
                        }
                }
            }
        }
        /////////////////////////////////////////SUMATORIA DE IGTF DE FACTURAS CON VUELTOS///////////////////////////////////
        let sumaBolivaresIGTFVueltosEfectivo = 0, sumaDolaresIGTFVueltosEfectivo = 0, sumaPesosIGTFVueltosEfectivo = 0;
        for(const item of facturas){
            let vueltos = 0;
            ////////////////////////FOR PARA VERIFICAR QUE LA LOS PAGOS TENGAN VUELTOS/////////////////////////////
            for(const pago of item.registro_pagos){
                if(pago.tipo_registro == 1){
                    vueltos = 1;
                    break;
                }
            }
            if(vueltos == 0){
                if((item.id_tipo_factura == 1 || item.id_tipo_factura == 3) && item.id_estado_factura != 3){
                    for(const pago of item.registro_pagos){
                        if(pago.id_tipo_pago == 2){
                            if(pago.id_divisa == 1 && pago.igtf_pago == 1){
                                sumaPesosIGTFVueltosEfectivo = sumaPesosIGTFVueltosEfectivo + pago.monto;
                            }if(pago.id_divisa == 2 && pago.igtf_pago == 1){
                                sumaDolaresIGTFVueltosEfectivo = sumaDolaresIGTFVueltosEfectivo + pago.monto;
                            }if(pago.id_divisa == 3 && pago.igtf_pago == 1){
                                sumaBolivaresIGTFVueltosEfectivo = sumaBolivaresIGTFVueltosEfectivo + pago.monto;
                            }
                        }
                    }
                }
            }
            vueltos = 0;
        }
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        ///////////////////////////////////SUMATORIA DE PAGOS POR IGTF/////////////////////////////
        for(const item of facturas){
            //console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", item)
            ////////////////////////////////////TOTAL IGTF (FACTURAS A CREDITO Y DEBITO)/////////////////////////////////////
            for(const pago of item.registro_pagos){
                if(item.id_tipo_factura != 3){
                        if(pago.id_divisa == 1 && pago.igtf_pago == 1){
                            igtfP = igtfP + pago.monto;
                        }if(pago.id_divisa == 2 && pago.igtf_pago == 1){
                            igtfD = igtfD + pago.monto;
                        }
                        //console.log(igtfP, igtfD)
                        if(pago.id_divisa == 3 && pago.igtf_pago == 1){
                            igtfB = igtfB + pago.monto;
                        }
                    ////////////////////////////IGTF EN TRANSFERENCIA//////////////////////////////
                    if(pago.id_tipo_pago == 1 && pago.igtf_pago == 1){
                        ////////////////PESOS//////////////
                        if(pago.id_divisa == 1 && pago.igtf_pago == 1){
                            igtfPTransferencia = igtfPTransferencia + pago.monto;
                        } 
                        if(pago.id_divisa == 2 && pago.igtf_pago == 1){
                            igtfDTransferencia = igtfDTransferencia + pago.monto;
                        } 
                        if(pago.id_divisa == 3 && pago.igtf_pago == 1){
                            igtfBTransferencia = igtfBTransferencia + pago.monto;
                        } 
                        /////////////////////////PARA PAYPAL Y ZELLE//////////////////////////////
                        if(pago.id_divisa == 2 && pago.igtf_pago == 1 && pago.id_banco == 8){
                            igtfPaypal = igtfPaypal + pago.monto;
                        }
                        if(pago.id_divisa == 2 && pago.igtf_pago == 1 && pago.id_banco == 6){
                            igtfZelle = igtfZelle + pago.monto;
                        } 
                        //////////////////////////////////////////////////////////////////////////
                    }
                    ////////////////////////////////
                    ///////////////////////////////////////////////////////////////////////////////
                    //////////////////////////EFECTIVO////////////////////////////////////////////
                    if(pago.id_tipo_pago == 2 && pago.igtf_pago == 1){
                        ////////////////PESOS//////////////
                        if(pago.id_divisa == 1 && pago.igtf_pago == 1){
                            igtfPEfectivo = igtfPEfectivo + pago.monto;
                        } 
                        if(pago.id_divisa == 2 && pago.igtf_pago == 1){
                            igtfDEfectivo = igtfDEfectivo + pago.monto;
                        } 
                        if(pago.id_divisa == 3 && pago.igtf_pago == 1){
                            igtfBEfectivo = igtfBEfectivo + pago.monto;
                        } 
                    }
                    if(pago.id_tipo_pago == 3 && pago.igtf_pago == 1){
                        if(pago.id_divisa == 1 && pago.igtf_pago == 1){
                            igtfPDebito = igtfPDebito + pago.monto;
                        } 
                        if(pago.id_divisa == 2 && pago.igtf_pago == 1){
                            igtfDDebito = igtfDDebito + pago.monto;
                        } 
                        if(pago.id_divisa == 3 && pago.igtf_pago == 1){
                            igtfBDebito = igtfBDebito + pago.monto;
                        } 
                    }
                    if(pago.id_tipo_pago == 4 && pago.igtf_pago == 1){
                        if(pago.id_divisa == 1 && pago.igtf_pago == 1){
                            igtfPCredito = igtfPCredito + pago.monto;
                        } 
                        if(pago.id_divisa == 2 && pago.igtf_pago == 1){
                            igtfDCredito = igtfDCredito + pago.monto;
                        } 
                        if(pago.id_divisa == 3 && pago.igtf_pago == 1){
                            igtfBCredito = igtfBCredito + pago.monto;
                        } 
                    }
                    /////////////////////////////////////////////////////////////////////////////////////////////////////
                    ///////////////////////////////////IGTF DE FACTURAS A CONTADO///////////////////////////////////////
                    if(item.id_tipo_factura == 1 && pago.igtf_pago == 1){
                        if(pago.id_divisa == 1 && pago.igtf_pago == 1){
                            igtfPFacturaContado = igtfPFacturaContado + pago.monto;
                        }
                        if(pago.id_divisa == 2 && pago.igtf_pago == 1){
                            igtfDFacturaContado = igtfDFacturaContado + pago.monto;
                        }
                        if(pago.id_divisa == 3 && pago.igtf_pago == 1){
                            igtfBFacturaContado = igtfBFacturaContado + pago.monto;
                        }
                        if(pago.id_tipo_pago == 1 && pago.igtf_pago == 1){
                            ////////////////PESOS//////////////
                            if(pago.id_divisa == 1 && pago.igtf_pago == 1){
                                igtfPTransferenciaFacturaContado = igtfPTransferenciaFacturaContado + pago.monto;
                            } 
                            if(pago.id_divisa == 2 && pago.igtf_pago == 1){
                                igtfDTransferenciaFacturaContado = igtfDTransferenciaFacturaContado + pago.monto;
                            } 
                            if(pago.id_divisa == 3 && pago.igtf_pago == 1){
                                igtfBTransferenciaFacturaContado = igtfBTransferenciaFacturaContado + pago.monto;
                            } 
                        }
                        ///////////////////////////////////////////////////////////////////////////////
                        //////////////////////////EFECTIVO////////////////////////////////////////////
                        if(pago.id_tipo_pago == 2 && pago.igtf_pago == 1){
                            ////////////////PESOS//////////////
                            if(pago.id_divisa == 1 && pago.igtf_pago == 1){
                                igtfPEfectivoFacturaContado = igtfPEfectivoFacturaContado + pago.monto;
                            } 
                            if(pago.id_divisa == 2 && pago.igtf_pago == 1){
                                igtfDEfectivoFacturaContado = igtfDEfectivoFacturaContado + pago.monto;
                            } 
                            if(pago.id_divisa == 3 && pago.igtf_pago == 1){
                                igtfBEfectivoFacturaContado = igtfBEfectivoFacturaContado + pago.monto;
                            } 
                        }
                        if(pago.id_tipo_pago == 3 && pago.igtf_pago == 1){
                            if(pago.id_divisa == 1 && pago.igtf_pago){
                                igtfPDebitoFacturaContado = igtfPDebitoFacturaContado + pago.monto;
                            } 
                            if(pago.id_divisa == 2 && pago.igtf_pago){
                                igtfDDebitoFacturaContado = igtfDDebitoFacturaContado + pago.monto;
                            } 
                            if(pago.id_divisa == 3 && pago.igtf_pago){
                                igtfBDebitoFacturaContado = igtfBDebitoFacturaContado + pago.monto;
                            } 
                        }
                        if(pago.id_tipo_pago == 4 && pago.igtf_pago == 1){
                            if(pago.id_divisa == 1 && pago.igtf_pago){
                                igtfPCreditoFacturaContado = igtfPCreditoFacturaContado + pago.monto;
                            } 
                            if(pago.id_divisa == 2 && pago.igtf_pago){
                                igtfDCreditoFacturaContado = igtfDCreditoFacturaContado + pago.monto;
                            } 
                            if(pago.id_divisa == 3 && pago.igtf_pago){
                                igtfBCreditoFacturaContado = igtfBCreditoFacturaContado + pago.monto;
                            } 
                        }
                    }
                    ////////////////////////////////////////////////////////////////////////////////////////////////////
                    ///////////////////////////////////IGTF DE FACTURAS A CREDITO////////////////////////////////////////
                    if(item.id_tipo_factura == 2 && pago.igtf_pago == 1){
                        if(pago.id_divisa == 1){
                            igtfPFacturaCredito = igtfPFacturaCredito + pago.monto;
                        }
                        if(pago.id_divisa == 2){
                            igtfDFacturaCredito = igtfDFacturaCredito + pago.monto;
                        }
                        if(pago.id_divisa == 3){
                            igtfBFacturaCredito = igtfBFacturaCredito + pago.monto;
                        }
                        ////////////////////////////IGTF EN TRANSFERENCIA//////////////////////////////
                        if(pago.id_tipo_pago == 1 && pago.igtf_pago == 1){
                            ////////////////PESOS//////////////
                            if(pago.id_divisa == 1){
                                igtfPTransferenciaFacturaCredito = igtfPTransferenciaFacturaCredito + pago.monto;
                            } 
                            if(pago.id_divisa == 2){
                                igtfDTransferenciaFacturaCredito = igtfDTransferenciaFacturaCredito + pago.monto;
                            } 
                            if(pago.id_divisa == 3){
                                igtfBTransferenciaFacturaCredito = igtfBTransferenciaFacturaCredito + pago.monto;
                            } 
                        }
                        ///////////////////////////////////////////////////////////////////////////////
                        //////////////////////////EFECTIVO////////////////////////////////////////////
                        if(pago.id_tipo_pago == 2 && pago.igtf_pago == 1){
                            ////////////////PESOS//////////////
                            if(pago.id_divisa == 1){
                                igtfPEfectivoFacturaCredito = igtfPEfectivoFacturaCredito + pago.monto;
                            } 
                            if(pago.id_divisa == 2){
                                igtfDEfectivoFacturaCredito = igtfDEfectivoFacturaCredito + pago.monto;
                            } 
                            if(pago.id_divisa == 3){
                                igtfBEfectivoFacturaCredito = igtfBEfectivoFacturaCredito + pago.monto;
                            } 
                        }
                        if(pago.id_tipo_pago == 3 && pago.igtf_pago == 1){
                            if(pago.id_divisa == 1){
                                igtfPDebitoFacturaCredito = igtfPDebitoFacturaCredito + pago.monto;
                            } 
                            if(pago.id_divisa == 2){
                                igtfDDebitoFacturaCredito = igtfDDebitoFacturaCredito + pago.monto;
                            } 
                            if(pago.id_divisa == 3){
                                igtfBDebitoFacturaCredito = igtfBDebitoFacturaCredito + pago.monto;
                            } 
                        }
                        if(pago.id_tipo_pago == 4 && pago.igtf_pago == 1){
                            if(pago.id_divisa == 1){
                                igtfPCreditoFacturaCredito = igtfPCreditoFacturaCredito + pago.monto;
                            } 
                            if(pago.id_divisa == 2){
                                igtfDCreditoFacturaCredito = igtfDCreditoFacturaCredito + pago.monto;
                            } 
                            if(pago.id_divisa == 3){
                                igtfBCreditoFacturaCredito = igtfBCreditoFacturaCredito + pago.monto;
                            } 
                        }
                    }
                    ////////////////////////////////////////////////////////////////////////////////////////////////////
                }
            }
        }
        
        ////////////////////////////////////SUMATORIA DE COSAS/////////////////////////////////////
        for(const item of facturas){
            //console.log(item);
            ///////////////////////////////ORDENES DE TRABAJO/////////////////////////
            if(item.numero_factura == null && item.orden_trabajo != null){
                totalOrdenesTrabajo = totalOrdenesTrabajo + 1, 
                totalBsOrdenesTrabajo = totalBsOrdenesTrabajo + item.total_bolivares, 
                totalPesosOrdenesTrabajo = totalPesosOrdenesTrabajo + item.total_pesos, 
                totalDolaresOrdenesTrabajo = totalDolaresOrdenesTrabajo + item.total_dolares;
            }

            ///////////////////////////////DESCUENTOS TOTALES/////////////////////////
                if(item.descuento_bolivares > 0 || item.descuento_pesos > 0 || item.descuento_dolares > 0){
                    cantidadFacturasDescuentos = cantidadFacturasDescuentos + 1;
                    detallesDescontadas.push({
                        id_factura: item.id_factura,
                        numero_factura: item.numero_factura,
                        orden_trabajo: item.orden_trabajo,
                        total_bolivares: item.total_bolivares,
                        total_dolares: item.total_dolares,
                        total_pesos: item.total_pesos,
                        id_usuario: item.id_usuario,
                        id_cliente: item.id_cliente,
                        id_tipo_factura: item.id_tipo_factura,
                        id_estado_factura: item.id_estado_factura,
                        fecha_creacion_factura: item.fecha_creacion_factura,
                        fecha_cencelacion_factura: item.fecha_cencelacion_factura,
                        descuento_bolivares: item.descuento_bolivares,
                        descuento_dolares: item.descuento_dolares,
                        descuento_pesos: item.descuento_pesos,
                        anulacion_motivo: item.anulacion_motivo,
                        tipo_factura_nombre: item.tipo_factura_nombre,
                        cliente_nombre: item.cliente_nombre,
                        cliente_apellido: item.cliente_apellido,
                        id_tipo_cliente: item.id_tipo_cliente,
                    })
                }
                descuentoD = descuentoD + item.descuento_dolares;
                descuentoB = descuentoB + item.descuento_bolivares;
                descuentoP = descuentoP + item.descuento_pesos;
            
            //////////////////////////////FACTURAS AL CONTADO////////////////////////
            if(item.id_tipo_factura == 1 && item.id_estado_factura != 3){
                cantidad_facturas_contado ++;
                contadoB = contadoB + (item.total_bolivares - item.descuento_bolivares)
                contadoD = contadoD + (item.total_dolares - item.descuento_dolares)
                contadoP = contadoP + (item.total_pesos - item.descuento_pesos)
            }
            if(item.id_tipo_factura == 3 && item.id_estado_factura != 3){
                contadoBOrdenTrabajo = contadoBOrdenTrabajo + item.total_bolivares
                contadoDOrdenTrabajo = contadoDOrdenTrabajo + item.total_dolares
                contadoPOrdenTrabajo = contadoPOrdenTrabajo + item.total_pesos
            }
            if((item.id_tipo_factura == 1 || item.id_tipo_factura == 3) && item.id_estado_factura != 3){
            // console.log("WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW")

                /////////////////////////////DESCUENTOS EN FACTURAS A CONTADO///////////////////////////
                descuento_pesos_factura_contado = descuento_pesos_factura_contado + item.descuento_pesos, 
                descuento_dolares_factura_contado = descuento_dolares_factura_contado + item.descuento_dolares, 
                descuento_bolivares_factura_contado = descuento_bolivares_factura_contado + item.descuento_bolivares
                for(const pago of item.registro_pagos){
                    //console.log("EN REGISTRO_ PAGOS!!!", pago);
                    /////////////////////////////INGRESOS POR TRANSFERENCIAS EN BOLIVARES DE BANCOS NACIONALES FACTURAS A CONTADO///////////////////
                    if(pago.id_tipo_pago == 1 && pago.tipo_registro == 0){
                        if(pago.id_banco == 1){
                        transBanesco_factura_contado = transBanesco_factura_contado + pago.monto;
                        /////////PROVINCIAL////////
                        }else if(pago.id_banco == 2){
                            transProvincial_factura_contado = transProvincial_factura_contado + pago.monto;
                        }else if(pago.id_banco == 3){
                        /////////MERCANTIL////////
                        transMercantil_factura_contado =transMercantil_factura_contado + pago.monto;
                        }else if(pago.id_banco == 4){
                        /////////VENEZUELA////////
                            transVenezuela_factura_contado = transVenezuela_factura_contado + pago.monto;
                        }else if(pago.id_banco == 5){
                        /////////SOFITASA////////
                            transSofitasa_factura_contado = transSofitasa_factura_contado + pago.monto;
                        }else if(pago.id_banco == 6){
                            /////////ZELLE////////
                                zelleFacturaContado = zelleFacturaContado + pago.monto;
                        }else if(pago.id_banco == 7){
                            /////////BANCOLOMBIA////////
                                bancolombiaFacturaContado = bancolombiaFacturaContado + pago.monto;
                        }else if(pago.id_banco == 8){
                            /////////paypal////////
                            paypalFacturaContado =paypalFacturaContado + pago.monto;
                        }else if(pago.id_banco == 9){
                            /////////paypal////////
                            trans100Banco_factura_contado = trans100Banco_factura_contado + pago.monto;
                        }
                    }
                    /////////////////////////////INGRESOS TARJETAS DE DEBITO FACTURAS A CONTADO///////////////////////////
                    if(pago.id_tipo_pago == 3 && pago.igtf_pago == 0 && pago.tipo_registro == 0){
                        /////////BANESCO////////
                        if(pago.id_banco == 1){
                            debitoBanescoContado = debitoBanescoContado + pago.monto;
                        /////////PROVINCIAL////////
                        }else if(pago.id_banco == 2){
                            debitoProvincialContado = debitoProvincialContado + pago.monto;
                        }else if(pago.id_banco == 3){
                        /////////MERCANTIL////////
                            debitoMercantilContado = debitoMercantilContado + pago.monto;
                        }else if(pago.id_banco == 4){
                        /////////VENEZUELA////////
                            debitoVenezuelaContado = debitoVenezuelaContado + pago.monto;
                        }else if(pago.id_banco == 5){
                        /////////SOFITASA////////
                            debitoSofitasaContado = debitoSofitasaContado + pago.monto;
                        }else if(pago.id_banco == 9){
                            /////////SOFITASA////////
                                debito100BancoContado = debito100BancoContado + pago.monto;
                            }
                    }
                    ///////////////////////////INGRESOS TARJETAS DE CREDITO FACTURAS A CONTADO////////////////////////////
                    if(pago.id_tipo_pago == 4 && pago.igtf_pago == 0 && pago.tipo_registro == 0){
                        /////////BANESCO////////
                        if(pago.id_banco == 1){
                            creditoBanescoContado = creditoBanescoContado + pago.monto;
                        /////////PROVINCIAL////////
                        }else if(pago.id_banco == 2){
                            creditoProvincialContado = creditoProvincialContado + pago.monto;
                        }else if(pago.id_banco == 3){
                        /////////MERCANTIL////////
                            creditoMercantilContado = creditoMercantilContado + pago.monto;
                        }else if(pago.id_banco == 4){
                        /////////VENEZUELA////////
                            creditoVenezuelaContado = creditoVenezuelaContado + pago.monto;
                        }else if(pago.id_banco == 5){
                        /////////SOFITASA////////
                            creditoSofitasaContado = creditoSofitasaContado + pago.monto;
                        }else if(pago.id_banco == 9){
                            /////////SOFITASA////////
                                credito100BancoContado = credito100BancoContado + pago.monto;
                            }
                    }
                    ///////////////////////////INGRESO POR EFECTIVO FACTURAS A CONTADO////////////////////////////////
                    if(pago.id_tipo_pago == 2 && pago.igtf_pago == 0){
                        ///////EFECTIVO PESOS//////
                        if(pago.id_divisa == 1){
                            if(pago.tipo_registro == 0){
                                efectivoPContado = efectivoPContado + pago.monto
                            }else{
                                efectivoPContado = efectivoPContado - pago.monto
                            }
                        }else if(pago.id_divisa == 2){
                        //////EFECITVO DOLAEES/////
                        //console.log("MMMMMMMMMMMMMMMMMMMMM", pago)
                        if(pago.tipo_registro == 0){
                            efectivoDContado = efectivoDContado + pago.monto
                        }else{
                            efectivoDContado = efectivoDContado - pago.monto
                        } 
                        }else if(pago.id_divisa == 3){
                        //////EFECTIVO BOLIVARES////
                            if(pago.tipo_registro == 0){
                                efectivoBContado = efectivoBContado + pago.monto
                            }else{
                                efectivoBContado = efectivoBContado - pago.monto
                            }
                        }
                    }
                    //console.log(efectivoPContado, efectivoDContado, efectivoBContado)
                }
            }
            /////////////////////////////FACTURAS A CREDITO/////////////////////////
            //console.log("??????????????????????????????????????????????????????????", item)
            if(item.id_tipo_factura == 2 && item.id_estado_factura != 3){
                cantidad_facturas_credito ++;
                creditoB = creditoB + item.total_bolivares
                creditoD = creditoD + item.total_dolares
                creditoP = creditoP + item.total_pesos
                if(item.id_tipo_cliente == 2){
                    creditoBConvenio = creditoBConvenio + item.total_bolivares,
                    creditoPConvenio = creditoPConvenio + item.total_pesos,
                    creditoDConvenio = creditoDConvenio + item.total_dolares,
                    cantidadFacturaCreditoConvenio = cantidadFacturaCreditoConvenio + 1;
                } 
                if(item.id_tipo_cliente == 1 ){
                    creditoBParticular = creditoBParticular + item.total_bolivares,
                    creditoPParticular = creditoPParticular + item.total_pesos,
                    creditoDParticular = creditoDParticular + item.total_dolares,
                    cantidadFacturaCreditoParticular = cantidadFacturaCreditoParticular + 1;
                }
                ////////////////////////////DESCUENTO EN FACTURAS A CREDITO/////////////////////////////
                descuento_pesos_factura_credito = descuento_pesos_factura_credito + item.descuento_pesos, 
                descuento_dolares_factura_credito = descuento_dolares_factura_credito + item.descuento_dolares, 
                descuento_bolivares_factura_credito = descuento_bolivares_factura_credito + item.descuento_bolivares
                ////////////////////////ABONOS EN FACTURAS A CREDITO//////////////////
                for(const abono of item.registro_pagos){
                    //console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<")
                    if(abono.id_usuario == req.body.id_usuario || abono.id_usuario == req.body.id_usuario2 || abono.id_usuario == req.body.id_usuario3){
                        if(abono.igtf_pago == 0 && abono.tipo_registro == 0 && abono.igtf_pago == 0){
                            ///////ABONO PESOS//////
                            if(abono.id_divisa == 1){
                                if(abono.tipo_registro == 0){
                                    abonadoP = abonadoP + abono.monto
                                }else{
                                    abonadoP = abonadoP - abono.monto
                                }
                            }else if(abono.id_divisa == 2){
                            //////ABONO DOLAEES/////
                                if(abono.tipo_registro == 0){
                                    abonadoD = abonadoD + abono.monto
                                }else{
                                    abonadoD = abonadoD - abono.monto
                                }
                            }else if(abono.id_divisa == 3){
                            //////ABONO BOLIVARES////
                                if(abono.tipo_registro == 0){
                                    abonadoB = abonadoB + abono.monto
                                }else{
                                    abonadoB = abonadoB - abono.monto
                                }
                            }
                        }
                        ///////////////////////////INGRESO POR EFECTIVO FACTURAS A CREDITO////////////////////////////////
                        if(abono.id_tipo_pago == 2 /*&& abono.igtf_pago == 0*/ && abono.tipo_registro == 0){
                            ///////EFECTIVO PESOS//////
                            if(abono.id_divisa == 1){
                                efectivoPCredito = efectivoPCredito + abono.monto
                            }else if(abono.id_divisa == 2){
                            //////EFECITVO DOLAEES/////
                                efectivoDCredito = efectivoDCredito + abono.monto
                            }else if(abono.id_divisa == 3){
                            //////EFECTIVO BOLIVARES////
                                efectivoBCredito = efectivoBCredito + abono.monto
                            }
                        }
                        ////////////////////////INGRESOS EN TRANSFERENCIAS EN BOLIVARES Y OTROS EN FACTURAS A CREDITO//////////////////
                        if(abono.id_tipo_pago == 1 && abono.igtf_pago == 0 && abono.tipo_registro == 0){
                            if(abono.id_banco == 1){
                            transBanesco_factura_credito = transBanesco_factura_credito + abono.monto;
                            /////////PROVINCIAL////////
                            }else if(abono.id_banco == 2){
                                transProvincial_factura_credito = transProvincial_factura_credito + abono.monto;
                            }else if(abono.id_banco == 3){
                            /////////MERCANTIL////////
                            transMercantil_factura_credito =transMercantil_factura_credito + abono.monto;
                            }else if(abono.id_banco == 4){
                            /////////VENEZUELA////////
                                transVenezuela_factura_credito = transVenezuela_factura_credito + abono.monto;
                            }else if(abono.id_banco == 5){
                            /////////SOFITASA////////
                                transSofitasa_factura_credito = transSofitasa_factura_credito + abono.monto;
                            }else if(abono.id_banco == 6){
                                /////////ZELLE////////
                                    zelleFacturaCredito = zelleFacturaCredito + abono.monto;
                            }else if(abono.id_banco == 7){
                                /////////BANCOLOMBIA////////
                                    bancolombiaFacturaCredito = bancolombiaFacturaCredito + abono.monto;
                            }else if(abono.id_banco == 8){
                                /////////paypal////////
                                paypalFacturaCredito = paypalFacturaCredito + abono.monto;
                            }else if(abono.id_banco == 9){
                                /////////paypal////////
                                trans100Banco_factura_credito = trans100Banco_factura_credito + abono.monto;
                            }
                        }
                        //console.log("KKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK", transSofitasa_factura_credito)
                        /////////////////////////////INGRESOS TARJETAS DE DEBITO FACTURAS A CREDITO///////////////////////////
                        if(abono.id_tipo_pago == 3 && abono.igtf_pago == 0 && abono.tipo_registro == 0){
                            /////////BANESCO////////
                            if(abono.id_banco == 1){
                                debitoBanescoCredito = debitoBanescoCredito + abono.monto;
                            /////////PROVINCIAL////////
                            }else if(abono.id_banco == 2){
                                debitoProvincialCredito = debitoProvincialCredito + abono.monto;
                            }else if(abono.id_banco == 3){
                            /////////MERCANTIL////////
                                debitoMercantilCredito = debitoMercantilCredito + abono.monto;
                            }else if(abono.id_banco == 4){
                            /////////VENEZUELA////////
                                debitoVenezuelaCredito = debitoVenezuelaCredito + abono.monto;
                            }else if(abono.id_banco == 5){
                            /////////SOFITASA////////
                                debitoSofitasaCredito = debitoSofitasaCredito + abono.monto;
                            }else if(abono.id_banco == 9){
                                /////////SOFITASA////////
                                    debito100BancoCredito = debito100BancoCredito + abono.monto;
                                }
                            
                        }
                        ///////////////////////////INGRESOS TARJETAS DE CREDITO FACTURAS A CREDITO////////////////////////////
                        if(abono.id_tipo_pago == 4 && abono.igtf_pago == 0 && abono.tipo_registro == 0){
                            /////////BANESCO////////
                            if(abono.id_banco == 1){
                                creditoBanescoCredito = creditoBanescoCredito + abono.monto;
                            /////////PROVINCIAL////////
                            }else if(abono.id_banco == 2){
                                creditoProvincialCredito = creditoProvincialCredito + abono.monto;
                            }else if(abono.id_banco == 3){
                            /////////MERCANTIL////////
                                creditoMercantilCredito = creditoMercantilCredito + abono.monto;
                            }else if(abono.id_banco == 4){
                            /////////VENEZUELA////////
                                creditoVenezuelaCredito = creditoVenezuelaCredito + abono.monto;
                            }else if(abono.id_banco == 5){
                            /////////SOFITASA////////
                                creditoSofitasaCredito = creditoSofitasaCredito + abono.monto;
                            }else if(abono.id_banco == 5){
                                /////////100% banco////////
                                    credito100BancoCredito = credito100BancoCredito + abono.monto;
                                }
                        }
                    }
                }
            }
            
            //////////////////////SUMATORIAS DE FACTURAS CREDITO Y CONTADO///////////////////////////
            monto_total_facturas_pesos = contadoP + creditoP + contadoPOrdenTrabajo;
            monto_total_facturas_dolares = contadoD + creditoD + contadoDOrdenTrabajo;
            monto_total_facturas_bolivares = contadoB + creditoB + contadoBOrdenTrabajo;
            //////////////////////////FACTURAS ANULADAS/////////////////////////////
            if(item.id_estado_factura == 3){
                cantidad_facturas_anuladas++;
                anuladoB = anuladoB + (item.total_bolivares - item.descuento_bolivares)
                anuladoD = anuladoD + (item.total_dolares - item.descuento_dolares)
                anuladoP = anuladoP + (item.total_pesos - item.descuento_pesos)
                detallesAnuladas.push({
                    numero_factura: item.numero_factura,
                    cliente: item.cliente_nombre +" "+item.cliente_apellido,
                    motivo: item.anulacion_motivo
                })
                //////////////////////////DESCUENTO DE FACTURAS ANULADAS////////////////////////////////
                descuento_pesos_factura_anulado = descuento_pesos_factura_anulado + item.descuento_pesos, 
                descuento_dolares_factura_anulado = descuento_dolares_factura_anulado + item.descuento_dolares, 
                descuento_bolivares_factura_anulado = descuento_bolivares_factura_anulado + item.descuento_bolivares;
            }
            
            for(const pago of item.registro_pagos){
            // console.log("pago", pago)
            /////////////////////////////INGRESOS TARJETAS DE DEBITO///////////////////////////
            if(item.id_estado_factura != 3){
                    if(pago.id_tipo_pago == 3 && pago.tipo_registro == 0){
                        /////////BANESCO////////
                        if(pago.id_banco == 1){
                            debitoBanesco = debitoBanesco + pago.monto;
                        /////////PROVINCIAL////////
                        }else if(pago.id_banco == 2){
                            debitoProvincial = debitoProvincial + pago.monto;
                        }else if(pago.id_banco == 3){
                        /////////MERCANTIL////////
                            debitoMercantil = debitoMercantil + pago.monto;
                        }else if(pago.id_banco == 4){
                        /////////VENEZUELA////////
                            debitoVenezuela = debitoVenezuela + pago.monto;
                        }else if(pago.id_banco == 5){
                        /////////SOFITASA////////
                            debitoSofitasa = debitoSofitasa + pago.monto;
                        }else if(pago.id_banco == 9){
                            /////////100 SOFITASA////////
                            debito100banco =debito100banco + pago.monto;
                            }
                    }
                    ///////////////////////////////////////////////////////////////////////////////////
                    ///////////////////////////INGRESOS TARJETAS DE CREDITO////////////////////////////
                    if(pago.id_tipo_pago == 4 && pago.tipo_registro == 0){
                        /////////BANESCO////////
                        if(pago.id_banco == 1){
                            creditoBanesco = creditoBanesco + pago.monto;
                        /////////PROVINCIAL////////
                        }else if(pago.id_banco == 2){
                            creditoProvincial = creditoProvincial + pago.monto;
                        }else if(pago.id_banco == 3){
                        /////////MERCANTIL////////
                            creditoMercantil = creditoMercantil + pago.monto;
                        }else if(pago.id_banco == 4){
                        /////////VENEZUELA////////
                            creditoVenezuela = creditoVenezuela + pago.monto;
                        }else if(pago.id_banco == 5){
                        /////////SOFITASA////////
                            creditoSofitasa = creditoSofitasa + pago.monto;
                        }else if(pago.id_banco == 9){
                            /////////100 BANCO////////
                                credito100Banco = credito100Banco + pago.monto;
                            }
                    }
                    ///////////////////////////////////////////////////////////////////////////////////
                    ///////////////////////////INGRESOS TRANSFERENCIAS/////////////////////////////////
                    if(pago.id_tipo_pago == 1 && pago.tipo_registro == 0){
                        if(pago.id_banco == 1){
                        transBanesco = transBanesco + pago.monto;
                        /////////PROVINCIAL////////
                        }else if(pago.id_banco == 2){
                            transPronvincial = transPronvincial + pago.monto;
                        }else if(pago.id_banco == 3){
                        /////////MERCANTIL////////
                        transMercantil =transMercantil + pago.monto;
                        }else if(pago.id_banco == 4){
                        /////////VENEZUELA////////
                            transVenezuela = transVenezuela + pago.monto;
                        }else if(pago.id_banco == 5){
                        /////////SOFITASA////////
                            transSofitasa = transSofitasa + pago.monto;
                        }else if(pago.id_banco == 6){
                            /////////ZELLE////////
                                zelle = zelle + pago.monto;
                        }else if(pago.id_banco == 7){
                            /////////BANCOLOMBIA////////
                                bancolombia = bancolombia + pago.monto;
                        }else if(pago.id_banco == 8){
                            /////////paypal////////
                            paypal =paypal + pago.monto;
                        }else if(pago.id_banco == 9){
                            /////////100 banco////////
                            trans100Banco = trans100Banco + pago.monto;
                        }
                    }
                    ///////////////////////////////////////////////////////////////////////////////////
                    /////////////////////////EFECTIVO PESOS, DOLARES, BOLIVARES////////////////////////
                    if(pago.id_tipo_pago == 2 && pago.igtf_pago == 0){
                        ///////EFECTIVO PESOS//////
                        if(pago.id_divisa == 1){
                            if(pago.tipo_registro == 0){
                                efectivoP = efectivoP + pago.monto
                            }else{
                                efectivoP = efectivoP - pago.monto
                            }
                        }else if(pago.id_divisa == 2){
                        //////EFECITVO DOLAEES/////
                            if(pago.tipo_registro == 0){
                                efectivoD = efectivoD + pago.monto
                            }else{
                                efectivoD = efectivoD - pago.monto
                            }
                        }else if(pago.id_divisa == 3){
                        //////EFECTIVO BOLIVARES////
                            if(pago.tipo_registro == 0){
                                efectivoB = efectivoB + pago.monto
                            }else{
                                efectivoB = efectivoB - pago.monto
                            }
                        }
                    }
            }
            }
        }
        //////////////////////////SUMATORIAS TOTALES EN FACTURAS A CONTADO///////////////////////////////////////
        total_transBancos_factura_contado = Number(Math.round((transBanesco_factura_contado + transProvincial_factura_contado + transMercantil_factura_contado + transVenezuela_factura_contado + transSofitasa_factura_contado + trans100Banco_factura_contado) + "e+2") + "e-2");
        total_debitoBancos_factura_contado = debitoBanescoContado + debitoProvincialContado + debitoMercantilContado + debitoVenezuelaContado + debitoSofitasaContado + debito100BancoContado;
        total_creditoBancos_factura_contado = creditoBanescoContado + creditoProvincialContado + creditoMercantilContado + creditoVenezuelaContado + creditoSofitasaContado + credito100BancoContado;
        /////CONVERSIONES FACTURAS A CONTADO/////
        const efectivoDContadoAB = efectivoDContado * bolivares;
        const efectivoPContadoAB = (efectivoPContado / pesos) * bolivares;
        const paypalContadoABolivares = paypalFacturaContado * bolivares;
        const bancolombiaContadoABolivares = (bancolombiaFacturaContado / pesos) * bolivares;
        const zelleContadoABolivares = zelleFacturaContado * bolivares;
        let igtf_total_factura_contado = Number(Math.round((igtfBFacturaContado + (((igtfPFacturaContado / pesos) * bolivares) + (igtfDFacturaContado * bolivares))) + "e+2") + "e-2");
        let total_factura_contado =  contadoB + totalBsOrdenesTrabajo + igtf_total_factura_contado;//efectivoBContado + efectivoDContadoAB + efectivoPContadoAB + paypalContadoABolivares + bancolombiaContadoABolivares + zelleContadoABolivares + total_transBancos_factura_contado + total_debitoBancos_factura_contado + total_creditoBancos_factura_contado;
        if(isNaN(total_factura_contado)){
            total_factura_contado = 0;
        }
        //////////////////////////SUMATORIAS TOTALES EN FACTURAS A CREDITO///////////////////////////////////////
        total_transBancos_factura_credito = Number(Math.round((transBanesco_factura_credito + transProvincial_factura_credito + transMercantil_factura_credito + transVenezuela_factura_credito + transSofitasa_factura_credito + trans100Banco_factura_credito) + "e+2") + "e-2")
        total_debitoBancos_factura_credito = Number(Math.round((debitoBanescoCredito + debitoProvincialCredito + debitoMercantilCredito + debitoVenezuelaCredito + debitoSofitasaCredito + debito100BancoCredito) + "e+2") + "e-2");
        total_creditoBancos_factura_credito = Number(Math.round((creditoBanescoCredito + creditoProvincialCredito + creditoMercantilCredito + creditoVenezuelaCredito + creditoSofitasaCredito + credito100BancoCredito) + "e+2") + "e-2");
        /////CONVERSIONES FACTURAS A CONTADO/////
        const efectivoDCreditoAB = efectivoDCredito * bolivares;
        const efectivoPCreditoAB = (efectivoPCredito / pesos) * bolivares;
        const paypalCreditoABolivares = paypalFacturaCredito * bolivares;
        const bancolombiaCreditoABolivares = (bancolombiaFacturaCredito / pesos) * bolivares;
        const zelleCreditoABolivares = zelleFacturaCredito * bolivares;

        
        //let total_factura_credito = creditoB;//efectivoBCredito + efectivoDCreditoAB + efectivoPCreditoAB + paypalCreditoABolivares + bancolombiaCreditoABolivares + zelleCreditoABolivares + total_transBancos_factura_credito + total_debitoBancos_factura_credito + total_creditoBancos_factura_credito + 0;
        total_factura_credito = efectivoBCredito + ((efectivoDCredito) * bolivares) + (((efectivoPCredito) / pesos) * bolivares) + (((bancolombiaFacturaCredito) / pesos) * bolivares) + ((zelleFacturaCredito) * bolivares) + ((paypalFacturaCredito) * bolivares) + total_transBancos_factura_credito + total_debitoBancos_factura_credito + total_creditoBancos_factura_credito + igtfBEfectivoFacturaCredito + igtfBEfectivoFacturaCredito + igtfBDebitoFacturaCredito + igtfBTransferenciaFacturaCredito + (((igtfPEfectivoFacturaCredito + igtfPCreditoFacturaCredito + igtfPDebitoFacturaCredito + igtfPTransferenciaFacturaCredito) / pesos) * bolivares) + ((igtfDEfectivoFacturaCredito + igtfDCreditoFacturaCredito + igtfDDebitoFacturaCredito + igtfDTransferenciaFacturaCredito) * bolivares)
        if(isNaN(total_factura_credito)){
            total_factura_credito = 0;
        }
        //////////////////////////////////SUMATORIAS DE RECUADRO CUATRO//////////////////////////////////////////
        const sumatoria_debito_facturas_credito_contado = debitoBanescoContado + debitoBanescoCredito + debitoProvincialContado + debitoProvincialCredito + debitoMercantilContado + debitoMercantilCredito + debitoVenezuelaContado + debitoVenezuelaCredito + debitoSofitasaContado + debitoSofitasaCredito;
        const sumatoria_credito_facturas_credito_contado = creditoBanescoContado + creditoBanescoCredito + creditoProvincialContado + creditoProvincialCredito + creditoMercantilContado + creditoMercantilCredito + creditoVenezuelaContado + creditoVenezuelaCredito + creditoSofitasaContado + creditoSofitasaCredito;

        //////////////////////////////////SUMATORIAS DE RECUADRO QUINTO//////////////////////////////////////////
        let sumatoria_total_provincial = transPronvincial + debitoProvincial + creditoProvincial;
        let sumatoria_total_sofitasa = transSofitasa + debitoSofitasa + creditoSofitasa;
        let sumatoria_total_mercantil = transMercantil + debitoMercantil + creditoMercantil;
        let sumatoria_total_banesco = transBanesco + debitoBanesco + creditoBanesco;
        let sumatoria_total_venezuela = transVenezuela + debitoVenezuela + creditoVenezuela;
        let sumatoria_total_100_banco = trans100Banco + debito100banco + credito100Banco;

        //////////////////////PRIMER Y ULTIMA FACTURA/////////////////////////
        if(facturas.length == 1){
            facturaPRI = facturas[0]
            facturaULT = facturas[0]
        }else if(facturas.length > 1){
            facturaPRI = facturas.shift();
            facturaULT = facturas.pop();
        }else if(facturas.length == 0){
            facturaPRI = 0
            facturaULT = 0
        }

        //console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!", facturaPRI, facturaULT)
        /////////////ABONOS EFECTIVO////////////////
        balance.abonos_bolivares_efectivo = efectivoBCredito //+ abonadoB;
        balance.abonos_pesos_efectivo = efectivoPCredito //+ abonadoP;
        balance.abonos_dolares_efectivo = Number(Math.round(efectivoDCredito + "e+2") + "e-2").toLocaleString('de-DE'); //+ abonadoD;
        ////////////DESCUENTO TOTAL/////////////////
        balance.descuento_total_dolares = Number(Math.round(descuentoD + "e+2") + "e-2").toLocaleString('de-DE');
        balance.descuento_total_bolivares = Number(Math.round(descuentoB + "e+2") + "e-2").toLocaleString('de-DE');
        balance.descuento_total_pesos =  Number(Math.round(descuentoP + "e+2") + "e-2").toLocaleString('de-DE');
        balance.cantidad_facturas_con_descuento = cantidadFacturasDescuentos;
        balance.facturas_con_descuento = detallesDescontadas;
        ////////////GANANCIA TARJETAS DE DEBITO NACIONALES////////
        balance.ganancia_debito_banesco = Number(Math.round((debitoBanesco) + "e+2") + "e-2");;
        balance.ganancia_debito_provincial = Number(Math.round((debitoProvincial) + "e+2") + "e-2");
        balance.ganancia_debito_mercantil = Number(Math.round((debitoMercantil) + "e+2") + "e-2");;
        balance.ganancia_debito_venezuela = Number(Math.round((debitoVenezuela) + "e+2") + "e-2")
        balance.ganancia_debito_sofitasa = Number(Math.round((debitoSofitasa) + "e+2") + "e-2")
        balance.ganancia_debito_100_banco = Number(Math.round((debito100banco) + "e+2") + "e-2")
        balance.total_tarjeta_debito_bancos_nacionales = Number(Math.round((debitoBanesco + debitoProvincial + debitoMercantil + debitoVenezuela + debitoSofitasa + debito100banco) + "e+2") + "e-2");
        //////////GANANCIA TARJETAS DE CREDITO NACIONALES////////
        balance.ganancia_credito_banesco = Number(Math.round((creditoBanesco) + "e+2") + "e-2")
        balance.ganancia_credito_provincial = Number(Math.round((creditoProvincial) + "e+2") + "e-2")
        balance.ganancia_credito_mercantil = Number(Math.round((creditoMercantil) + "e+2") + "e-2")
        balance.ganancia_credito_venezuela = Number(Math.round((creditoVenezuela) + "e+2") + "e-2")
        balance.ganancia_credito_sofitasa = Number(Math.round((creditoSofitasa) + "e+2") + "e-2")
        balance.ganancia_credito_100_banco = Number(Math.round((credito100Banco) + "e+2") + "e-2")
        balance.total_tarjeta_credito_bancos_nacionales = Number(Math.round((creditoBanesco + creditoProvincial + creditoMercantil + creditoVenezuela + creditoSofitasa + credito100Banco) + "e+2") + "e-2");

        /////////GANANCIA TRANSFERENCIAS NACIONALES//////////////
        balance.ganancia_transferencia_banesco = Number(Math.round((transBanesco) + "e+2") + "e-2");
        balance.ganancia_transferencia_provincial = Number(Math.round((transPronvincial) + "e+2") + "e-2");
        balance.ganancia_transferencia_mercantil = Number(Math.round((transMercantil) + "e+2") + "e-2");
        balance.ganancia_transferencia_venezuela = Number(Math.round((transVenezuela) + "e+2") + "e-2");
        balance.ganancia_transferencia_sofitasa = Number(Math.round((transSofitasa) + "e+2") + "e-2");
        balance.ganancia_transferencia_100_banco = Number(Math.round((trans100Banco) + "e+2") + "e-2");
        //balance.total_transferencias_bancos_nacionales = Number(Math.round((transBanesco + transPronvincial + transMercantil + transVenezuela + transSofitasa + trans100Banco) + "e+2") + "e-2");
        balance.total_transferencias_bancos_nacionales = Number(Math.round((total_transBancos_factura_contado + igtfBTransferencia + total_transBancos_factura_credito) + "e+2") + "e-2");
        /////////GANANCIA TRANSFERENCIAS INTERNACIONALES//////////////
        balance.ganancia_transferencia_zelle = Number(Math.round((zelle) + "e+2") + "e-2");
        balance.ganancia_transferencia_bancolombia = Number(Math.round((bancolombia /*+ igtfPTransferencia*/) + "e+2") + "e-2");
        balance.ganancia_transferencia_paypal = Number(Math.round((paypal) + "e+2") + "e-2");
        ////////TOTAL DE GANANCIAS POR TRANSFERENCIAS EN BOLIVARES DE BANCOS NACIONALES FACTURAS AL CONTADO///////////////////
        balance.total_transBancos_factura_contado = Number(Math.round((total_transBancos_factura_contado + igtfBTransferencia) + "e+2") + "e-2");
        ////////TOTAL DE GANANCIAS POR TARJETA DE DEBITO EN BOLIVARES DE BANCOS NACIONALES FACTURAS AL CONTADO///////////////////
        balance.total_debitoBancos_factura_contado = Number(Math.round((total_debitoBancos_factura_contado + igtfBDebito) + "e+2") + "e-2");
        ////////TOTAL DE GANANCIAS POR TARJETA DE CREDITO EN BOLIVARES DE BANCOS NACIONALES FACTURAS AL CONTADO///////////////////
        balance.total_creditoBancos_factura_contado = Number(Math.round((total_creditoBancos_factura_contado) + "e+2") + "e-2");
        ////////TOTAL DE EFECTIVO EN BOLIVARES, PESOS Y DOLARES DE FACTURAS AL CONTADO///////////////////
        balance.efectivo_pesos_factura_contado = Number(Math.round((efectivoPContado + sumaPesosIGTFVueltosEfectivo) + "e+2") + "e-2");
        balance.efectivo_dolares_factura_contado = Number(Math.round((efectivoDContado + sumaDolaresIGTFVueltosEfectivo) + "e+2") + "e-2");
        balance.efectivo_bolivares_factura_contado = Number(Math.round((efectivoBContado + sumaBolivaresIGTFVueltosEfectivo) + "e+2") + "e-2");
        ///////////////////////////TOTAL DE TRANSFERENCIAS EN BANCOLOMBIA ZELLE Y PAYPAL FACTURAS AL CONTADO///////////////////////
        balance.zelle_factura_contado = Number(Math.round((zelleFacturaContado) + "e+2") + "e-2");
        balance.bancolombia_factura_contado = Number(Math.round((bancolombiaFacturaContado) + "e+2") + "e-2");
        balance.paypal_factura_contado = Number(Math.round((paypalFacturaContado) + "e+2") + "e-2");
        /////////////INGRESOS POR FACTURAS AL CONTADO////////////////
        balance.ganancia_factura_contado_bolivares = Number(Math.round(contadoB + "e+2") + "e-2");
        balance.ganancia_orden_trabajo_bolivares = Number(Math.round(contadoBOrdenTrabajo + "e+2") + "e-2");
        //balance.ganancia_factura_contado_dolares = Number(Math.round(contadoD + "e+2") + "e-2");
        //balance.ganancia_factura_contado_pesos = Number(Math.round(contadoP + "e+2") + "e-2");
        ////////////DESCUENTO POR FACTURAS AL CONTADO/////////////////
        balance.descuento_pesos_factura_contado = Number(Math.round((descuento_pesos_factura_contado) + "e+2") + "e-2");
        balance.descuento_dolares_factura_contado = Number(Math.round((descuento_dolares_factura_contado) + "e+2") + "e-2");
        balance.descuento_bolivares_factura_contado = Number(Math.round((descuento_bolivares_factura_contado) + "e+2") + "e-2");
        //////////////CANTIDAD DE FACTURAS AL CONTADO///////////////
        balance.cantidad_facturas_contado = Number(Math.round((cantidad_facturas_contado) + "e+2") + "e-2");
        /////////////SUMA TOTAL DE GANANCIAS DE FACTURAS AL CONTADO///////////////////////
        
        balance.total_factura_contado = Number(Math.round(total_factura_contado + "e+2") + "e-2");
        /////////////INGRESOS POR FACTURAS A CREDITO////////////////
        balance.ganancia_factura_credito_bolivares = Number(Math.round((creditoB) + "e+2") + "e-2");
        balance.ganancia_factura_credito_dolares = Number(Math.round(creditoD + "e+2") + "e-2");
        balance.ganancia_factura_credito_pesos = Number(Math.round(creditoP + "e+2") + "e-2");
        ////////////DESCUENTO POR FACTURAS A CREDITO/////////////////
        balance.descuento_pesos_factura_credito = Number(Math.round((descuento_pesos_factura_credito) + "e+2") + "e-2"); 
        balance.descuento_dolares_factura_credito = Number(Math.round((descuento_dolares_factura_credito) + "e+2") + "e-2");
        balance.descuento_bolivares_factura_credito = Number(Math.round((descuento_bolivares_factura_credito) + "e+2") + "e-2");
        ///////////////////CANTIDAD FACTURAS A CREDITO///////////////////////
        balance.cantidad_facturas_credito = Number(Math.round((cantidad_facturas_credito) + "e+2") + "e-2");
        //////////////////SUMATORIA TOTAL DE TRANSFERENCIAS A FACTURAS A CREDITO//////////////////////////////////
        balance.total_transBancos_factura_credito = Number(Math.round((total_transBancos_factura_credito) + "e+2") + "e-2");
        /////////////////SUMATORIA TOTAL EN TARJETAS DE DEBITO A FACTURAS A CREDITO////////////////////////////////
        balance.total_debitoBancos_factura_credito = Number(Math.round((total_debitoBancos_factura_credito) + "e+2") + "e-2");
        ////////TOTAL DE GANANCIAS POR TARJETA DE CREDITO EN BOLIVARES DE BANCOS NACIONALES A FACTURAS A CREDITO////////////////
        balance.total_creditoBancos_factura_credito = Number(Math.round((total_creditoBancos_factura_credito) + "e+2") + "e-2");
        /////////////////TRANSFERENCIA EN BANCOLOMBIA, ZELLE Y PAYPAL EN FACTURAS A CREDITO///////////////////////
        balance.zelleFacturaCredito = Number(Math.round((zelleFacturaCredito) + "e+2") + "e-2");
        balance.bancolombiaFacturaCredito = Number(Math.round((bancolombiaFacturaCredito) + "e+2") + "e-2");
        balance.paypalFacturaCredito = Number(Math.round((paypalFacturaCredito) + "e+2") + "e-2");
        /////////////SUMA TOTAL DE GANANCIAS DE FACTURAS A CREDITO///////////////////////
        balance.total_factura_credito = Number(Math.round((total_factura_credito) + "e+2") + "e-2");
        /////////////SUMA DE FACTURAS A CREDITO Y CONTADO////////////////
        balance.monto_total_facturas_pesos = Number(Math.round(monto_total_facturas_pesos + "e+2") + "e-2");
        balance.monto_total_facturas_dolares = Number(Math.round(monto_total_facturas_dolares + "e+2") + "e-2");
        balance.monto_total_facturas_bolivares = Number(Math.round(monto_total_facturas_bolivares + "e+2") + "e-2");
        ///////////////////SUMATORIA DE TARJETAS DE DEBITO Y CREDITO EN FACTURAS AL CONTADO////////////////////////////////////////////
        balance.sumatoria_debito_facturas_credito_contado = Number(Math.round((sumatoria_debito_facturas_credito_contado) + "e+2") + "e-2");
        ///////////////////SUMATORIA DE TARJETAS DE CREDITO Y CREDITO EN FACTURAS AL CONTADO////////////////////////////////////////////
        balance.sumatoria_credito_facturas_credito_contado = Number(Math.round((sumatoria_credito_facturas_credito_contado) + "e+2") + "e-2");
        ////////////SUMA DE CANTIDADES DE FACTURAS A CONTADO Y CREDITO////////
        balance.sumatoria_cantidad_credito_contado = Number(Math.round((cantidad_facturas_contado + cantidad_facturas_credito) + "e+2") + "e-2");
        /////////////FACTURAS ANULADAS////////////////////////////
        balance.factura_anulada_bolivares = Number(Math.round(anuladoB + "e+2") + "e-2");
        balance.factura_anulada_dolares = Number(Math.round(anuladoD + "e+2") + "e-2");
        balance.factura_anulada_pesos = Number(Math.round(anuladoP + "e+2") + "e-2");
        ///////////////DESCUENTOS DE FACTURAS ANULADAS//////////////////////
        balance.descuento_pesos_factura_anulado = Number(Math.round(descuento_pesos_factura_anulado + "e+2") + "e-2");
        balance.descuento_dolares_factura_anulado = Number(Math.round(descuento_dolares_factura_anulado + "e+2") + "e-2");
        balance.descuento_bolivares_factura_anulado = Number(Math.round(descuento_bolivares_factura_anulado + "e+2") + "e-2");
        /////////////////CANTIDAD DE FACTURAS ANULADAS///////////////////////////
        balance.cantidad_facturas_anuladas = cantidad_facturas_anuladas;
        /////////////EFECTIVO RECAUDADO////////////////////////////
        balance.efectivo_dolares = Number(Math.round((/*efectivoD*/efectivoDContado + efectivoDCredito + sumaDolaresIGTFVueltosEfectivo) + "e+2") + "e-2");
        balance.efectivo_pesos = Number(Math.round((/*efectivoP*/efectivoPContado + efectivoPCredito + sumaPesosIGTFVueltosEfectivo) + "e+2") + "e-2");
        balance.efectivo_bolivares = Number(Math.round((/*efectivoB*/efectivoBContado + /*efectivoBCredito +*/ sumaBolivaresIGTFVueltosEfectivo) + "e+2") + "e-2");
        ///////////////////SUMATORIA TOTAL DE TARJETAS DE DEBITO Y CREDITO Y TRANSFERENCIAS DE BANCOS NACIONALES///////////////////////////
        balance.sumatoria_total_provincial = Number(Math.round(sumatoria_total_provincial + "e+2") + "e-2");
        balance.sumatoria_total_sofitasa = Number(Math.round(sumatoria_total_sofitasa + "e+2") + "e-2");
        balance.sumatoria_total_mercantil = Number(Math.round(sumatoria_total_mercantil + "e+2") + "e-2");
        balance.sumatoria_total_banesco = Number(Math.round(sumatoria_total_banesco + "e+2") + "e-2");
        balance.sumatoria_total_venezuela = Number(Math.round(sumatoria_total_venezuela + "e+2") + "e-2");
        balance.sumatoria_total_100_banco = Number(Math.round(sumatoria_total_100_banco + "e+2") + "e-2");
        /////////////ABONOS HECHOS EN LA FECHA/////////////////////
        balance.abonos_dolares = Number(Math.round(abonadoD + "e+2") + "e-2");
        balance.abonos_pesos = Number(Math.round(abonadoP + "e+2") + "e-2");
        balance.abonos_bolivares = Number(Math.round(abonadoB + "e+2") + "e-2");
        ////////////////////PRIMERA Y ULTIMA FACTURA/////////////////
        balance.primera_factura = facturaPRI;
        balance.segunda_factura = facturaULT;
        //////////////DESTELLES DE FACTURAS ANULADAS/////////////////
        //console.log("DETALLES ANULADAS!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!", balance.detalles_facturas_anuladas)
        balance.detalles_facturas_anuladas = detallesAnuladas;
        //////////////FACTURAS A CREDITO DE CONVENIOS///////////////////
        balance.sumatoria_bolivares_factura_credito_convenio = Number(Math.round(creditoBConvenio + "e+2") + "e-2"),
        balance.sumatoria_pesos_factura_credito_convenio = Number(Math.round(creditoPConvenio + "e+2") + "e-2"),
        balance.sumatoria_dolares_factura_credito_convenio = Number(Math.round(creditoDConvenio + "e+2") + "e-2"),
        balance.cantidad_facturas_credito_convenio = cantidadFacturaCreditoConvenio,
        //////////////FACTURAS A CREDITO DE PARTICULARES////////////////
        balance.sumatoria_bolivares_factura_credito_particulares = Number(Math.round(creditoBParticular + "e+2") + "e-2"),
        balance.sumatoria_pesos_factura_credito_particulares = Number(Math.round(creditoPParticular + "e+2") + "e-2"),
        balance.sumatoria_dolares_factura_credito_particulares =  Number(Math.round(creditoDParticular + "e+2") + "e-2"),
        balance.cantidad_facturas_credito_particulares = cantidadFacturaCreditoParticular,
        /////////////////////////////DESCRIPCION DE ORDENES DE TRABAJO///////////////////////////////////
        balance.total_ordenes_trabajo = totalOrdenesTrabajo, 
        balance.total_bolivares_ordenes_trabajo_bolivares = Number(Math.round((totalBsOrdenesTrabajo) + "e+2") + "e-2"),
        balance.total_pesos_ordenes_trabajo = Number(Math.round(totalPesosOrdenesTrabajo + "e+2") + "e-2"),
        balance.total_dolares_ordenes_trabajo = Number(Math.round(totalDolaresOrdenesTrabajo + "e+2") + "e-2")
    //////////////SECCION DE IGTF///////////////////////
        //////////////////SUMATORIA DE IGTF TOTALES/////////////////////////////
        balance.IGTF_bolivares_transferencia = Number(Math.round((igtfBTransferencia) + "e+2") + "e-2");
        balance.IGTF_pesos_transferencia = Number(Math.round((igtfPTransferencia) + "e+2") + "e-2");
        balance.IGTF_dolares_transferencia = Number(Math.round((igtfDTransferencia) + "e+2") + "e-2");
        balance.IGTF_bolivares_tarjeta_credito = Number(Math.round((igtfBEfectivo) + "e+2") + "e-2");
        balance.IGTF_pesos_tarjeta_credito = Number(Math.round(igtfPCredito + "e+2") + "e-2");
        balance.IGTF_dolares_tarjeta_credito = Number(Math.round(igtfDCredito + "e+2") + "e-2");
        balance.IGTF_bolivares = Number(Math.round((igtfB + (igtfD * bolivares) + ((igtfP / pesos)) * bolivares) + "e+2") + "e-2")
        balance.IGTF_pesos = Number(Math.round(igtfP + "e+2") + "e-2"),
        balance.IGTF_dolares = igtfD//Number(Math.round(igtfD + "e+2") + "e-2"),
        balance.IGTF_bolivares_efectivo = Number(Math.round(igtfBEfectivo + "e+2") + "e-2");
        balance.IGTF_pesos_efectivo = Number(Math.round(igtfPEfectivo + "e+2") + "e-2"); 
        balance.IGTF_dolares_efectivo = Number(Math.round(igtfDEfectivo + "e+2") + "e-2"); 
        balance.IGTF_bolivares_tarjeta_debito = Number(Math.round(igtfBDebito + "e+2") + "e-2");
        balance.IGTF_pesos_tarjeta_debito = Number(Math.round(igtfPDebito + "e+2") + "e-2"); 
        balance.IGTF_dolares_factura_debito = Number(Math.round(igtfDDebito + "e+2") + "e-2");
        ///////////////////////////////////////////////////////////////////////
        /////////////////SUMATORIA DE IGTF POR FACTURAS A CREDITO////////////////////////////////
        balance.IGTF_bolivares_transferencia_factura_credito = Number(Math.round(igtfBTransferenciaFacturaCredito + "e+2") + "e-2");
        balance.IGTF_pesos_transferencia_factura_credito = Number(Math.round(igtfPTransferenciaFacturaCredito + "e+2") + "e-2");
        balance.IGTF_dolares_transferencia_factura_credito = Number(Math.round(igtfDTransferenciaFacturaCredito + "e+2") + "e-2");
        balance.IGTF_bolivares_tarjeta_credito_factura_credito = Number(Math.round(igtfBEfectivoFacturaCredito + "e+2") + "e-2");
        balance.IGTF_pesos_tarjeta_credito_factura_credito = Number(Math.round(igtfPCreditoFacturaCredito + "e+2") + "e-2");
        balance.IGTF_dolares_tarjeta_credito_factura_credito = Number(Math.round(igtfDCreditoFacturaCredito + "e+2") + "e-2"),
        balance.IGTF_bolivares_factura_credito = Number(Math.round((igtfBFacturaCredito + (((igtfPFacturaCredito / pesos) * bolivares) + (igtfDFacturaCredito * bolivares))) + "e+2") + "e-2"), //Number(Math.round(igtfBFacturaCredito + "e+2") + "e-2"),
        balance.IGTF_pesos_factura_credito =  Number(Math.round(igtfPFacturaCredito + "e+2") + "e-2"),
        balance.IGTF_dolares_factura_credito = Number(Math.round(igtfDFacturaCredito + "e+2") + "e-2"),
        balance.IGTF_bolivares_efectivo_factura_credito = Number(Math.round(igtfBEfectivoFacturaCredito + "e+2") + "e-2");
        balance.IGTF_pesos_efectivo_factura_credito = Number(Math.round(igtfPEfectivoFacturaCredito + "e+2") + "e-2"); 
        balance.IGTF_dolares_efectivo_factura_credito = Number(Math.round(igtfDEfectivoFacturaCredito + "e+2") + "e-2"); 
        balance.IGTF_bolivares_tarjeta_debito_factura_credito = Number(Math.round(igtfBDebitoFacturaCredito + "e+2") + "e-2");
        balance.IGTF_pesos_tarjeta_debito_factura_credito = Number(Math.round(igtfPDebitoFacturaCredito + "e+2") + "e-2"); 
        balance.IGTF_dolares_factura_debito_factura_credito = Number(Math.round(igtfDDebitoFacturaCredito + "e+2") + "e-2");
        /////////////////////////////////////////////////////////////////////////////////////////
        /////////////////SUMATORIA DE IGTF POR FACTURAS A CONTADO////////////////////////////////
        balance.IGTF_bolivares_transferencia_factura_contado = Number(Math.round(igtfBTransferenciaFacturaContado + "e+2") + "e-2");
        balance.IGTF_pesos_transferencia_factura_contado = Number(Math.round(igtfPTransferenciaFacturaContado + "e+2") + "e-2");
        balance.IGTF_dolares_transferencia_factura_contado = Number(Math.round(igtfDTransferenciaFacturaContado + "e+2") + "e-2");
        balance.IGTF_bolivares_tarjeta_credito_factura_contado = Number(Math.round(igtfBCreditoFacturaContado + "e+2") + "e-2");
        balance.IGTF_pesos_tarjeta_credito_factura_contado = Number(Math.round(igtfPCreditoFacturaContado + "e+2") + "e-2");
        balance.IGTF_dolares_tarjeta_credito_factura_contado = Number(Math.round(igtfDCreditoFacturaContado + "e+2") + "e-2");
        balance.IGTF_bolivares_factura_contado = Number(Math.round((igtfBFacturaContado + (((igtfPFacturaContado / pesos) * bolivares) + (igtfDFacturaContado * bolivares))) + "e+2") + "e-2"),
        //balance.IGTF_pesos_factura_contado = Number(Math.round(igtfPFacturaContado + "e+2") + "e-2"),
        //balance.IGTF_dolares_factura_contado = Number(Math.round(igtfDFacturaContado + "e+2") + "e-2"),
        balance.IGTF_bolivares_efectivo_factura_contado = igtfBEfectivoFacturaContado,
        balance.IGTF_pesos_efectivo_factura_contado = Number(Math.round(igtfPEfectivoFacturaContado + "e+2") + "e-2"); 
        balance.IGTF_dolares_efectivo_factura_contado = Number(Math.round(igtfDEfectivoFacturaContado + "e+2") + "e-2"); 
        balance.IGTF_bolivares_tarjeta_debito_factura_contado = Number(Math.round(igtfBDebitoFacturaContado + "e+2") + "e-2");
        balance.IGTF_pesos_tarjeta_debito_factura_contado = Number(Math.round(igtfPDebitoFacturaContado + "e+2") + "e-2"); 
        balance.IGTF_dolares_factura_debito_factura_contado = Number(Math.round(igtfDDebitoFacturaContado + "e+2") + "e-2");
        /////////////////////////////////////////////////////////////////////////////////////////
        ////////////////////////////////SUMATORIAS TOTALES DE IGTF//////////////////////////////
        balance.IGTF_total_bolivares = Number(Math.round((igtfBFacturaContado + igtfBFacturaCredito) + "e+2") + "e-2"),
        balance.IGTF_total_pesos = Number(Math.round((igtfPFacturaContado + igtfPFacturaCredito) + "e+2") + "e-2"),
        balance.IGTF_total_dolares =  Number(Math.round((igtfDFacturaContado + igtfDFacturaCredito) + "e+2") + "e-2"),
        balance.IGTF_total_bolivares_transferencia = Number(Math.round((igtfBTransferenciaFacturaContado + igtfBTransferenciaFacturaCredito) + "e+2") + "e-2");
        balance.IGTF_total_pesos_transferencia = Number(Math.round((igtfPTransferenciaFacturaContado + igtfPTransferenciaFacturaCredito) + "e+2") + "e-2");
        balance.IGTF_total_dolares_transferencia = Number(Math.round((igtfDTransferenciaFacturaContado + igtfDTransferenciaFacturaCredito) + "e+2") + "e-2");
        balance.IGTF_total_bolivares_tarjetas_credito = Number(Math.round((igtfBCreditoFacturaContado + igtfBCreditoFacturaCredito) + "e+2") + "e-2");
        balance.IGTF_total_pesos_tarjetas_credito = Number(Math.round((igtfPCreditoFacturaContado + igtfPCreditoFacturaCredito) + "e+2") + "e-2");
        balance.IGTF_total_dolares_tarjetas_credito = Number(Math.round((igtfDCreditoFacturaContado + igtfDCreditoFacturaCredito) + "e+2") + "e-2");
        balance.IGTF_total_bolivares_tarjetas_debito = Number(Math.round((igtfBDebitoFacturaContado + igtfBDebitoFacturaCredito) + "e+2") + "e-2");
        balance.IGTF_total_pesos_tarjetas_debito = Number(Math.round((igtfPDebitoFacturaContado + igtfPDebitoFacturaCredito) + "e+2") + "e-2");
        balance.IGTF_total_dolares_tarjetas_debito = Number(Math.round((igtfDDebitoFacturaContado + igtfDDebitoFacturaCredito) + "e+2") + "e-2");

        ////////////////////////////SECCION DE RECIBOS/////////////////////////////////
        ////////////////////////////SUMATORIA DE DIVISAS GENERAL DE RECIBOS////////////////////////
        /////////////SUMATORIA DE REGISTROS CONVENIOS////////////////////
        balance.total_recibos_bolivares_registro_convenio = Number(Math.round((totalBolivaresReciboRegistroConvenio) + "e+2") + "e-2");
        balance.total_recibos_pesos_registro_convenio = Number(Math.round((totalPesosReciboRegistroConvenio) + "e+2") + "e-2");
        balance.total_recibos_dolares_registro_convenio = Number(Math.round((totalDolaresReciboRegistroConvenio) + "e+2") + "e-2");
        ////////////SUMATORIA DE FACTURAS A CREDITO//////////////////////
        balance.total_recibos_bolivares_facturas_credito = Number(Math.round((totalBolivaresReciboFacturasCredito) + "e+2") + "e-2");
        balance.total_recibos_pesos_facturas_credito = Number(Math.round((totalPesosReciboFacturasCredito) + "e+2") + "e-2");
        balance.total_recibos_dolares_facturas_credito = Number(Math.round((totalDolaresReciboFacturasCredito) + "e+2") + "e-2");
        /////////////////////NOTAS A CREDITO/////////////////////////////
        balance.notas_a_credito = notasCredito;
        //res.send(facturas);
        res.send(balance);
    }
        async function buscarNotasCreditoCC(notasCredito, sqlNotasCredito) {
            return new Promise((resolve, reject) => {
                connection.query(sqlNotasCredito, function (err, result, fields) {
                    if (err) {
                        console.log('ERROR en CheckTemplate', err);
                        res.send('3');
                    }
                    if(result){
                        notasCredito = result;
                        //console.log("!!!!!!!!!!!!!!!!!", result)
                        resolve(notasCredito);
                        //res.send(result)
                    }
                });
            })
        }

        async function buscarFacturas(facturas, sql) {
            return new Promise((resolve, reject) => {
                connection.query(sql, function (err, result, fields) {
                    if (err) {
                        console.log('ERROR en CheckTemplate', err);
                        res.send('3');
                    }
                    if(result){
                        facturas = result;
                        //console.log("!!!!!!!!!!!!!!!!!", result)
                        resolve(facturas);
                        //res.send(result)
                    }
                });
            })
        }

        async function buscarRegistrosPagoOutRango(primerId, ultimoId, idUsuario, idUsuario2, idUsuario3) {
            return new Promise((resolve, reject) => {
                let sql = "SELECT tbl_registro_pago.id_registro_pago, CAST(tbl_registro_pago.tipo_registro AS INT) AS tipo_registro, DATE_FORMAT(tbl_registro_pago.fecha_creacion, '%d-%m-%Y %T') AS fecha_creacion, tbl_registro_pago.id_factura, tbl_registro_pago.id_nota_credito, tbl_registro_pago.id_nota_debito, tbl_registro_pago.id_recibo, tbl_registro_pago.id_registro_divisa, tbl_registro_pago.id_tipo_pago, tbl_registro_pago.id_banco, tbl_registro_pago.numero_referencia, tbl_registro_pago.monto, tbl_registro_pago.id_usuario, tbl_tipo_pago.tipo_pago_nombre, tbl_banco.banco_nombre, tbl_registro_divisa.id_divisa, CAST(tbl_registro_pago.igtf_pago AS INT) AS igtf_pago, tbl_divisa.divisa_nombre FROM tbl_registro_pago LEFT JOIN tbl_tipo_pago ON tbl_tipo_pago.id_tipo_pago = tbl_registro_pago.id_tipo_pago LEFT JOIN tbl_banco ON tbl_banco.id_banco = tbl_registro_pago.id_banco LEFT JOIN tbl_registro_divisa ON tbl_registro_pago.id_registro_divisa = tbl_registro_divisa.id_registro_divisa LEFT JOIN tbl_divisa ON tbl_divisa.id_divisa = tbl_registro_divisa.id_divisa WHERE (tbl_registro_pago.id_factura NOT BETWEEN '"+primerId+"' AND '"+ultimoId+"') AND (tbl_registro_pago.fecha_creacion BETWEEN '"+req.body.from+"' AND '"+req.body.to+"') AND (tbl_registro_pago.id_usuario = '"+idUsuario+"' OR tbl_registro_pago.id_usuario = '"+idUsuario2+"' OR tbl_registro_pago.id_usuario = '"+idUsuario3+"')";
                console.log("-----------------------", sql)
                connection.query(sql, function (err, result, fields) {
                    if (err) {
                        console.log('ERROR en CheckTemplate', err);
                        res.send('3');
                    }
                    if(result){
                        registroPago = result
                        resolve(registroPago);
                        //res.send(result)
                    }
                });
            })
        }

        async function buscarRegistrosPagoOutRangoNoFacturas(idUsuario, idUsuario2, idUsuario3) {
            return new Promise((resolve, reject) => {
                let sql = "SELECT tbl_registro_pago.id_registro_pago, CAST(tbl_registro_pago.tipo_registro AS INT) AS tipo_registro, DATE_FORMAT(tbl_registro_pago.fecha_creacion, '%d-%m-%Y %T') AS fecha_creacion, tbl_registro_pago.id_factura, tbl_registro_pago.id_nota_credito, tbl_registro_pago.id_nota_debito, tbl_registro_pago.id_recibo, tbl_registro_pago.id_registro_divisa, tbl_registro_pago.id_tipo_pago, tbl_registro_pago.id_banco, tbl_registro_pago.numero_referencia, tbl_registro_pago.monto, tbl_registro_pago.id_usuario, tbl_tipo_pago.tipo_pago_nombre, tbl_banco.banco_nombre, tbl_registro_divisa.id_divisa, CAST(tbl_registro_pago.igtf_pago AS INT) AS igtf_pago, tbl_divisa.divisa_nombre FROM tbl_registro_pago LEFT JOIN tbl_tipo_pago ON tbl_tipo_pago.id_tipo_pago = tbl_registro_pago.id_tipo_pago LEFT JOIN tbl_banco ON tbl_banco.id_banco = tbl_registro_pago.id_banco LEFT JOIN tbl_registro_divisa ON tbl_registro_pago.id_registro_divisa = tbl_registro_divisa.id_registro_divisa LEFT JOIN tbl_divisa ON tbl_divisa.id_divisa = tbl_registro_divisa.id_divisa WHERE (tbl_registro_pago.fecha_creacion BETWEEN '"+req.body.from+"' AND '"+req.body.to+"') AND (tbl_registro_pago.fecha_creacion BETWEEN '"+req.body.from+"' AND '"+req.body.to+"') AND (tbl_registro_pago.id_usuario = '"+idUsuario+"' OR tbl_registro_pago.id_usuario = '"+idUsuario2+"' OR tbl_registro_pago.id_usuario = '"+idUsuario3+"')";
                console.log("-----------------------", sql)
                connection.query(sql, function (err, result, fields) {
                    if (err) {
                        console.log('ERROR en CheckTemplate', err);
                        res.send('3');
                    }
                    if(result){
                        registroPago = result
                        resolve(registroPago);
                        //res.send(result)
                    }
                });
            })
        }


        async function buscarRegistrosPago(item, registroPago) {
            return new Promise((resolve, reject) => {
                let sql = "SELECT tbl_registro_pago.id_registro_pago, CAST(tbl_registro_pago.tipo_registro AS INT) AS tipo_registro, DATE_FORMAT(tbl_registro_pago.fecha_creacion, '%d-%m-%Y %T') AS fecha_creacion, tbl_registro_pago.id_factura, tbl_registro_pago.id_nota_credito, tbl_registro_pago.id_nota_debito, tbl_registro_pago.id_recibo, tbl_registro_pago.id_registro_divisa, tbl_registro_pago.id_tipo_pago, tbl_registro_pago.id_banco, tbl_registro_pago.numero_referencia, tbl_registro_pago.monto, tbl_tipo_pago.tipo_pago_nombre, tbl_registro_pago.id_usuario, tbl_banco.banco_nombre, tbl_registro_divisa.id_divisa, CAST(tbl_registro_pago.igtf_pago AS INT) AS igtf_pago, tbl_divisa.divisa_nombre FROM tbl_registro_pago LEFT JOIN tbl_tipo_pago ON tbl_tipo_pago.id_tipo_pago = tbl_registro_pago.id_tipo_pago LEFT JOIN tbl_banco ON tbl_banco.id_banco = tbl_registro_pago.id_banco LEFT JOIN tbl_registro_divisa ON tbl_registro_pago.id_registro_divisa = tbl_registro_divisa.id_registro_divisa LEFT JOIN tbl_divisa ON tbl_divisa.id_divisa = tbl_registro_divisa.id_divisa WHERE tbl_registro_pago.id_factura='" + item.id_factura + "' AND (tbl_registro_pago.fecha_creacion BETWEEN '"+req.body.from+"' AND '"+req.body.to+"')";
                connection.query(sql, function (err, result, fields) {
                    if (err) {
                        console.log('ERROR en CheckTemplate', err);
                        res.send('3');
                    }
                    if(result){
                        registroPago = result
                        resolve(registroPago);
                        //res.send(result)
                    }
                });
            })
        }
        async function buscarRegistrosPagoRecibo(item, registroPago) {
            return new Promise((resolve, reject) => {
                let sql = "SELECT tbl_registro_pago.id_registro_pago, tbl_registro_pago.id_usuario, DATE_FORMAT(tbl_registro_pago.fecha_creacion, '%d-%m-%Y %T') AS fecha_creacion, tbl_registro_pago.igtf_pago, tbl_registro_pago.id_factura, CAST(tbl_registro_pago.tipo_registro AS INT) AS tipo_registro, tbl_registro_pago.id_nota_credito, tbl_registro_pago.id_nota_debito, tbl_registro_pago.id_recibo, tbl_registro_pago.id_registro_divisa, tbl_registro_pago.id_tipo_pago, tbl_registro_pago.id_banco, tbl_registro_pago.numero_referencia, tbl_registro_pago.monto, tbl_tipo_pago.tipo_pago_nombre, tbl_banco.banco_nombre, tbl_registro_divisa.id_divisa, tbl_divisa.divisa_nombre FROM tbl_registro_pago LEFT JOIN tbl_tipo_pago ON tbl_tipo_pago.id_tipo_pago = tbl_registro_pago.id_tipo_pago LEFT JOIN tbl_banco ON tbl_banco.id_banco = tbl_registro_pago.id_banco LEFT JOIN tbl_registro_divisa ON tbl_registro_pago.id_registro_divisa = tbl_registro_divisa.id_registro_divisa LEFT JOIN tbl_divisa ON tbl_divisa.id_divisa = tbl_registro_divisa.id_divisa WHERE tbl_registro_pago.id_recibo='" + item.id_recibo + "' AND (tbl_registro_pago.fecha_creacion BETWEEN '"+req.body.from+"' AND '"+req.body.to+"')";
                connection.query(sql, function (err, result, fields) {
                    if (err) {
                        console.log('ERROR en CheckTemplate', err);
                        res.send('3');
                    }
                    if(result){
                        registroPago = result
                        resolve(registroPago);
                        //res.send(result)
                    }
                });
            })
        }
        async function buscarRegistroDivisas(registros) {
            return new Promise((resolve, reject) => {
                const sql = "SELECT a.tasa_actual, a.id_registro_divisa, a.id_divisa, c.divisa_nombre FROM tbl_registro_divisa a LEFT JOIN tbl_divisa c ON c.id_divisa = a.id_divisa WHERE id_registro_divisa = (SELECT MAX(id_registro_divisa) FROM `tbl_registro_divisa` b WHERE a.id_divisa = b.id_divisa)"
                connection.query(sql, function (err, result, fie) {
                    if (err) {
                        console.log('error en la conexion intente de nuevo', err)
                        res.send('3')
                    }
                    //console.log("EL RESULT!!!!!!!", result)
                    registros = result;
                    resolve(registros);
                })
            })
        }

        async function buscarRecibos(recibos, sqlRecibos) {
            return new Promise((resolve, reject) => {
                connection.query(sqlRecibos, function (err, result, fie) {
                    if (err) {
                        console.log('error en la conexion intente de nuevo', err)
                        res.send('3')
                    }else{
                        //console.log("EL RESULT!!!!!!!", result)
                        recibos = result;
                        resolve(recibos);
                    }
                })
            })
        }
    

}

administracionFiscalCtrl.cierreDeCajaConsolidado = async(req, res) =>{
    let sql, sqlRecibos, sqlNotasCredito;
    if(req.body.tipo == 1){
        sql = "SELECT tbl_factura.id_factura, tbl_factura.numero_factura, tbl_factura.orden_trabajo, tbl_factura.total_bolivares, tbl_factura.total_dolares, tbl_factura.total_pesos, tbl_factura.id_usuario, tbl_factura.id_cliente, tbl_factura.id_tipo_factura, tbl_factura.id_estado_factura, DATE_FORMAT(tbl_factura.fecha_creacion_factura, '%d-%m-%Y %T') AS fecha_creacion_factura, DATE_FORMAT(tbl_factura.fecha_cancelacion, '%d-%m-%Y %T') AS fecha_cencelacion_factura, tbl_factura.id_estado_factura, tbl_factura.descuento_bolivares, tbl_factura.descuento_dolares, tbl_factura.descuento_pesos, tbl_factura.anulacion_motivo, tbl_tipo_factura.tipo_factura_nombre, tbl_cliente.cliente_nombre, tbl_cliente.cliente_apellido, tbl_cliente.id_tipo_cliente FROM `tbl_factura` LEFT JOIN tbl_tipo_factura ON tbl_tipo_factura.id_tipo_factura = tbl_factura.id_tipo_factura LEFT JOIN tbl_cliente ON tbl_cliente.id_cliente = tbl_factura.id_cliente WHERE (fecha_creacion_orden_trabajo BETWEEN '"+req.body.from+"' AND '"+req.body.to+"') OR (fecha_creacion_factura BETWEEN '"+req.body.from+"' AND '"+req.body.to+"') ORDER BY id_factura ASC"
        sqlRecibos = "SELECT tbl_recibo.id_recibo, tbl_recibo.id_tipo_recibo, tbl_recibo.id_factura, tbl_recibo.numero_recibo, tbl_recibo.fecha_creacion, tbl_recibo.fecha_cancelacion, tbl_recibo.monto_bolivares, tbl_recibo.monto_dolares, tbl_recibo.monto_pesos, tbl_recibo.descuento_bolivares, tbl_recibo.descuento_pesos, tbl_recibo.IGTF_bolivares, tbl_recibo.IGTF_dolares, tbl_recibo.IGTF_pesos, tbl_recibo.tasa_bolivar_dia, tbl_recibo.tasa_pesos_dia, tbl_recibo.id_usuario FROM tbl_recibo WHERE (fecha_creacion BETWEEN '"+req.body.from+"' AND '"+req.body.to+"' AND tbl_recibo.id_factura IS NULL) ORDER BY id_recibo ASC"
    }else if(req.body.tipo == 2){
        sql = "SELECT tbl_factura.id_factura, tbl_factura.numero_factura, tbl_factura.orden_trabajo, tbl_factura.total_bolivares, tbl_factura.total_dolares, tbl_factura.total_pesos, tbl_factura.id_usuario, tbl_factura.id_cliente, tbl_factura.id_tipo_factura, tbl_factura.id_estado_factura, DATE_FORMAT(tbl_factura.fecha_creacion_factura, '%d-%m-%Y %T') AS fecha_creacion_factura, DATE_FORMAT(tbl_factura.fecha_cancelacion, '%d-%m-%Y %T') AS fecha_cencelacion_factura, tbl_factura.id_estado_factura, tbl_factura.descuento_bolivares, tbl_factura.descuento_dolares, tbl_factura.descuento_pesos, tbl_factura.anulacion_motivo, tbl_tipo_factura.tipo_factura_nombre, tbl_cliente.cliente_nombre, tbl_cliente.cliente_apellido, tbl_cliente.id_tipo_cliente FROM `tbl_factura` LEFT JOIN tbl_tipo_factura ON tbl_tipo_factura.id_tipo_factura = tbl_factura.id_tipo_factura LEFT JOIN tbl_cliente ON tbl_cliente.id_cliente = tbl_factura.id_cliente WHERE (fecha_creacion_orden_trabajo BETWEEN '"+req.body.from+"' AND '"+req.body.to+"' OR fecha_creacion_factura BETWEEN '"+req.body.from+"' AND '"+req.body.to+"') AND (id_usuario = '"+req.body.id_usuario+"') ORDER BY id_factura ASC"
        sqlRecibos = "SELECT tbl_recibo.id_recibo, tbl_recibo.id_tipo_recibo, tbl_recibo.id_factura, tbl_recibo.numero_recibo, tbl_recibo.fecha_creacion, tbl_recibo.fecha_cancelacion, tbl_recibo.monto_bolivares, tbl_recibo.monto_dolares, tbl_recibo.monto_pesos, tbl_recibo.descuento_bolivares, tbl_recibo.descuento_pesos, tbl_recibo.IGTF_bolivares, tbl_recibo.IGTF_dolares, tbl_recibo.IGTF_pesos, tbl_recibo.tasa_bolivar_dia, tbl_recibo.tasa_pesos_dia, tbl_recibo.id_usuario FROM tbl_recibo WHERE (fecha_creacion BETWEEN '"+req.body.from+"' AND '"+req.body.to+"' AND id_usuario = '"+req.body.id_usuario+"' AND tbl_recibo.id_factura IS NULL) ORDER BY id_recibo ASC"
        console.log("JAJAJAJAJAJAJAJAJAJA", sqlRecibos)
    }else if(req.body.tipo == 3){
        sql = "SELECT tbl_factura.id_factura, tbl_factura.numero_factura, tbl_factura.orden_trabajo, tbl_factura.total_bolivares, tbl_factura.total_dolares, tbl_factura.total_pesos, tbl_factura.id_usuario, tbl_factura.id_cliente, tbl_factura.id_tipo_factura, tbl_factura.id_estado_factura, DATE_FORMAT(tbl_factura.fecha_creacion_factura, '%d-%m-%Y %T') AS fecha_creacion_factura, DATE_FORMAT(tbl_factura.fecha_cancelacion, '%d-%m-%Y %T') AS fecha_cencelacion_factura, tbl_factura.id_estado_factura, tbl_factura.descuento_bolivares, tbl_factura.descuento_dolares, tbl_factura.descuento_pesos, tbl_factura.anulacion_motivo, tbl_tipo_factura.tipo_factura_nombre, tbl_cliente.cliente_nombre, tbl_cliente.cliente_apellido, tbl_cliente.id_tipo_cliente FROM `tbl_factura` LEFT JOIN tbl_tipo_factura ON tbl_tipo_factura.id_tipo_factura = tbl_factura.id_tipo_factura LEFT JOIN tbl_cliente ON tbl_cliente.id_cliente = tbl_factura.id_cliente WHERE (fecha_creacion_orden_trabajo BETWEEN '"+req.body.from+"' AND '"+req.body.to+"' OR fecha_creacion_factura BETWEEN '"+req.body.from+"' AND '"+req.body.to+"') AND (id_usuario = '"+req.body.id_usuario+"' OR id_usuario = '"+req.body.id_usuario2+"') ORDER BY id_factura ASC"
        sqlRecibos = "SELECT tbl_recibo.id_recibo, tbl_recibo.id_tipo_recibo, tbl_recibo.id_factura, tbl_recibo.numero_recibo, tbl_recibo.fecha_creacion, tbl_recibo.fecha_cancelacion, tbl_recibo.monto_bolivares, tbl_recibo.monto_dolares, tbl_recibo.monto_pesos, tbl_recibo.descuento_bolivares, tbl_recibo.descuento_pesos, tbl_recibo.IGTF_bolivares, tbl_recibo.IGTF_dolares, tbl_recibo.IGTF_pesos, tbl_recibo.tasa_bolivar_dia, tbl_recibo.tasa_pesos_dia, tbl_recibo.id_usuario FROM tbl_recibo WHERE (fecha_creacion BETWEEN '"+req.body.from+"' AND '"+req.body.to+"' AND (id_usuario = '"+req.body.id_usuario+"' OR id_usuario = '"+req.body.id_usuario2+"' AND tbl_recibo.id_factura IS NULL)) ORDER BY id_recibo ASC"
    }else if(req.body.tipo == 4){
        sql = "SELECT tbl_factura.id_factura, tbl_factura.numero_factura, tbl_factura.orden_trabajo, tbl_factura.total_bolivares, tbl_factura.total_dolares, tbl_factura.total_pesos, tbl_factura.id_usuario, tbl_factura.id_cliente, tbl_factura.id_tipo_factura, tbl_factura.id_estado_factura, DATE_FORMAT(tbl_factura.fecha_creacion_factura, '%d-%m-%Y %T') AS fecha_creacion_factura, DATE_FORMAT(tbl_factura.fecha_cancelacion, '%d-%m-%Y %T') AS fecha_cencelacion_factura, tbl_factura.id_estado_factura, tbl_factura.descuento_bolivares, tbl_factura.descuento_dolares, tbl_factura.descuento_pesos, tbl_factura.anulacion_motivo, tbl_tipo_factura.tipo_factura_nombre, tbl_cliente.cliente_nombre, tbl_cliente.cliente_apellido, tbl_cliente.id_tipo_cliente FROM `tbl_factura` LEFT JOIN tbl_tipo_factura ON tbl_tipo_factura.id_tipo_factura = tbl_factura.id_tipo_factura LEFT JOIN tbl_cliente ON tbl_cliente.id_cliente = tbl_factura.id_cliente WHERE (fecha_creacion_orden_trabajo BETWEEN '"+req.body.from+"' AND '"+req.body.to+"' OR fecha_creacion_factura BETWEEN '"+req.body.from+"' AND '"+req.body.to+"') AND (id_usuario = '"+req.body.id_usuario+"' OR id_usuario = '"+req.body.id_usuario2+"' OR id_usuario = '"+req.body.id_usuario3+"') ORDER BY id_factura ASC"
        sqlRecibos = "SELECT tbl_recibo.id_recibo, tbl_recibo.id_tipo_recibo, tbl_recibo.id_factura, tbl_recibo.numero_recibo, tbl_recibo.fecha_creacion, tbl_recibo.fecha_cancelacion, tbl_recibo.monto_bolivares, tbl_recibo.monto_dolares, tbl_recibo.monto_pesos, tbl_recibo.descuento_bolivares, tbl_recibo.descuento_pesos, tbl_recibo.IGTF_bolivares, tbl_recibo.IGTF_dolares, tbl_recibo.IGTF_pesos, tbl_recibo.tasa_bolivar_dia, tbl_recibo.tasa_pesos_dia, tbl_recibo.id_usuario FROM tbl_recibo WHERE (fecha_creacion BETWEEN '"+req.body.from+"' AND '"+req.body.to+"') AND (id_usuario = '"+req.body.id_usuario+"' OR id_usuario = '"+req.body.id_usuario2+"' OR id_usuario = '"+req.body.id_usuario3+"' AND tbl_recibo.id_factura IS NULL) ORDER BY id_recibo ASC"
    }
    sqlNotasCredito = "SELECT tbl_nota_credito.id_nota_credito, tbl_nota_credito.nota_credito_numero, tbl_nota_credito.id_factura, DATE_FORMAT(tbl_nota_credito.fecha_emision, '%d-%m-%Y %T') AS fecha_emision, tbl_nota_credito.monto_bolivares, tbl_nota_credito.monto_pesos, tbl_nota_credito.monto_dolares, tbl_nota_credito.concepto, tbl_factura.numero_factura, tbl_factura.id_factura, tbl_cliente.cliente_nombre, tbl_cliente.cliente_apellido, tbl_cliente.cedula_RIF FROM tbl_nota_credito LEFT JOIN tbl_factura ON tbl_factura.id_factura = tbl_nota_credito.id_factura LEFT JOIN tbl_cliente ON tbl_factura.id_cliente = tbl_cliente.id_cliente WHERE (fecha_emision BETWEEN '"+req.body.from+"' AND '"+req.body.to+"') ORDER BY tbl_nota_credito.id_nota_credito ASC"
    let facturas;
    let notasCredito;
    let registroPago = [];
    let i = 0;
    let balance = {};
    let efectivoD = 0, efectivoP = 0, efectivoB = 0, zelle = 0, paypal = 0, bancolombia = 0, contadoB = 0, contadoP = 0, contadoD = 0, contadoBOrdenTrabajo = 0, contadoPOrdenTrabajo = 0, contadoDOrdenTrabajo = 0, creditoB = 0, creditoP =0, creditoD = 0, creditoBConvenio = 0, creditoPConvenio = 0, creditoDConvenio = 0, cantidadFacturaCreditoConvenio = 0, cantidadFacturaCreditoParticular = 0, creditoBParticular = 0, creditoPParticular = 0, creditoDParticular = 0, anuladoB = 0, anuladoP = 0, anuladoD = 0, NC = 0, transferencia = 0;
    let provincial = 0, transPronvincial = 0, sofitasa = 0, transSofitasa = 0, mercantil = 0, transMercantil = 0, banesco = 0, transBanesco = 0, venezuela = 0, transVenezuela = 0, trans100Banco = 0;
    let debitoProvincial = 0, creditoProvincial = 0, creditoSofitasa = 0, debitoSofitasa = 0, creditoMercantil = 0, debitoMercantil = 0, creditoBanesco = 0, debitoBanesco = 0, debitoVenezuela = 0, creditoVenezuela = 0, debito100banco = 0, credito100Banco = 0;
    let ttProvincial = 0, ttSofitasa = 0, ttMercantil = 0, ttBanesco = 0;
    let descuentoP = 0, descuentoB = 0, descuentoD = 0, cantidadFacturasDescuentos = 0;
    let abonadoD = 0, abonadoP = 0, abonadoB = 0;
    let facturaPRI, facturaULT;
    let detallesAnuladas = [];
    let detallesDescontadas = [];

    //////////////////SUMATORIA DE IGTF TOTALES/////////////////////////////
    let igtfBTransferencia= 0, igtfPTransferencia= 0, igtfDTransferencia= 0, igtfBCredito = 0, igtfPCredito = 0, igtfDCredito = 0, igtfB = 0, igtfP = 0, igtfD = 0;
    let igtfBEfectivo= 0, igtfPEfectivo= 0, igtfDEfectivo= 0, igtfBDebito= 0, igtfPDebito= 0, igtfDDebito= 0
    ///////////////////////////////////////////////////////////////////////
    /////////////////SUMATORIA DE IGTF POR FACTURAS A CREDITO////////////////////////////////
    let igtfBTransferenciaFacturaCredito= 0, igtfPTransferenciaFacturaCredito= 0, igtfDTransferenciaFacturaCredito= 0, igtfBCreditoFacturaCredito = 0, igtfPCreditoFacturaCredito = 0, igtfDCreditoFacturaCredito = 0, igtfBFacturaCredito = 0, igtfPFacturaCredito = 0, igtfDFacturaCredito = 0;
    let igtfBEfectivoFacturaCredito= 0, igtfPEfectivoFacturaCredito= 0, igtfDEfectivoFacturaCredito= 0, igtfBDebitoFacturaCredito= 0, igtfPDebitoFacturaCredito= 0, igtfDDebitoFacturaCredito= 0
    /////////////////////////////////////////////////////////////////////////////////////////
    /////////////////SUMATORIA DE IGTF POR FACTURAS A CONTADO////////////////////////////////
    let igtfBTransferenciaFacturaContado= 0, igtfPTransferenciaFacturaContado= 0, igtfDTransferenciaFacturaContado= 0, igtfBCreditoFacturaContado = 0, igtfPCreditoFacturaContado = 0, igtfDCreditoFacturaContado = 0, igtfBFacturaContado = 0, igtfPFacturaContado = 0, igtfDFacturaContado = 0;
    let igtfBEfectivoFacturaContado= 0, igtfPEfectivoFacturaContado= 0, igtfDEfectivoFacturaContado= 0, igtfBDebitoFacturaContado= 0, igtfPDebitoFacturaContado= 0, igtfDDebitoFacturaContado= 0
    /////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////SUMATORIA DE IGTF POR PAYPAL Y ZELLE////////////////////////////
    let igtfPaypal = 0, igtfZelle = 0;
    /////////////////////////////////////////////////////////////////////////////////////////
    let vueltosB= 0, vueltosP= 0, vueltosD= 0;

    //////////////////////////SUMATORIA DE BOLIVARES, PESOS Y DOLARES DE LOS RECIBOS///////////////////////////
    let pesosR = 0, dolaresR = 0, bolivaresR = 0;

    //////////////////////////////////////////////////PRIMER RECUADRO FALTANTE////////////////////////////////////////
    let monto_total_facturas_pesos = 0, monto_total_facturas_dolares = 0, monto_total_facturas_bolivares = 0;
    let descuento_pesos_factura_contado = 0, descuento_dolares_factura_contado = 0, descuento_bolivares_factura_contado = 0;
    let descuento_pesos_factura_credito = 0, descuento_dolares_factura_credito = 0, descuento_bolivares_factura_credito = 0;
    let descuento_pesos_factura_anulado = 0, descuento_dolares_factura_anulado = 0, descuento_bolivares_factura_anulado = 0;
    let cantidad_facturas_contado = 0, cantidad_facturas_credito = 0, cantidad_facturas_anuladas = 0;
    let sumatoria_cantidad_credito_contado = 0;
    let registrosDivisa;

    ///////////////////////////////////////////////SEGUNDO RECUADRO FALTANTE///////////////////////////////////////////
    let total_transBancos_factura_contado = 0, trans100Banco_factura_contado = 0, transBanesco_factura_contado = 0, transProvincial_factura_contado = 0, transSofitasa_factura_contado = 0, transMercantil_factura_contado = 0, transVenezuela_factura_contado = 0, bancolombiaFacturaContado = 0, paypalFacturaContado = 0, zelleFacturaContado = 0;
    let total_debitoBancos_factura_contado = 0, debito100BancoContado = 0, debitoBanescoContado = 0, debitoProvincialContado = 0, debitoMercantilContado = 0, debitoVenezuelaContado = 0, debitoSofitasaContado = 0;
    let total_creditoBancos_factura_contado = 0, credito100BancoContado = 0, creditoBanescoContado = 0, creditoProvincialContado = 0, creditoMercantilContado = 0, creditoVenezuelaContado = 0, creditoSofitasaContado = 0;
    let efectivoPContado = 0, efectivoBContado = 0, efectivoDContado = 0;

    /////////////////////////////////////////////////TERCER RECUADRO///////////////////////////////////////////////////
    let total_transBancos_factura_credito = 0, trans100Banco_factura_credito = 0, transBanesco_factura_credito = 0, transProvincial_factura_credito = 0, transSofitasa_factura_credito = 0, transMercantil_factura_credito = 0, transVenezuela_factura_credito = 0, bancolombiaFacturaCredito = 0, paypalFacturaCredito = 0, zelleFacturaCredito = 0;
    let total_debitoBancos_factura_credito = 0, debito100BancoCredito = 0, debitoBanescoCredito = 0, debitoProvincialCredito = 0, debitoMercantilCredito = 0, debitoVenezuelaCredito = 0, debitoSofitasaCredito = 0;
    let total_creditoBancos_factura_credito = 0, credito100BancoCredito = 0, creditoBanescoCredito = 0, creditoProvincialCredito = 0, creditoMercantilCredito = 0, creditoVenezuelaCredito = 0, creditoSofitasaCredito = 0;
    let efectivoPCredito = 0, efectivoBCredito = 0, efectivoDCredito = 0;

    //////////////////////////////////////////EXTRAS//////////////////////////////////////////////////
    //DE ORDENES DE TRABAJO:
    //el total en bs, dolares, y pesos
    //la cantidad total de ordenes de trabajo
    let totalOrdenesTrabajoContado = 0, totalBsOrdenesTrabajo = 0, totalPesosOrdenesTrabajo = 0, totalDolaresOrdenesTrabajo = 0;

    ///////////////////////////////////RECIBOS Y DETALLES RECIBOS////////////////////////////////////////
    /////////main///////
    let recibos, registroPagoRecibo;
    /////clasificacion de sumatoria de montos de recibo//////
    let totalBolivaresReciboRegistroConvenio = 0, totalPesosReciboRegistroConvenio = 0, totalDolaresReciboRegistroConvenio = 0;
    let totalBolivaresReciboFacturasCredito = 0, totalPesosReciboFacturasCredito = 0, totalDolaresReciboFacturasCredito = 0;

    ////////////////////////////////ABONOS PARA FACTURAS A CREDITO/////////////////////////////
    let abono_bolivares_efectivo = 0;
    let abono_dolares_efectivo = 0;
    let abono_pesos_efectivo = 0;
    //////////////////////////////////SECCION PARA ORDENES DE TRABAJO A CREDITO///////////////////
    let cantidad_ordenes_trabajo_credito = 0, creditoBOT = 0, creditoDOT = 0, creditoPOT = 0;
    let creditoBConvenioOT = 0, creditoPConvenioOT = 0, creditoDConvenioOT = 0, cantidadOTCreditoConvenio = 0;
    let creditoBOTParticular = 0, creditoPOTParticular = 0, creditoDOTParticular = 0, cantidadOTCreditoParticular = 0;
    let descuento_pesos_ordenes_trabajo_credito = 0, descuento_dolares_ordenes_trabajo_credito = 0;
    let descuento_bolivares_ordenes_trabajo_credito = 0;
    let transBanesco_ordenes_trabajo_credito = 0, transProvincial_orden_trabajo_credito = 0;
    let transVenezuela_orden_trabajo_credito = 0, transSofitasa_orden_trabajo_credito = 0;
    let transMercantil_orden_trabajo_credito = 0, zelleOTCredito = 0, bancolombiaOTCredito = 0, paypalOTCredito = 0;
    let trans100Banco_orden_trabajo_credito = 0, debitoBanescoOTCredito = 0, debitoProvincialOTCredito = 0;
    let debitoMercantilOTCredito = 0, debitoVenezuelaOTCredito = 0, debitoSofitasaOTCredito = 0;
    let debito100BancoOTCredito = 0, creditoBanescoOTCredito = 0, creditoProvincialOTCredito = 0;
    let creditoMercantilOTCredito = 0, creditoVenezuelaOTCredito = 0, creditoSofitasaOTCredito = 0;
    let credito100BancoOTCredito = 0;
    let creditoBOrdenTrabajo = 0;
    let creditoDOrdenTrabajo = 0;
    let creditoPOrdenTrabajo = 0;
    //////////////////////////////////////ABONOS EN ORDENES DE TRABAJO A CREDITO////////////////////////////////////
    let igtfPOTCredito = 0, igtfDOTCredito = 0, igtfBOTCredito = 0, igtfPTransferenciaOTCredito = 0;
    let igtfDTransferenciaOTCredito = 0, igtfBTransferenciaOTCredito = 0, igtfPEfectivoOTCredito = 0;
    let igtfDEfectivoOTCredito = 0, igtfBEfectivoOTCredito = 0, igtfPDebitoOTCredito = 0;
    let igtfDDebitoOTCredito = 0, igtfBDebitoOTCredito = 0, igtfPCreditoOTCredito = 0, igtfDCreditoOTCredito = 0;
    let igtfBCreditoOTCredito = 0, efectivoPOTCredito = 0, efectivoDOTCredito = 0, efectivoBOTCredito = 0;
    let transBanesco_orden_trabajo_credito = 0;




    //console.log("!!!!!!!!!!!!!!!!!!!!!!", recibos)

    registrosDivisa = await buscarRegistroDivisas(registrosDivisa);
    //console.log("!!!!!!!!!!!!!!!!!!!!!!!", registrosDivisa)
    let dolares, pesos, bolivares;
    for(const divisa of registrosDivisa){
        if(divisa.divisa_nombre == 'DOLARES'){
            dolares = divisa.tasa_actual;
        }else
        if(divisa.divisa_nombre == 'BOLIVARES'){
            bolivares = divisa.tasa_actual;
        }else
        if(divisa.divisa_nombre == 'PESOS'){
            pesos = divisa.tasa_actual;
        }
    }
    //console.log("BOLIVARES?", bolivares, dolares, pesos)
    
    notasCredito = await buscarNotasCreditoCC(notasCredito, sqlNotasCredito);
    facturas = await buscarFacturas(facturas, sql)
    for(const item of facturas){
        registroPago = await buscarRegistrosPago(item, registroPago);
        facturas[i].registro_pagos = registroPago;
        i++
    }
    i = 0;
    //res.send(facturas)
    recibos = await buscarRecibos(recibos, sqlRecibos)
    //console.log("??????", recibos)

        for(const item of recibos){
            registroPagoRecibo = await buscarRegistrosPagoRecibo(item, registroPagoRecibo);
            recibos[i].registros_pago = registroPagoRecibo;
            i++;
        }
    
    //console.log("[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[", facturas)
    let abonosOutRango
    //console.log("!!!!!!!!!!!!!!!!!!!!!!", recibos, "HELICOPTER HELICOPTER", abonosOutRango)
    //console.log("!!!!!!!!!!!!!!!!!!!!!!", recibos)

    //////////////////////////SUMAR LOS ABONOS DE PAGOS DE FACTURA OUT OF RANGO////////////////////////
    if(facturas.length > 0){
        abonosOutRango = await buscarRegistrosPagoOutRango(facturas[0].id_factura, facturas[facturas.length - 1].id_factura, req.body.id_usuario, req.body.id_usuario2, req.body.id_usuario3)
        if(abonosOutRango.length > 0){
            //console.log("WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW", abonosOutRango)
            for(const abono of abonosOutRango){
                ///////////////////////////////////IGTF DE ABONOS OUT OF RANGO////////////////////////////////////////
                if(abono.igtf_pago == 1){
                    if(abono.id_divisa == 1){
                        igtfPFacturaCredito = igtfPFacturaCredito + abono.monto;
                    }
                    if(abono.id_divisa == 2){
                        igtfDFacturaCredito = igtfDFacturaCredito + abono.monto;
                    }
                    if(abono.id_divisa == 3){
                        igtfBFacturaCredito = igtfBFacturaCredito + abono.monto;
                    }
                    ////////////////////////////IGTF EN TRANSFERENCIA//////////////////////////////
                    if(abono.id_tipo_pago == 1 && abono.igtf_pago == 1){
                        ////////////////PESOS//////////////
                        if(abono.id_divisa == 1){
                            igtfPTransferenciaFacturaCredito = igtfPTransferenciaFacturaCredito + abono.monto;
                        } 
                        if(abono.id_divisa == 2){
                            igtfDTransferenciaFacturaCredito = igtfDTransferenciaFacturaCredito + abono.monto;
                        } 
                        if(abono.id_divisa == 3){
                            igtfBTransferenciaFacturaCredito = igtfBTransferenciaFacturaCredito + abono.monto;
                        } 
                    }
                    ///////////////////////////////////////////////////////////////////////////////
                    //////////////////////////EFECTIVO////////////////////////////////////////////
                    if(abono.id_tipo_pago == 2 && abono.igtf_pago == 1){
                        ////////////////PESOS//////////////
                        if(abono.id_divisa == 1){
                            igtfPEfectivoFacturaCredito = igtfPEfectivoFacturaCredito + abono.monto;
                        } 
                        if(abono.id_divisa == 2){
                            igtfDEfectivoFacturaCredito = igtfDEfectivoFacturaCredito + abono.monto;
                        } 
                        if(abono.id_divisa == 3){
                            igtfBEfectivoFacturaCredito = igtfBEfectivoFacturaCredito + abono.monto;
                        } 
                    }
                    if(abono.id_tipo_pago == 3 && abono.igtf_pago == 1){
                        if(abono.id_divisa == 1){
                            igtfPDebitoFacturaCredito = igtfPDebitoFacturaCredito + abono.monto;
                        } 
                        if(abono.id_divisa == 2){
                            igtfDDebitoFacturaCredito = igtfDDebitoFacturaCredito + abono.monto;
                        } 
                        if(abono.id_divisa == 3){
                            igtfBDebitoFacturaCredito = igtfBDebitoFacturaCredito + abono.monto;
                        } 
                    }
                    if(abono.id_tipo_pago == 4 && abono.igtf_pago == 1){
                        if(abono.id_divisa == 1){
                            igtfPCreditoFacturaCredito = igtfPCreditoFacturaCredito + abono.monto;
                        } 
                        if(abono.id_divisa == 2){
                            igtfDCreditoFacturaCredito = igtfDCreditoFacturaCredito + abono.monto;
                        } 
                        if(abono.id_divisa == 3){
                            igtfBCreditoFacturaCredito = igtfBCreditoFacturaCredito + abono.monto;
                        } 
                    }
                }
                ////////////////////////////////////////////////////////////////////////////////////////////////////    
                //console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<")
                if(abono.igtf_pago == 0 && abono.tipo_registro == 0 && abono.igtf_pago == 0){
                            ///////ABONO PESOS//////
                            if(abono.id_divisa == 1){
                                if(abono.tipo_registro == 0){
                                    abonadoP = abonadoP + abono.monto
                                    creditoP = creditoP + abono.monto
                                }else{
                                    abonadoP = abonadoP - abono.monto
                                    creditoP = creditoP - abono.monto
                                }
                            }else if(abono.id_divisa == 2){
                            //////ABONO DOLARES/////
                                if(abono.tipo_registro == 0){
                                    abonadoD = abonadoD + abono.monto
                                    creditoD = creditoD + abono.monto
                                }else{
                                    abonadoD = abonadoD - abono.monto
                                    creditoD = creditoD - abono.monto
                                }
                            }else if(abono.id_divisa == 3){
                            //////ABONO BOLIVARES////
                                if(abono.tipo_registro == 0){
                                    abonadoB = abonadoB + abono.monto
                                    creditoB = creditoB + abono.monto
                                }else{
                                    abonadoB = abonadoB - abono.monto
                                    creditoB = creditoB - abono.monto
                                }
                            }
                }
                ///////////////////////////INGRESO POR EFECTIVO FACTURAS A CREDITO////////////////////////////////
                    if(abono.id_tipo_pago == 2 /*&& abono.igtf_pago == 0*/){
                        ///////EFECTIVO PESOS//////
                        if(abono.id_divisa == 1){
                            efectivoPCredito = efectivoPCredito + abono.monto
                        }else if(abono.id_divisa == 2){
                        //////EFECITVO DOLAEES/////
                        //console.log("999999999999999999999999999999999999999999999999999", abono.monto)
                            if(abono.tipo_registro == 0){
                                efectivoDCredito = efectivoDCredito + abono.monto
                            }else{
                                efectivoDCredito = efectivoDCredito - abono.monto
                            } 
                            //console.log("999999999999999999999999999999999999999999999999999", efectivoDCredito)
                        }else if(abono.id_divisa == 3){
                        //////EFECTIVO BOLIVARES////
                            efectivoBCredito = efectivoBCredito + abono.monto
                        }
                    }
                    ////////////////////////INGRESOS EN TRANSFERENCIAS EN BOLIVARES Y OTROS EN FACTURAS A CREDITO//////////////////
                    if(abono.id_tipo_pago == 1 && abono.igtf_pago == 0 && abono.tipo_registro == 0){
                        if(abono.id_banco == 1){
                        transBanesco_factura_credito = transBanesco_factura_credito + abono.monto;
                        /////////PROVINCIAL////////
                        }else if(abono.id_banco == 2){
                            transProvincial_factura_credito = transProvincial_factura_credito + abono.monto;
                        }else if(abono.id_banco == 3){
                        /////////MERCANTIL////////
                        transMercantil_factura_credito =transMercantil_factura_credito + abono.monto;
                        }else if(abono.id_banco == 4){
                        /////////VENEZUELA////////
                            transVenezuela_factura_credito = transVenezuela_factura_credito + abono.monto;
                        }else if(abono.id_banco == 5){
                        /////////SOFITASA////////
                            transSofitasa_factura_credito = transSofitasa_factura_credito + abono.monto;
                        }else if(abono.id_banco == 6){
                            /////////ZELLE////////
                                zelleFacturaCredito = zelleFacturaCredito + abono.monto;
                        }else if(abono.id_banco == 7){
                            /////////BANCOLOMBIA////////
                                bancolombiaFacturaCredito = bancolombiaFacturaCredito + abono.monto;
                        }else if(abono.id_banco == 8){
                            /////////paypal////////
                                paypalFacturaCredito = paypalFacturaCredito + abono.monto;
                        }else if(abono.id_banco == 9){
                            /////////paypal////////
                                trans100Banco_factura_credito = trans100Banco_factura_credito + abono.monto;
                        }
                    }
                    //console.log("KKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK", transSofitasa_factura_credito)
                    /////////////////////////////INGRESOS TARJETAS DE DEBITO FACTURAS A CREDITO///////////////////////////
                    if(abono.id_tipo_pago == 3 && abono.igtf_pago == 0 && abono.tipo_registro == 0){
                        /////////BANESCO////////
                        if(abono.id_banco == 1){
                            debitoBanescoCredito = debitoBanescoCredito + abono.monto;
                        /////////PROVINCIAL////////
                        }else if(abono.id_banco == 2){
                            debitoProvincialCredito = debitoProvincialCredito + abono.monto;
                        }else if(abono.id_banco == 3){
                        /////////MERCANTIL////////
                            debitoMercantilCredito = debitoMercantilCredito + abono.monto;
                        }else if(abono.id_banco == 4){
                        /////////VENEZUELA////////
                            debitoVenezuelaCredito = debitoVenezuelaCredito + abono.monto;
                        }else if(abono.id_banco == 5){
                        /////////SOFITASA////////
                            debitoSofitasaCredito = debitoSofitasaCredito + abono.monto;
                        }else if(abono.id_banco == 9){
                            /////////SOFITASA////////
                                debito100BancoCredito = debito100BancoCredito + abono.monto;
                            }
                                
                    }
                    ///////////////////////////INGRESOS TARJETAS DE CREDITO FACTURAS A CREDITO////////////////////////////
                    if(abono.id_tipo_pago == 4 && abono.igtf_pago == 0 && abono.tipo_registro == 0){
                        /////////BANESCO////////
                        if(abono.id_banco == 1){
                            creditoBanescoCredito = creditoBanescoCredito + abono.monto;
                        /////////PROVINCIAL////////
                        }else if(abono.id_banco == 2){
                            creditoProvincialCredito = creditoProvincialCredito + abono.monto;
                        }else if(abono.id_banco == 3){
                        /////////MERCANTIL////////
                            creditoMercantilCredito = creditoMercantilCredito + abono.monto;
                        }else if(abono.id_banco == 4){
                        /////////VENEZUELA////////
                            creditoVenezuelaCredito = creditoVenezuelaCredito + abono.monto;
                        }else if(abono.id_banco == 5){
                        /////////SOFITASA////////
                            creditoSofitasaCredito = creditoSofitasaCredito + abono.monto;
                        }else if(abono.id_banco == 5){
                            /////////100% banco////////
                                credito100BancoCredito = credito100BancoCredito + abono.monto;
                        }
                    }
            }
        }
    }else if(facturas.length == 0){
        abonosOutRango = await buscarRegistrosPagoOutRangoNoFacturas(req.body.id_usuario, req.body.id_usuario2, req.body.id_usuario3)
            //console.log("WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW", abonosOutRango)
            for(const abono of abonosOutRango){
                if(abono.id_tipo_factura == 1 || abono.id_tipo_factura == 2 || abono.id_tipo_factura == 3 || abono.id_tipo_factura == 4){
                    ///////////////////////////////////IGTF DE ABONOS OUT OF RANGO////////////////////////////////////////
                    if(abono.igtf_pago == 1){
                        if(abono.id_divisa == 1){
                            igtfPFacturaCredito = igtfPFacturaCredito + abono.monto;
                        }
                        if(abono.id_divisa == 2){
                            igtfDFacturaCredito = igtfDFacturaCredito + abono.monto;
                        }
                        if(abono.id_divisa == 3){
                            igtfBFacturaCredito = igtfBFacturaCredito + abono.monto;
                        }
                        ////////////////////////////IGTF EN TRANSFERENCIA//////////////////////////////
                        if(abono.id_tipo_pago == 1 && abono.igtf_pago == 1){
                            ////////////////PESOS//////////////
                            if(abono.id_divisa == 1){
                                igtfPTransferenciaFacturaCredito = igtfPTransferenciaFacturaCredito + abono.monto;
                            } 
                            if(abono.id_divisa == 2){
                                igtfDTransferenciaFacturaCredito = igtfDTransferenciaFacturaCredito + abono.monto;
                            } 
                            if(abono.id_divisa == 3){
                                igtfBTransferenciaFacturaCredito = igtfBTransferenciaFacturaCredito + abono.monto;
                            } 
                        }
                        ///////////////////////////////////////////////////////////////////////////////
                        //////////////////////////EFECTIVO////////////////////////////////////////////
                        if(abono.id_tipo_pago == 2 && abono.igtf_pago == 1){
                            ////////////////PESOS//////////////
                            if(abono.id_divisa == 1){
                                igtfPEfectivoFacturaCredito = igtfPEfectivoFacturaCredito + abono.monto;
                            } 
                            if(abono.id_divisa == 2){
                                igtfDEfectivoFacturaCredito = igtfDEfectivoFacturaCredito + abono.monto;
                            } 
                            if(abono.id_divisa == 3){
                                igtfBEfectivoFacturaCredito = igtfBEfectivoFacturaCredito + abono.monto;
                            } 
                        }
                        if(abono.id_tipo_pago == 3 && abono.igtf_pago == 1){
                            if(abono.id_divisa == 1){
                                igtfPDebitoFacturaCredito = igtfPDebitoFacturaCredito + abono.monto;
                            } 
                            if(abono.id_divisa == 2){
                                igtfDDebitoFacturaCredito = igtfDDebitoFacturaCredito + abono.monto;
                            } 
                            if(abono.id_divisa == 3){
                                igtfBDebitoFacturaCredito = igtfBDebitoFacturaCredito + abono.monto;
                            } 
                        }
                        if(abono.id_tipo_pago == 4 && abono.igtf_pago == 1){
                            if(abono.id_divisa == 1){
                                igtfPCreditoFacturaCredito = igtfPCreditoFacturaCredito + abono.monto;
                            } 
                            if(abono.id_divisa == 2){
                                igtfDCreditoFacturaCredito = igtfDCreditoFacturaCredito + abono.monto;
                            } 
                            if(abono.id_divisa == 3){
                                igtfBCreditoFacturaCredito = igtfBCreditoFacturaCredito + abono.monto;
                            } 
                        }
                    }
                    ////////////////////////////////////////////////////////////////////////////////////////////////////    
                    //console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<")
                    if(abono.igtf_pago == 0 && abono.tipo_registro == 0 && abono.igtf_pago == 0){
                                ///////ABONO PESOS//////
                                if(abono.id_divisa == 1){
                                    if(abono.tipo_registro == 0){
                                        abonadoP = abonadoP + abono.monto
                                        creditoP = creditoP + abono.monto
                                    }else{
                                        abonadoP = abonadoP - abono.monto
                                        creditoP = creditoP - abono.monto
                                    }
                                }else if(abono.id_divisa == 2){
                                //////ABONO DOLARES/////
                                    if(abono.tipo_registro == 0){
                                        abonadoD = abonadoD + abono.monto
                                        creditoD = creditoD + abono.monto
                                    }else{
                                        abonadoD = abonadoD - abono.monto
                                        creditoD = creditoD - abono.monto
                                    }
                                }else if(abono.id_divisa == 3){
                                //////ABONO BOLIVARES////
                                    if(abono.tipo_registro == 0){
                                        abonadoB = abonadoB + abono.monto
                                        creditoB = creditoB + abono.monto
                                    }else{
                                        abonadoB = abonadoB - abono.monto
                                        creditoB = creditoB - abono.monto
                                    }
                                }
                    }
                    ///////////////////////////INGRESO POR EFECTIVO FACTURAS A CREDITO////////////////////////////////
                    if(abono.id_usuario == req.body.id_usuario || abono.id_usuario == req.body.id_usuario2 || abono.id_usuario == req.body.id_usuario3){
                        if(abono.id_tipo_pago == 2 /*&& abono.igtf_pago == 0*/){
                            ///////EFECTIVO PESOS//////
                            if(abono.id_divisa == 1){
                                efectivoPCredito = efectivoPCredito + abono.monto
                            }else if(abono.id_divisa == 2){
                                if(abono.tipo_registro == 0){
                                    efectivoDCredito = efectivoDCredito + abono.monto
                                }else{
                                    efectivoDCredito = efectivoDCredito - abono.monto
                                } 
                            }else if(abono.id_divisa == 3){
                            //////EFECTIVO BOLIVARES////
                                efectivoBCredito = efectivoBCredito + abono.monto
                            }
                        }
                        ////////////////////////INGRESOS EN TRANSFERENCIAS EN BOLIVARES Y OTROS EN FACTURAS A CREDITO//////////////////
                        if(abono.id_tipo_pago == 1 && abono.igtf_pago == 0 && abono.tipo_registro == 0){
                            if(abono.id_banco == 1){
                            transBanesco_factura_credito = transBanesco_factura_credito + abono.monto;
                            /////////PROVINCIAL////////
                            }else if(abono.id_banco == 2){
                                transProvincial_factura_credito = transProvincial_factura_credito + abono.monto;
                            }else if(abono.id_banco == 3){
                            /////////MERCANTIL////////
                            transMercantil_factura_credito =transMercantil_factura_credito + abono.monto;
                            }else if(abono.id_banco == 4){
                            /////////VENEZUELA////////
                                transVenezuela_factura_credito = transVenezuela_factura_credito + abono.monto;
                            }else if(abono.id_banco == 5){
                            /////////SOFITASA////////
                                transSofitasa_factura_credito = transSofitasa_factura_credito + abono.monto;
                            }else if(abono.id_banco == 6){
                                /////////ZELLE////////
                                    zelleFacturaCredito = zelleFacturaCredito + abono.monto;
                            }else if(abono.id_banco == 7){
                                /////////BANCOLOMBIA////////
                                    bancolombiaFacturaCredito = bancolombiaFacturaCredito + abono.monto;
                            }else if(abono.id_banco == 8){
                                /////////paypal////////
                                    paypalFacturaCredito = paypalFacturaCredito + abono.monto;
                            }else if(abono.id_banco == 9){
                                /////////paypal////////
                                    trans100Banco_factura_credito = trans100Banco_factura_credito + abono.monto;
                            }
                        }
                        //console.log("KKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK", transSofitasa_factura_credito)
                        /////////////////////////////INGRESOS TARJETAS DE DEBITO FACTURAS A CREDITO///////////////////////////
                        if(abono.id_tipo_pago == 3 && abono.igtf_pago == 0 && abono.tipo_registro == 0){
                            /////////BANESCO////////
                            if(abono.id_banco == 1){
                                debitoBanescoCredito = debitoBanescoCredito + abono.monto;
                            /////////PROVINCIAL////////
                            }else if(abono.id_banco == 2){
                                debitoProvincialCredito = debitoProvincialCredito + abono.monto;
                            }else if(abono.id_banco == 3){
                            /////////MERCANTIL////////
                                debitoMercantilCredito = debitoMercantilCredito + abono.monto;
                            }else if(abono.id_banco == 4){
                            /////////VENEZUELA////////
                                debitoVenezuelaCredito = debitoVenezuelaCredito + abono.monto;
                            }else if(abono.id_banco == 5){
                            /////////SOFITASA////////
                                debitoSofitasaCredito = debitoSofitasaCredito + abono.monto;
                            }else if(abono.id_banco == 9){
                                /////////SOFITASA////////
                                    debito100BancoCredito = debito100BancoCredito + abono.monto;
                                }
                                    
                        }
                        ///////////////////////////INGRESOS TARJETAS DE CREDITO FACTURAS A CREDITO////////////////////////////
                        if(abono.id_tipo_pago == 4 && abono.igtf_pago == 0 && abono.tipo_registro == 0){
                            /////////BANESCO////////
                            if(abono.id_banco == 1){
                                creditoBanescoCredito = creditoBanescoCredito + abono.monto;
                            /////////PROVINCIAL////////
                            }else if(abono.id_banco == 2){
                                creditoProvincialCredito = creditoProvincialCredito + abono.monto;
                            }else if(abono.id_banco == 3){
                            /////////MERCANTIL////////
                                creditoMercantilCredito = creditoMercantilCredito + abono.monto;
                            }else if(abono.id_banco == 4){
                            /////////VENEZUELA////////
                                creditoVenezuelaCredito = creditoVenezuelaCredito + abono.monto;
                            }else if(abono.id_banco == 5){
                            /////////SOFITASA////////
                                creditoSofitasaCredito = creditoSofitasaCredito + abono.monto;
                            }else if(abono.id_banco == 5){
                                /////////100% banco////////
                                    credito100BancoCredito = credito100BancoCredito + abono.monto;
                            }
                        }
                    }
                }else if(abono.id_tipo_factura == 5){
                    ////////////////////////////PARA ORDENES DE TRABAJO A CREDITO/////////////////////////////
                    if(abono.igtf_pago == 1){
                        if(abono.id_divisa == 1){
                            igtfPOTCredito = igtfPOTCredito + abono.monto;
                        }
                        if(abono.id_divisa == 2){
                            igtfDOTCredito = igtfDOTCredito + abono.monto;
                        }
                        if(abono.id_divisa == 3){
                            igtfBOTCredito = igtfBOTCredito + abono.monto;
                        }
                        ////////////////////////////IGTF EN TRANSFERENCIA//////////////////////////////
                        if(abono.id_tipo_pago == 1 && abono.igtf_pago == 1){
                            ////////////////PESOS//////////////
                            if(abono.id_divisa == 1){
                                igtfPTransferenciaOTCredito = igtfPTransferenciaOTCredito + abono.monto;
                            } 
                            if(abono.id_divisa == 2){
                                igtfDTransferenciaOTCredito = igtfDTransferenciaOTCredito + abono.monto;
                            } 
                            if(abono.id_divisa == 3){
                                igtfBTransferenciaOTCredito = igtfBTransferenciaOTCredito + abono.monto;
                            } 
                        }
                        ///////////////////////////////////////////////////////////////////////////////
                        //////////////////////////EFECTIVO////////////////////////////////////////////
                        if(abono.id_tipo_pago == 2 && abono.igtf_pago == 1){
                            ////////////////PESOS//////////////
                            if(abono.id_divisa == 1){
                                igtfPEfectivoOTCredito = igtfPEfectivoOTCredito + abono.monto;
                            } 
                            if(abono.id_divisa == 2){
                                igtfDEfectivoOTCredito = igtfDEfectivoOTCredito + abono.monto;
                            } 
                            if(abono.id_divisa == 3){
                                igtfBEfectivoOTCredito = igtfBEfectivoOTCredito + abono.monto;
                            } 
                        }
                        if(abono.id_tipo_pago == 3 && abono.igtf_pago == 1){
                            if(abono.id_divisa == 1){
                                igtfPDebitoFacturaCredito = igtfPDebitoFacturaCredito + abono.monto;
                            } 
                            if(abono.id_divisa == 2){
                                igtfDDebitoOTCredito = igtfDDebitoOTCredito + abono.monto;
                            } 
                            if(abono.id_divisa == 3){
                                igtfBDebitoOTCredito = igtfBDebitoOTCredito + abono.monto;
                            } 
                        }
                        if(abono.id_tipo_pago == 4 && abono.igtf_pago == 1){
                            if(abono.id_divisa == 1){
                                igtfPCreditoOTCredito = igtfPCreditoOTCredito + abono.monto;
                            } 
                            if(abono.id_divisa == 2){
                                igtfDCreditoOTCredito = igtfDCreditoOTCredito + abono.monto;
                            } 
                            if(abono.id_divisa == 3){
                                igtfBCreditoOTCredito = igtfBCreditoOTCredito + abono.monto;
                            } 
                        }
                    }
                    ////////////////////////////////////////////////////////////////////////////////////////////////////    
                    //console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<")
                    if(abono.igtf_pago == 0 && abono.tipo_registro == 0 && abono.igtf_pago == 0){
                                ///////ABONO PESOS//////
                                if(abono.id_divisa == 1){
                                    if(abono.tipo_registro == 0){
                                        abonadoP = abonadoP + abono.monto
                                        creditoP = creditoP + abono.monto
                                    }else{
                                        abonadoP = abonadoP - abono.monto
                                        creditoP = creditoP - abono.monto
                                    }
                                }else if(abono.id_divisa == 2){
                                //////ABONO DOLARES/////
                                    if(abono.tipo_registro == 0){
                                        abonadoD = abonadoD + abono.monto
                                        creditoD = creditoD + abono.monto
                                    }else{
                                        abonadoD = abonadoD - abono.monto
                                        creditoD = creditoD - abono.monto
                                    }
                                }else if(abono.id_divisa == 3){
                                //////ABONO BOLIVARES////
                                    if(abono.tipo_registro == 0){
                                        abonadoB = abonadoB + abono.monto
                                        creditoB = creditoB + abono.monto
                                    }else{
                                        abonadoB = abonadoB - abono.monto
                                        creditoB = creditoB - abono.monto
                                    }
                                }
                    }
                    ///////////////////////////INGRESO POR EFECTIVO FACTURAS A CREDITO////////////////////////////////
                    if(abono.id_usuario == req.body.id_usuario || abono.id_usuario == req.body.id_usuario2 || abono.id_usuario == req.body.id_usuario3){
                        if(abono.id_tipo_pago == 2 /*&& abono.igtf_pago == 0*/ && abono.tipo_registro == 0){
                            ///////EFECTIVO PESOS//////
                            if(abono.id_divisa == 1){
                                efectivoPOTCredito = efectivoPOTCredito + abono.monto
                            }else if(abono.id_divisa == 2){
                            //////EFECITVO DOLAEES/////
                                efectivoDOTCredito = efectivoDOTCredito + abono.monto
                            }else if(abono.id_divisa == 3){
                            //////EFECTIVO BOLIVARES////
                                efectivoBOTCredito = efectivoBOTCredito + abono.monto
                            }
                        }
                        ////////////////////////INGRESOS EN TRANSFERENCIAS EN BOLIVARES Y OTROS EN FACTURAS A CREDITO//////////////////
                        if(abono.id_tipo_pago == 1 && abono.igtf_pago == 0 && abono.tipo_registro == 0){
                            if(abono.id_banco == 1){
                            transBanesco_orden_trabajo_credito = transBanesco_orden_trabajo_credito + abono.monto;
                            /////////PROVINCIAL////////
                            }else if(abono.id_banco == 2){
                                transProvincial_orden_trabajo_credito = transProvincial_orden_trabajo_credito + abono.monto;
                            }else if(abono.id_banco == 3){
                            /////////MERCANTIL////////
                            transMercantil_orden_trabajo_credito =transMercantil_orden_trabajo_credito + abono.monto;
                            }else if(abono.id_banco == 4){
                            /////////VENEZUELA////////
                                transVenezuela_orden_trabajo_credito = transVenezuela_orden_trabajo_credito + abono.monto;
                            }else if(abono.id_banco == 5){
                            /////////SOFITASA////////
                                transSofitasa_orden_trabajo_credito = transSofitasa_orden_trabajo_credito + abono.monto;
                            }else if(abono.id_banco == 6){
                                /////////ZELLE////////
                                    zelleOTCredito = zelleOTCredito + abono.monto;
                            }else if(abono.id_banco == 7){
                                /////////BANCOLOMBIA////////
                                    bancolombiaOTCredito = bancolombiaOTCredito + abono.monto;
                            }else if(abono.id_banco == 8){
                                /////////paypal////////
                                    paypalOTCredito = paypalOTCredito + abono.monto;
                            }else if(abono.id_banco == 9){
                                /////////paypal////////
                                    trans100Banco_orden_trabajo_credito = trans100Banco_orden_trabajo_credito + abono.monto;
                            }
                        }
                        //console.log("KKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK", transSofitasa_factura_credito)
                        /////////////////////////////INGRESOS TARJETAS DE DEBITO FACTURAS A CREDITO///////////////////////////
                        if(abono.id_tipo_pago == 3 && abono.igtf_pago == 0 && abono.tipo_registro == 0){
                            /////////BANESCO////////
                            if(abono.id_banco == 1){
                                debitoBanescoOTCredito = debitoBanescoOTCredito + abono.monto;
                            /////////PROVINCIAL////////
                            }else if(abono.id_banco == 2){
                                debitoProvincialOTCredito = debitoProvincialOTCredito + abono.monto;
                            }else if(abono.id_banco == 3){
                            /////////MERCANTIL////////
                                debitoMercantilOTCredito = debitoMercantilOTCredito + abono.monto;
                            }else if(abono.id_banco == 4){
                            /////////VENEZUELA////////
                                debitoVenezuelaOTCredito = debitoVenezuelaOTCredito + abono.monto;
                            }else if(abono.id_banco == 5){
                            /////////SOFITASA////////
                                debitoSofitasaOTCredito = debitoSofitasaOTCredito + abono.monto;
                            }else if(abono.id_banco == 9){
                                /////////SOFITASA////////
                                    debito100BancoOTCredito = debito100BancoOTCredito + abono.monto;
                                }
                                    
                        }
                        ///////////////////////////INGRESOS TARJETAS DE CREDITO FACTURAS A CREDITO////////////////////////////
                        if(abono.id_tipo_pago == 4 && abono.igtf_pago == 0 && abono.tipo_registro == 0){
                            /////////BANESCO////////
                            if(abono.id_banco == 1){
                                creditoBanescoOTCredito = creditoBanescoOTCredito + abono.monto;
                            /////////PROVINCIAL////////
                            }else if(abono.id_banco == 2){
                                creditoProvincialOTCredito = creditoProvincialOTCredito + abono.monto;
                            }else if(abono.id_banco == 3){
                            /////////MERCANTIL////////
                                creditoMercantilOTCredito = creditoMercantilOTCredito + abono.monto;
                            }else if(abono.id_banco == 4){
                            /////////VENEZUELA////////
                                creditoVenezuelaOTCredito = creditoVenezuelaOTCredito + abono.monto;
                            }else if(abono.id_banco == 5){
                            /////////SOFITASA////////
                                creditoSofitasaOTCredito = creditoSofitasaOTCredito + abono.monto;
                            }else if(abono.id_banco == 5){
                                /////////100% banco////////
                                    credito100BancoOTCredito = credito100BancoOTCredito + abono.monto;
                            }
                        }
                    }
                }
            }
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////////

    //////////////////////////SUMANDO INDIVIDUALMENTE LOS TIPOS DE REGISTRO////////////////////////////
    for(const item of recibos){
        ////////////////////SUMATORIA GENERAL PARA RECIBOS DE REGISTRO CONVENIO Y PARA FACTURAS A CREDITO///////////////
        ////////RECIBOS PARA FACTURA A CREDITO///////
        pesosR = pesosR  + item.monto_pesos, 
        dolaresR = dolaresR  + item.monto_bolivares, 
        bolivaresR = bolivaresR  + item.monto_bolivares;
        if(item.id_tipo_recibo == 1){
            totalBolivaresReciboRegistroConvenio = totalBolivaresReciboRegistroConvenio + item.monto_bolivares
            totalPesosReciboRegistroConvenio = totalPesosReciboRegistroConvenio + item.monto_pesos
            totalDolaresReciboRegistroConvenio = totalDolaresReciboRegistroConvenio + item.monto_dolares

        ///////////RECIBOS PARA REGISTROS CONVENIOS//////////////
        }else if(item.id_tipo_recibo == 2){
            totalBolivaresReciboFacturasCredito = totalBolivaresReciboFacturasCredito + item.monto_bolivares, 
            totalPesosReciboFacturasCredito = + totalPesosReciboFacturasCredito + item.monto_pesos, 
            totalDolaresReciboFacturasCredito = totalDolaresReciboFacturasCredito + item.monto_dolares
        }

        for(const pago of item.registros_pago){
            //console.log("MEN AT WORK", pago.tipo_registro)
            if(pago.id_tipo_pago == 2 /*&& pago.igtf_pago == 0*/){
                ///////EFECTIVO PESOS//////
                if(pago.id_divisa == 1){
                    if(pago.tipo_registro == 0){
                        //efectivoPContado = efectivoPContado + pago.monto
                        //abonadoP = abonadoP + pago.monto;
                        efectivoPCredito = efectivoPCredito + pago.monto
                    }else{
                        //efectivoPContado = efectivoPContado - pago.monto
                        //abonadoP = abonadoP - pago.monto;
                        efectivoPCredito = efectivoPCredito + pago.monto
                    }
                }else if(pago.id_divisa == 2){
                //////EFECITVO DOLAEES/////
                if(pago.tipo_registro == 0){
                    //efectivoDContado = efectivoDContado + pago.monto
                    //abonadoD = abonadoD + pago.monto;
                    efectivoDCredito = efectivoDCredito + pago.monto
                }else{
                    //efectivoDContado = efectivoDContado - pago.monto
                    //abonadoD = abonadoD - pago.monto;
                    efectivoDCredito = efectivoDCredito - pago.monto
                } 
                //console.log("ENTRO A MENT A DOLARES", efectivoDContado);
                }else if(pago.id_divisa == 3){
                //////EFECTIVO BOLIVARES////
                    if(pago.tipo_registro == 0){
                        //efectivoBContado = efectivoBContado + pago.monto
                        //abonadoB = abonadoB + pago.monto;
                        efectivoBCredito = efectivoPCredito + pago.monto
                    }else{
                        //efectivoBContado = efectivoBContado - pago.monto
                        //abonadoB = abonadoB - pago.monto;
                        efectivoBCredito = efectivoPCredito + pago.monto
                    }
                }
            }
            /////////////////////////////////INGRESOS DE RECIBO POR BANCOS////////////////////////////////
            if(pago.id_tipo_pago == 1 && pago.igtf_pago == 0 && pago.tipo_registro == 0){
                if(pago.id_banco == 1){
                transBanesco_factura_credito = transBanesco_factura_credito + pago.monto;
                /////////PROVINCIAL////////
                }else if(pago.id_banco == 2){
                    transProvincial_factura_credito = transProvincial_factura_credito + pago.monto;
                }else if(pago.id_banco == 3){
                /////////MERCANTIL////////
                transMercantil_factura_credito =transMercantil_factura_credito + pago.monto;
                }else if(pago.id_banco == 4){
                /////////VENEZUELA////////
                    transVenezuela_factura_credito = transVenezuela_factura_credito + pago.monto;
                }else if(pago.id_banco == 5){
                /////////SOFITASA////////
                    transSofitasa_factura_credito = transSofitasa_factura_credito + pago.monto;
                }else if(pago.id_banco == 6){
                    /////////ZELLE////////
                        zelleFacturaCredito = zelleFacturaCredito + pago.monto;
                }else if(pago.id_banco == 7){
                    /////////BANCOLOMBIA////////
                        bancolombiaFacturaCredito = bancolombiaFacturaCredito + pago.monto;
                }else if(pago.id_banco == 8){
                    /////////paypal////////
                       paypalFacturaCredito = paypalFacturaCredito + pago.monto;
                }else if(pago.id_banco == 9){
                    /////////paypal////////
                       trans100Banco_factura_credito = trans100Banco_factura_credito + pago.monto;
                }
            }
            ///////////////////////////////////////////////////////////////////////
            ///////////////////////////INGRESOS TARJETAS DE CREDITO FACTURAS A CONTADO LOOP PARA RECIBOS////////////////////////////
            if(pago.id_tipo_pago == 4 && pago.igtf_pago == 0 && pago.tipo_registro == 0){
                /////////BANESCO////////
                if(pago.id_banco == 1){
                    creditoBanescoCredito = creditoBanescoContado + pago.monto;
                /////////PROVINCIAL////////
                }else if(pago.id_banco == 2){
                    creditoProvincialCredito = creditoProvincialCredito + pago.monto;
                }else if(pago.id_banco == 3){
                /////////MERCANTIL////////
                    creditoMercantilCredito = creditoMercantilCredito + pago.monto;
                }else if(pago.id_banco == 4){
                /////////VENEZUELA////////
                    creditoVenezuelaCredito = creditoVenezuelaCredito + pago.monto;
                }else if(pago.id_banco == 5){
                /////////SOFITASA////////
                    creditoSofitasaCredito = creditoSofitasaCredito + pago.monto;
                }else if(pago.id_banco == 9){
                    /////////SOFITASA////////
                        credito100BancoCredito = credito100BancoCredito + pago.monto;
                    }
            }
        }
    }
    /////////////////////////////////////////SUMATORIA DE IGTF DE FACTURAS CON VUELTOS///////////////////////////////////
    let sumaBolivaresIGTFVueltosEfectivo = 0, sumaDolaresIGTFVueltosEfectivo = 0, sumaPesosIGTFVueltosEfectivo = 0;
    for(const item of facturas){
        let vueltos = 0;
        ////////////////////////FOR PARA VERIFICAR QUE LA LOS PAGOS TENGAN VUELTOS/////////////////////////////
        for(const pago of item.registro_pagos){
            if(pago.tipo_registro == 1){
                vueltos = 1;
                break;
            }
        }
        if(vueltos == 0){
            if((item.id_tipo_factura == 1 || item.id_tipo_factura == 3) && item.id_estado_factura != 3){
                for(const pago of item.registro_pagos){
                    if(pago.id_tipo_pago == 2){
                        if(pago.id_divisa == 1 && pago.igtf_pago == 1){
                            sumaPesosIGTFVueltosEfectivo = sumaPesosIGTFVueltosEfectivo + pago.monto;
                        }if(pago.id_divisa == 2 && pago.igtf_pago == 1){
                            sumaDolaresIGTFVueltosEfectivo = sumaDolaresIGTFVueltosEfectivo + pago.monto;
                        }if(pago.id_divisa == 3 && pago.igtf_pago == 1){
                            sumaBolivaresIGTFVueltosEfectivo = sumaBolivaresIGTFVueltosEfectivo + pago.monto;
                        }
                    }
                }
            }
        }
        vueltos = 0;
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////SUMATORIA DE PAGOS POR IGTF/////////////////////////////
    for(const item of facturas){
        //console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", item)
        ////////////////////////////////////TOTAL IGTF (FACTURAS A CREDITO Y DEBITO)/////////////////////////////////////
        for(const pago of item.registro_pagos){
            if(item.id_tipo_factura != 3){
                    if(pago.id_divisa == 1 && pago.igtf_pago == 1){
                        igtfP = igtfP + pago.monto;
                    }if(pago.id_divisa == 2 && pago.igtf_pago == 1){
                        igtfD = igtfD + pago.monto;
                    }
                    //console.log(igtfP, igtfD)
                    if(pago.id_divisa == 3 && pago.igtf_pago == 1){
                        igtfB = igtfB + pago.monto;
                    }
                ////////////////////////////IGTF EN TRANSFERENCIA//////////////////////////////
                if(pago.id_tipo_pago == 1 && pago.igtf_pago == 1){
                    ////////////////PESOS//////////////
                    if(pago.id_divisa == 1 && pago.igtf_pago == 1){
                        igtfPTransferencia = igtfPTransferencia + pago.monto;
                    } 
                    if(pago.id_divisa == 2 && pago.igtf_pago == 1){
                        igtfDTransferencia = igtfDTransferencia + pago.monto;
                    } 
                    if(pago.id_divisa == 3 && pago.igtf_pago == 1){
                        igtfBTransferencia = igtfBTransferencia + pago.monto;
                    } 
                    /////////////////////////PARA PAYPAL Y ZELLE//////////////////////////////
                    if(pago.id_divisa == 2 && pago.igtf_pago == 1 && pago.id_banco == 8){
                        igtfPaypal = igtfPaypal + pago.monto;
                    }
                    if(pago.id_divisa == 2 && pago.igtf_pago == 1 && pago.id_banco == 6){
                        igtfZelle = igtfZelle + pago.monto;
                    } 
                    //////////////////////////////////////////////////////////////////////////
                }
                ////////////////////////////////
                ///////////////////////////////////////////////////////////////////////////////
                //////////////////////////EFECTIVO////////////////////////////////////////////
                if(pago.id_tipo_pago == 2 && pago.igtf_pago == 1){
                    ////////////////PESOS//////////////
                    if(pago.id_divisa == 1 && pago.igtf_pago == 1){
                        igtfPEfectivo = igtfPEfectivo + pago.monto;
                    } 
                    if(pago.id_divisa == 2 && pago.igtf_pago == 1){
                        igtfDEfectivo = igtfDEfectivo + pago.monto;
                    } 
                    if(pago.id_divisa == 3 && pago.igtf_pago == 1){
                        igtfBEfectivo = igtfBEfectivo + pago.monto;
                    } 
                }
                if(pago.id_tipo_pago == 3 && pago.igtf_pago == 1){
                    if(pago.id_divisa == 1 && pago.igtf_pago == 1){
                        igtfPDebito = igtfPDebito + pago.monto;
                    } 
                    if(pago.id_divisa == 2 && pago.igtf_pago == 1){
                        igtfDDebito = igtfDDebito + pago.monto;
                    } 
                    if(pago.id_divisa == 3 && pago.igtf_pago == 1){
                        igtfBDebito = igtfBDebito + pago.monto;
                    } 
                }
                if(pago.id_tipo_pago == 4 && pago.igtf_pago == 1){
                    if(pago.id_divisa == 1 && pago.igtf_pago == 1){
                        igtfPCredito = igtfPCredito + pago.monto;
                    } 
                    if(pago.id_divisa == 2 && pago.igtf_pago == 1){
                        igtfDCredito = igtfDCredito + pago.monto;
                    } 
                    if(pago.id_divisa == 3 && pago.igtf_pago == 1){
                        igtfBCredito = igtfBCredito + pago.monto;
                    } 
                }
                /////////////////////////////////////////////////////////////////////////////////////////////////////
                ///////////////////////////////////IGTF DE FACTURAS A CONTADO///////////////////////////////////////
                if(item.id_tipo_factura == 1 && pago.igtf_pago == 1){
                    if(pago.id_divisa == 1 && pago.igtf_pago == 1){
                        igtfPFacturaContado = igtfPFacturaContado + pago.monto;
                    }
                    if(pago.id_divisa == 2 && pago.igtf_pago == 1){
                        igtfDFacturaContado = igtfDFacturaContado + pago.monto;
                    }
                    if(pago.id_divisa == 3 && pago.igtf_pago == 1){
                        igtfBFacturaContado = igtfBFacturaContado + pago.monto;
                    }
                    if(pago.id_tipo_pago == 1 && pago.igtf_pago == 1){
                        ////////////////PESOS//////////////
                        if(pago.id_divisa == 1 && pago.igtf_pago == 1){
                            igtfPTransferenciaFacturaContado = igtfPTransferenciaFacturaContado + pago.monto;
                        } 
                        if(pago.id_divisa == 2 && pago.igtf_pago == 1){
                            igtfDTransferenciaFacturaContado = igtfDTransferenciaFacturaContado + pago.monto;
                        } 
                        if(pago.id_divisa == 3 && pago.igtf_pago == 1){
                            igtfBTransferenciaFacturaContado = igtfBTransferenciaFacturaContado + pago.monto;
                        } 
                    }
                    ///////////////////////////////////////////////////////////////////////////////
                    //////////////////////////EFECTIVO////////////////////////////////////////////
                    if(pago.id_tipo_pago == 2 && pago.igtf_pago == 1){
                        ////////////////PESOS//////////////
                        if(pago.id_divisa == 1 && pago.igtf_pago == 1){
                            igtfPEfectivoFacturaContado = igtfPEfectivoFacturaContado + pago.monto;
                        } 
                        if(pago.id_divisa == 2 && pago.igtf_pago == 1){
                            igtfDEfectivoFacturaContado = igtfDEfectivoFacturaContado + pago.monto;
                        } 
                        if(pago.id_divisa == 3 && pago.igtf_pago == 1){
                            igtfBEfectivoFacturaContado = igtfBEfectivoFacturaContado + pago.monto;
                        } 
                    }
                    if(pago.id_tipo_pago == 3 && pago.igtf_pago == 1){
                        if(pago.id_divisa == 1 && pago.igtf_pago){
                            igtfPDebitoFacturaContado = igtfPDebitoFacturaContado + pago.monto;
                        } 
                        if(pago.id_divisa == 2 && pago.igtf_pago){
                            igtfDDebitoFacturaContado = igtfDDebitoFacturaContado + pago.monto;
                        } 
                        if(pago.id_divisa == 3 && pago.igtf_pago){
                            igtfBDebitoFacturaContado = igtfBDebitoFacturaContado + pago.monto;
                        } 
                    }
                    if(pago.id_tipo_pago == 4 && pago.igtf_pago == 1){
                        if(pago.id_divisa == 1 && pago.igtf_pago){
                            igtfPCreditoFacturaContado = igtfPCreditoFacturaContado + pago.monto;
                        } 
                        if(pago.id_divisa == 2 && pago.igtf_pago){
                            igtfDCreditoFacturaContado = igtfDCreditoFacturaContado + pago.monto;
                        } 
                        if(pago.id_divisa == 3 && pago.igtf_pago){
                            igtfBCreditoFacturaContado = igtfBCreditoFacturaContado + pago.monto;
                        } 
                    }
                }
                ////////////////////////////////////////////////////////////////////////////////////////////////////
                ///////////////////////////////////IGTF DE FACTURAS A CREDITO////////////////////////////////////////
                if(item.id_tipo_factura == 2 && pago.igtf_pago == 1){
                    if(pago.id_divisa == 1){
                        igtfPFacturaCredito = igtfPFacturaCredito + pago.monto;
                    }
                    if(pago.id_divisa == 2){
                        igtfDFacturaCredito = igtfDFacturaCredito + pago.monto;
                    }
                    if(pago.id_divisa == 3){
                        igtfBFacturaCredito = igtfBFacturaCredito + pago.monto;
                    }
                    ////////////////////////////IGTF EN TRANSFERENCIA//////////////////////////////
                    if(pago.id_tipo_pago == 1 && pago.igtf_pago == 1){
                        ////////////////PESOS//////////////
                        if(pago.id_divisa == 1){
                            igtfPTransferenciaFacturaCredito = igtfPTransferenciaFacturaCredito + pago.monto;
                        } 
                        if(pago.id_divisa == 2){
                            igtfDTransferenciaFacturaCredito = igtfDTransferenciaFacturaCredito + pago.monto;
                        } 
                        if(pago.id_divisa == 3){
                            igtfBTransferenciaFacturaCredito = igtfBTransferenciaFacturaCredito + pago.monto;
                        } 
                    }
                    ///////////////////////////////////////////////////////////////////////////////
                    //////////////////////////EFECTIVO////////////////////////////////////////////
                    if(pago.id_tipo_pago == 2 && pago.igtf_pago == 1){
                        ////////////////PESOS//////////////
                        if(pago.id_divisa == 1){
                            igtfPEfectivoFacturaCredito = igtfPEfectivoFacturaCredito + pago.monto;
                        } 
                        if(pago.id_divisa == 2){
                            igtfDEfectivoFacturaCredito = igtfDEfectivoFacturaCredito + pago.monto;
                        } 
                        if(pago.id_divisa == 3){
                            igtfBEfectivoFacturaCredito = igtfBEfectivoFacturaCredito + pago.monto;
                        } 
                    }
                    if(pago.id_tipo_pago == 3 && pago.igtf_pago == 1){
                        if(pago.id_divisa == 1){
                            igtfPDebitoFacturaCredito = igtfPDebitoFacturaCredito + pago.monto;
                        } 
                        if(pago.id_divisa == 2){
                            igtfDDebitoFacturaCredito = igtfDDebitoFacturaCredito + pago.monto;
                        } 
                        if(pago.id_divisa == 3){
                            igtfBDebitoFacturaCredito = igtfBDebitoFacturaCredito + pago.monto;
                        } 
                    }
                    if(pago.id_tipo_pago == 4 && pago.igtf_pago == 1){
                        if(pago.id_divisa == 1){
                            igtfPCreditoFacturaCredito = igtfPCreditoFacturaCredito + pago.monto;
                        } 
                        if(pago.id_divisa == 2){
                            igtfDCreditoFacturaCredito = igtfDCreditoFacturaCredito + pago.monto;
                        } 
                        if(pago.id_divisa == 3){
                            igtfBCreditoFacturaCredito = igtfBCreditoFacturaCredito + pago.monto;
                        } 
                    }
                }
                ////////////////////////////////////////////////////////////////////////////////////////////////////
            }
        }
    }
    
    ////////////////////////////////////SUMATORIA DE COSAS/////////////////////////////////////
    for(const item of facturas){


        ///////////////////////////////ORDENES DE TRABAJO/////////////////////////
        if(item.numero_factura == null && item.orden_trabajo != null && item.id_tipo_factura == 3){
            totalOrdenesTrabajoContado = totalOrdenesTrabajoContado + 1, 
            totalBsOrdenesTrabajo = totalBsOrdenesTrabajo + item.total_bolivares, 
            totalPesosOrdenesTrabajo = totalPesosOrdenesTrabajo + item.total_pesos, 
            totalDolaresOrdenesTrabajo = totalDolaresOrdenesTrabajo + item.total_dolares;
        }

        ///////////////////////////////DESCUENTOS TOTALES/////////////////////////
            if(item.descuento_bolivares > 0 || item.descuento_pesos > 0 || item.descuento_dolares > 0){
                cantidadFacturasDescuentos = cantidadFacturasDescuentos + 1;
                detallesDescontadas.push({
                    id_factura: item.id_factura,
                    numero_factura: item.numero_factura,
                    orden_trabajo: item.orden_trabajo,
                    total_bolivares: item.total_bolivares,
                    total_dolares: item.total_dolares,
                    total_pesos: item.total_pesos,
                    id_usuario: item.id_usuario,
                    id_cliente: item.id_cliente,
                    id_tipo_factura: item.id_tipo_factura,
                    id_estado_factura: item.id_estado_factura,
                    fecha_creacion_factura: item.fecha_creacion_factura,
                    fecha_cencelacion_factura: item.fecha_cencelacion_factura,
                    descuento_bolivares: item.descuento_bolivares,
                    descuento_dolares: item.descuento_dolares,
                    descuento_pesos: item.descuento_pesos,
                    anulacion_motivo: item.anulacion_motivo,
                    tipo_factura_nombre: item.tipo_factura_nombre,
                    cliente_nombre: item.cliente_nombre,
                    cliente_apellido: item.cliente_apellido,
                    id_tipo_cliente: item.id_tipo_cliente,
                })
            }
            descuentoD = descuentoD + item.descuento_dolares;
            descuentoB = descuentoB + item.descuento_bolivares;
            descuentoP = descuentoP + item.descuento_pesos;
        
        //////////////////////////////FACTURAS AL CONTADO////////////////////////
        if(item.id_tipo_factura == 1 && item.id_estado_factura != 3){
            cantidad_facturas_contado ++;
            contadoB = contadoB + (item.total_bolivares - item.descuento_bolivares)
            contadoD = contadoD + (item.total_dolares - item.descuento_dolares)
            contadoP = contadoP + (item.total_pesos - item.descuento_pesos)
        }
        if(item.id_tipo_factura == 3 && item.id_estado_factura != 3){
            contadoBOrdenTrabajo = contadoBOrdenTrabajo + item.total_bolivares
            contadoDOrdenTrabajo = contadoDOrdenTrabajo + item.total_dolares
            contadoPOrdenTrabajo = contadoPOrdenTrabajo + item.total_pesos
        }
        if(item.id_tipo_factura == 5 && item.id_estado_factura != 3){
            creditoBOrdenTrabajo = creditoBOrdenTrabajo + item.total_bolivares
            creditoDOrdenTrabajo = creditoDOrdenTrabajo + item.total_dolares
            creditoPOrdenTrabajo = creditoPOrdenTrabajo + item.total_pesos
        }
        if((item.id_tipo_factura == 1 || item.id_tipo_factura == 3) && item.id_estado_factura != 3){
           // console.log("WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW")

            /////////////////////////////DESCUENTOS EN FACTURAS A CONTADO///////////////////////////
            descuento_pesos_factura_contado = descuento_pesos_factura_contado + item.descuento_pesos, 
            descuento_dolares_factura_contado = descuento_dolares_factura_contado + item.descuento_dolares, 
            descuento_bolivares_factura_contado = descuento_bolivares_factura_contado + item.descuento_bolivares
            for(const pago of item.registro_pagos){
                //console.log("EN REGISTRO_ PAGOS!!!", pago);
                /////////////////////////////INGRESOS POR TRANSFERENCIAS EN BOLIVARES DE BANCOS NACIONALES FACTURAS A CONTADO///////////////////
                if(pago.id_tipo_pago == 1 && pago.tipo_registro == 0){
                    if(pago.id_banco == 1){
                    transBanesco_factura_contado = transBanesco_factura_contado + pago.monto;
                    /////////PROVINCIAL////////
                    }else if(pago.id_banco == 2){
                        transProvincial_factura_contado = transProvincial_factura_contado + pago.monto;
                    }else if(pago.id_banco == 3){
                    /////////MERCANTIL////////
                    transMercantil_factura_contado =transMercantil_factura_contado + pago.monto;
                    }else if(pago.id_banco == 4){
                    /////////VENEZUELA////////
                        transVenezuela_factura_contado = transVenezuela_factura_contado + pago.monto;
                    }else if(pago.id_banco == 5){
                    /////////SOFITASA////////
                        transSofitasa_factura_contado = transSofitasa_factura_contado + pago.monto;
                    }else if(pago.id_banco == 6){
                        /////////ZELLE////////
                            zelleFacturaContado = zelleFacturaContado + pago.monto;
                    }else if(pago.id_banco == 7){
                        /////////BANCOLOMBIA////////
                            bancolombiaFacturaContado = bancolombiaFacturaContado + pago.monto;
                    }else if(pago.id_banco == 8){
                        /////////paypal////////
                           paypalFacturaContado =paypalFacturaContado + pago.monto;
                    }else if(pago.id_banco == 9){
                        /////////paypal////////
                           trans100Banco_factura_contado = trans100Banco_factura_contado + pago.monto;
                    }
                }
                /////////////////////////////INGRESOS TARJETAS DE DEBITO FACTURAS A CONTADO///////////////////////////
                if(pago.id_tipo_pago == 3 && pago.igtf_pago == 0 && pago.tipo_registro == 0){
                    /////////BANESCO////////
                    if(pago.id_banco == 1){
                        debitoBanescoContado = debitoBanescoContado + pago.monto;
                    /////////PROVINCIAL////////
                    }else if(pago.id_banco == 2){
                        debitoProvincialContado = debitoProvincialContado + pago.monto;
                    }else if(pago.id_banco == 3){
                    /////////MERCANTIL////////
                        debitoMercantilContado = debitoMercantilContado + pago.monto;
                    }else if(pago.id_banco == 4){
                    /////////VENEZUELA////////
                        debitoVenezuelaContado = debitoVenezuelaContado + pago.monto;
                    }else if(pago.id_banco == 5){
                    /////////SOFITASA////////
                        debitoSofitasaContado = debitoSofitasaContado + pago.monto;
                    }else if(pago.id_banco == 9){
                        /////////SOFITASA////////
                            debito100BancoContado = debito100BancoContado + pago.monto;
                        }
                }
                ///////////////////////////INGRESOS TARJETAS DE CREDITO FACTURAS A CONTADO////////////////////////////
                if(pago.id_tipo_pago == 4 && pago.igtf_pago == 0 && pago.tipo_registro == 0){
                    /////////BANESCO////////
                    if(pago.id_banco == 1){
                        creditoBanescoContado = creditoBanescoContado + pago.monto;
                    /////////PROVINCIAL////////
                    }else if(pago.id_banco == 2){
                        creditoProvincialContado = creditoProvincialContado + pago.monto;
                    }else if(pago.id_banco == 3){
                    /////////MERCANTIL////////
                        creditoMercantilContado = creditoMercantilContado + pago.monto;
                    }else if(pago.id_banco == 4){
                    /////////VENEZUELA////////
                        creditoVenezuelaContado = creditoVenezuelaContado + pago.monto;
                    }else if(pago.id_banco == 5){
                    /////////SOFITASA////////
                        creditoSofitasaContado = creditoSofitasaContado + pago.monto;
                    }else if(pago.id_banco == 9){
                        /////////SOFITASA////////
                            credito100BancoContado = credito100BancoContado + pago.monto;
                        }
                }
                ///////////////////////////INGRESO POR EFECTIVO FACTURAS A CONTADO////////////////////////////////
                if(pago.id_tipo_pago == 2 && pago.igtf_pago == 0){
                    ///////EFECTIVO PESOS//////
                    if(pago.id_divisa == 1){
                        if(pago.tipo_registro == 0){
                            efectivoPContado = efectivoPContado + pago.monto
                        }else{
                            efectivoPContado = efectivoPContado - pago.monto
                        }
                    }else if(pago.id_divisa == 2){
                    //////EFECITVO DOLAEES/////
                    //console.log("MMMMMMMMMMMMMMMMMMMMM", pago)
                      if(pago.tipo_registro == 0){
                        efectivoDContado = efectivoDContado + pago.monto
                      }else{
                        efectivoDContado = efectivoDContado - pago.monto
                      } 
                    }else if(pago.id_divisa == 3){
                    //////EFECTIVO BOLIVARES////
                        if(pago.tipo_registro == 0){
                            efectivoBContado = efectivoBContado + pago.monto
                        }else{
                            efectivoBContado = efectivoBContado - pago.monto
                        }
                    }
                }
                //console.log(efectivoPContado, efectivoDContado, efectivoBContado)
            }
        }
        /////////////////////////////FACTURAS A CREDITO/////////////////////////
        //console.log("??????????????????????????????????????????????????????????", item)
        if(item.id_tipo_factura == 2 && item.id_estado_factura != 3){
            cantidad_facturas_credito ++;
            creditoB = creditoB + item.total_bolivares
            creditoD = creditoD + item.total_dolares
            creditoP = creditoP + item.total_pesos
            if(item.id_tipo_cliente == 2){
                creditoBConvenio = creditoBConvenio + item.total_bolivares,
                creditoPConvenio = creditoPConvenio + item.total_pesos,
                creditoDConvenio = creditoDConvenio + item.total_dolares,
                cantidadFacturaCreditoConvenio = cantidadFacturaCreditoConvenio + 1;
            } 
            if(item.id_tipo_cliente == 1 ){
                creditoBParticular = creditoBParticular + item.total_bolivares,
                creditoPParticular = creditoPParticular + item.total_pesos,
                creditoDParticular = creditoDParticular + item.total_dolares,
                cantidadFacturaCreditoParticular = cantidadFacturaCreditoParticular + 1;
            }
            ////////////////////////////DESCUENTO EN FACTURAS A CREDITO/////////////////////////////
            descuento_pesos_factura_credito = descuento_pesos_factura_credito + item.descuento_pesos, 
            descuento_dolares_factura_credito = descuento_dolares_factura_credito + item.descuento_dolares, 
            descuento_bolivares_factura_credito = descuento_bolivares_factura_credito + item.descuento_bolivares
            ////////////////////////ABONOS EN FACTURAS A CREDITO//////////////////
            for(const abono of item.registro_pagos){
                //console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<")
                //if(abono.id_usuario == req.body.id_usuario || abono.id_usuario == req.body.id_usuario2 || abono.id_usuario == req.body.id_usuario3 ){
                    if(abono.igtf_pago == 0 && abono.tipo_registro == 0 && abono.igtf_pago == 0){
                        ///////ABONO PESOS//////
                        if(abono.id_divisa == 1){
                            if(abono.tipo_registro == 0){
                                abonadoP = abonadoP + abono.monto
                            }else{
                                abonadoP = abonadoP - abono.monto
                            }
                        }else if(abono.id_divisa == 2){
                        //////ABONO DOLAEES/////
                            if(abono.tipo_registro == 0){
                                abonadoD = abonadoD + abono.monto
                            }else{
                                abonadoD = abonadoD - abono.monto
                            }
                        }else if(abono.id_divisa == 3){
                        //////ABONO BOLIVARES////
                            if(abono.tipo_registro == 0){
                                abonadoB = abonadoB + abono.monto
                            }else{
                                abonadoB = abonadoB - abono.monto
                            }
                        }
                    }
                    ///////////////////////////INGRESO POR EFECTIVO FACTURAS A CREDITO////////////////////////////////
                    if(abono.id_tipo_pago == 2 /*&& abono.igtf_pago == 0*/){
                        ///////EFECTIVO PESOS//////
                        if(abono.id_divisa == 1){
                            efectivoPCredito = efectivoPCredito + abono.monto
                        }else if(abono.id_divisa == 2){
                        //////EFECITVO DOLAEES/////
                            console.log("7777777777777777777777777777777777777", abono)
                            if(abono.tipo_registro == 0){
                                efectivoDCredito = efectivoDCredito + abono.monto
                            }else{
                                efectivoDCredito = efectivoDCredito - abono.monto
                            } 
                        }else if(abono.id_divisa == 3){
                        //////EFECTIVO BOLIVARES////
                            efectivoBCredito = efectivoBCredito + abono.monto
                        }
                    }
                    ////////////////////////INGRESOS EN TRANSFERENCIAS EN BOLIVARES Y OTROS EN FACTURAS A CREDITO//////////////////
                    if(abono.id_tipo_pago == 1 && abono.igtf_pago == 0 && abono.tipo_registro == 0){
                        if(abono.id_banco == 1){
                        transBanesco_factura_credito = transBanesco_factura_credito + abono.monto;
                        /////////PROVINCIAL////////
                        }else if(abono.id_banco == 2){
                            transProvincial_factura_credito = transProvincial_factura_credito + abono.monto;
                        }else if(abono.id_banco == 3){
                        /////////MERCANTIL////////
                        transMercantil_factura_credito =transMercantil_factura_credito + abono.monto;
                        }else if(abono.id_banco == 4){
                        /////////VENEZUELA////////
                            transVenezuela_factura_credito = transVenezuela_factura_credito + abono.monto;
                        }else if(abono.id_banco == 5){
                        /////////SOFITASA////////
                            transSofitasa_factura_credito = transSofitasa_factura_credito + abono.monto;
                        }else if(abono.id_banco == 6){
                            /////////ZELLE////////
                                zelleFacturaCredito = zelleFacturaCredito + abono.monto;
                        }else if(abono.id_banco == 7){
                            /////////BANCOLOMBIA////////
                                bancolombiaFacturaCredito = bancolombiaFacturaCredito + abono.monto;
                        }else if(abono.id_banco == 8){
                            /////////paypal////////
                            paypalFacturaCredito = paypalFacturaCredito + abono.monto;
                        }else if(abono.id_banco == 9){
                            /////////BANCAMIGA////////
                           
                            trans100Banco_factura_credito = trans100Banco_factura_credito + abono.monto;
                        }
                    }
                    console.log("KKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK", abono)
                    /////////////////////////////INGRESOS TARJETAS DE DEBITO FACTURAS A CREDITO///////////////////////////
                    if(abono.id_tipo_pago == 3 && abono.igtf_pago == 0 && abono.tipo_registro == 0){
                        /////////BANESCO////////
                        if(abono.id_banco == 1){
                            debitoBanescoCredito = debitoBanescoCredito + abono.monto;
                        /////////PROVINCIAL////////
                        }else if(abono.id_banco == 2){
                            debitoProvincialCredito = debitoProvincialCredito + abono.monto;
                        }else if(abono.id_banco == 3){
                        /////////MERCANTIL////////
                            debitoMercantilCredito = debitoMercantilCredito + abono.monto;
                        }else if(abono.id_banco == 4){
                        /////////VENEZUELA////////
                            debitoVenezuelaCredito = debitoVenezuelaCredito + abono.monto;
                        }else if(abono.id_banco == 5){
                        /////////SOFITASA////////
                            debitoSofitasaCredito = debitoSofitasaCredito + abono.monto;
                        }else if(abono.id_banco == 9){
                            /////////BANCAMIGA////////
                            console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", abono.monto)
                                debito100BancoCredito = debito100BancoCredito + abono.monto;
                            }
                        
                    }
                    ///////////////////////////INGRESOS TARJETAS DE CREDITO FACTURAS A CREDITO////////////////////////////
                    if(abono.id_tipo_pago == 4 && abono.igtf_pago == 0 && abono.tipo_registro == 0){
                        /////////BANESCO////////
                        if(abono.id_banco == 1){
                            creditoBanescoCredito = creditoBanescoCredito + abono.monto;
                        /////////PROVINCIAL////////
                        }else if(abono.id_banco == 2){
                            creditoProvincialCredito = creditoProvincialCredito + abono.monto;
                        }else if(abono.id_banco == 3){
                        /////////MERCANTIL////////
                            creditoMercantilCredito = creditoMercantilCredito + abono.monto;
                        }else if(abono.id_banco == 4){
                        /////////VENEZUELA////////
                            creditoVenezuelaCredito = creditoVenezuelaCredito + abono.monto;
                        }else if(abono.id_banco == 5){
                        /////////SOFITASA////////
                            creditoSofitasaCredito = creditoSofitasaCredito + abono.monto;
                        }else if(abono.id_banco == 9){
                            /////////100% banco////////
                                credito100BancoCredito = credito100BancoCredito + abono.monto;
                            }
                    }
                //}
            }
        }
        //////////////////////////////ORDENES DE TRABAJO A CREDITO//////////////////////////////
        
        ////////////////////////////ORDENES DE TRABAJO A CREDITO///////////////////////
        if(item.id_tipo_factura == 5 && item.id_estado_factura != 3){
            cantidad_ordenes_trabajo_credito++;
            creditoBOrdenTrabajo = creditoBOrdenTrabajo + item.totcreditoBOTal_bolivares
            creditoDOrdenTrabajo = creditoDOrdenTrabajo + item.total_dolares
            creditoPOrdenTrabajo = creditoPOrdenTrabajo + item.total_pesos
        }
        /////////////////////////////ORDENES DE TRABAJO A CREDITO/////////////////////////
        //console.log("??????????????????????????????????????????????????????????", item)
        if(item.id_tipo_factura == 5 && item.id_estado_factura != 3){
            console.log("??????????????????????????????????????????????????????????", item)
            cantidad_facturas_credito ++;
            creditoBOT = creditoBOT + item.total_bolivares
            creditoDOT = creditoDOT + item.total_dolares
            creditoPOT = creditoPOT + item.total_pesos
            if(item.id_tipo_cliente == 2){
                creditoBConvenioOT = creditoBConvenioOT + item.total_bolivares,
                creditoPConvenioOT = creditoPConvenioOT + item.total_pesos,
                creditoDConvenioOT = creditoDConvenioOT + item.total_dolares,
                cantidadOTCreditoConvenio = cantidadOTCreditoConvenio + 1;
            } 
            if(item.id_tipo_cliente == 1 ){
                creditoBOTParticular = creditoBOTParticular + item.total_bolivares,
                creditoPOTParticular = creditoPOTParticular + item.total_pesos,
                creditoDOTParticular = creditoDOTParticular + item.total_dolares,
                cantidadOTCreditoParticular = cantidadOTCreditoParticular + 1;
            }
            ////////////////////////////DESCUENTO EN ORDENES DE TRABAJO A CREDITO/////////////////////////////
            descuento_pesos_ordenes_trabajo_credito = descuento_pesos_ordenes_trabajo_credito + item.descuento_pesos, 
            descuento_dolares_ordenes_trabajo_credito = descuento_dolares_ordenes_trabajo_credito + item.descuento_dolares, 
            descuento_bolivares_ordenes_trabajo_credito = descuento_bolivares_ordenes_trabajo_credito + item.descuento_bolivares
            ////////////////////////ABONOS EN ORDENES DE TRABAJO A CREDITO//////////////////
            for(const abono of item.registro_pagos){
                //console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<")
                if((abono.id_usuario == req.body.id_usuario || abono.id_usuario == req.body.id_usuario2 || abono.id_usuario == req.body.id_usuario3) || (req.body.id_usuario1 == null && req.body.id_usuario2 == null && req.body.id_usuario3 == null)){
                    if(abono.igtf_pago == 0 && abono.tipo_registro == 0 && abono.igtf_pago == 0){
                        ///////ABONO PESOS//////
                        if(abono.id_divisa == 1){
                            if(abono.tipo_registro == 0){
                                abonadoP = abonadoP + abono.monto
                            }else{
                                abonadoP = abonadoP - abono.monto
                            }
                        }else if(abono.id_divisa == 2){
                        //////ABONO DOLAEES/////
                            if(abono.tipo_registro == 0){
                                abonadoD = abonadoD + abono.monto
                            }else{
                                abonadoD = abonadoD - abono.monto
                            }
                        }else if(abono.id_divisa == 3){
                        //////ABONO BOLIVARES////
                            if(abono.tipo_registro == 0){
                                abonadoB = abonadoB + abono.monto
                            }else{
                                abonadoB = abonadoB - abono.monto
                            }
                        }
                    }
                    ///////////////////////////INGRESO POR EFECTIVO ORDENES DE TRABAJO A CREDITO////////////////////////////////
                    if(abono.id_tipo_pago == 2 /*&& abono.igtf_pago == 0*/ && abono.tipo_registro == 0){
                        ///////EFECTIVO PESOS//////
                        if(abono.id_divisa == 1){
                            efectivoPOTCredito = efectivoPOTCredito + abono.monto
                        }else if(abono.id_divisa == 2){
                        //////EFECITVO DOLAEES/////
                            efectivoDOTCredito = efectivoDOTCredito + abono.monto
                        }else if(abono.id_divisa == 3){
                        //////EFECTIVO BOLIVARES////
                            efectivoBOTCredito = efectivoBOTCredito + abono.monto
                        }
                    }
                    ////////////////////////INGRESOS EN TRANSFERENCIAS EN BOLIVARES Y OTROS EN ORDENES DE TRABAJO A CREDITO//////////////////
                    if(abono.id_tipo_pago == 1 && abono.igtf_pago == 0 && abono.tipo_registro == 0){
                        if(abono.id_banco == 1){
                        transBanesco_factura_credito = transBanesco_factura_credito + abono.monto;
                        /////////PROVINCIAL////////
                        }else if(abono.id_banco == 2){
                            transProvincial_orden_trabajo_credito = transProvincial_orden_trabajo_credito + abono.monto;
                        }else if(abono.id_banco == 3){
                        /////////MERCANTIL////////
                        transMercantil_orden_trabajo_credito =transMercantil_orden_trabajo_credito + abono.monto;
                        }else if(abono.id_banco == 4){
                        /////////VENEZUELA////////
                            transVenezuela_orden_trabajo_credito = transVenezuela_orden_trabajo_credito + abono.monto;
                        }else if(abono.id_banco == 5){
                        /////////SOFITASA////////
                            transSofitasa_orden_trabajo_credito = transSofitasa_orden_trabajo_credito + abono.monto;
                        }else if(abono.id_banco == 6){
                            /////////ZELLE////////
                                zelleOTCredito = zelleOTCredito + abono.monto;
                        }else if(abono.id_banco == 7){
                            /////////BANCOLOMBIA////////
                                bancolombiaOTCredito = bancolombiaOTCredito + abono.monto;
                        }else if(abono.id_banco == 8){
                            /////////paypal////////
                            paypalOTCredito = paypalOTCredito + abono.monto;
                        }else if(abono.id_banco == 9){
                            /////////paypal////////
                            trans100Banco_orden_trabajo_credito = trans100Banco_orden_trabajo_credito + abono.monto;
                        }
                    }
                    //console.log("KKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK", transSofitasa_factura_credito)
                    /////////////////////////////INGRESOS TARJETAS DE DEBITO ORDENES DE TRABAJO A CREDITO///////////////////////////
                    if(abono.id_tipo_pago == 3 && abono.igtf_pago == 0 && abono.tipo_registro == 0){
                        /////////BANESCO////////
                        if(abono.id_banco == 1){
                            debitoBanescoOTCredito = debitoBanescoOTCredito + abono.monto;
                        /////////PROVINCIAL////////
                        }else if(abono.id_banco == 2){
                            debitoProvincialOTCredito = debitoProvincialOTCredito + abono.monto;
                        }else if(abono.id_banco == 3){
                        /////////MERCANTIL////////
                            debitoMercantilOTCredito = debitoMercantilOTCredito + abono.monto;
                        }else if(abono.id_banco == 4){
                        /////////VENEZUELA////////
                            debitoVenezuelaOTCredito = debitoVenezuelaOTCredito + abono.monto;
                        }else if(abono.id_banco == 5){
                        /////////SOFITASA////////
                            debitoSofitasaOTCredito = debitoSofitasaOTCredito + abono.monto;
                        }else if(abono.id_banco == 9){
                            /////////SOFITASA////////
                                debito100BancoOTCredito = debito100BancoOTCredito + abono.monto;
                            }
                        
                    }
                    ///////////////////////////INGRESOS TARJETAS DE CREDITO ORDENES DE TRABAJO A CREDITO////////////////////////////
                    if(abono.id_tipo_pago == 4 && abono.igtf_pago == 0 && abono.tipo_registro == 0){
                        /////////BANESCO////////
                        if(abono.id_banco == 1){
                            creditoBanescoOTCredito = creditoBanescoOTCredito + abono.monto;
                        /////////PROVINCIAL////////
                        }else if(abono.id_banco == 2){
                            creditoProvincialOTCredito = creditoProvincialOTCredito + abono.monto;
                        }else if(abono.id_banco == 3){
                        /////////MERCANTIL////////
                            creditoMercantilOTCredito = creditoMercantilOTCredito + abono.monto;
                        }else if(abono.id_banco == 4){
                        /////////VENEZUELA////////
                            creditoVenezuelaOTCredito = creditoVenezuelaOTCredito + abono.monto;
                        }else if(abono.id_banco == 5){
                        /////////SOFITASA////////
                            creditoSofitasaOTCredito = creditoSofitasaOTCredito + abono.monto;
                        }else if(abono.id_banco == 5){
                            /////////100% banco////////
                                credito100BancoOTCredito = credito100BancoOTCredito + abono.monto;
                            }
                    }
                }
            }
        }
    /////////////////////////////////////////SECCION DE ORDENES DE TRABAJO A CREDITO////////////////////////////
    balance.creditoBOrdenTrabajo = creditoBOrdenTrabajo;
    balance.creditoDOrdenTrabajo = creditoDOrdenTrabajo;
    balance.creditoPOrdenTrabajo = creditoPOrdenTrabajo;
    balance.cantidad_ordenes_trabajo_credito = cantidad_ordenes_trabajo_credito;
    balance.creditoBOT = creditoBOT;
    balance.creditoDOT = creditoDOT;
    balance.creditoPOT = creditoPOT;
    balance.creditoBConvenioOT = creditoBConvenioOT;
    balance.creditoPConvenioOT = creditoPConvenioOT;
    balance.creditoDConvenioOT = creditoDConvenioOT;
    balance.cantidadOTCreditoConvenio = cantidadOTCreditoConvenio;
    balance.creditoBOTParticular = creditoBOTParticular;
    balance.creditoPOTParticular = creditoPOTParticular;
    balance.creditoDOTParticular = creditoDOTParticular;
    balance.cantidadOTCreditoParticular = cantidadOTCreditoParticular;
    balance.descuento_pesos_ordenes_trabajo_credito = descuento_pesos_ordenes_trabajo_credito;
    balance.descuento_dolares_ordenes_trabajo_credito = descuento_dolares_ordenes_trabajo_credito;
    balance.descuento_bolivares_ordenes_trabajo_credito = descuento_bolivares_ordenes_trabajo_credito;
    balance.transBanesco_orden_trabajo_credito = transBanesco_orden_trabajo_credito;
    balance.transProvincial_orden_trabajo_credito = transProvincial_orden_trabajo_credito;
    balance.transVenezuela_orden_trabajo_credito = transVenezuela_orden_trabajo_credito;
    balance.transSofitasa_orden_trabajo_credito = transSofitasa_orden_trabajo_credito;
    balance.transMercantil_orden_trabajo_credito = transMercantil_orden_trabajo_credito;
    balance.zelleOTCredito = zelleOTCredito;
    balance.bancolombiaOTCredito = bancolombiaOTCredito;
    balance.paypalOTCredito = paypalOTCredito;
    balance.trans100Banco_orden_trabajo_credito = trans100Banco_orden_trabajo_credito;
    balance.debitoBanescoOTCredito = debitoBanescoOTCredito;
    balance.debitoProvincialOTCredito = debitoProvincialOTCredito;
    balance.debitoMercantilOTCredito = debitoMercantilOTCredito;
    balance.debitoVenezuelaOTCredito = debitoVenezuelaOTCredito;
    balance.debitoSofitasaOTCredito = debitoSofitasaOTCredito;
    balance.debito100BancoOTCredito = debito100BancoOTCredito;
    balance.creditoBanescoOTCredito = creditoBanescoOTCredito;
    balance.creditoProvincialOTCredito = creditoProvincialOTCredito;
    balance.creditoMercantilOTCredito = creditoMercantilOTCredito;
    balance.creditoVenezuelaOTCredito = creditoVenezuelaOTCredito;
    balance.creditoSofitasaOTCredito = creditoSofitasaOTCredito;
    balance.credito100BancoOTCredito = credito100BancoOTCredito;

    let total_transBancos_OTC = transBanesco_orden_trabajo_credito + transProvincial_orden_trabajo_credito +
    transVenezuela_orden_trabajo_credito + transSofitasa_orden_trabajo_credito + transMercantil_orden_trabajo_credito +
    trans100Banco_orden_trabajo_credito;

    balance.total_transBancos_OTC = total_transBancos_OTC;

    balance.total_debitoBancos_OTC = debitoBanescoOTCredito + debitoProvincialOTCredito + debitoMercantilOTCredito +
    debitoVenezuelaOTCredito + debitoSofitasaOTCredito + debito100BancoOTCredito;

    balance.total_creditoBancos_OTC = creditoBanescoOTCredito + creditoProvincialOTCredito + creditoMercantilOTCredito +
    creditoVenezuelaOTCredito + creditoSofitasaOTCredito + credito100BancoOTCredito;

    balance.total_ordenes_trabajo_credito = efectivoBOTCredito + ((efectivoDOTCredito) * bolivares) + (((efectivoPOTCredito) / pesos) * bolivares) + (((bancolombiaOTCredito) / pesos) * bolivares) + ((zelleOTCredito) * bolivares) + ((paypalOTCredito) * bolivares) + balance.total_transBancos_OTC + balance.total_debitoBancos_OTC + balance.total_creditoBancos_OTC;
    

    //////////////////////////////////////////////////////////////////////////////////////////////////////
    balance.igtfPOTCredito = igtfPOTCredito; 
    balance.igtfDOTCredito = igtfDOTCredito;
    balance.igtfBOTCredito = igtfBOTCredito;
    balance.igtfPTransferenciaOTCredito = igtfPTransferenciaOTCredito;
    balance.igtfDTransferenciaOTCredito = igtfDTransferenciaOTCredito;
    balance.igtfBTransferenciaOTCredito = igtfBTransferenciaOTCredito;
    balance.igtfPEfectivoOTCredito = igtfPEfectivoOTCredito;
    balance.igtfDEfectivoOTCredito = igtfDEfectivoOTCredito;
    balance.igtfBEfectivoOTCredito = igtfBEfectivoOTCredito;
    balance.igtfPDebitoFacturaCredito = igtfPDebitoFacturaCredito;
    balance.igtfDDebitoOTCredito = igtfDDebitoOTCredito;
    balance.igtfBDebitoOTCredito = igtfBDebitoOTCredito;
    balance.igtfPCreditoOTCredito = igtfPCreditoOTCredito;
    balance.igtfDCreditoOTCredito = igtfDCreditoOTCredito;
    balance.igtfBCreditoOTCredito = igtfBCreditoOTCredito;
    balance.efectivoPOTCredito = efectivoPOTCredito;
    console.log("000000000000000000000000", efectivoDOTCredito)
    balance.efectivoDOTCredito = efectivoDOTCredito;
    balance.efectivoBOTCredito = efectivoBOTCredito;
    balance.transBanesco_orden_trabajo_credito = transBanesco_orden_trabajo_credito;

        /////////////////////////////////////////////////////////////////////////////////////////
        //////////////////////SUMATORIAS DE FACTURAS CREDITO Y CONTADO///////////////////////////
        monto_total_facturas_pesos = contadoP + creditoP + contadoPOrdenTrabajo;
        monto_total_facturas_dolares = contadoD + creditoD + contadoDOrdenTrabajo;
        monto_total_facturas_bolivares = contadoB + creditoB; //+ contadoBOrdenTrabajo;
        //////////////////////////FACTURAS ANULADAS/////////////////////////////
        if(item.id_estado_factura == 3){
            cantidad_facturas_anuladas++;
            anuladoB = anuladoB + (item.total_bolivares - item.descuento_bolivares)
            anuladoD = anuladoD + (item.total_dolares - item.descuento_dolares)
            anuladoP = anuladoP + (item.total_pesos - item.descuento_pesos)
            detallesAnuladas.push({
                numero_factura: item.numero_factura,
                cliente: item.cliente_nombre +" "+item.cliente_apellido,
                motivo: item.anulacion_motivo
            })
            //////////////////////////DESCUENTO DE FACTURAS ANULADAS////////////////////////////////
            descuento_pesos_factura_anulado = descuento_pesos_factura_anulado + item.descuento_pesos, 
            descuento_dolares_factura_anulado = descuento_dolares_factura_anulado + item.descuento_dolares, 
            descuento_bolivares_factura_anulado = descuento_bolivares_factura_anulado + item.descuento_bolivares;
        }
        
        for(const pago of item.registro_pagos){
           // console.log("pago", pago)
           /////////////////////////////INGRESOS TARJETAS DE DEBITO///////////////////////////
           if(item.id_estado_factura != 3){
                if(pago.id_tipo_pago == 3 && pago.tipo_registro == 0){
                    /////////BANESCO////////
                    if(pago.id_banco == 1){
                        debitoBanesco = debitoBanesco + pago.monto;
                    /////////PROVINCIAL////////
                    }else if(pago.id_banco == 2){
                        debitoProvincial = debitoProvincial + pago.monto;
                    }else if(pago.id_banco == 3){
                    /////////MERCANTIL////////
                        debitoMercantil = debitoMercantil + pago.monto;
                    }else if(pago.id_banco == 4){
                    /////////VENEZUELA////////
                        debitoVenezuela = debitoVenezuela + pago.monto;
                    }else if(pago.id_banco == 5){
                    /////////SOFITASA////////
                        debitoSofitasa = debitoSofitasa + pago.monto;
                    }else if(pago.id_banco == 9){
                        /////////100 SOFITASA////////
                        debito100banco =debito100banco + pago.monto;
                        }
                }
                ///////////////////////////////////////////////////////////////////////////////////
                ///////////////////////////INGRESOS TARJETAS DE CREDITO////////////////////////////
                if(pago.id_tipo_pago == 4 && pago.tipo_registro == 0){
                    /////////BANESCO////////
                    if(pago.id_banco == 1){
                        creditoBanesco = creditoBanesco + pago.monto;
                    /////////PROVINCIAL////////
                    }else if(pago.id_banco == 2){
                        creditoProvincial = creditoProvincial + pago.monto;
                    }else if(pago.id_banco == 3){
                    /////////MERCANTIL////////
                        creditoMercantil = creditoMercantil + pago.monto;
                    }else if(pago.id_banco == 4){
                    /////////VENEZUELA////////
                        creditoVenezuela = creditoVenezuela + pago.monto;
                    }else if(pago.id_banco == 5){
                    /////////SOFITASA////////
                        creditoSofitasa = creditoSofitasa + pago.monto;
                    }else if(pago.id_banco == 9){
                        /////////100 BANCO////////
                            credito100Banco = credito100Banco + pago.monto;
                        }
                }
                ///////////////////////////////////////////////////////////////////////////////////
                ///////////////////////////INGRESOS TRANSFERENCIAS/////////////////////////////////
                if(pago.id_tipo_pago == 1 && pago.tipo_registro == 0){
                    if(pago.id_banco == 1){
                    transBanesco = transBanesco + pago.monto;
                    /////////PROVINCIAL////////
                    }else if(pago.id_banco == 2){
                        transPronvincial = transPronvincial + pago.monto;
                    }else if(pago.id_banco == 3){
                    /////////MERCANTIL////////
                    transMercantil =transMercantil + pago.monto;
                    }else if(pago.id_banco == 4){
                    /////////VENEZUELA////////
                        transVenezuela = transVenezuela + pago.monto;
                    }else if(pago.id_banco == 5){
                    /////////SOFITASA////////
                        transSofitasa = transSofitasa + pago.monto;
                    }else if(pago.id_banco == 6){
                        /////////ZELLE////////
                            zelle = zelle + pago.monto;
                    }else if(pago.id_banco == 7){
                        /////////BANCOLOMBIA////////
                            bancolombia = bancolombia + pago.monto;
                    }else if(pago.id_banco == 8){
                        /////////paypal////////
                        paypal =paypal + pago.monto;
                    }else if(pago.id_banco == 9){
                        /////////100 banco////////
                        trans100Banco = trans100Banco + pago.monto;
                    }
                }
                ///////////////////////////////////////////////////////////////////////////////////
                /////////////////////////EFECTIVO PESOS, DOLARES, BOLIVARES////////////////////////
                if(pago.id_tipo_pago == 2 && pago.igtf_pago == 0){
                    ///////EFECTIVO PESOS//////
                    if(pago.id_divisa == 1){
                        if(pago.tipo_registro == 0){
                            efectivoP = efectivoP + pago.monto
                        }else{
                            efectivoP = efectivoP - pago.monto
                        }
                    }else if(pago.id_divisa == 2){
                    //////EFECITVO DOLAEES/////
                        if(pago.tipo_registro == 0){
                            efectivoD = efectivoD + pago.monto
                        }else{
                            efectivoD = efectivoD - pago.monto
                        }
                    }else if(pago.id_divisa == 3){
                    //////EFECTIVO BOLIVARES////
                        if(pago.tipo_registro == 0){
                            efectivoB = efectivoB + pago.monto
                        }else{
                            efectivoB = efectivoB - pago.monto
                        }
                    }
                }
           }
        }
    }
    //////////////////////////SUMATORIAS TOTALES EN FACTURAS A CONTADO///////////////////////////////////////
    total_transBancos_factura_contado = Number(Math.round((transBanesco_factura_contado + transProvincial_factura_contado + transMercantil_factura_contado + transVenezuela_factura_contado + transSofitasa_factura_contado + trans100Banco_factura_contado) + "e+2") + "e-2");
    total_debitoBancos_factura_contado = debitoBanescoContado + debitoProvincialContado + debitoMercantilContado + debitoVenezuelaContado + debitoSofitasaContado + debito100BancoContado;
    total_creditoBancos_factura_contado = creditoBanescoContado + creditoProvincialContado + creditoMercantilContado + creditoVenezuelaContado + creditoSofitasaContado + credito100BancoContado;
    /////CONVERSIONES FACTURAS A CONTADO/////
    const efectivoDContadoAB = efectivoDContado * bolivares;
    const efectivoPContadoAB = (efectivoPContado / pesos) * bolivares;
    const paypalContadoABolivares = paypalFacturaContado * bolivares;
    const bancolombiaContadoABolivares = (bancolombiaFacturaContado / pesos) * bolivares;
    const zelleContadoABolivares = zelleFacturaContado * bolivares;
    let igtf_total_factura_contado = Number(Math.round((igtfBFacturaContado + (((igtfPFacturaContado / pesos) * bolivares) + (igtfDFacturaContado * bolivares))) + "e+2") + "e-2");
    let total_factura_contado =  contadoB + totalBsOrdenesTrabajo + igtf_total_factura_contado;//efectivoBContado + efectivoDContadoAB + efectivoPContadoAB + paypalContadoABolivares + bancolombiaContadoABolivares + zelleContadoABolivares + total_transBancos_factura_contado + total_debitoBancos_factura_contado + total_creditoBancos_factura_contado;
    if(isNaN(total_factura_contado)){
        total_factura_contado = 0;
    }
    //////////////////////////SUMATORIAS TOTALES EN FACTURAS A CREDITO///////////////////////////////////////
    total_transBancos_factura_credito = Number(Math.round((transBanesco_factura_credito + transProvincial_factura_credito + transMercantil_factura_credito + transVenezuela_factura_credito + transSofitasa_factura_credito + trans100Banco_factura_credito) + "e+2") + "e-2")
    total_debitoBancos_factura_credito = Number(Math.round((debitoBanescoCredito + debitoProvincialCredito + debitoMercantilCredito + debitoVenezuelaCredito + debitoSofitasaCredito + debito100BancoCredito) + "e+2") + "e-2");
    total_creditoBancos_factura_credito = Number(Math.round((creditoBanescoCredito + creditoProvincialCredito + creditoMercantilCredito + creditoVenezuelaCredito + creditoSofitasaCredito + credito100BancoCredito) + "e+2") + "e-2");
    /////CONVERSIONES FACTURAS A CONTADO/////
    const efectivoDCreditoAB = efectivoDCredito * bolivares;
    const efectivoPCreditoAB = (efectivoPCredito / pesos) * bolivares;
    const paypalCreditoABolivares = paypalFacturaCredito * bolivares;
    const bancolombiaCreditoABolivares = (bancolombiaFacturaCredito / pesos) * bolivares;
    const zelleCreditoABolivares = zelleFacturaCredito * bolivares;

    
    //let total_factura_credito = creditoB;//efectivoBCredito + efectivoDCreditoAB + efectivoPCreditoAB + paypalCreditoABolivares + bancolombiaCreditoABolivares + zelleCreditoABolivares + total_transBancos_factura_credito + total_debitoBancos_factura_credito + total_creditoBancos_factura_credito + 0;
    total_factura_credito = efectivoBCredito + ((efectivoDCredito) * bolivares) + (((efectivoPCredito) / pesos) * bolivares) + (((bancolombiaFacturaCredito) / pesos) * bolivares) + ((zelleFacturaCredito) * bolivares) + ((paypalFacturaCredito) * bolivares) + total_transBancos_factura_credito + total_debitoBancos_factura_credito + total_creditoBancos_factura_credito + igtfBEfectivoFacturaCredito + igtfBEfectivoFacturaCredito + igtfBDebitoFacturaCredito + igtfBTransferenciaFacturaCredito + (((igtfPEfectivoFacturaCredito + igtfPCreditoFacturaCredito + igtfPDebitoFacturaCredito + igtfPTransferenciaFacturaCredito) / pesos) * bolivares) + ((igtfDEfectivoFacturaCredito + igtfDCreditoFacturaCredito + igtfDDebitoFacturaCredito + igtfDTransferenciaFacturaCredito) * bolivares)
    if(isNaN(total_factura_credito)){
        total_factura_credito = 0;
    }
    //////////////////////////////////SUMATORIAS DE RECUADRO CUATRO//////////////////////////////////////////
    const sumatoria_debito_facturas_credito_contado = debitoBanescoContado + debitoBanescoCredito + debitoProvincialContado + debitoProvincialCredito + debitoMercantilContado + debitoMercantilCredito + debitoVenezuelaContado + debitoVenezuelaCredito + debitoSofitasaContado + debitoSofitasaCredito;
    const sumatoria_credito_facturas_credito_contado = creditoBanescoContado + creditoBanescoCredito + creditoProvincialContado + creditoProvincialCredito + creditoMercantilContado + creditoMercantilCredito + creditoVenezuelaContado + creditoVenezuelaCredito + creditoSofitasaContado + creditoSofitasaCredito;

    //////////////////////////////////SUMATORIAS DE RECUADRO QUINTO//////////////////////////////////////////
    let sumatoria_total_provincial = transPronvincial + debitoProvincial + creditoProvincial;
    let sumatoria_total_sofitasa = transSofitasa + debitoSofitasa + creditoSofitasa;
    let sumatoria_total_mercantil = transMercantil + debitoMercantil + creditoMercantil;
    let sumatoria_total_banesco = transBanesco + debitoBanesco + creditoBanesco;
    let sumatoria_total_venezuela = transVenezuela + debitoVenezuela + creditoVenezuela;
    let sumatoria_total_100_banco = trans100Banco + debito100banco + credito100Banco;

    //////////////////////PRIMER Y ULTIMA FACTURA/////////////////////////
    if(facturas.length == 1){
        facturaPRI = facturas[0]
        facturaULT = facturas[0]
    }else if(facturas.length > 1){
        facturaPRI = facturas.shift();
        facturaULT = facturas.pop();
    }else if(facturas.length == 0){
        facturaPRI = 0
        facturaULT = 0
    }

    //console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!", facturaPRI, facturaULT)
    /////////////ABONOS EFECTIVO////////////////
    balance.abonos_bolivares_efectivo = efectivoBCredito //+ abonadoB;
    balance.abonos_pesos_efectivo = efectivoPCredito //+ abonadoP;
    //console.log("111111111111111111111111111111111111111111111111111111111", efectivoDCredito)
    balance.abonos_dolares_efectivo = Number(Math.round(efectivoDCredito + "e+2") + "e-2"); //+ abonadoD;
    ////////////DESCUENTO TOTAL/////////////////
    balance.descuento_total_dolares = Number(Math.round(descuentoD + "e+2") + "e-2").toLocaleString('de-DE');
    balance.descuento_total_bolivares = Number(Math.round(descuentoB + "e+2") + "e-2").toLocaleString('de-DE');
    balance.descuento_total_pesos =  Number(Math.round(descuentoP + "e+2") + "e-2").toLocaleString('de-DE');
    balance.cantidad_facturas_con_descuento = cantidadFacturasDescuentos;
    balance.facturas_con_descuento = detallesDescontadas;
    ////////////GANANCIA TARJETAS DE DEBITO NACIONALES////////
    balance.ganancia_debito_banesco = Number(Math.round((debitoBanesco) + "e+2") + "e-2");;
    balance.ganancia_debito_provincial = Number(Math.round((debitoProvincial) + "e+2") + "e-2");
    balance.ganancia_debito_mercantil = Number(Math.round((debitoMercantil) + "e+2") + "e-2");;
    balance.ganancia_debito_venezuela = Number(Math.round((debitoVenezuela) + "e+2") + "e-2")
    balance.ganancia_debito_sofitasa = Number(Math.round((debitoSofitasa) + "e+2") + "e-2")
    balance.ganancia_debito_100_banco = Number(Math.round((debito100banco) + "e+2") + "e-2")
    balance.total_tarjeta_debito_bancos_nacionales = Number(Math.round((debitoBanesco + debitoProvincial + debitoMercantil + debitoVenezuela + debitoSofitasa + debito100banco) + "e+2") + "e-2");
    //////////GANANCIA TARJETAS DE CREDITO NACIONALES////////
    balance.ganancia_credito_banesco = Number(Math.round((creditoBanesco) + "e+2") + "e-2")
    balance.ganancia_credito_provincial = Number(Math.round((creditoProvincial) + "e+2") + "e-2")
    balance.ganancia_credito_mercantil = Number(Math.round((creditoMercantil) + "e+2") + "e-2")
    balance.ganancia_credito_venezuela = Number(Math.round((creditoVenezuela) + "e+2") + "e-2")
    balance.ganancia_credito_sofitasa = Number(Math.round((creditoSofitasa) + "e+2") + "e-2")
    balance.ganancia_credito_100_banco = Number(Math.round((credito100Banco) + "e+2") + "e-2")
    balance.total_tarjeta_credito_bancos_nacionales = Number(Math.round((creditoBanesco + creditoProvincial + creditoMercantil + creditoVenezuela + creditoSofitasa + credito100Banco) + "e+2") + "e-2");

    /////////GANANCIA TRANSFERENCIAS NACIONALES//////////////
    balance.ganancia_transferencia_banesco = Number(Math.round((transBanesco) + "e+2") + "e-2");
    balance.ganancia_transferencia_provincial = Number(Math.round((transPronvincial) + "e+2") + "e-2");
    balance.ganancia_transferencia_mercantil = Number(Math.round((transMercantil) + "e+2") + "e-2");
    balance.ganancia_transferencia_venezuela = Number(Math.round((transVenezuela) + "e+2") + "e-2");
    balance.ganancia_transferencia_sofitasa = Number(Math.round((transSofitasa) + "e+2") + "e-2");
    balance.ganancia_transferencia_100_banco = Number(Math.round((trans100Banco) + "e+2") + "e-2");
    //balance.total_transferencias_bancos_nacionales = Number(Math.round((transBanesco + transPronvincial + transMercantil + transVenezuela + transSofitasa + trans100Banco) + "e+2") + "e-2");
    balance.total_transferencias_bancos_nacionales = Number(Math.round((total_transBancos_factura_contado + igtfBTransferencia + total_transBancos_factura_credito) + "e+2") + "e-2");
    /////////GANANCIA TRANSFERENCIAS INTERNACIONALES//////////////
    balance.ganancia_transferencia_zelle = Number(Math.round((zelle) + "e+2") + "e-2");
    balance.ganancia_transferencia_bancolombia = Number(Math.round((bancolombia /*+ igtfPTransferencia*/) + "e+2") + "e-2");
    balance.ganancia_transferencia_paypal = Number(Math.round((paypal) + "e+2") + "e-2");
    ////////TOTAL DE GANANCIAS POR TRANSFERENCIAS EN BOLIVARES DE BANCOS NACIONALES FACTURAS AL CONTADO///////////////////
    balance.total_transBancos_factura_contado = Number(Math.round((total_transBancos_factura_contado + igtfBTransferencia) + "e+2") + "e-2");
    ////////TOTAL DE GANANCIAS POR TARJETA DE DEBITO EN BOLIVARES DE BANCOS NACIONALES FACTURAS AL CONTADO///////////////////
    balance.total_debitoBancos_factura_contado = Number(Math.round((total_debitoBancos_factura_contado + igtfBDebito) + "e+2") + "e-2");
    ////////TOTAL DE GANANCIAS POR TARJETA DE CREDITO EN BOLIVARES DE BANCOS NACIONALES FACTURAS AL CONTADO///////////////////
    balance.total_creditoBancos_factura_contado = Number(Math.round((total_creditoBancos_factura_contado) + "e+2") + "e-2");
    ////////TOTAL DE EFECTIVO EN BOLIVARES, PESOS Y DOLARES DE FACTURAS AL CONTADO///////////////////
    balance.efectivo_pesos_factura_contado = Number(Math.round((efectivoPContado + sumaPesosIGTFVueltosEfectivo) + "e+2") + "e-2");
    balance.efectivo_dolares_factura_contado = Number(Math.round((efectivoDContado + sumaDolaresIGTFVueltosEfectivo) + "e+2") + "e-2");
    balance.efectivo_bolivares_factura_contado = Number(Math.round((efectivoBContado + sumaBolivaresIGTFVueltosEfectivo) + "e+2") + "e-2");
    ///////////////////////////TOTAL DE TRANSFERENCIAS EN BANCOLOMBIA ZELLE Y PAYPAL FACTURAS AL CONTADO///////////////////////
    balance.zelle_factura_contado = Number(Math.round((zelleFacturaContado) + "e+2") + "e-2");
    balance.bancolombia_factura_contado = Number(Math.round((bancolombiaFacturaContado) + "e+2") + "e-2");
    balance.paypal_factura_contado = Number(Math.round((paypalFacturaContado) + "e+2") + "e-2");
    /////////////INGRESOS POR FACTURAS AL CONTADO////////////////
    balance.ganancia_factura_contado_bolivares = Number(Math.round(contadoB + "e+2") + "e-2");
    balance.ganancia_orden_trabajo_contado_bolivares = Number(Math.round(contadoBOrdenTrabajo + "e+2") + "e-2");
    //balance.ganancia_factura_contado_dolares = Number(Math.round(contadoD + "e+2") + "e-2");
    //balance.ganancia_factura_contado_pesos = Number(Math.round(contadoP + "e+2") + "e-2");
    ////////////DESCUENTO POR FACTURAS AL CONTADO/////////////////
    balance.descuento_pesos_factura_contado = Number(Math.round((descuento_pesos_factura_contado) + "e+2") + "e-2");
    balance.descuento_dolares_factura_contado = Number(Math.round((descuento_dolares_factura_contado) + "e+2") + "e-2");
    balance.descuento_bolivares_factura_contado = Number(Math.round((descuento_bolivares_factura_contado) + "e+2") + "e-2");
    //////////////CANTIDAD DE FACTURAS AL CONTADO///////////////
    balance.cantidad_facturas_contado = Number(Math.round((cantidad_facturas_contado) + "e+2") + "e-2");
    /////////////SUMA TOTAL DE GANANCIAS DE FACTURAS AL CONTADO///////////////////////
    
    balance.total_factura_contado = Number(Math.round(total_factura_contado + "e+2") + "e-2");
    balance.totalBsOrdenesTrabajo = Number(Math.round( totalBsOrdenesTrabajo + "e+2") + "e-2");
    /////////////INGRESOS POR FACTURAS A CREDITO////////////////
    balance.ganancia_factura_credito_bolivares = Number(Math.round((creditoB) + "e+2") + "e-2");
    balance.ganancia_factura_credito_dolares = Number(Math.round(creditoD + "e+2") + "e-2");
    balance.ganancia_factura_credito_pesos = Number(Math.round(creditoP + "e+2") + "e-2");
    ////////////DESCUENTO POR FACTURAS A CREDITO/////////////////
    balance.descuento_pesos_factura_credito = Number(Math.round((descuento_pesos_factura_credito) + "e+2") + "e-2"); 
    balance.descuento_dolares_factura_credito = Number(Math.round((descuento_dolares_factura_credito) + "e+2") + "e-2");
    balance.descuento_bolivares_factura_credito = Number(Math.round((descuento_bolivares_factura_credito) + "e+2") + "e-2");
    ///////////////////CANTIDAD FACTURAS A CREDITO///////////////////////
    balance.cantidad_facturas_credito = Number(Math.round((cantidad_facturas_credito) + "e+2") + "e-2");
    //////////////////SUMATORIA TOTAL DE TRANSFERENCIAS A FACTURAS A CREDITO//////////////////////////////////
    balance.total_transBancos_factura_credito = Number(Math.round((total_transBancos_factura_credito) + "e+2") + "e-2");
    /////////////////SUMATORIA TOTAL EN TARJETAS DE DEBITO A FACTURAS A CREDITO////////////////////////////////
    balance.total_debitoBancos_factura_credito = Number(Math.round((total_debitoBancos_factura_credito) + "e+2") + "e-2");
    ////////TOTAL DE GANANCIAS POR TARJETA DE CREDITO EN BOLIVARES DE BANCOS NACIONALES A FACTURAS A CREDITO////////////////
    balance.total_creditoBancos_factura_credito = Number(Math.round((total_creditoBancos_factura_credito) + "e+2") + "e-2");
    /////////////////TRANSFERENCIA EN BANCOLOMBIA, ZELLE Y PAYPAL EN FACTURAS A CREDITO///////////////////////
    balance.zelleFacturaCredito = Number(Math.round((zelleFacturaCredito) + "e+2") + "e-2");
    balance.bancolombiaFacturaCredito = Number(Math.round((bancolombiaFacturaCredito) + "e+2") + "e-2");
    balance.paypalFacturaCredito = Number(Math.round((paypalFacturaCredito) + "e+2") + "e-2");
    /////////////SUMA TOTAL DE GANANCIAS DE FACTURAS A CREDITO///////////////////////
    balance.total_factura_credito = Number(Math.round((total_factura_credito) + "e+2") + "e-2");
    /////////////SUMA DE FACTURAS A CREDITO Y CONTADO////////////////
    balance.monto_total_facturas_pesos = Number(Math.round(monto_total_facturas_pesos + "e+2") + "e-2");
    balance.monto_total_facturas_dolares = Number(Math.round(monto_total_facturas_dolares + "e+2") + "e-2");
    balance.monto_total_facturas_bolivares = Number(Math.round(monto_total_facturas_bolivares + "e+2") + "e-2");
    ///////////////////SUMATORIA DE TARJETAS DE DEBITO Y CREDITO EN FACTURAS AL CONTADO////////////////////////////////////////////
    balance.sumatoria_debito_facturas_credito_contado = Number(Math.round((sumatoria_debito_facturas_credito_contado) + "e+2") + "e-2");
    ///////////////////SUMATORIA DE TARJETAS DE CREDITO Y CREDITO EN FACTURAS AL CONTADO////////////////////////////////////////////
    balance.sumatoria_credito_facturas_credito_contado = Number(Math.round((sumatoria_credito_facturas_credito_contado) + "e+2") + "e-2");
    ////////////SUMA DE CANTIDADES DE FACTURAS A CONTADO Y CREDITO////////
    balance.sumatoria_cantidad_credito_contado = Number(Math.round((cantidad_facturas_contado + cantidad_facturas_credito) + "e+2") + "e-2");
    /////////////FACTURAS ANULADAS////////////////////////////
    balance.factura_anulada_bolivares = Number(Math.round(anuladoB + "e+2") + "e-2");
    balance.factura_anulada_dolares = Number(Math.round(anuladoD + "e+2") + "e-2");
    balance.factura_anulada_pesos = Number(Math.round(anuladoP + "e+2") + "e-2");
    ///////////////DESCUENTOS DE FACTURAS ANULADAS//////////////////////
    balance.descuento_pesos_factura_anulado = Number(Math.round(descuento_pesos_factura_anulado + "e+2") + "e-2");
    balance.descuento_dolares_factura_anulado = Number(Math.round(descuento_dolares_factura_anulado + "e+2") + "e-2");
    balance.descuento_bolivares_factura_anulado = Number(Math.round(descuento_bolivares_factura_anulado + "e+2") + "e-2");
    /////////////////CANTIDAD DE FACTURAS ANULADAS///////////////////////////
    balance.cantidad_facturas_anuladas = cantidad_facturas_anuladas;
    /////////////EFECTIVO RECAUDADO////////////////////////////
    balance.efectivo_dolares = Number(Math.round((/*efectivoD*/efectivoDContado + efectivoDCredito + sumaDolaresIGTFVueltosEfectivo) + "e+2") + "e-2");
    balance.efectivo_pesos = Number(Math.round((/*efectivoP*/efectivoPContado + efectivoPCredito + sumaPesosIGTFVueltosEfectivo) + "e+2") + "e-2");
    balance.efectivo_bolivares = Number(Math.round((/*efectivoB*/efectivoBContado + /*efectivoBCredito +*/ sumaBolivaresIGTFVueltosEfectivo) + "e+2") + "e-2");
    ///////////////////SUMATORIA TOTAL DE TARJETAS DE DEBITO Y CREDITO Y TRANSFERENCIAS DE BANCOS NACIONALES///////////////////////////
    balance.sumatoria_total_provincial = Number(Math.round(sumatoria_total_provincial + "e+2") + "e-2");
    balance.sumatoria_total_sofitasa = Number(Math.round(sumatoria_total_sofitasa + "e+2") + "e-2");
    balance.sumatoria_total_mercantil = Number(Math.round(sumatoria_total_mercantil + "e+2") + "e-2");
    balance.sumatoria_total_banesco = Number(Math.round(sumatoria_total_banesco + "e+2") + "e-2");
    balance.sumatoria_total_venezuela = Number(Math.round(sumatoria_total_venezuela + "e+2") + "e-2");
    balance.sumatoria_total_100_banco = Number(Math.round(sumatoria_total_100_banco + "e+2") + "e-2");
    /////////////ABONOS HECHOS EN LA FECHA/////////////////////
    balance.abonos_dolares = Number(Math.round(abonadoD + "e+2") + "e-2");
    balance.abonos_pesos = Number(Math.round(abonadoP + "e+2") + "e-2");
    balance.abonos_bolivares = Number(Math.round(abonadoB + "e+2") + "e-2");
    ////////////////////PRIMERA Y ULTIMA FACTURA/////////////////
    balance.primera_factura = facturaPRI;
    balance.segunda_factura = facturaULT;
    //////////////DESTELLES DE FACTURAS ANULADAS/////////////////
    //console.log("DETALLES ANULADAS!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!", balance.detalles_facturas_anuladas)
    balance.detalles_facturas_anuladas = detallesAnuladas;
    //////////////FACTURAS A CREDITO DE CONVENIOS///////////////////
    balance.sumatoria_bolivares_factura_credito_convenio = Number(Math.round(creditoBConvenio + "e+2") + "e-2"),
    balance.sumatoria_pesos_factura_credito_convenio = Number(Math.round(creditoPConvenio + "e+2") + "e-2"),
    balance.sumatoria_dolares_factura_credito_convenio = Number(Math.round(creditoDConvenio + "e+2") + "e-2"),
    balance.cantidad_facturas_credito_convenio = cantidadFacturaCreditoConvenio,
    //////////////FACTURAS A CREDITO DE PARTICULARES////////////////
    balance.sumatoria_bolivares_factura_credito_particulares = Number(Math.round(creditoBParticular + "e+2") + "e-2"),
    balance.sumatoria_pesos_factura_credito_particulares = Number(Math.round(creditoPParticular + "e+2") + "e-2"),
    balance.sumatoria_dolares_factura_credito_particulares =  Number(Math.round(creditoDParticular + "e+2") + "e-2"),
    balance.cantidad_facturas_credito_particulares = cantidadFacturaCreditoParticular,
    /////////////////////////////DESCRIPCION DE ORDENES DE TRABAJO///////////////////////////////////
    balance.total_ordenes_trabajo_contado = totalOrdenesTrabajoContado, 
    balance.total_bolivares_ordenes_trabajo_contado = Number(Math.round((totalBsOrdenesTrabajo) + "e+2") + "e-2"),
    balance.total_pesos_ordenes_trabajo = Number(Math.round(totalPesosOrdenesTrabajo + "e+2") + "e-2"),
    balance.total_dolares_ordenes_trabajo = Number(Math.round(totalDolaresOrdenesTrabajo + "e+2") + "e-2")
//////////////SECCION DE IGTF///////////////////////
    //////////////////SUMATORIA DE IGTF TOTALES/////////////////////////////
    balance.IGTF_bolivares_transferencia = Number(Math.round((igtfBTransferencia) + "e+2") + "e-2");
    balance.IGTF_pesos_transferencia = Number(Math.round((igtfPTransferencia) + "e+2") + "e-2");
    balance.IGTF_dolares_transferencia = Number(Math.round((igtfDTransferencia) + "e+2") + "e-2");
    balance.IGTF_bolivares_tarjeta_credito = Number(Math.round((igtfBEfectivo) + "e+2") + "e-2");
    balance.IGTF_pesos_tarjeta_credito = Number(Math.round(igtfPCredito + "e+2") + "e-2");
    balance.IGTF_dolares_tarjeta_credito = Number(Math.round(igtfDCredito + "e+2") + "e-2");
    balance.IGTF_bolivares = Number(Math.round((igtfB + (igtfD * bolivares) + ((igtfP / pesos)) * bolivares) + "e+2") + "e-2")
    balance.IGTF_pesos = Number(Math.round(igtfP + "e+2") + "e-2"),
    balance.IGTF_dolares = igtfD//Number(Math.round(igtfD + "e+2") + "e-2"),
    balance.IGTF_bolivares_efectivo = Number(Math.round(igtfBEfectivo + "e+2") + "e-2");
    balance.IGTF_pesos_efectivo = Number(Math.round(igtfPEfectivo + "e+2") + "e-2"); 
    balance.IGTF_dolares_efectivo = Number(Math.round(igtfDEfectivo + "e+2") + "e-2"); 
    balance.IGTF_bolivares_tarjeta_debito = Number(Math.round(igtfBDebito + "e+2") + "e-2");
    balance.IGTF_pesos_tarjeta_debito = Number(Math.round(igtfPDebito + "e+2") + "e-2"); 
    balance.IGTF_dolares_factura_debito = Number(Math.round(igtfDDebito + "e+2") + "e-2");
    ///////////////////////////////////////////////////////////////////////
    /////////////////SUMATORIA DE IGTF POR FACTURAS A CREDITO////////////////////////////////
    balance.IGTF_bolivares_transferencia_factura_credito = Number(Math.round(igtfBTransferenciaFacturaCredito + "e+2") + "e-2");
    balance.IGTF_pesos_transferencia_factura_credito = Number(Math.round(igtfPTransferenciaFacturaCredito + "e+2") + "e-2");
    balance.IGTF_dolares_transferencia_factura_credito = Number(Math.round(igtfDTransferenciaFacturaCredito + "e+2") + "e-2");
    balance.IGTF_bolivares_tarjeta_credito_factura_credito = Number(Math.round(igtfBEfectivoFacturaCredito + "e+2") + "e-2");
    balance.IGTF_pesos_tarjeta_credito_factura_credito = Number(Math.round(igtfPCreditoFacturaCredito + "e+2") + "e-2");
    balance.IGTF_dolares_tarjeta_credito_factura_credito = Number(Math.round(igtfDCreditoFacturaCredito + "e+2") + "e-2"),
    balance.IGTF_bolivares_factura_credito = Number(Math.round((igtfBFacturaCredito + (((igtfPFacturaCredito / pesos) * bolivares) + (igtfDFacturaCredito * bolivares))) + "e+2") + "e-2"), //Number(Math.round(igtfBFacturaCredito + "e+2") + "e-2"),
    balance.IGTF_pesos_factura_credito =  Number(Math.round(igtfPFacturaCredito + "e+2") + "e-2"),
    balance.IGTF_dolares_factura_credito = Number(Math.round(igtfDFacturaCredito + "e+2") + "e-2"),
    balance.IGTF_bolivares_efectivo_factura_credito = Number(Math.round(igtfBEfectivoFacturaCredito + "e+2") + "e-2");
    balance.IGTF_pesos_efectivo_factura_credito = Number(Math.round(igtfPEfectivoFacturaCredito + "e+2") + "e-2"); 
    balance.IGTF_dolares_efectivo_factura_credito = Number(Math.round(igtfDEfectivoFacturaCredito + "e+2") + "e-2"); 
    balance.IGTF_bolivares_tarjeta_debito_factura_credito = Number(Math.round(igtfBDebitoFacturaCredito + "e+2") + "e-2");
    balance.IGTF_pesos_tarjeta_debito_factura_credito = Number(Math.round(igtfPDebitoFacturaCredito + "e+2") + "e-2"); 
    balance.IGTF_dolares_factura_debito_factura_credito = Number(Math.round(igtfDDebitoFacturaCredito + "e+2") + "e-2");
    /////////////////////////////////////////////////////////////////////////////////////////
    /////////////////SUMATORIA DE IGTF POR FACTURAS A CONTADO////////////////////////////////
    balance.IGTF_bolivares_transferencia_factura_contado = Number(Math.round(igtfBTransferenciaFacturaContado + "e+2") + "e-2");
    balance.IGTF_pesos_transferencia_factura_contado = Number(Math.round(igtfPTransferenciaFacturaContado + "e+2") + "e-2");
    balance.IGTF_dolares_transferencia_factura_contado = Number(Math.round(igtfDTransferenciaFacturaContado + "e+2") + "e-2");
    balance.IGTF_bolivares_tarjeta_credito_factura_contado = Number(Math.round(igtfBCreditoFacturaContado + "e+2") + "e-2");
    balance.IGTF_pesos_tarjeta_credito_factura_contado = Number(Math.round(igtfPCreditoFacturaContado + "e+2") + "e-2");
    balance.IGTF_dolares_tarjeta_credito_factura_contado = Number(Math.round(igtfDCreditoFacturaContado + "e+2") + "e-2");
    balance.IGTF_bolivares_factura_contado = Number(Math.round((igtfBFacturaContado + (((igtfPFacturaContado / pesos) * bolivares) + (igtfDFacturaContado * bolivares))) + "e+2") + "e-2"),
    //balance.IGTF_pesos_factura_contado = Number(Math.round(igtfPFacturaContado + "e+2") + "e-2"),
    //balance.IGTF_dolares_factura_contado = Number(Math.round(igtfDFacturaContado + "e+2") + "e-2"),
    balance.IGTF_bolivares_efectivo_factura_contado = igtfBEfectivoFacturaContado,
    balance.IGTF_pesos_efectivo_factura_contado = Number(Math.round(igtfPEfectivoFacturaContado + "e+2") + "e-2"); 
    balance.IGTF_dolares_efectivo_factura_contado = Number(Math.round(igtfDEfectivoFacturaContado + "e+2") + "e-2"); 
    balance.IGTF_bolivares_tarjeta_debito_factura_contado = Number(Math.round(igtfBDebitoFacturaContado + "e+2") + "e-2");
    balance.IGTF_pesos_tarjeta_debito_factura_contado = Number(Math.round(igtfPDebitoFacturaContado + "e+2") + "e-2"); 
    balance.IGTF_dolares_factura_debito_factura_contado = Number(Math.round(igtfDDebitoFacturaContado + "e+2") + "e-2");
    /////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////SUMATORIAS TOTALES DE IGTF//////////////////////////////
    balance.IGTF_total_bolivares = Number(Math.round((igtfBFacturaContado + igtfBFacturaCredito) + "e+2") + "e-2"),
    balance.IGTF_total_pesos = Number(Math.round((igtfPFacturaContado + igtfPFacturaCredito) + "e+2") + "e-2"),
    balance.IGTF_total_dolares =  Number(Math.round((igtfDFacturaContado + igtfDFacturaCredito) + "e+2") + "e-2"),
    balance.IGTF_total_bolivares_transferencia = Number(Math.round((igtfBTransferenciaFacturaContado + igtfBTransferenciaFacturaCredito) + "e+2") + "e-2");
    balance.IGTF_total_pesos_transferencia = Number(Math.round((igtfPTransferenciaFacturaContado + igtfPTransferenciaFacturaCredito) + "e+2") + "e-2");
    balance.IGTF_total_dolares_transferencia = Number(Math.round((igtfDTransferenciaFacturaContado + igtfDTransferenciaFacturaCredito) + "e+2") + "e-2");
    balance.IGTF_total_bolivares_tarjetas_credito = Number(Math.round((igtfBCreditoFacturaContado + igtfBCreditoFacturaCredito) + "e+2") + "e-2");
    balance.IGTF_total_pesos_tarjetas_credito = Number(Math.round((igtfPCreditoFacturaContado + igtfPCreditoFacturaCredito) + "e+2") + "e-2");
    balance.IGTF_total_dolares_tarjetas_credito = Number(Math.round((igtfDCreditoFacturaContado + igtfDCreditoFacturaCredito) + "e+2") + "e-2");
    balance.IGTF_total_bolivares_tarjetas_debito = Number(Math.round((igtfBDebitoFacturaContado + igtfBDebitoFacturaCredito) + "e+2") + "e-2");
    balance.IGTF_total_pesos_tarjetas_debito = Number(Math.round((igtfPDebitoFacturaContado + igtfPDebitoFacturaCredito) + "e+2") + "e-2");
    balance.IGTF_total_dolares_tarjetas_debito = Number(Math.round((igtfDDebitoFacturaContado + igtfDDebitoFacturaCredito) + "e+2") + "e-2");

    ////////////////////////////SECCION DE RECIBOS/////////////////////////////////
    ////////////////////////////SUMATORIA DE DIVISAS GENERAL DE RECIBOS////////////////////////
    /////////////SUMATORIA DE REGISTROS CONVENIOS////////////////////
    balance.total_recibos_bolivares_registro_convenio = Number(Math.round((totalBolivaresReciboRegistroConvenio) + "e+2") + "e-2");
    balance.total_recibos_pesos_registro_convenio = Number(Math.round((totalPesosReciboRegistroConvenio) + "e+2") + "e-2");
    balance.total_recibos_dolares_registro_convenio = Number(Math.round((totalDolaresReciboRegistroConvenio) + "e+2") + "e-2");
    ////////////SUMATORIA DE FACTURAS A CREDITO//////////////////////
    balance.total_recibos_bolivares_facturas_credito = Number(Math.round((totalBolivaresReciboFacturasCredito) + "e+2") + "e-2");
    balance.total_recibos_pesos_facturas_credito = Number(Math.round((totalPesosReciboFacturasCredito) + "e+2") + "e-2");
    balance.total_recibos_dolares_facturas_credito = Number(Math.round((totalDolaresReciboFacturasCredito) + "e+2") + "e-2");
    /////////////////////NOTAS A CREDITO/////////////////////////////
    balance.notas_a_credito = notasCredito;
    //res.send(facturas);
    res.send(balance);

    async function buscarNotasCreditoCC(notasCredito, sqlNotasCredito) {
        return new Promise((resolve, reject) => {
            connection.query(sqlNotasCredito, function (err, result, fields) {
                if (err) {
                    console.log('ERROR en CheckTemplate', err);
                    res.send('3');
                }
                if(result){
                    notasCredito = result;
                    //console.log("!!!!!!!!!!!!!!!!!", result)
                    resolve(notasCredito);
                    //res.send(result)
                }
            });
        })
    }

    async function buscarFacturas(facturas, sql) {
        return new Promise((resolve, reject) => {
            connection.query(sql, function (err, result, fields) {
                if (err) {
                    console.log('ERROR en CheckTemplate', err);
                    res.send('3');
                }
                if(result){
                    facturas = result;
                    //console.log("!!!!!!!!!!!!!!!!!", result)
                    resolve(facturas);
                    //res.send(result)
                }
            });
        })
    }

    async function buscarRegistrosPagoOutRango(primerId, ultimoId, idUsuario, idUsuario2, idUsuario3) {
        return new Promise((resolve, reject) => {
            let sql;
            if(req.body.tipo == 4){
                sql = "SELECT tbl_registro_pago.id_registro_pago, CAST(tbl_registro_pago.tipo_registro AS INT) AS tipo_registro, DATE_FORMAT(tbl_registro_pago.fecha_creacion, '%d-%m-%Y %T') AS fecha_creacion, tbl_registro_pago.id_factura, tbl_registro_pago.id_nota_credito, tbl_registro_pago.id_nota_debito, tbl_registro_pago.id_recibo, tbl_registro_pago.id_registro_divisa, tbl_registro_pago.id_tipo_pago, tbl_registro_pago.id_banco, tbl_registro_pago.numero_referencia, tbl_registro_pago.monto, tbl_registro_pago.id_usuario, tbl_tipo_pago.tipo_pago_nombre, tbl_banco.banco_nombre, tbl_registro_divisa.id_divisa, CAST(tbl_registro_pago.igtf_pago AS INT) AS igtf_pago, tbl_divisa.divisa_nombre, tbl_factura.id_tipo_factura FROM tbl_registro_pago LEFT JOIN tbl_tipo_pago ON tbl_tipo_pago.id_tipo_pago = tbl_registro_pago.id_tipo_pago LEFT JOIN tbl_banco ON tbl_banco.id_banco = tbl_registro_pago.id_banco LEFT JOIN tbl_registro_divisa ON tbl_registro_pago.id_registro_divisa = tbl_registro_divisa.id_registro_divisa LEFT JOIN tbl_divisa ON tbl_divisa.id_divisa = tbl_registro_divisa.id_divisa LEFT JOIN tbl_factura ON tbl_factura.id_factura = tbl_registro_pago.id_factura WHERE (tbl_registro_pago.id_factura NOT BETWEEN '"+primerId+"' AND '"+ultimoId+"') AND (tbl_registro_pago.fecha_creacion BETWEEN '"+req.body.from+"' AND '"+req.body.to+"') AND (tbl_registro_pago.id_usuario = '"+idUsuario+"' OR tbl_registro_pago.id_usuario = '"+idUsuario2+"' OR tbl_registro_pago.id_usuario = '"+idUsuario3+"')";
            }
            if(req.body.tipo == 3){
                sql = "SELECT tbl_registro_pago.id_registro_pago, CAST(tbl_registro_pago.tipo_registro AS INT) AS tipo_registro, DATE_FORMAT(tbl_registro_pago.fecha_creacion, '%d-%m-%Y %T') AS fecha_creacion, tbl_registro_pago.id_factura, tbl_registro_pago.id_nota_credito, tbl_registro_pago.id_nota_debito, tbl_registro_pago.id_recibo, tbl_registro_pago.id_registro_divisa, tbl_registro_pago.id_tipo_pago, tbl_registro_pago.id_banco, tbl_registro_pago.numero_referencia, tbl_registro_pago.monto, tbl_registro_pago.id_usuario, tbl_tipo_pago.tipo_pago_nombre, tbl_banco.banco_nombre, tbl_registro_divisa.id_divisa, CAST(tbl_registro_pago.igtf_pago AS INT) AS igtf_pago, tbl_divisa.divisa_nombre, tbl_factura.id_tipo_factura FROM tbl_registro_pago LEFT JOIN tbl_tipo_pago ON tbl_tipo_pago.id_tipo_pago = tbl_registro_pago.id_tipo_pago LEFT JOIN tbl_banco ON tbl_banco.id_banco = tbl_registro_pago.id_banco LEFT JOIN tbl_registro_divisa ON tbl_registro_pago.id_registro_divisa = tbl_registro_divisa.id_registro_divisa LEFT JOIN tbl_divisa ON tbl_divisa.id_divisa = tbl_registro_divisa.id_divisa LEFT JOIN tbl_factura ON tbl_factura.id_factura = tbl_registro_pago.id_factura WHERE (tbl_registro_pago.id_factura NOT BETWEEN '"+primerId+"' AND '"+ultimoId+"') AND (tbl_registro_pago.fecha_creacion BETWEEN '"+req.body.from+"' AND '"+req.body.to+"') AND (tbl_registro_pago.id_usuario = '"+idUsuario+"' OR tbl_registro_pago.id_usuario = '"+idUsuario2+"')";
            } 
            if(req.body.tipo == 2){
                sql = "SELECT tbl_registro_pago.id_registro_pago, CAST(tbl_registro_pago.tipo_registro AS INT) AS tipo_registro, DATE_FORMAT(tbl_registro_pago.fecha_creacion, '%d-%m-%Y %T') AS fecha_creacion, tbl_registro_pago.id_factura, tbl_registro_pago.id_nota_credito, tbl_registro_pago.id_nota_debito, tbl_registro_pago.id_recibo, tbl_registro_pago.id_registro_divisa, tbl_registro_pago.id_tipo_pago, tbl_registro_pago.id_banco, tbl_registro_pago.numero_referencia, tbl_registro_pago.monto, tbl_registro_pago.id_usuario, tbl_tipo_pago.tipo_pago_nombre, tbl_banco.banco_nombre, tbl_registro_divisa.id_divisa, CAST(tbl_registro_pago.igtf_pago AS INT) AS igtf_pago, tbl_divisa.divisa_nombre, tbl_factura.id_tipo_factura FROM tbl_registro_pago LEFT JOIN tbl_tipo_pago ON tbl_tipo_pago.id_tipo_pago = tbl_registro_pago.id_tipo_pago LEFT JOIN tbl_banco ON tbl_banco.id_banco = tbl_registro_pago.id_banco LEFT JOIN tbl_registro_divisa ON tbl_registro_pago.id_registro_divisa = tbl_registro_divisa.id_registro_divisa LEFT JOIN tbl_divisa ON tbl_divisa.id_divisa = tbl_registro_divisa.id_divisa LEFT JOIN tbl_factura ON tbl_factura.id_factura = tbl_registro_pago.id_factura WHERE (tbl_registro_pago.id_factura NOT BETWEEN '"+primerId+"' AND '"+ultimoId+"') AND (tbl_registro_pago.fecha_creacion BETWEEN '"+req.body.from+"' AND '"+req.body.to+"') AND (tbl_registro_pago.id_usuario = '"+idUsuario+"')";
            }
            if(req.body.tipo == 1){
                sql = "SELECT tbl_registro_pago.id_registro_pago, CAST(tbl_registro_pago.tipo_registro AS INT) AS tipo_registro, DATE_FORMAT(tbl_registro_pago.fecha_creacion, '%d-%m-%Y %T') AS fecha_creacion, tbl_registro_pago.id_factura, tbl_registro_pago.id_nota_credito, tbl_registro_pago.id_nota_debito, tbl_registro_pago.id_recibo, tbl_registro_pago.id_registro_divisa, tbl_registro_pago.id_tipo_pago, tbl_registro_pago.id_banco, tbl_registro_pago.numero_referencia, tbl_registro_pago.monto, tbl_registro_pago.id_usuario, tbl_tipo_pago.tipo_pago_nombre, tbl_banco.banco_nombre, tbl_registro_divisa.id_divisa, CAST(tbl_registro_pago.igtf_pago AS INT) AS igtf_pago, tbl_divisa.divisa_nombre, tbl_factura.id_tipo_factura FROM tbl_registro_pago LEFT JOIN tbl_tipo_pago ON tbl_tipo_pago.id_tipo_pago = tbl_registro_pago.id_tipo_pago LEFT JOIN tbl_banco ON tbl_banco.id_banco = tbl_registro_pago.id_banco LEFT JOIN tbl_registro_divisa ON tbl_registro_pago.id_registro_divisa = tbl_registro_divisa.id_registro_divisa LEFT JOIN tbl_divisa ON tbl_divisa.id_divisa = tbl_registro_divisa.id_divisa LEFT JOIN tbl_factura ON tbl_factura.id_factura = tbl_registro_pago.id_factura WHERE (tbl_registro_pago.id_factura NOT BETWEEN '"+primerId+"' AND '"+ultimoId+"') AND (tbl_registro_pago.fecha_creacion BETWEEN '"+req.body.from+"' AND '"+req.body.to+"')";
            }
            //console.log("-----------------------", sql)
            connection.query(sql, function (err, result, fields) {
                if (err) {
                    console.log('ERROR en CheckTemplate', err);
                    res.send('3');
                }
                if(result){
                    registroPago = result
                    //console.log("++++++++++++++++++++++++++++++++", registroPago)
                    resolve(registroPago);
                    //res.send(result)
                }
            });
        })
    }

    async function buscarRegistrosPagoOutRangoNoFacturas(idUsuario, idUsuario2, idUsuario3) {
        return new Promise((resolve, reject) => {
            let sql = "SELECT tbl_registro_pago.id_registro_pago, CAST(tbl_registro_pago.tipo_registro AS INT) AS tipo_registro, DATE_FORMAT(tbl_registro_pago.fecha_creacion, '%d-%m-%Y %T') AS fecha_creacion, tbl_registro_pago.id_factura, tbl_registro_pago.id_nota_credito, tbl_registro_pago.id_nota_debito, tbl_registro_pago.id_recibo, tbl_registro_pago.id_registro_divisa, tbl_registro_pago.id_tipo_pago, tbl_registro_pago.id_banco, tbl_registro_pago.numero_referencia, tbl_registro_pago.monto, tbl_registro_pago.id_usuario, tbl_tipo_pago.tipo_pago_nombre, tbl_banco.banco_nombre, tbl_registro_divisa.id_divisa, CAST(tbl_registro_pago.igtf_pago AS INT) AS igtf_pago, tbl_divisa.divisa_nombre FROM tbl_registro_pago LEFT JOIN tbl_tipo_pago ON tbl_tipo_pago.id_tipo_pago = tbl_registro_pago.id_tipo_pago LEFT JOIN tbl_banco ON tbl_banco.id_banco = tbl_registro_pago.id_banco LEFT JOIN tbl_registro_divisa ON tbl_registro_pago.id_registro_divisa = tbl_registro_divisa.id_registro_divisa LEFT JOIN tbl_divisa ON tbl_divisa.id_divisa = tbl_registro_divisa.id_divisa WHERE (tbl_registro_pago.fecha_creacion BETWEEN '"+req.body.from+"' AND '"+req.body.to+"') AND (tbl_registro_pago.fecha_creacion BETWEEN '"+req.body.from+"' AND '"+req.body.to+"') AND (tbl_registro_pago.id_usuario = '"+idUsuario+"' OR tbl_registro_pago.id_usuario = '"+idUsuario2+"' OR tbl_registro_pago.id_usuario = '"+idUsuario3+"')";
            console.log("-----------------------", sql)
            connection.query(sql, function (err, result, fields) {
                if (err) {
                    console.log('ERROR en CheckTemplate', err);
                    res.send('3');
                }
                if(result){
                    registroPago = result
                    resolve(registroPago);
                    //res.send(result)
                }
            });
        })
    }


    async function buscarRegistrosPago(item, registroPago) {
        return new Promise((resolve, reject) => {
            let sql = "SELECT tbl_registro_pago.id_registro_pago, CAST(tbl_registro_pago.tipo_registro AS INT) AS tipo_registro, DATE_FORMAT(tbl_registro_pago.fecha_creacion, '%d-%m-%Y %T') AS fecha_creacion, tbl_registro_pago.id_factura, tbl_registro_pago.id_nota_credito, tbl_registro_pago.id_nota_debito, tbl_registro_pago.id_recibo, tbl_registro_pago.id_registro_divisa, tbl_registro_pago.id_tipo_pago, tbl_registro_pago.id_banco, tbl_registro_pago.numero_referencia, tbl_registro_pago.monto, tbl_tipo_pago.tipo_pago_nombre, tbl_registro_pago.id_usuario, tbl_banco.banco_nombre, tbl_registro_divisa.id_divisa, CAST(tbl_registro_pago.igtf_pago AS INT) AS igtf_pago, tbl_divisa.divisa_nombre FROM tbl_registro_pago LEFT JOIN tbl_tipo_pago ON tbl_tipo_pago.id_tipo_pago = tbl_registro_pago.id_tipo_pago LEFT JOIN tbl_banco ON tbl_banco.id_banco = tbl_registro_pago.id_banco LEFT JOIN tbl_registro_divisa ON tbl_registro_pago.id_registro_divisa = tbl_registro_divisa.id_registro_divisa LEFT JOIN tbl_divisa ON tbl_divisa.id_divisa = tbl_registro_divisa.id_divisa WHERE tbl_registro_pago.id_factura='" + item.id_factura + "' AND (tbl_registro_pago.fecha_creacion BETWEEN '"+req.body.from+"' AND '"+req.body.to+"')";
            connection.query(sql, function (err, result, fields) {
                if (err) {
                    console.log('ERROR en CheckTemplate', err);
                    res.send('3');
                }
                if(result){
                    registroPago = result
                    resolve(registroPago);
                    //res.send(result)
                }
            });
        })
    }
    async function buscarRegistrosPagoRecibo(item, registroPago) {
        return new Promise((resolve, reject) => {
            let sql = "SELECT tbl_registro_pago.id_registro_pago, tbl_registro_pago.id_usuario, DATE_FORMAT(tbl_registro_pago.fecha_creacion, '%d-%m-%Y %T') AS fecha_creacion, tbl_registro_pago.igtf_pago, tbl_registro_pago.id_factura, CAST(tbl_registro_pago.tipo_registro AS INT) AS tipo_registro, tbl_registro_pago.id_nota_credito, tbl_registro_pago.id_nota_debito, tbl_registro_pago.id_recibo, tbl_registro_pago.id_registro_divisa, tbl_registro_pago.id_tipo_pago, tbl_registro_pago.id_banco, tbl_registro_pago.numero_referencia, tbl_registro_pago.monto, tbl_tipo_pago.tipo_pago_nombre, tbl_banco.banco_nombre, tbl_registro_divisa.id_divisa, tbl_divisa.divisa_nombre FROM tbl_registro_pago LEFT JOIN tbl_tipo_pago ON tbl_tipo_pago.id_tipo_pago = tbl_registro_pago.id_tipo_pago LEFT JOIN tbl_banco ON tbl_banco.id_banco = tbl_registro_pago.id_banco LEFT JOIN tbl_registro_divisa ON tbl_registro_pago.id_registro_divisa = tbl_registro_divisa.id_registro_divisa LEFT JOIN tbl_divisa ON tbl_divisa.id_divisa = tbl_registro_divisa.id_divisa WHERE tbl_registro_pago.id_recibo='" + item.id_recibo + "' AND (tbl_registro_pago.fecha_creacion BETWEEN '"+req.body.from+"' AND '"+req.body.to+"')";
            connection.query(sql, function (err, result, fields) {
                if (err) {
                    console.log('ERROR en CheckTemplate', err);
                    res.send('3');
                }
                if(result){
                    registroPago = result
                    resolve(registroPago);
                    //res.send(result)
                }
            });
        })
    }
    async function buscarRegistroDivisas(registros) {
        return new Promise((resolve, reject) => {
            const sql = "SELECT a.tasa_actual, a.id_registro_divisa, a.id_divisa, c.divisa_nombre FROM tbl_registro_divisa a LEFT JOIN tbl_divisa c ON c.id_divisa = a.id_divisa WHERE id_registro_divisa = (SELECT MAX(id_registro_divisa) FROM `tbl_registro_divisa` b WHERE a.id_divisa = b.id_divisa)"
            connection.query(sql, function (err, result, fie) {
                if (err) {
                    console.log('error en la conexion intente de nuevo', err)
                    res.send('3')
                }
                //console.log("EL RESULT!!!!!!!", result)
                registros = result;
                resolve(registros);
            })
        })
    }

    async function buscarRecibos(recibos, sqlRecibos) {
        return new Promise((resolve, reject) => {
            connection.query(sqlRecibos, function (err, result, fie) {
                if (err) {
                    console.log('error en la conexion intente de nuevo', err)
                    res.send('3')
                }else{
                    //console.log("EL RESULT!!!!!!!", result)
                    recibos = result;
                    resolve(recibos);
                }
            })
        })
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
}

administracionFiscalCtrl.masterDeVentasFiscal = async(req, res) =>{

    let facturas, numero, response = {}, divisas, cambioBolivares;
    sql = "SELECT tbl_factura.id_factura, tbl_factura.numero_factura, tbl_factura.orden_trabajo, tbl_factura.debe_dolares, tbl_factura.total_bolivares, tbl_factura.total_dolares, tbl_factura.total_pesos, tbl_factura.id_estado_factura, tbl_factura.id_usuario, tbl_factura.id_cliente, tbl_factura.id_tipo_factura, tbl_factura.id_estado_factura, DATE_FORMAT(tbl_factura.fecha_creacion_factura, '%Y-%m-%d') AS fecha_creacion_factura, DATE_FORMAT(tbl_factura.fecha_cancelacion, '%Y-%m-%d') AS fecha_cencelacion_factura, tbl_factura.id_estado_factura, tbl_factura.descuento_bolivares, tbl_factura.descuento_dolares, tbl_factura.descuento_pesos, tbl_factura.anulacion_motivo, tbl_factura.IGTF_dolares, tbl_factura.IGTF_pesos, tbl_factura.IGTF_bolivares, tbl_factura.base_imponible_bolivares, tbl_factura.base_imponible_dolares, tbl_tipo_factura.tipo_factura_nombre, tbl_cliente.cliente_nombre, tbl_cliente.cliente_apellido, tbl_cliente.cedula_RIF, tbl_estado_factura.nombre FROM `tbl_factura` LEFT JOIN tbl_tipo_factura ON tbl_tipo_factura.id_tipo_factura = tbl_factura.id_tipo_factura LEFT JOIN tbl_cliente ON tbl_cliente.id_cliente = tbl_factura.id_cliente LEFT JOIN tbl_estado_factura ON tbl_estado_factura.id_estado_factura = tbl_factura.id_estado_factura WHERE (fecha_creacion_factura BETWEEN '"+req.body.from+"' AND '"+req.body.to+"') ORDER BY id_factura ASC";
    
    divisas = await getDivisas();
    for(const item of divisas.registroDivisas){
        if(item.divisa_nombre == 'BOLIVARES'){
            cambioBolivares = item.tasa_actual;
        }
    }
    console.log("!!!!!!!!!", cambioBolivares)
    facturas = await buscarFacturas(facturas, sql);
    //numero = facturas.length;
    response = await configFacturas(facturas, cambioBolivares)
    res.send(response)

    async function getDivisas() {
        return new Promise((resolve, reject) => {
                axios.get('http://localhost:3000/registroDivisas')
                .then(function (response) {
                    resolve(response.data)
                })
        })
    }

    async function configFacturas(facturas, cambioBolivares) {
        return new Promise((resolve, reject) => {
            let agrupados = [];
            let i = 0;
            //Recorremos el arreglo 
            facturas.forEach( item => {
            //Si la ciudad no existe en nuevoObjeto entonces
            //la creamos e inicializamos el arreglo de profesionales. 
            if( !agrupados.hasOwnProperty(item.id_cliente)){
                agrupados[item.id_cliente] = {
                    id_cliente: item.id_cliente,
                    cliente_nombre: item.cliente_nombre,
                    cliente_apellido: item.cliente_apellido,
                    cedula_RIF: item.cedula_RIF,
                    detalles_factura: []
                }
            }
            //Agregamos los datos de profesionales. 
            if(item.numero_factura != null){
                agrupados[item.id_cliente].detalles_factura.push({
                    id_factura: item.id_factura,
                    numero_factura: item.numero_factura,
                    orden_trabajo: item.orden_trabajo,
                    total_bolivares: item.total_bolivares,
                    total_dolares:  item.total_dolares,
                    total_pesos:  item.total_pesos,
                    id_usuario: item.id_usuario,
                    id_cliente: item.id_cliente,
                    id_tipo_factura: item.id_tipo_factura,
                    id_estado_factura: item.id_estado_factura,
                    fecha_creacion_factura: item.fecha_creacion_factura,
                    fecha_cencelacion_factura: item.fecha_cencelacion_factura,
                    fecha_creacion_orden_trabajo: item.fecha_creacion_orden_trabajo,
                    descuento_bolivares: item.descuento_bolivares,
                    descuento_dolares:  item.descuento_dolares,
                    descuento_pesos: item.descuento_pesos,
                    anulacion_motivo: item.anulacion_motivo,
                    tipo_factura_nombre: item.tipo_factura_nombre,
                    cliente_nombre: item.cliente_nombre,
                    cliente_apellido: item.cliente_apellido,
                    cedula_RIF: item.cedula_RIF,
                    IGTF_dolares: item.IGTF_dolares,
                    IGTF_pesos: item.IGTF_pesos,
                    IGTF_bolivares: item.IGTF_bolivares,
                    base_imponible_bolivares: item.base_imponible_bolivares,
                    base_imponible_dolares: item.base_imponible_dolares,
                    debe_dolares: item.debe_dolares,
                    estado_factura: item.nombre
                })
            }else{
                agrupados[item.id_cliente].detalles_factura.push({
                    id_factura: item.id_factura,
                    numero_factura: item.numero_factura,
                    orden_trabajo: item.orden_trabajo,
                    total_bolivares: item.total_bolivares,
                    total_dolares:  item.total_dolares,
                    total_pesos:  item.total_pesos,
                    id_usuario: item.id_usuario,
                    id_cliente: item.id_cliente,
                    id_tipo_factura: item.id_tipo_factura,
                    id_estado_factura: item.id_estado_factura,
                    fecha_creacion_factura: item.fecha_creacion_factura,
                    fecha_cencelacion_factura: item.fecha_cencelacion_factura,
                    fecha_creacion_orden_trabajo: item.fecha_creacion_orden_trabajo,
                    descuento_bolivares: item.descuento_bolivares,
                    descuento_dolares:  item.descuento_dolares,
                    descuento_pesos: item.descuento_pesos,
                    anulacion_motivo: item.anulacion_motivo,
                    tipo_factura_nombre: item.tipo_factura_nombre,
                    cliente_nombre: item.cliente_nombre,
                    cliente_apellido: item.cliente_apellido,
                    cedula_RIF: item.cedula_RIF,
                    IGTF_dolares: item.IGTF_dolares,
                    IGTF_pesos: item.IGTF_pesos,
                    IGTF_bolivares: item.IGTF_bolivares,
                    base_imponible_bolivares: 0,
                    base_imponible_dolares: 0,
                    debe_dolares: item.debe_dolares,
                    estado_factura: item.nombre
                })
            }
            
            })
            let bolivaresCliente = 0, debeBolivaresCliente = 0, bolivaresTotal = 0, imponibleBs = 0, igtfBs = 0, imponibleBsTotal = 0, igtfBsTotal = 0, debe_bolivares = 0, total_debe = 0;
            let cliente_nombre, cliente_apellido, cedula_RIF;
            let agrupadosFiltrado = agrupados.filter(item => item != null);
            for(const itemMayor of agrupadosFiltrado){
                for(const itemDetalles of itemMayor.detalles_factura){
                    bolivaresCliente = bolivaresCliente + itemDetalles.total_bolivares;
                    imponibleBs = imponibleBs + itemDetalles.base_imponible_bolivares;
                    igtfBs = igtfBs + itemDetalles.IGTF_bolivares;
                    debe_bolivares = (itemDetalles.debe_dolares * cambioBolivares)
                    debeBolivaresCliente = debeBolivaresCliente + debe_bolivares;
                    itemDetalles.debe_bolivares = debe_bolivares;
                    itemDetalles.abono_factura = itemDetalles.total_bolivares - itemDetalles.debe_bolivares
                    cliente_nombre = itemDetalles.cliente_nombre
                    cliente_apellido = itemDetalles.cliente_apellido
                    cedula_RIF = itemDetalles.cedula_RIF
                }
                itemMayor.sub_total_bolivares = Number(Math.round(bolivaresCliente + "e+2") + "e-2")//bolivaresCliente;
                itemMayor.sub_total_base_imponible_bolivares = Number(Math.round(imponibleBs + "e+2") + "e-2")//imponibleBs;
                itemMayor.sub_total_IGTF_bolivares = Number(Math.round(igtfBs + "e+2") + "e-2")//igtfBs;
                itemMayor.debe_bolivares_sub_total = Number(Math.round(debeBolivaresCliente + "e+2") + "e-2")//debeBolivaresCliente;
                itemMayor.abono_sub_total = Number(Math.round((bolivaresCliente - debeBolivaresCliente) + "e+2") + "e-2")//bolivaresCliente - debeBolivaresCliente;


                bolivaresTotal = bolivaresTotal + bolivaresCliente;
                total_debe = total_debe + debe_bolivares;               ///ESTE ES EL SALDO TOTAL QUE SE DEBE
                imponibleBsTotal = imponibleBsTotal + imponibleBs;
                igtfBsTotal = igtfBsTotal + igtfBs;
                bolivaresCliente = 0;
                igtfBs = 0;
                imponibleBs = 0;
            } 
            response = [
                {   
                    total_bolivares:  Number(Math.round(bolivaresTotal + "e+2") + "e-2").toLocaleString('de-DE'),
                    bolivares_imponible_total: Number(Math.round(imponibleBsTotal + "e+2") + "e-2").toLocaleString('de-DE'),
                    IGTF_bolivares_total: Number(Math.round(igtfBsTotal + "e+2") + "e-2").toLocaleString('de-DE'),
                    total_debe_bolivares:  Number(Math.round(total_debe + "e+2") + "e-2").toLocaleString('de-DE'),       ////////////////saldo en bolivares
                    abono_total: Number(Math.round((bolivaresTotal - total_debe) + "e+2") + "e-2").toLocaleString('de-DE')
                },
                {clientes_factura: agrupadosFiltrado}
            ]
            resolve(response);
        })
    }
    
    
    async function buscarFacturas(facturas, sql) {
        return new Promise((resolve, reject) => {
            connection.query(sql, function (err, result, fields) {
                if (err) {
                    console.log('ERROR en CheckTemplate', err);
                    res.send('3');
                }
                if(result){
                    facturas = result;
                    resolve(facturas);
                    //res.send(result)
                }
            });
        })
    }

}

administracionFiscalCtrl.masterDeVentasNoFiscal = async(req, res) =>{

    let facturas, numero, response = {}, divisas, cambioBolivares;
    sql = "SELECT tbl_factura.id_factura, tbl_factura.numero_factura, tbl_factura.orden_trabajo, tbl_factura.debe_dolares, tbl_factura.total_bolivares, tbl_factura.total_dolares, tbl_factura.total_pesos, tbl_factura.id_usuario, tbl_factura.id_cliente, tbl_factura.id_tipo_factura, tbl_factura.id_estado_factura, DATE_FORMAT(tbl_factura.fecha_creacion_factura, '%Y-%m-%d') AS fecha_creacion_factura, DATE_FORMAT(tbl_factura.fecha_cancelacion, '%Y-%m-%d') AS fecha_cancelacion_factura, DATE_FORMAT(tbl_factura.fecha_creacion_orden_trabajo, '%Y-%m-%d') AS fecha_creacion_orden_trabajo, tbl_factura.id_estado_factura, tbl_factura.descuento_bolivares, tbl_factura.descuento_dolares, tbl_factura.descuento_pesos, tbl_factura.anulacion_motivo, tbl_factura.IGTF_dolares, tbl_factura.IGTF_pesos, tbl_factura.IGTF_bolivares, tbl_factura.base_imponible_bolivares, tbl_factura.base_imponible_dolares, tbl_tipo_factura.tipo_factura_nombre, tbl_cliente.cliente_nombre, tbl_cliente.cliente_apellido, tbl_cliente.cedula_RIF, tbl_factura.id_estado_factura, tbl_estado_factura.nombre FROM `tbl_factura` LEFT JOIN tbl_tipo_factura ON tbl_tipo_factura.id_tipo_factura = tbl_factura.id_tipo_factura LEFT JOIN tbl_cliente ON tbl_cliente.id_cliente = tbl_factura.id_cliente LEFT JOIN tbl_estado_factura ON tbl_factura.id_estado_factura = tbl_estado_factura.id_estado_factura WHERE (fecha_creacion_orden_trabajo BETWEEN '"+req.body.from+"' AND '"+req.body.to+"') AND (numero_factura IS NULL) ORDER BY id_factura ASC";
    //sql = "SELECT tbl_factura.id_factura, tbl_factura.orden_trabajo, tbl_factura.numero_factura, tbl_factura.debe_dolares, tbl_factura.total_bolivares, tbl_factura.total_dolares, tbl_factura.total_pesos, tbl_factura.id_usuario, tbl_factura.id_cliente, tbl_factura.id_tipo_factura, tbl_factura.id_estado_factura, DATE_FORMAT(tbl_factura.fecha_creacion_factura, '%d-%m-%Y %T') AS fecha_creacion_factura, DATE_FORMAT(tbl_factura.fecha_cancelacion, '%d-%m-%Y %T') AS fecha_cencelacion_factura, tbl_factura.id_estado_factura, tbl_factura.descuento_bolivares, tbl_factura.descuento_dolares, tbl_factura.descuento_pesos, tbl_factura.anulacion_motivo, tbl_factura.IGTF_dolares, tbl_factura.IGTF_pesos, tbl_factura.IGTF_bolivares, tbl_factura.base_imponible_bolivares, tbl_factura.base_imponible_dolares, tbl_tipo_factura.tipo_factura_nombre, tbl_cliente.cliente_nombre, tbl_cliente.cliente_apellido FROM `tbl_factura` LEFT JOIN tbl_tipo_factura ON tbl_tipo_factura.id_tipo_factura = tbl_factura.id_tipo_factura LEFT JOIN tbl_cliente ON tbl_cliente.id_cliente = tbl_factura.id_cliente WHERE numero_factura IS NULL ORDER BY id_factura ASC"
    divisas = await getDivisas();
    for(const item of divisas.registroDivisas){
        if(item.divisa_nombre == 'BOLIVARES'){
            cambioBolivares = item.tasa_actual;
        }
    }
    console.log("!!!!!!!!!", cambioBolivares)
    facturas = await buscarFacturas(facturas, sql);
    //numero = facturas.length;
    response = await configFacturas(facturas, cambioBolivares)
    res.send(response)

    async function getDivisas() {
        return new Promise((resolve, reject) => {
                axios.get('http://localhost:3000/registroDivisas')
                .then(function (response) {
                    resolve(response.data)
                })
        })
    }

    async function configFacturas(facturas, cambioBolivares) {
        return new Promise((resolve, reject) => {
            let agrupados = [];
            let i = 0;
            //Recorremos el arreglo 
            facturas.forEach( item => {
            //Si la ciudad no existe en nuevoObjeto entonces
            //la creamos e inicializamos el arreglo de profesionales. 
            if( !agrupados.hasOwnProperty(item.id_cliente)){
                agrupados[item.id_cliente] = {
                    id_cliente: item.id_cliente,
                    cliente_nombre: item.cliente_nombre,
                    cliente_apellido: item.cliente_apellido,
                    cedula_RIF: item.cedula_RIF,
                    detalles_factura: []
                }
            }
            //Agregamos los datos de profesionales. 
                    agrupados[item.id_cliente].detalles_factura.push({
                        id_factura: item.id_factura,
                        numero_factura: item.numero_factura,
                        orden_trabajo: item.orden_trabajo,
                        total_bolivares: item.total_bolivares,
                        total_dolares:  item.total_dolares,
                        total_pesos:  item.total_pesos,
                        id_usuario: item.id_usuario,
                        id_cliente: item.id_cliente,
                        id_tipo_factura: item.id_tipo_factura,
                        id_estado_factura: item.id_estado_factura,
                        fecha_creacion_factura: item.fecha_creacion_factura,
                        fecha_cencelacion_factura: item.fecha_cencelacion_factura,
                        fecha_creacion_orden_trabajo: item.fecha_creacion_orden_trabajo,
                        descuento_bolivares: item.descuento_bolivares,
                        descuento_dolares:  item.descuento_dolares,
                        descuento_pesos: item.descuento_pesos,
                        anulacion_motivo: item.anulacion_motivo,
                        tipo_factura_nombre: item.tipo_factura_nombre,
                        cliente_nombre: item.cliente_nombre,
                        cliente_apellido: item.cliente_apellido,
                        cedula_RIF: item.cedula_RIF,
                        IGTF_dolares: 0,
                        IGTF_pesos: 0,
                        IGTF_bolivares: 0,
                        base_imponible_bolivares: 0,
                        base_imponible_dolares: 0,
                        debe_dolares: item.debe_dolares,
                        estado_factura: item.nombre
                    })
            
            })
            let bolivaresCliente = 0, debeBolivaresCliente = 0, bolivaresTotal = 0, imponibleBs = 0, igtfBs = 0, imponibleBsTotal = 0, igtfBsTotal = 0, debe_bolivares = 0, total_debe = 0;
            let cliente_nombre, cliente_apellido, cedula_RIF;
            let agrupadosFiltrado = agrupados.filter(item => item != null);
            for(const itemMayor of agrupadosFiltrado){
                for(const itemDetalles of itemMayor.detalles_factura){
                    bolivaresCliente = bolivaresCliente + itemDetalles.total_bolivares;
                    imponibleBs = imponibleBs + itemDetalles.base_imponible_bolivares;
                    igtfBs = igtfBs + itemDetalles.IGTF_bolivares;
                    debe_bolivares = (itemDetalles.debe_dolares * cambioBolivares)
                    debeBolivaresCliente = debeBolivaresCliente + debe_bolivares;
                    itemDetalles.debe_bolivares = debe_bolivares;
                    itemDetalles.abono_factura = itemDetalles.total_bolivares - itemDetalles.debe_bolivares
                    cliente_nombre = itemDetalles.cliente_nombre
                    cliente_apellido = itemDetalles.cliente_apellido
                    cedula_RIF = itemDetalles.cedula_RIF
                }
                itemMayor.sub_total_bolivares = Number(Math.round(bolivaresCliente + "e+2") + "e-2")//bolivaresCliente;
                itemMayor.sub_total_base_imponible_bolivares = Number(Math.round(imponibleBs + "e+2") + "e-2")//imponibleBs;
                itemMayor.sub_total_IGTF_bolivares = Number(Math.round(igtfBs + "e+2") + "e-2")//igtfBs;
                itemMayor.debe_bolivares_sub_total = Number(Math.round(debeBolivaresCliente + "e+2") + "e-2")//debeBolivaresCliente;
                itemMayor.abono_sub_total = Number(Math.round((bolivaresCliente - debeBolivaresCliente) + "e+2") + "e-2")//bolivaresCliente - debeBolivaresCliente;


                bolivaresTotal = bolivaresTotal + bolivaresCliente;
                total_debe = total_debe + debe_bolivares;               ///ESTE ES EL SALDO TOTAL QUE SE DEBE
                imponibleBsTotal = imponibleBsTotal + imponibleBs;
                igtfBsTotal = igtfBsTotal + igtfBs;
                bolivaresCliente = 0;
                debeBolivaresCliente = 0;
                igtfBs = 0;
                imponibleBs = 0;
            } 
            response = [
                {   
                    total_bolivares:  Number(Math.round(bolivaresTotal + "e+2") + "e-2").toLocaleString('de-DE'),
                    bolivares_imponible_total: Number(Math.round(imponibleBsTotal + "e+2") + "e-2").toLocaleString('de-DE'),
                    IGTF_bolivares_total: Number(Math.round(igtfBsTotal + "e+2") + "e-2").toLocaleString('de-DE'),
                    total_debe_bolivares:  Number(Math.round(total_debe + "e+2") + "e-2").toLocaleString('de-DE'),       ////////////////saldo en bolivares
                    abono_total: Number(Math.round((bolivaresTotal - total_debe) + "e+2") + "e-2").toLocaleString('de-DE')
                },
                {clientes_factura: agrupadosFiltrado}
            ]
            resolve(response);
        })
    }
    
    
    async function buscarFacturas(facturas, sql) {
        return new Promise((resolve, reject) => {
            connection.query(sql, function (err, result, fields) {
                if (err) {
                    console.log('ERROR en CheckTemplate', err);
                    res.send('3');
                }
                if(result){
                    facturas = result;
                    resolve(facturas);
                    //res.send(result)
                }
            });
        })
    }
}

administracionFiscalCtrl.masterDeVentasConsolidado = async(req, res) =>{

    let facturas, numero, response = {}, divisas, cambioBolivares;
    sql = "SELECT tbl_factura.id_factura, tbl_factura.numero_factura, tbl_factura.orden_trabajo, tbl_factura.debe_dolares, tbl_factura.total_bolivares, tbl_factura.total_dolares, tbl_factura.total_pesos, tbl_factura.id_usuario, tbl_factura.id_cliente, tbl_factura.id_tipo_factura, tbl_factura.id_estado_factura, DATE_FORMAT(tbl_factura.fecha_creacion_factura, '%Y-%m-%d') AS fecha_creacion_factura, DATE_FORMAT(tbl_factura.fecha_cancelacion, '%Y-%m-%d') AS fecha_cencelacion_factura, DATE_FORMAT(tbl_factura.fecha_creacion_orden_trabajo, '%Y-%m-%d') AS fecha_creacion_orden_trabajo, tbl_factura.id_estado_factura, tbl_factura.descuento_bolivares, tbl_factura.descuento_dolares, tbl_factura.descuento_pesos, tbl_factura.anulacion_motivo, tbl_factura.IGTF_dolares, tbl_factura.IGTF_pesos, tbl_factura.IGTF_bolivares, tbl_factura.base_imponible_bolivares, tbl_factura.base_imponible_dolares, tbl_tipo_factura.tipo_factura_nombre, tbl_cliente.cliente_nombre, tbl_cliente.cliente_apellido, tbl_cliente.cedula_RIF, tbl_factura.id_estado_factura, tbl_estado_factura.nombre FROM `tbl_factura` LEFT JOIN tbl_tipo_factura ON tbl_tipo_factura.id_tipo_factura = tbl_factura.id_tipo_factura LEFT JOIN tbl_cliente ON tbl_cliente.id_cliente = tbl_factura.id_cliente LEFT JOIN tbl_estado_factura ON tbl_estado_factura.id_estado_factura = tbl_factura.id_estado_factura WHERE (fecha_creacion_factura BETWEEN '"+req.body.from+"' AND '"+req.body.to+"') OR (fecha_creacion_orden_trabajo BETWEEN '"+req.body.from+"' AND '"+req.body.to+"')  ORDER BY id_factura ASC";
    
    divisas = await getDivisas();
    for(const item of divisas.registroDivisas){
        if(item.divisa_nombre == 'BOLIVARES'){
            cambioBolivares = item.tasa_actual;
        }
    }
    //console.log("!!!!!!!!!", cambioBolivares)
    facturas = await buscarFacturas(facturas, sql);
    //numero = facturas.length;
    response = await configFacturas(facturas, cambioBolivares)
    res.send(response)

    async function getDivisas() {
        return new Promise((resolve, reject) => {
                axios.get('http://localhost:3000/registroDivisas')
                .then(function (response) {
                    resolve(response.data)
                })
        })
    }

    async function configFacturas(facturas, cambioBolivares) {
        return new Promise((resolve, reject) => {
            let agrupados = [];
            let i = 0;
            //Recorremos el arreglo 
            facturas.forEach( item => {
                //console.log(",,,,,,,,,,,,,,,,,,,,,,,,,,,,", item)
            //Si la ciudad no existe en nuevoObjeto entonces
            //la creamos e inicializamos el arreglo de profesionales. 
            if( !agrupados.hasOwnProperty(item.id_cliente)){
                agrupados[item.id_cliente] = {
                    id_cliente: item.id_cliente,
                    cliente_nombre: item.cliente_nombre,
                    cliente_apellido: item.cliente_apellido,
                    cedula_RIF: item.cedula_RIF,
                    detalles_factura: []
                }
            }
            //Agregamos los datos de profesionales. 
                if(item.numero_factura != null){
                    agrupados[item.id_cliente].detalles_factura.push({
                        id_factura: item.id_factura,
                        numero_factura: item.numero_factura,
                        orden_trabajo: item.orden_trabajo,
                        total_bolivares: item.total_bolivares,
                        total_dolares:  item.total_dolares,
                        total_pesos:  item.total_pesos,
                        id_usuario: item.id_usuario,
                        id_cliente: item.id_cliente,
                        id_tipo_factura: item.id_tipo_factura,
                        id_estado_factura: item.id_estado_factura,
                        fecha_creacion_factura: item.fecha_creacion_factura,
                        fecha_cencelacion_factura: item.fecha_cencelacion_factura,
                        fecha_creacion_orden_trabajo: item.fecha_creacion_orden_trabajo,
                        descuento_bolivares: item.descuento_bolivares,
                        descuento_dolares:  item.descuento_dolares,
                        descuento_pesos: item.descuento_pesos,
                        anulacion_motivo: item.anulacion_motivo,
                        tipo_factura_nombre: item.tipo_factura_nombre,
                        cliente_nombre: item.cliente_nombre,
                        cliente_apellido: item.cliente_apellido,
                        cedula_RIF: item.cedula_RIF,
                        IGTF_dolares: item.IGTF_dolares,
                        IGTF_pesos: item.IGTF_pesos,
                        IGTF_bolivares: item.IGTF_bolivares,
                        base_imponible_bolivares: item.base_imponible_bolivares,
                        base_imponible_dolares: item.base_imponible_dolares,
                        debe_dolares: item.debe_dolares,
                        estado_factura: item.nombre
                    })
                }else{
                    agrupados[item.id_cliente].detalles_factura.push({
                        id_factura: item.id_factura,
                        numero_factura: item.numero_factura,
                        orden_trabajo: item.orden_trabajo,
                        total_bolivares: item.total_bolivares,
                        total_dolares:  item.total_dolares,
                        total_pesos:  item.total_pesos,
                        id_usuario: item.id_usuario,
                        id_cliente: item.id_cliente,
                        id_tipo_factura: item.id_tipo_factura,
                        id_estado_factura: item.id_estado_factura,
                        fecha_creacion_factura: item.fecha_creacion_factura,
                        fecha_cencelacion_factura: item.fecha_cencelacion_factura,
                        fecha_creacion_orden_trabajo: item.fecha_creacion_orden_trabajo,
                        descuento_bolivares: item.descuento_bolivares,
                        descuento_dolares:  item.descuento_dolares,
                        descuento_pesos: item.descuento_pesos,
                        anulacion_motivo: item.anulacion_motivo,
                        tipo_factura_nombre: item.tipo_factura_nombre,
                        cliente_nombre: item.cliente_nombre,
                        cliente_apellido: item.cliente_apellido,
                        cedula_RIF: item.cedula_RIF,
                        IGTF_dolares: 0,
                        IGTF_pesos: 0,
                        IGTF_bolivares: 0,
                        base_imponible_bolivares: 0,
                        base_imponible_dolares: 0,
                        debe_dolares: item.debe_dolares,
                        estado_factura: item.nombre
                    })
                }
            
            })
            let bolivaresCliente = 0, debeBolivaresCliente = 0, bolivaresTotal = 0, imponibleBs = 0, igtfBs = 0, imponibleBsTotal = 0, igtfBsTotal = 0, debe_bolivares = 0, total_debe = 0;
            let cliente_nombre, cliente_apellido, cedula_RIF;
            let agrupadosFiltrado = agrupados.filter(item => item != null);
            for(const itemMayor of agrupadosFiltrado){
                for(const itemDetalles of itemMayor.detalles_factura){
                    bolivaresCliente = bolivaresCliente + itemDetalles.total_bolivares;
                    imponibleBs = imponibleBs + itemDetalles.base_imponible_bolivares;
                    igtfBs = igtfBs + itemDetalles.IGTF_bolivares;
                    debe_bolivares = (itemDetalles.debe_dolares * cambioBolivares)
                    debeBolivaresCliente = debeBolivaresCliente + debe_bolivares;
                    itemDetalles.debe_bolivares = debe_bolivares;
                    itemDetalles.abono_factura = itemDetalles.total_bolivares - itemDetalles.debe_bolivares
                    cliente_nombre = itemDetalles.cliente_nombre
                    cliente_apellido = itemDetalles.cliente_apellido
                    cedula_RIF = itemDetalles.cedula_RIF
                }
                itemMayor.sub_total_bolivares = Number(Math.round(bolivaresCliente + "e+2") + "e-2")//bolivaresCliente;
                itemMayor.sub_total_base_imponible_bolivares = Number(Math.round(imponibleBs + "e+2") + "e-2")//imponibleBs;
                itemMayor.sub_total_IGTF_bolivares = Number(Math.round(igtfBs + "e+2") + "e-2")//igtfBs;
                itemMayor.debe_bolivares_sub_total = Number(Math.round(debeBolivaresCliente + "e+2") + "e-2")//debeBolivaresCliente;
                itemMayor.abono_sub_total = Number(Math.round((bolivaresCliente - debeBolivaresCliente) + "e+2") + "e-2")//bolivaresCliente - debeBolivaresCliente;


                bolivaresTotal = bolivaresTotal + bolivaresCliente;
                total_debe = total_debe + debe_bolivares;               ///ESTE ES EL SALDO TOTAL QUE SE DEBE
                imponibleBsTotal = imponibleBsTotal + imponibleBs;
                igtfBsTotal = igtfBsTotal + igtfBs;
                bolivaresCliente = 0;
                debeBolivaresCliente = 0;
                igtfBs = 0;
                imponibleBs = 0;
            } 
            response = [
                {   
                    total_bolivares:  Number(Math.round(bolivaresTotal + "e+2") + "e-2").toLocaleString('de-DE'),
                    bolivares_imponible_total: Number(Math.round(imponibleBsTotal + "e+2") + "e-2").toLocaleString('de-DE'),
                    IGTF_bolivares_total: Number(Math.round(igtfBsTotal + "e+2") + "e-2").toLocaleString('de-DE'),
                    total_debe_bolivares:  Number(Math.round(total_debe + "e+2") + "e-2").toLocaleString('de-DE'),       ////////////////saldo en bolivares
                    abono_total: Number(Math.round((bolivaresTotal - total_debe) + "e+2") + "e-2").toLocaleString('de-DE')
                },
                {clientes_factura: agrupadosFiltrado}
            ]
            resolve(response);
        })
    }
    
    
    async function buscarFacturas(facturas, sql) {
        return new Promise((resolve, reject) => {
            connection.query(sql, function (err, result, fields) {
                if (err) {
                    console.log('ERROR en CheckTemplate', err);
                    res.send('3');
                }
                if(result){
                    facturas = result;
                    resolve(facturas);
                    //res.send(result)
                }
            });
        })
    }
}

administracionFiscalCtrl.relacionPacientePruebas = async(req, res) =>{
    let facturas, numero, response, jsonEnvio, divisas, cambioBolivares;
    sql = "SELECT tbl_factura.id_factura, tbl_factura.total_bolivares, tbl_factura.total_pesos, tbl_factura.total_dolares ,tbl_factura.numero_factura, tbl_factura.orden_trabajo, tbl_factura.debe_dolares, tbl_factura.total_bolivares, tbl_factura.total_dolares, tbl_factura.total_pesos, tbl_factura.id_usuario, tbl_factura.id_cliente, tbl_factura.id_tipo_factura, tbl_factura.id_estado_factura, DATE_FORMAT(tbl_factura.fecha_creacion_factura, '%d-%m-%Y %T') AS fecha_creacion_factura, DATE_FORMAT(tbl_factura.fecha_cancelacion, '%d-%m-%Y %T') AS fecha_cencelacion_factura, tbl_factura.id_estado_factura, tbl_factura.descuento_bolivares, tbl_factura.descuento_dolares, tbl_factura.descuento_pesos, tbl_factura.anulacion_motivo, tbl_factura.IGTF_dolares, tbl_factura.IGTF_pesos, tbl_factura.IGTF_bolivares, tbl_factura.base_imponible_bolivares, tbl_factura.base_imponible_dolares, tbl_tipo_factura.tipo_factura_nombre, tbl_cliente.cliente_nombre, tbl_cliente.cliente_apellido, tbl_cliente.cedula_RIF FROM `tbl_factura` LEFT JOIN tbl_tipo_factura ON tbl_tipo_factura.id_tipo_factura = tbl_factura.id_tipo_factura LEFT JOIN tbl_cliente ON tbl_cliente.id_cliente = tbl_factura.id_cliente WHERE (fecha_creacion_factura BETWEEN '"+req.body.from+"' AND '"+req.body.to+"') OR (fecha_creacion_orden_trabajo BETWEEN '"+req.body.from+"' AND '"+req.body.to+"')  ORDER BY id_factura ASC";
    
    //console.log("!!!!!!!!!", cambioBolivares)
    facturas = await buscarFacturas(facturas, sql);
    //numero = facturas.length;
    response = await configFacturas(facturas)
    //console.log(response)
    let pacienteLista;
                for(const itemDetalles of response.clientes_factura){
                    for(const factura of itemDetalles.detalles_factura){
                        //console.log("!!!!!!!!!!!!!!!!!!!!!", factura)
                        pacienteLista = await detallePacienteExamenCultivo(factura.id_factura)
                        factura.pacientes = pacienteLista
                    }
                  // 
                }
    res.send(response)

    async function configFacturas(facturas) {
        return new Promise((resolve, reject) => {
            let agrupados = [];
            let i = 0;
            let totalBolivares = 0;
            let totalDolares = 0;
            let totalPesos = 0;
            //Recorremos el arreglo 
            facturas.forEach( item => {
            //Si la ciudad no existe en nuevoObjeto entonces
            //la creamos e inicializamos el arreglo de profesionales. 
            totalBolivares = totalBolivares + item.total_bolivares;
            totalDolares = totalDolares + item.total_dolares;
            totalPesos = totalPesos + item.total_pesos;
            if( !agrupados.hasOwnProperty(item.id_cliente)){
                agrupados[item.id_cliente] = {
                    id_cliente: item.id_cliente,
                    cliente_nombre: item.cliente_nombre,
                    cliente_apellido: item.cliente_apellido,
                    cedula_RIF: item.cedula_RIF,
                    detalles_factura: []
                }
            }
            //Agregamos los datos de profesionales. 
            agrupados[item.id_cliente].detalles_factura.push({
                    id_factura: item.id_factura,
                    numero_factura: item.numero_factura,
                    orden_trabajo: item.orden_trabajo,
                    total_bolivares: item.total_bolivares,
                })
            
            })
            let agrupadosFiltrado = agrupados.filter(item => item != null);
            resolve({clientes_factura: agrupadosFiltrado, total_bolivares: Number(Math.round(totalBolivares + "e+2") + "e-2").toLocaleString('de-DE'), total_dolares: Number(Math.round(totalDolares + "e+2") + "e-2").toLocaleString('de-DE'), total_pesos: Number(Math.round(totalPesos + "e+2") + "e-2").toLocaleString('de-DE')});
        })
    }
    
    async function detallePacienteExamenCultivo(id_factura){
        //console.log("!!!!!!!!!!!!!!!!!!!11", id_factura)
        return new Promise((resolve, reject) => {
            let sql="SELECT tbl_detalle_factura_paciente.id_detalle_factura_paciente, tbl_detalle_factura_paciente.id_factura, tbl_detalle_factura_paciente.id_paciente, tbl_detalle_factura_paciente.id_examen, tbl_detalle_factura_paciente.id_cultivo, tbl_paciente.paciente_nombre, tbl_paciente.paciente_apellido, tbl_paciente.paciente_cedula, tbl_paciente.edad, tbl_examen.examen_nombre, tbl_examen.examen_codigo, tbl_examen.examen_precio, tbl_cultivo.cultivo_nombre, tbl_cultivo.cultivo_codigo, tbl_cultivo.cultivo_precio, tbl_detalle_orden.id_orden, tbl_orden.numero_orden FROM tbl_detalle_factura_paciente LEFT JOIN tbl_paciente ON tbl_paciente.id_paciente = tbl_detalle_factura_paciente.id_paciente LEFT JOIN tbl_examen ON tbl_examen.id_examen = tbl_detalle_factura_paciente.id_examen LEFT JOIN tbl_cultivo ON tbl_cultivo.id_cultivo = tbl_detalle_factura_paciente.id_cultivo LEFT JOIN tbl_detalle_orden ON tbl_detalle_orden.id_detalle_factura_paciente = tbl_detalle_factura_paciente.id_detalle_factura_paciente LEFT JOIN tbl_orden ON tbl_orden.id_orden = tbl_detalle_orden.id_orden WHERE tbl_detalle_factura_paciente.id_factura = '"+id_factura+"'"
            connection.query(sql, function (err, result, fields) {
                if (err) {
                    console.log('ERROR en CheckTemplate', err);
                    res.send('3');
                }
                if(result){
                    let pacientes, agrupados = [];
                    pacientes = result;
                    //console.log(pacientes)
                    pacientes.forEach( item => {
                        //Si la ciudad no existe en nuevoObjeto entonces
                        //la creamos e inicializamos el arreglo de profesionales. 
                        if( !agrupados.hasOwnProperty(item.id_paciente)){
                            agrupados[item.id_paciente] = {
                                id_detalle_factura_paciente: item.id_detalle_factura_paciente,
                                id_orden: item.id_orden,
                                numero_orden: item.numero_orden,
                                id_paciente: item.id_cliente,
                                paciente_nombre: item.paciente_nombre,
                                paciente_apellido: item.paciente_apellido,
                                paciente_cedula: item.paciente_cedula,
                                detalles_examen_cultivo: []
                            }
                        }
                        //Agregamos los datos de profesionales. 
                        agrupados[item.id_paciente].detalles_examen_cultivo.push({
                                examen_nombre: item.examen_nombre,
                                examen_codigo: item.examen_codigo,
                                examen_precio: item.examen_precio,
                                cultivo_nombre: item.cultivo_nombre,
                                cultivo_codigo: item.cultivo_codigo,
                                cultivo_precio: item.cultivo_precio
                            })
                        
                        })
                        let agrupadosFiltrado = agrupados.filter(item => item != null);
                        //console.log("!!!!!!!!!!!!!!!!!!!!!", agrupadosFiltrado)
                    resolve(agrupadosFiltrado);
                    //res.send(result)
                }
            });
        })
    }


    async function buscarFacturas(facturas, sql) {
        return new Promise((resolve, reject) => {
            connection.query(sql, function (err, result, fields) {
                if (err) {
                    console.log('ERROR en CheckTemplate', err);
                    res.send('3');
                }
                if(result){
                    facturas = result;
                    resolve(facturas);
                    //res.send(result)
                }
            });
        })
    }
}

administracionFiscalCtrl.relacionPacientePruebasCliente = async(req, res) =>{
    let facturas, numero, response, jsonEnvio, divisas, cambioBolivares;
    sql = "SELECT tbl_factura.id_factura, tbl_factura.numero_factura, tbl_factura.orden_trabajo, tbl_factura.debe_dolares, tbl_factura.total_bolivares, tbl_factura.total_dolares, tbl_factura.total_pesos, tbl_factura.id_usuario, tbl_factura.id_cliente, tbl_factura.id_tipo_factura, tbl_factura.id_estado_factura, DATE_FORMAT(tbl_factura.fecha_creacion_factura, '%d-%m-%Y %T') AS fecha_creacion_factura, DATE_FORMAT(tbl_factura.fecha_cancelacion, '%d-%m-%Y %T') AS fecha_cencelacion_factura, tbl_factura.id_estado_factura, tbl_factura.descuento_bolivares, tbl_factura.descuento_dolares, tbl_factura.descuento_pesos, tbl_factura.anulacion_motivo, tbl_factura.IGTF_dolares, tbl_factura.IGTF_pesos, tbl_factura.IGTF_bolivares, tbl_factura.base_imponible_bolivares, tbl_factura.base_imponible_dolares, tbl_tipo_factura.tipo_factura_nombre, tbl_cliente.cliente_nombre, tbl_cliente.cliente_apellido, tbl_cliente.cedula_RIF FROM `tbl_factura` LEFT JOIN tbl_tipo_factura ON tbl_tipo_factura.id_tipo_factura = tbl_factura.id_tipo_factura LEFT JOIN tbl_cliente ON tbl_cliente.id_cliente = tbl_factura.id_cliente WHERE ((fecha_creacion_factura BETWEEN '"+req.body.from+"' AND '"+req.body.to+"') OR (fecha_creacion_orden_trabajo BETWEEN '"+req.body.from+"' AND '"+req.body.to+"')) AND (tbl_factura.id_cliente = '"+req.body.id_cliente+"') ORDER BY id_factura ASC";
    //console.log("SQL", sql)
    //console.log("!!!!!!!!!", cambioBolivares)
    facturas = await buscarFacturas(facturas, sql);
    //console.log("FACTURAS!!!", facturas)
    //numero = facturas.length;
    response = await configFacturas(facturas)
    //console.log(response)
    let pacienteLista;
                for(const itemDetalles of response.clientes_factura){
                    for(const factura of itemDetalles.detalles_factura){
                        //console.log("!!!!!!!!!!!!!!!!!!!!!", factura)
                        pacienteLista = await detallePacienteExamenCultivo(factura.id_factura)
                        factura.pacientes = pacienteLista
                    }
                  // 
                }
    res.send(response)

    async function configFacturas(facturas) {
        return new Promise((resolve, reject) => {
            let agrupados = [];
            let i = 0;
            let totalBolivares = 0;
            let totalDolares = 0;
            let totalPesos = 0;
            //Recorremos el arreglo 
            facturas.forEach( item => {
            //Si la ciudad no existe en nuevoObjeto entonces
            //la creamos e inicializamos el arreglo de profesionales. 
            totalBolivares = totalBolivares + item.total_bolivares;
            totalDolares = totalDolares + item.total_dolares;
            totalPesos = totalPesos + item.total_pesos;
            if( !agrupados.hasOwnProperty(item.id_cliente)){
                agrupados[item.id_cliente] = {
                    id_cliente: item.id_cliente,
                    cliente_nombre: item.cliente_nombre,
                    cliente_apellido: item.cliente_apellido,
                    cedula_RIF: item.cedula_RIF,
                    detalles_factura: []
                }
            }
            //Agregamos los datos de profesionales. 
            agrupados[item.id_cliente].detalles_factura.push({
                    id_factura: item.id_factura,
                    numero_factura: item.numero_factura,
                    orden_trabajo: item.orden_trabajo,
                    total_bolivares: item.total_bolivares,
                })
            
            })
            let agrupadosFiltrado = agrupados.filter(item => item != null);
            resolve({clientes_factura: agrupadosFiltrado, total_bolivares: Number(Math.round(totalBolivares + "e+2") + "e-2").toLocaleString('de-DE'), total_dolares: Number(Math.round(totalDolares + "e+2") + "e-2").toLocaleString('de-DE'), total_pesos: Number(Math.round(totalPesos + "e+2") + "e-2").toLocaleString('de-DE')});
        })
    }
    
    async function detallePacienteExamenCultivo(id_factura){
        //console.log("!!!!!!!!!!!!!!!!!!!11", id_factura)
        return new Promise((resolve, reject) => {
            let sql="SELECT tbl_detalle_factura_paciente.id_detalle_factura_paciente, tbl_detalle_factura_paciente.id_factura, tbl_detalle_factura_paciente.id_paciente, tbl_detalle_factura_paciente.id_examen, tbl_detalle_factura_paciente.id_cultivo, tbl_paciente.paciente_nombre, tbl_paciente.paciente_apellido, tbl_paciente.paciente_cedula, tbl_paciente.edad, tbl_examen.examen_nombre, tbl_examen.examen_codigo, tbl_examen.examen_precio, tbl_cultivo.cultivo_nombre, tbl_cultivo.cultivo_codigo, tbl_cultivo.cultivo_precio, tbl_detalle_orden.id_orden, tbl_orden.numero_orden FROM tbl_detalle_factura_paciente LEFT JOIN tbl_paciente ON tbl_paciente.id_paciente = tbl_detalle_factura_paciente.id_paciente LEFT JOIN tbl_examen ON tbl_examen.id_examen = tbl_detalle_factura_paciente.id_examen LEFT JOIN tbl_cultivo ON tbl_cultivo.id_cultivo = tbl_detalle_factura_paciente.id_cultivo LEFT JOIN tbl_detalle_orden ON tbl_detalle_orden.id_detalle_factura_paciente = tbl_detalle_factura_paciente.id_detalle_factura_paciente LEFT JOIN tbl_orden ON tbl_orden.id_orden = tbl_detalle_orden.id_orden WHERE tbl_detalle_factura_paciente.id_factura = '"+id_factura+"'"
            connection.query(sql, function (err, result, fields) {
                if (err) {
                    console.log('ERROR en CheckTemplate', err);
                    res.send('3');
                }
                if(result){
                    let pacientes, agrupados = [];
                    pacientes = result;
                    //console.log(pacientes)
                    pacientes.forEach( item => {
                        //Si la ciudad no existe en nuevoObjeto entonces
                        //la creamos e inicializamos el arreglo de profesionales. 
                        if( !agrupados.hasOwnProperty(item.id_paciente)){
                            agrupados[item.id_paciente] = {
                                id_detalle_factura_paciente: item.id_detalle_factura_paciente,
                                id_orden: item.id_orden,
                                numero_orden: item.numero_orden,
                                id_paciente: item.id_cliente,
                                paciente_nombre: item.paciente_nombre,
                                paciente_apellido: item.paciente_apellido,
                                paciente_cedula: item.paciente_cedula,
                                detalles_examen_cultivo: []
                            }
                        }
                        //Agregamos los datos de profesionales. 
                        agrupados[item.id_paciente].detalles_examen_cultivo.push({
                                examen_nombre: item.examen_nombre,
                                examen_codigo: item.examen_codigo,
                                examen_precio: item.examen_precio,
                                cultivo_nombre: item.cultivo_nombre,
                                cultivo_codigo: item.cultivo_codigo,
                                cultivo_precio: item.cultivo_precio
                            })
                        
                    })
                        let agrupadosFiltrado = agrupados.filter(item => item != null);
                        //console.log("!!!!!!!!!!!!!!!!!!!!!", agrupadosFiltrado)
                    resolve(agrupadosFiltrado);
                    //res.send(result)
                }
            });
        })
    }


    async function buscarFacturas(facturas, sql) {
        return new Promise((resolve, reject) => {
            connection.query(sql, function (err, result, fields) {
                if (err) {
                    console.log('ERROR en CheckTemplate', err);
                    res.send('3');
                }
                if(result){
                    facturas = result;
                    resolve(facturas);
                    //res.send(result)
                }
            });
        })
    }
}

administracionFiscalCtrl.reporteDeVentasConsolidado = async(req, res) =>{

    let facturas, response, anuladas, responseOrdenesTrabajo, ordenesTrabajo, notasCredito, responseNotasCredito;
    /////FACTURAS/////
    sql = "SELECT tbl_factura.id_factura, tbl_factura.numero_factura, tbl_factura.orden_trabajo, tbl_factura.debe_dolares, tbl_factura.total_bolivares, tbl_factura.total_dolares, tbl_factura.total_pesos, tbl_factura.id_usuario, tbl_factura.id_cliente, tbl_factura.id_tipo_factura, tbl_factura.id_estado_factura, DATE_FORMAT(tbl_factura.fecha_creacion_factura, '%y-%m-%d') AS fecha_creacion_factura, DATE_FORMAT(tbl_factura.fecha_cancelacion, '%y-%m-%d') AS fecha_cencelacion_factura, tbl_factura.id_estado_factura, tbl_factura.descuento_bolivares, tbl_factura.descuento_dolares, tbl_factura.descuento_pesos, tbl_factura.anulacion_motivo, tbl_factura.IGTF_dolares, tbl_factura.IGTF_pesos, tbl_factura.IGTF_bolivares, tbl_factura.base_imponible_bolivares, tbl_factura.base_imponible_dolares, tbl_tipo_factura.tipo_factura_nombre, tbl_cliente.cliente_nombre, tbl_cliente.cliente_apellido, tbl_cliente.cedula_RIF FROM `tbl_factura` LEFT JOIN tbl_tipo_factura ON tbl_tipo_factura.id_tipo_factura = tbl_factura.id_tipo_factura LEFT JOIN tbl_cliente ON tbl_cliente.id_cliente = tbl_factura.id_cliente WHERE (fecha_creacion_factura BETWEEN '"+req.body.from+"' AND '"+req.body.to+"') AND tbl_factura.numero_factura IS NOT NULL AND tbl_factura.id_estado_factura != 3 ORDER BY id_factura ASC";
    
    /////ORDENES DE TRABAJO/////
    sql2 = "SELECT tbl_factura.id_factura, tbl_factura.orden_trabajo, tbl_factura.numero_factura, tbl_factura.debe_dolares, tbl_factura.total_bolivares, tbl_factura.total_dolares, tbl_factura.total_pesos, tbl_factura.id_usuario, tbl_factura.id_cliente, tbl_factura.id_tipo_factura, tbl_factura.id_estado_factura, DATE_FORMAT(tbl_factura.fecha_creacion_orden_trabajo, '%y-%m-%d') AS fecha_creacion_orden_trabajo, DATE_FORMAT(tbl_factura.fecha_cancelacion, '%y-%m-%d') AS fecha_cencelacion_factura, tbl_factura.id_estado_factura, tbl_factura.descuento_bolivares, tbl_factura.descuento_dolares, tbl_factura.descuento_pesos, tbl_factura.anulacion_motivo, tbl_factura.IGTF_dolares, tbl_factura.IGTF_pesos, tbl_factura.IGTF_bolivares, tbl_factura.base_imponible_bolivares, tbl_factura.base_imponible_dolares, tbl_tipo_factura.tipo_factura_nombre, tbl_cliente.cliente_nombre, tbl_cliente.cliente_apellido, tbl_cliente.cedula_RIF FROM `tbl_factura` LEFT JOIN tbl_tipo_factura ON tbl_tipo_factura.id_tipo_factura = tbl_factura.id_tipo_factura LEFT JOIN tbl_cliente ON tbl_cliente.id_cliente = tbl_factura.id_cliente WHERE (fecha_creacion_orden_trabajo BETWEEN '"+req.body.from+"' AND '"+req.body.to+"') AND tbl_factura.numero_factura IS NULL AND tbl_factura.id_estado_factura != 3 ORDER BY id_factura ASC";
    
    ////FACTURAS ANULADAS//////
    sql3 = "SELECT tbl_factura.id_factura, tbl_factura.orden_trabajo, tbl_factura.numero_factura, tbl_factura.debe_dolares, tbl_factura.total_bolivares, tbl_factura.total_dolares, tbl_factura.total_pesos, tbl_factura.id_usuario, tbl_factura.id_cliente, tbl_factura.id_tipo_factura, tbl_factura.id_estado_factura, DATE_FORMAT(tbl_factura.fecha_creacion_factura, '%y-%m-%d') AS fecha_creacion_factura, DATE_FORMAT(tbl_factura.fecha_cancelacion, '%y-%m-%d') AS fecha_cencelacion_factura, tbl_factura.id_estado_factura, tbl_factura.descuento_bolivares, tbl_factura.descuento_dolares, tbl_factura.descuento_pesos, tbl_factura.anulacion_motivo, tbl_factura.IGTF_dolares, tbl_factura.IGTF_pesos, tbl_factura.IGTF_bolivares, tbl_factura.base_imponible_bolivares, tbl_factura.base_imponible_dolares, tbl_tipo_factura.tipo_factura_nombre, tbl_cliente.cliente_nombre, tbl_cliente.cliente_apellido, tbl_cliente.cedula_RIF FROM `tbl_factura` LEFT JOIN tbl_tipo_factura ON tbl_tipo_factura.id_tipo_factura = tbl_factura.id_tipo_factura LEFT JOIN tbl_cliente ON tbl_cliente.id_cliente = tbl_factura.id_cliente WHERE (fecha_creacion_factura BETWEEN '"+req.body.from+"' AND '"+req.body.to+"') AND tbl_factura.numero_factura IS NOT NULL AND tbl_factura.id_estado_factura = 3 ORDER BY id_factura ASC";
    
    ////NOTAS A CREDITO///////
    sql4 = "SELECT tbl_nota_credito.id_nota_credito, tbl_nota_credito.nota_credito_numero, tbl_nota_credito.id_factura, DATE_FORMAT(tbl_nota_credito.fecha_emision, '%y-%m-%d') AS fecha_emision, tbl_nota_credito.monto_bolivares, tbl_nota_credito.monto_pesos, tbl_nota_credito.monto_dolares, tbl_nota_credito.concepto, tbl_factura.numero_factura FROM tbl_nota_credito LEFT JOIN tbl_factura ON tbl_factura.id_factura = tbl_nota_credito.id_factura WHERE (fecha_emision BETWEEN '"+req.body.from+"' AND '"+req.body.to+"') ORDER BY id_nota_credito ASC"


    facturas = await buscarFacturas(facturas, sql);
    anuladas = await buscarFacturas(anuladas, sql3);
    notasCredito = await buscarFacturas(notasCredito, sql4);
    responseNotasCredito = await configNotasCredito(notasCredito, sql4)
    //console.log("NOTAS A CREDITO", responseNotasCredito)
    ordenesTrabajo = await buscarFacturas(ordenesTrabajo, sql2)
    responseOrdenesTrabajo = await configOrdenesTrabajo(ordenesTrabajo);
    response = await configFacturas(facturas)


    let clientes_factura = response.clientes_factura;
    let clientes_ordenes_trabajo = responseOrdenesTrabajo.clientes_ordenes_trabajo;
    let clientes_notas_credito = responseNotasCredito.clientes_nota_credito;
    let claves = Object.values(clientes_factura);
    let clavesOrdenesTrabajo = Object.values(clientes_ordenes_trabajo);
    let clavesNotasCredito = Object.values(clientes_notas_credito);
    //let clavesNotasCredito = Object.values()
    let facturasArray = [], ordenesTrabajoArray = [], notasCreditoArray = [];

    for(let i=0;i<claves.length;i++){
        //console.log(claves[i]);
        facturasArray.push(
            claves[i]
        )
    }

    facturasArray.sort((a, b) => {
        const fechaA = new Date(`20${a.fecha_creacion_factura.replace(/-/g, '/')}`);
        const fechaB = new Date(`20${b.fecha_creacion_factura.replace(/-/g, '/')}`);
        return fechaA - fechaB;
      });

    facturasArray.forEach(factura => {
        factura.facturas.sort((a, b) => a.numero_factura - b.numero_factura);
    });

    for(let i=0;i<clavesOrdenesTrabajo.length;i++){
        //console.log(claves[i]);
        ordenesTrabajoArray.push(
            clavesOrdenesTrabajo[i]
        )
    }

    ordenesTrabajoArray.sort((a, b) => {
        const fechaA = new Date(`20${a.fecha_creacion_orden_trabajo.replace(/-/g, '/')}`);
        const fechaB = new Date(`20${b.fecha_creacion_orden_trabajo.replace(/-/g, '/')}`);
        return fechaA - fechaB;
      });

    ordenesTrabajoArray.forEach(orden_de_trabajo => {
        orden_de_trabajo.ordenes_de_trabajo.sort((a, b) => a.orden_trabajo - b.orden_trabajo);
    });

    for(let i=0;i<clavesNotasCredito.length;i++){
        //console.log(claves[i]);
        notasCreditoArray.push(
            clavesNotasCredito[i]
        )
    }

    notasCreditoArray.sort((a, b) => {
        const fechaA = new Date(`20${a.fecha_emision.replace(/-/g, '/')}`);
        const fechaB = new Date(`20${b.fecha_emision.replace(/-/g, '/')}`);
        return fechaA - fechaB;
      });

      notasCreditoArray.forEach(nota_credito => {
        nota_credito.notas_credito.sort((a, b) => a.nota_credito_numero - b.nota_credito_numero);
    });

    let totalBolivaresAnuladas = 0, totalDolaresAnuladas = 0, totalPesosAnuladas = 0;
    for(let i=0;i<anuladas.length;i++){
        //console.log(claves[i]);
            totalBolivaresAnuladas = totalBolivaresAnuladas + anuladas[i].total_bolivares - anuladas[i].descuento_bolivares,
            totalDolaresAnuladas = totalDolaresAnuladas + anuladas[i].total_dolares - anuladas[i].descuento_dolares,
            totalPesosAnuladas = totalPesosAnuladas + anuladas[i].total_pesos - anuladas[i].descuento_pesos
    }



    let envioTodo = {
        total_ordenes_trabajo: {
            total_bolivares: responseOrdenesTrabajo.total_bolivares,
            total_dolares: responseOrdenesTrabajo.total_dolares,
            total_pesos: responseOrdenesTrabajo.total_pesos
        },
        total_facturas: {
            total_bolivares: response.total_bolivares,
            total_dolares: response.total_dolares,
            total_pesos: response.total_pesos
        },
        total_facturas_anuladas: {
            total_bolivares: totalBolivaresAnuladas,
            total_dolares: totalDolaresAnuladas,
            total_pesos: totalPesosAnuladas
        },
        total_notas_credito: {
            total_bolivares: responseNotasCredito.total_bolivares,
            total_dolares: responseNotasCredito.total_dolares,
            total_pesos: responseNotasCredito.total_pesos
        },
        facturas: facturasArray,
        facturas_anuladas: anuladas,
        ordenes_trabajo: ordenesTrabajoArray,
        notas_credito_agrupado: notasCreditoArray,
        notas_credito: notasCredito
    }
    //console.log("ROSALIA", clientes_factura)
    console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!", facturasArray[0])
    res.send(envioTodo);

    async function configFacturas(facturas) {
        return new Promise((resolve, reject) => {
            let agrupados = {};
            let i = 0;
            let totalBolivares = 0;
            let totalDolares = 0;
            let totalPesos = 0;
            //Recorremos el arreglo 
            facturas.forEach( item => {
            //Si la ciudad no existe en nuevoObjeto entonces
            //la creamos e inicializamos el arreglo de profesionales. 
            totalBolivares = totalBolivares + item.total_bolivares;
            totalDolares = totalDolares + item.total_dolares;
            totalPesos = totalPesos + item.total_pesos;
            if( !agrupados.hasOwnProperty(item.fecha_creacion_factura)){
                agrupados[item.fecha_creacion_factura] = {
                    fecha_creacion_factura: item.fecha_creacion_factura,
                    totalBolivares : 0,
                    totalDolares : 0,
                    totalPesos : 0,
                    facturas: []
                }
            }
            //Agregamos los datos de profesionales. 
                if(agrupados[item.fecha_creacion_factura].fecha_creacion_factura == item.fecha_creacion_factura){
                    agrupados[item.fecha_creacion_factura].totalBolivares = agrupados[item.fecha_creacion_factura].totalBolivares + item.total_bolivares
                    agrupados[item.fecha_creacion_factura].totalDolares = agrupados[item.fecha_creacion_factura].totalDolares + item.total_dolares
                    agrupados[item.fecha_creacion_factura].totalPesos = agrupados[item.fecha_creacion_factura].totalPesos + item.total_pesos
                } 
                agrupados[item.fecha_creacion_factura].facturas.push({
                        id_factura: item.id_factura,
                        numero_factura: item.numero_factura,
                        orden_trabajo: item.orden_trabajo,
                        total_bolivares: item.total_bolivares,
                })
                //totalBolivares = 0;
            })
            //let agrupadosFiltrado = agrupados.filter(item => item != null);
            //console.log("agrupaso!!!1", agrupados)
            resolve({clientes_factura: agrupados, total_bolivares: Number(Math.round(totalBolivares + "e+2") + "e-2"), total_dolares: Number(Math.round(totalDolares + "e+2") + "e-2"), total_pesos: Number(Math.round(totalPesos + "e+2") + "e-2")});
        })
    }

    async function configOrdenesTrabajo(ordenesTrabajo) {
        return new Promise((resolve, reject) => {
            let agrupados = {};
            let i = 0;
            let totalBolivares = 0;
            let totalDolares = 0;
            let totalPesos = 0;
            //Recorremos el arreglo 
           
            ordenesTrabajo.forEach( item => {
            //Si la ciudad no existe en nuevoObjeto entonces
            //la creamos e inicializamos el arreglo de profesionales. 
            totalBolivares = totalBolivares + item.total_bolivares;
            totalDolares = totalDolares + item.total_dolares;
            totalPesos = totalPesos + item.total_pesos;
            if( !agrupados.hasOwnProperty(item.fecha_creacion_orden_trabajo)){
                agrupados[item.fecha_creacion_orden_trabajo] = {
                    fecha_creacion_orden_trabajo: item.fecha_creacion_orden_trabajo,
                    totalBolivares : 0,
                    totalDolares : 0,
                    totalPesos : 0,
                    ordenes_de_trabajo: []
                }
            }
            //Agregamos los datos de profesionales.
            if(agrupados[item.fecha_creacion_orden_trabajo].fecha_creacion_orden_trabajo == item.fecha_creacion_orden_trabajo){
                agrupados[item.fecha_creacion_orden_trabajo].totalBolivares = agrupados[item.fecha_creacion_orden_trabajo].totalBolivares + item.total_bolivares
                agrupados[item.fecha_creacion_orden_trabajo].totalDolares = agrupados[item.fecha_creacion_orden_trabajo].totalDolares + item.total_dolares
                agrupados[item.fecha_creacion_orden_trabajo].totalPesos = agrupados[item.fecha_creacion_orden_trabajo].totalPesos + item.total_pesos
            } 
            agrupados[item.fecha_creacion_orden_trabajo].ordenes_de_trabajo.push({
                    id_factura: item.id_factura,
                    orden_trabajo: item.orden_trabajo,
                    total_bolivares: item.total_bolivares,
                })
            
            })
            //let agrupadosFiltrado = agrupados.filter(item => item != null);
            //console.log("agrupaso!!!1", agrupados)
            resolve({clientes_ordenes_trabajo: agrupados, total_bolivares: Number(Math.round(totalBolivares + "e+2") + "e-2"), total_dolares: Number(Math.round(totalDolares + "e+2") + "e-2"), total_pesos: Number(Math.round(totalPesos + "e+2") + "e-2")});
        })
    }

    async function configNotasCredito(notasCredito) {
        return new Promise((resolve, reject) => {
            let agrupados = {}, totalesDivisas = {}
            let i = 0;
            let totalBolivares = 0;
            let totalDolares = 0;
            let totalPesos = 0;
            //Recorremos el arreglo 
           
            notasCredito.forEach( item => {
            //Si la ciudad no existe en nuevoObjeto entonces
            //la creamos e inicializamos el arreglo de profesionales.
            totalBolivares = totalBolivares + item.monto_bolivares;
            totalDolares = totalDolares + item.monto_dolares;
            totalPesos = totalPesos + item.monto_pesos; 
            if( !agrupados.hasOwnProperty(item.fecha_emision)){
                agrupados[item.fecha_emision] = {
                    fecha_emision: item.fecha_emision,
                    totalBolivares : 0,
                    totalDolares : 0,
                    totalPesos : 0,
                    notas_credito: []
                }
            }
            //Agregamos los datos de profesionales. 
            if(agrupados[item.fecha_emision].fecha_emision == item.fecha_emision){
                agrupados[item.fecha_emision].totalBolivares = agrupados[item.fecha_emision].totalBolivares + item.monto_bolivares
                agrupados[item.fecha_emision].totalDolares = agrupados[item.fecha_emision].totalDolares + item.monto_dolares
                agrupados[item.fecha_emision].totalPesos = agrupados[item.fecha_emision].totalPesos + item.monto_pesos
            }
            agrupados[item.fecha_emision].notas_credito.push({
                    id_nota_credito: item.id_nota_credito,
                    nota_credito_numero: item.nota_credito_numero,
                    monto_bolivares: item.monto_bolivares,
                    monto_dolares: item.monto_dolares,
                    monto_pesos: item.monto_pesos,
                    numero_factura: item.numero_factura
                })
                //totalBolivares = 0;
            })
            //let agrupadosFiltrado = agrupados.filter(item => item != null);
            //console.log("agrupaso!!!1", agrupados)
            resolve({clientes_nota_credito: agrupados, total_bolivares: Number(Math.round(totalBolivares + "e+2") + "e-2").toLocaleString('de-DE'), total_dolares: Number(Math.round(totalDolares + "e+2") + "e-2").toLocaleString('de-DE'), total_pesos: Number(Math.round(totalPesos + "e+2") + "e-2").toLocaleString('de-DE')});
        })
    }

    async function buscarFacturas(facturas, sql) {
        return new Promise((resolve, reject) => {
            connection.query(sql, function (err, result, fields) {
                if (err) {
                    console.log('ERROR en CheckTemplate', err);
                    res.send('3');
                }
                if(result){
                    facturas = result;
                    resolve(facturas);
                    //res.send(result)
                }
            });
        })
    }

}

administracionFiscalCtrl.relacionIGTF = async(req, res) =>{

    let facturas;
    let facturasFecha;
    let baseImponibleBolivares = 0;

    facturas = await buscarFacturas();
    console.log(facturas)
    facturasFecha = await configFacturas(facturas)
    let clavesFacturasFecha = Object.values(facturasFecha);

    for(item of clavesFacturasFecha){
       baseImponibleBolivares = baseImponibleBolivares + item.totalBaseImponibleBolivares 
    }

    formatoRelacionIGTF = {
        facturas: clavesFacturasFecha,
        total_base_imponible_bolivares: baseImponibleBolivares
    }

    res.send(formatoRelacionIGTF);
    async function buscarFacturas() {
        return new Promise((resolve, reject) => {
            sql = "SELECT tbl_factura.id_factura, tbl_factura.numero_factura, tbl_factura.orden_trabajo, tbl_factura.debe_dolares, tbl_factura.total_bolivares, tbl_factura.total_dolares, tbl_factura.total_pesos, tbl_factura.id_usuario, tbl_factura.id_cliente, tbl_factura.id_tipo_factura, tbl_factura.id_estado_factura, DATE_FORMAT(tbl_factura.fecha_creacion_factura, '%Y-%m-%d') AS fecha_creacion_factura, DATE_FORMAT(tbl_factura.fecha_cancelacion, '%Y-%m-%d %T') AS fecha_cencelacion_factura, tbl_factura.id_estado_factura, tbl_factura.descuento_bolivares, tbl_factura.descuento_dolares, tbl_factura.descuento_pesos, tbl_factura.anulacion_motivo, tbl_factura.IGTF_dolares, tbl_factura.IGTF_pesos, tbl_factura.IGTF_bolivares, tbl_factura.base_imponible_bolivares, tbl_factura.base_imponible_dolares, tbl_tipo_factura.tipo_factura_nombre, tbl_cliente.cliente_nombre, tbl_cliente.cliente_apellido, tbl_cliente.cedula_RIF FROM `tbl_factura` LEFT JOIN tbl_tipo_factura ON tbl_tipo_factura.id_tipo_factura = tbl_factura.id_tipo_factura LEFT JOIN tbl_cliente ON tbl_cliente.id_cliente = tbl_factura.id_cliente WHERE (fecha_creacion_factura BETWEEN '"+req.body.from+"' AND '"+req.body.to+"') AND tbl_factura.IGTF_bolivares > 0 AND tbl_factura.id_estado_factura != 3";
            connection.query(sql, function (err, result, fields) {
                if (err) {
                    console.log('ERROR en CheckTemplate', err);
                    res.send('3');
                }
                if(result){
                    facturas = result;
                    resolve(facturas);
                    //res.send(result)
                }
            });
        })
    }

    async function configFacturas(facturas) {
        return new Promise((resolve, reject) => {
            let agrupados = {};
            let i = 0;
            //Recorremos el arreglo 
            facturas.forEach( item => {
            //Si la ciudad no existe en nuevoObjeto entonces
            //la creamos e inicializamos el arreglo de profesionales. 
            if( !agrupados.hasOwnProperty(item.fecha_creacion_factura)){
                agrupados[item.fecha_creacion_factura] = {
                    fecha_creacion_factura: item.fecha_creacion_factura,
                    totalBaseImponibleBolivares : 0,
                    totalBaseImponibleDolares : 0,
                    //totalBaseImponiblePesos : 0,
                    facturas: 0
                }
            }
            //Agregamos los datos de profesionales. 
                if(agrupados[item.fecha_creacion_factura].fecha_creacion_factura == item.fecha_creacion_factura){
                    agrupados[item.fecha_creacion_factura].totalBaseImponibleBolivares = agrupados[item.fecha_creacion_factura].totalBaseImponibleBolivares + item.base_imponible_bolivares
                    agrupados[item.fecha_creacion_factura].totalBaseImponibleDolares = agrupados[item.fecha_creacion_factura].totalBaseImponibleDolares + item.base_imponible_dolares
                    agrupados[item.fecha_creacion_factura].facturas = agrupados[item.fecha_creacion_factura].facturas + 1
                } 
                //totalBolivares = 0;
            })
            //let agrupadosFiltrado = agrupados.filter(item => item != null);
            //console.log("agrupaso!!!1", agrupados)
            
            resolve(agrupados);
        })
    }
}

administracionFiscalCtrl.reporteNotasCredito = async(req, res) =>{
    
    let notasCredito;
    let totalBolivares = 0;

    notasCredito = await buscarNotasCredito();
    for(item of notasCredito){
        totalBolivares = totalBolivares + item.monto_bolivares;
    }

    formatoNotasCredito = {
        notas_credito: notasCredito,
        total_bolivares: totalBolivares
    }
    res.send(formatoNotasCredito);

    async function buscarNotasCredito() {
        return new Promise((resolve, reject) => {
            sql = "SELECT tbl_nota_credito.id_nota_credito, tbl_nota_credito.nota_credito_numero, tbl_nota_credito.id_factura, date_format(fecha_emision,'%Y-%m-%d') AS fecha_emision, tbl_nota_credito.monto_bolivares, tbl_nota_credito.monto_pesos, tbl_nota_credito.monto_dolares, tbl_nota_credito.concepto, tbl_factura.id_cliente, tbl_factura.numero_factura, tbl_factura.id_cliente, tbl_cliente.cliente_nombre, tbl_cliente.cliente_apellido, tbl_cliente.cedula_RIF FROM tbl_nota_credito LEFT JOIN tbl_factura ON tbl_factura.id_factura = tbl_nota_credito.id_factura LEFT JOIN tbl_cliente ON tbl_cliente.id_cliente = tbl_factura.id_cliente WHERE (fecha_emision BETWEEN '"+req.body.from+"' AND '"+req.body.to+"')";
            connection.query(sql, function (err, result, fields) {
                if (err) {
                    console.log('ERROR en CheckTemplate', err);
                    res.send('3');
                }
                if(result){
                    resolve(result);
                    //res.send(result)
                }
            });
        })
    }
}

administracionFiscalCtrl.estadisticasExamenesCultivos = async(req, res) =>{
   let sql = "SELECT tbl_factura.id_factura, tbl_factura.numero_factura, tbl_factura.orden_trabajo, tbl_factura.total_bolivares, tbl_factura.total_dolares, tbl_factura.total_pesos, tbl_factura.id_usuario, tbl_factura.id_cliente, tbl_factura.id_tipo_factura, tbl_factura.id_estado_factura, DATE_FORMAT(tbl_factura.fecha_creacion_factura, '%d-%m-%Y %T') AS fecha_creacion_factura, DATE_FORMAT(tbl_factura.fecha_cancelacion, '%d-%m-%Y %T') AS fecha_cencelacion_factura, tbl_factura.id_estado_factura, tbl_factura.descuento_bolivares, tbl_factura.descuento_dolares, tbl_factura.descuento_pesos, tbl_factura.anulacion_motivo, tbl_tipo_factura.tipo_factura_nombre, tbl_cliente.cliente_nombre, tbl_cliente.cliente_apellido, tbl_cliente.id_tipo_cliente FROM `tbl_factura` LEFT JOIN tbl_tipo_factura ON tbl_tipo_factura.id_tipo_factura = tbl_factura.id_tipo_factura LEFT JOIN tbl_cliente ON tbl_cliente.id_cliente = tbl_factura.id_cliente WHERE (fecha_creacion_orden_trabajo BETWEEN '"+req.body.from+"' AND '"+req.body.to+"') OR (fecha_creacion_factura BETWEEN '"+req.body.from+"' AND '"+req.body.to+"') ORDER BY id_factura ASC"
   let facturas;
   let detallesFacturaPaciente;
   let examenesCultivos = [];
   let examenes = [], cultivos = [];
   let objetoFinal = [];
   
   facturas = await buscarFacturas(facturas, sql);
   for(const item of facturas){
        detallesFacturaPaciente = await buscarDetallesFactura(item.id_factura)
        for(const detalle of detallesFacturaPaciente){
            examenesCultivos.push({
                id_examen: detalle.id_examen,
                id_cultivo: detalle.id_cultivo,
                examen_nombre: detalle.examen_nombre,
                examen_precio: detalle.examen_precio,
                cultivo_nombre: detalle.cultivo_nombre,
                cultivo_precio: detalle.cultivo_precio
            })
        }
   }
   for(item of examenesCultivos){
       if(item.id_examen == null){
            delete item.id_examen,
            delete item.examen_nombre,
            delete item.examen_precio
            cultivos.push({
                id_cultivo: item.id_cultivo,
                cultivo_nombre: item.cultivo_nombre,
                cultivo_precio: item.cultivo_precio,
                usado: 1
            })
       }else if(item.id_cultivo == null){
            delete item.id_cultivo,
            delete item.cultivo_nombre,
            delete item.cultivo_precio,
            examenes.push({
              id_examen: item.id_examen,
              examen_nombre: item.examen_nombre,
              examen_precio: item.examen_precio,
              usado: 1
            })
       }
   }

   let numExamen= 0, precioAcum = 0, numCultivo = 0;
   for(const itemi of examenes){
        for(itemj of examenes){
            //itemj.usado = 0;
            if(itemi.id_examen == itemj.id_examen && itemj.usado == 1){
                numExamen++;
                precioAcum = precioAcum + itemj.examen_precio
                itemj.usado = 0;
            }
        }
        if(precioAcum > 0){
            objetoFinal.push({
                id_examen: itemi.id_examen,
                examen_nombre: itemi.examen_nombre,
                cantidad: numExamen,
                total_dolares: precioAcum
            })
        }
        itemi.usado = 0,
        numExamen = 0,
        precioAcum = 0
   }

   for(const itemi of cultivos){
        for(itemj of cultivos){
            //itemj.usado = 0;
            if(itemi.id_cultivo == itemj.id_cultivo && itemj.usado == 1){
                numCultivo++;
                precioAcum = precioAcum + itemj.cultivo_precio
                itemj.usado = 0;
            }
        }
        if(precioAcum > 0){
            objetoFinal.push({
                id_cultivo: itemi.id_cultivo,
                cultivo_nombre: itemi.cultivo_nombre,
                cantidad: numCultivo,
                total_dolares: precioAcum
            })
        }
        itemi.usado = 0,
        numCultivo = 0,
        precioAcum = 0
    }
   res.send(objetoFinal)
   
   async function buscarFacturas(facturas, sql) {
        return new Promise((resolve, reject) => {
            connection.query(sql, function (err, result, fields) {
                if (err) {
                    console.log('ERROR en CheckTemplate', err);
                    res.send('3');
                }
                if(result){
                    facturas = result;
                    //console.log("!!!!!!!!!!!!!!!!!", result)
                    resolve(facturas);
                    //res.send(result)
                }
            });
        })
    }

    async function buscarDetallesFactura(idFactura) {
        return new Promise((resolve, reject) => {
            let sql = "SELECT tbl_detalle_factura_paciente.id_detalle_factura_paciente, tbl_detalle_factura_paciente.id_examen, tbl_detalle_factura_paciente.id_cultivo, tbl_examen.examen_nombre, tbl_examen.examen_precio, tbl_cultivo.cultivo_nombre, tbl_cultivo.cultivo_precio FROM tbl_detalle_factura_paciente LEFT JOIN tbl_examen ON tbl_examen.id_examen = tbl_detalle_factura_paciente.id_examen LEFT JOIN tbl_cultivo ON tbl_cultivo.id_cultivo = tbl_detalle_factura_paciente.id_cultivo WHERE tbl_detalle_factura_paciente.id_factura = '" +idFactura+"'";
            connection.query(sql, function (err, result, fields) {
                if (err) {
                    console.log('ERROR en CheckTemplate', err);
                    res.send('3');
                }
                if(result){
                    //console.log(result)
                    resolve(result);
                }
            });
        })
    }

}

administracionFiscalCtrl.cuentasPorCobrar = async(req, res) =>{
    let objetoResp = {};
    let facturas;
    let cliente;
    let reigistrosConvenios;
    let debeDolares = 0;
    let deudaFacturaClientes;
    facturas = await buscarFactura();
    cliente = await buscarCliente();

    if(cliente.length == 0){
        res.send("-1")
    }else{
        reigistrosConvenios = await buscarRegistrosConvenios();
        console.log("ERROR QUE HA ESTADO DANDO CON TINA,", cliente)
        if(cliente[0].id_tipo_cliente == 2){
            console.log("ES CONVENIO")
        }

        for(const item of facturas){
            console.log(item.debe_dolares)
            debeDolares = debeDolares + item.debe_dolares;
        }

        for(const item of reigistrosConvenios){
            debeDolares = debeDolares + item.total_dolares
        }
        objetoResp.facturas = facturas;
        objetoResp.cliente = cliente[0];
        objetoResp.debe_dolares = debeDolares;
        objetoResp.registros_convenios = reigistrosConvenios;

        res.send(objetoResp);
    }

    async function buscarFactura(){
        return new Promise((resolve, reject) => {
            let sql = "SELECT tbl_factura.id_factura, tbl_factura.numero_factura, tbl_factura.id_estado_factura, tbl_factura.debe_dolares, tbl_factura.orden_trabajo, tbl_factura.total_bolivares, tbl_factura.total_dolares, tbl_factura.total_pesos, tbl_factura.id_usuario, tbl_factura.id_cliente, tbl_factura.id_tipo_factura, tbl_factura.id_estado_factura, DATE_FORMAT(tbl_factura.fecha_creacion_factura, '%d-%m-%Y %T') AS fecha_creacion_factura, DATE_FORMAT(tbl_factura.fecha_cancelacion, '%d-%m-%Y %T') AS fecha_cencelacion_factura, tbl_factura.id_estado_factura, tbl_factura.descuento_bolivares, tbl_factura.descuento_dolares, tbl_factura.descuento_pesos, tbl_factura.anulacion_motivo, tbl_tipo_factura.tipo_factura_nombre, tbl_cliente.cliente_nombre, tbl_cliente.cliente_apellido, tbl_cliente.id_tipo_cliente FROM `tbl_factura` LEFT JOIN tbl_tipo_factura ON tbl_tipo_factura.id_tipo_factura = tbl_factura.id_tipo_factura LEFT JOIN tbl_cliente ON tbl_cliente.id_cliente = tbl_factura.id_cliente WHERE tbl_factura.id_cliente = '"+req.body.id_cliente+"' AND tbl_factura.debe_dolares > 0 AND tbl_factura.id_estado_factura != 3 ORDER BY tbl_factura.id_factura ASC"
            connection.query(sql, function (err, result, fields) {
                if (err) {
                    console.log('ERROR en CheckTemplate', err);
                    res.send('3');
                }
                if(result){
                    resolve(result);
                    //res.send(result)
                }
            });
        })
    }

    async function buscarRegistrosConvenios(facturas, sql) {
        return new Promise((resolve, reject) => {
            let sql = "SELECT tbl_registro_convenio.id_registro_convenio, tbl_registro_convenio.numero_registro_convenio, tbl_registro_convenio.id_cliente, tbl_registro_convenio.id_factura, tbl_registro_convenio.total_bolivares, tbl_registro_convenio.total_pesos, tbl_registro_convenio.total_dolares, tbl_registro_convenio.descuento_bolivares, tbl_registro_convenio.descuento_pesos, tbl_registro_convenio.debe_dolares, tbl_registro_convenio.id_usuario, date_format(tbl_registro_convenio.fecha,'%d-%m-%Y %T') AS fecha, tbl_factura.numero_factura, tbl_cliente.cliente_nombre, tbl_cliente.cliente_apellido, tbl_cliente.cedula_RIF FROM `tbl_registro_convenio` LEFT JOIN tbl_factura ON tbl_factura.id_factura = tbl_registro_convenio.id_factura LEFT JOIN tbl_cliente ON tbl_cliente.id_cliente = tbl_registro_convenio.id_cliente  WHERE tbl_registro_convenio.estatus = 0 AND tbl_registro_convenio.id_cliente = '"+req.body.id_cliente+"'";
            connection.query(sql, function (err, result, fields) {
                if (err) {
                    console.log('ERROR en CheckTemplate', err);
                    res.send('3');
                }
                if(result){
                    facturas = result;
                    resolve(facturas);
                    //res.send(result)
                }
            });
        })
    }

    async function buscarCliente(){
        return new Promise((resolve, reject) => {
            let sql = "SELECT * FROM tbl_cliente WHERE id_cliente = '"+req.body.id_cliente+"'"
            connection.query(sql, function (err, result, fields) {
                if (err) {
                    console.log('ERROR en CheckTemplate', err);
                    res.send('3');
                }
                if(result){
                    resolve(result);
                    //res.send(result)
                }
            });
        })
    }

}

administracionFiscalCtrl.cuentasPorCobrarGeneral = async(req, res) =>{
    ///////////////MANEJO DE REGISTRO DE DIVISAS////////////////////////
    let registrosDivisas = await dbFunctionsAdminFiscal.buscarRegistroDivisas();
    let divisaDolares = 0, divisaPesos = 0, divisaBolivares = 0;
    //console.log("000000", registrosDivisas)

    for(const registro of registrosDivisas){
        if(registro.divisa_nombre == "DOLARES"){
            divisaDolares = registro.tasa_actual;
        }else if(registro.divisa_nombre == "PESOS"){
            divisaPesos = registro.tasa_actual;
        }else{
            divisaBolivares = registro.tasa_actual;
        }
    }

    ///////////////EXTRAIGO FACTURAS DE CLIENTES Y REGISTROS CONVENIO CON CUENTAS POR COBRAR/////////////////
    let facturas = await dbFunctionsAdminFiscal.buscarFacturas();
    let registrosConvenios = await dbFunctionsAdminFiscal.buscarRegistrosConvenios();
    let dolaresRegistrosConvenios = 0, bolivaresRegistrosConvenios = 0, pesosRegistrosConvenios = 0;
    let totalDebeDolaresFacturas = 0;

    /////////////////////////GUARDO LOS ID DE FACTURAS, ID DE CLIENTES Y REGISTROS CONVENIOS EN UN ARRAY C/U/////////////////////
    let idFacturas = facturas.map(({id_factura}) => id_factura)
    let idClientes = facturas.map(({id_cliente}) => id_cliente)
    let idClientesRegistrosConvenio = registrosConvenios.map(({id_cliente}) => id_cliente);

    ///////////////////////GUARDAR LOS DEBE DE LOS REGISTROS CONVENIOS/////////////////////////////////////////////////////
    for(const registro of registrosConvenios){
        dolaresRegistrosConvenios = registro.total_dolares;
        bolivaresRegistrosConvenios = registro.total_bolivares;
        pesosRegistrosConvenios = registro.total_pesos;
    }

    /////////////////////////UNO LOS ID DE  CLIENTES DE FACTURAS Y DE REGISTROS CONVENIO Y HAGO QUE NO SE REPITAN EN EL ARRAY///////////////////////////
    idClientes = [... new Set([...idClientes, ...idClientesRegistrosConvenio])];

    ////////////////////////BUSCO LOS REGISTRO DE PAGOS QUE SE HAYAN HECHO PARA CADA FACTURA///////////////////
    let registroPagos = await dbFunctionsAdminFiscal.buscarRegistrosPagos(idFacturas);
    let pagosPesos = 0, pagosDolares = 0, pagosBolivares = 0;

    ////////////////////////SUMANDO LOS REGISTROS DE PAGO PARA LOS MONTOS TOTALES DE PAGOS/////////////////////
    for(const registro of registroPagos){
        if(registro.divisa_nombre == "DOLARES"){
            pagosDolares += registro.monto;
        }else if(registro.divisa_nombre == "BOLIVARES"){
            pagosBolivares += registro.monto;
        }else{
            pagosPesos += registro.monto;
        }
    }

    ////////////////////////////////////////////CONVIERTO LOS PAGOS A DOLARES////////////////////////////////
    let pagoBsTo$ = Number(Math.round(pagosBolivares / divisaBolivares + "e+2") + "e-2");
    let pagoPosTo$ = Number(Math.round(pagosPesos / divisaPesos + "e+2") + "e-2")

    //////////////////////////////////////////SUMO LOS PAGOS EN UNA VARIABLE GENERAL/////////////////////////
    let totalDePagos$ = pagosDolares + pagoBsTo$ + pagoPosTo$;
    

    ///////////////////////AGRUPO ESOS PAGOS PARA CADA FACTURA///////////////////////////////////////////////
    for(const factura of facturas){
        totalDebeDolaresFacturas += factura.debe_dolares;
        let pagos = [];
        factura.pagos = [];
        pagos = registroPagos.filter((registro) => registro.id_factura == factura.id_factura);
        if(pagos.length > 0){
            factura.pagos = pagos;
        }
    }

    //////////////////////SUMO LOS DEBES GENERALES//////////////////////////
    let debeGeneralDolares = (dolaresRegistrosConvenios + totalDebeDolaresFacturas) - totalDePagos$;
    console.log("0000000000000", debeGeneralDolares, pagosDolares, pagoBsTo$, pagoPosTo$)

    ///////////////AGRUPAR FACTURAS POR CLIENTE//////////////////////
    let cuentasPorCobrar = {
        debe_general_dolares: debeGeneralDolares,
        detalles: []
    };
    for(const idCliente of idClientes){
        let facturasCliente = [];
        let registrosConveniosCliente = [];
        facturasCliente = facturas.filter((factura) => factura.id_cliente == idCliente);
        registrosConveniosCliente = registrosConvenios.filter((registro) => registro.id_cliente == idCliente)
            if(facturasCliente.length > 0){
                cuentasPorCobrar.detalles.push({
                    id_cliente: idCliente,
                    cliente_nombre: facturasCliente[0].cliente_nombre,
                    cliente_apellido: facturasCliente[0].cliente_apellido,
                    cedula_RIF: facturasCliente[0].cedula_RIF,
                    //facturas: facturasCliente,
                    //registros_convenios: registrosConveniosCliente,
                    facturas_registros_convenios: facturasCliente.concat(registrosConveniosCliente)
                })
            }else if(registrosConveniosCliente.length > 0){
                cuentasPorCobrar.detalles.push({
                    id_cliente: idCliente,
                    cliente_nombre: registrosConveniosCliente[0].cliente_nombre,
                    cliente_apellido: registrosConveniosCliente[0].cliente_apellido,
                    cedula_RIF: registrosConveniosCliente[0].cedula_RIF,
                    //facturas: facturasCliente,
                    //registros_convenios: registrosConveniosCliente,
                    facturas_registros_convenios: facturasCliente.concat(registrosConveniosCliente)
                }) 
            }
    }
    //idFacturas = [... new Set(idFacturas)]
    res.send(cuentasPorCobrar)
}

administracionFiscalCtrl.buscarDeudaFacturaClientes = async(req, res) =>{

    let deudasFacturas, deudasRegistroConvenio, deudaTotalRegistroConvenio = 0, deudaTotalFacturas = 0, deudaTotal = 0;
    let deudasUnidas = [];
    deudasFacturas = await buscarDeudasFacturas();
    deudasRegistroConvenio = await buscarDeudasRegistrosConvenio();

    for(const item of deudasFacturas){
        deudaTotalFacturas += item.debe_dolares;
        item.activo = 1
    }
    for(const item of deudasRegistroConvenio){
        deudaTotalRegistroConvenio += item.debe_dolares;
        item.activo = 1
    }

    let debe = 0;
    for(const itemF of deudasFacturas){
        debe += itemF.debe_dolares
        for(const itemR of deudasRegistroConvenio){
            if(itemF.id_cliente == itemR.id_cliente){
                debe += itemR.debe_dolares
            }
            itemR.activo = 0
        }
        deudasUnidas.push({
            debe_dolares: debe,
            id_cliente: itemF.id_cliente,
            cliente_nombre: itemF.cliente_nombre,
            cliente_apellido: itemF.cliente_apellido,
            cedula_RIF: itemF.cedula_RIF,
            contacto_persona_convenio: itemF.contacto_persona_convenio,
            correo: itemF.correo,
            telefono: itemF.telefono,
            descuento_fijo: itemF.descuento_fijo,
            id_tipo_cliente: itemF.id_tipo_cliente,
            activo: "N"
        })
        debe = 0;
    }

    for(const itemR of deudasRegistroConvenio){
        if(itemR.activo == 1){
            deudasUnidas.push(itemR)
        }
    }

    res.send(
        {
            deudaTotal: Number(Math.round(deudaTotalFacturas+deudaTotalRegistroConvenio+ "e+2") + "e-2"),
            deudaFacturas: Number(Math.round(deudaTotalFacturas+ "e+2") + "e-2"),
            deudaRegistroConvenio: deudaTotalRegistroConvenio,
            deudasClientes: deudasUnidas,
            //facturas: deudasFacturas,
            //registrosConvenio: deudasRegistroConvenio
        }
    );
    async function buscarDeudasFacturas(){
        return new Promise((resolve, reject) => {
            let sql = "SELECT SUM(debe_dolares) as debe_dolares, tbl_factura.id_cliente, tbl_cliente.cliente_nombre, tbl_cliente.cliente_apellido, tbl_cliente.cedula_RIF, tbl_cliente.contacto_persona_convenio, tbl_cliente.correo, tbl_cliente.telefono, tbl_cliente.descuento_fijo, tbl_cliente.id_tipo_cliente FROM `tbl_factura` LEFT JOIN tbl_cliente ON tbl_cliente.id_cliente = tbl_factura.id_cliente WHERE debe_dolares > 0 GROUP BY id_cliente"
            connection.query(sql, function (err, result, fields) {
                if (err) {
                    console.log('ERROR en CheckTemplate', err);
                    res.send('3');
                }
                if(result){
                    resolve(result);
                    //res.send(result)
                }
            });
        })
    }

    async function buscarDeudasRegistrosConvenio(){
        return new Promise((resolve, reject) => {
            let sql = "SELECT SUM(total_dolares) as debe_dolares, tbl_registro_convenio.id_cliente, tbl_cliente.cliente_nombre, tbl_cliente.cliente_apellido, tbl_cliente.cedula_RIF, tbl_cliente.contacto_persona_convenio, tbl_cliente.correo, tbl_cliente.telefono, tbl_cliente.descuento_fijo, tbl_cliente.id_tipo_cliente FROM `tbl_registro_convenio` LEFT JOIN tbl_cliente ON tbl_cliente.id_cliente = tbl_registro_convenio.id_cliente WHERE tbl_registro_convenio.estatus = 0 GROUP BY id_cliente"
            connection.query(sql, function (err, result, fields) {
                if (err) {
                    console.log('ERROR en CheckTemplate', err);
                    res.send('3');
                }
                if(result){
                    resolve(result);
                    //res.send(result)
                }
            });
        })
    }
}

administracionFiscalCtrl.XD = async(req, res) =>{
    

    let tareas, rol;
    
    console.log(basePrueba.length)
    /*
    tareas = await seleccionarTareas();
    rol = await seleccionarRoles();

    console.log(rol, tareas)


    for(const itemT of tareas){
        //console.log(rol[0].id_rol, itemT.id_tarea)
        await insertarMaster(rol[0].id_rol, itemT.id_tarea)
    }
    res.send("LISTO!")


    async function insertarMaster(master, tarea) {
        return new Promise((resolve, reject) => {
            connection.query('INSERT INTO `tbl_rol_tarea` SET?', {
                id_rol: master,
                id_tarea: tarea
            }, (err, result) => {
                if (err) {
                    console.log('no se pudo a agregar', err)
                    res.send('ERROR EN AGREGAR PACIENTE!')
                } else {
                    console.log('agrego!!', result)
                    resolve("1");
                }
            });
        })
    }

    async function seleccionarTareas() {
        return new Promise((resolve, reject) => { 
            let sql = "SELECT * FROM tbl_tarea"
            connection.query(sql, function (err, result, fields) {
                if (err) {
                    console.log('ERROR en CheckTemplate', err);
                    res.send('3');
                }
                if(result){
                    resolve(result);
                }
            })
         })
    }

    async function seleccionarRoles() {
        return new Promise((resolve, reject) => { 
            let sql = "SELECT * FROM tbl_rol WHERE id_rol = 6"
            connection.query(sql, function (err, result, fields) {
                if (err) {
                    console.log('ERROR en CheckTemplate', err);
                    res.send('3');
                }
                if(result){
                    resolve(result);
                }
            })
         })
    }
    */
}

module.exports = administracionFiscalCtrl;