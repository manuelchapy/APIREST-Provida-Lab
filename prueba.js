
        ////////////////////////////ORDENES DE TRABAJO A CREDITO///////////////////////
        if(item.id_tipo_factura == 5 && item.id_estado_factura != 3){
            creditoBOrdenTrabajo = creditoBOrdenTrabajo + item.total_bolivares
            creditoDOrdenTrabajo = creditoDOrdenTrabajo + item.total_dolares
            creditoPOrdenTrabajo = creditoPOrdenTrabajo + item.total_pesos
        }
        /////////////////////////////ORDENES DE TRABAJO A CREDITO/////////////////////////
        //console.log("??????????????????????????????????????????????????????????", item)
        if(item.id_tipo_factura == 5 && item.id_estado_factura != 3){
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
                cantidadotCreditoParticular = cantidadOTaCreditoParticular + 1;
            }
            ////////////////////////////DESCUENTO EN ORDENES DE TRABAJO A CREDITO/////////////////////////////
            descuento_pesos_ordenes_trabajo_credito = descuento_pesos_ordenes_trabajo_credito + item.descuento_pesos, 
            descuento_dolares_ordenes_trabajo_credito = descuento_dolares_ordenes_trabajo_credito + item.descuento_dolares, 
            descuento_bolivares_ordenes_trabajo_credito = descuento_bolivares_ordenes_trabajo_credito + item.descuento_bolivares
            ////////////////////////ABONOS EN ORDENES DE TRABAJO A CREDITO//////////////////
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
    balance.cantidadotCreditoParticular = cantidadotCreditoParticular;
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
    balance.efectivoDOTCredito = efectivoDOTCredito;
    balance.efectivoBOTCredito = efectivoBOTCredito;
    balance.transBanesco_orden_trabajo_credito = transBanesco_orden_trabajo_credito;
