const resultadosCtrl = {};
const e = require('express');
const session = require('express-session');
const { updateLocale } = require('moment');
const { NULL } = require('mysql/lib/protocol/constants/types');
const connection = require('../src/database');
const resultadoModel = require("../models/resultados");
const uniqid = require('uniqid');
const config = require('../src/config');
const impresionesTemplate = require('../models/impresiones')

resultadosCtrl.checkDetallesOrdenesExamenes = async(req, res) =>{
    //console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++", req.body[0].examenes[0].examen)
    const sql = "SELECT COUNT(id_detalle_orden) AS conteo FROM `tbl_resultado` WHERE id_detalle_orden = '" + req.body[0].examenes[0].examen.id_detalle_orden + "'";
    connection.query(sql, async function (err, result, fie) {
		if (err) {
			console.log('error en la conexion intente de nuevo', err)
			res.send('3')
		}
        //console.log(req.body[0].examenes[0].examen.id_detalle_orden)
        //console.log('el conteo: ', result)
		//res.send(result);
        let valor = -1;
        //////////////////////////////////VERIFICANDO LA SUMA DE LIPIH Y LIPIM///////////////////////////////////////
        ////////////PARA HOMBRES//////////// 
        let colesterolLDLHombres /*794*/, colesterolTotal /*792*/, colesterolHDLHombres /*793*/, Trigliceridos /*796*/;
        /*794 = 792-793-(796/5)*/
        let colesterolVLDL /*795*/ /*colesterolHDLHombres 793*/;
        /*795 = 793/5*/
        let colesterolLDLHDLHombres /*797*/; /*colesterolLDLHombres 794*/  /*colesterolHDLHombres 793*/;
        /*797 = 794 - 793*/
        let colesterolTotalHDLHombres /*798*/; /*colesterol total 792*/ /*colesterolHDLHombres 793*/
        /*798 = 792/793*/
        ///////////////////////////////////////////////
        ////////////////////PARA MUJERES///////////////
        let colesterolLDLMujeres /*801*/, colesterolTotalM /*799*/, colesterolHDLMujeres /*800*/, trigliceridosM /*803*/;
        ///calculo -----> 801 = 799-800-(803/5)
        let colesterolVLDLM /*802*/ /*trigliceridosM 803*/
        //calculo ------> 802 = 803/5
        let colesterolLDLHDLM /*804*/ /*colesterolLDLMujeres 801*/ /*colesterolHDLMujeres 800*/
        //calculo ------> 804 = 801/800
        let colesterolTotalHDLM /*805*/ /*colesterolTtoalM 799*/ /*colesterolHDLMujeres 800*/
        //calculo ------> 805 = 799/800
        ////////////////////INDICE PSA///////////////////////////////
        let PSATotal, PSALibre, indicePSA;

        //////////////////////////////////////////////////EXTRAER VALORES/////////////////////////////////////////////
        for(let i=0; i<req.body.length; i++){
            ////////NIVEL EXAMEN/////////
            for(let j=0; j<req.body[i].examenes.length; j++){
            ///////NIVEL PRUEBAS////////
                for(let k=0; k<req.body[i].examenes[j].examen.pruebas.length; k++){
                    if(req.body[i].examenes[j].examen.pruebas[k].resultado != null && req.body[i].examenes[j].examen.pruebas[k].resultado != '' && req.body[i].examenes[j].examen.pruebas[k].resultado != 'null'){
                        //console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!", req.body[i].examenes[j].examen.pruebas[k].id_detalle_examen_prueba, req.body[i].examenes[j].examen.pruebas[k].resultado)
                        // console.log("PASO???????", req.body[i].examenes[j].examen.pruebas[k].id_detalle_examen_prueba.resultado)
                       /////para 792 Colesterol total hombres//////
                       if(req.body[i].examenes[j].examen.pruebas[k].id_detalle_examen_prueba == 792){
                          colesterolTotal = Number(req.body[i].examenes[j].examen.pruebas[k].resultado)
                        
                        ///////////para 793 colesterol HDL hombres///////
                       }else if(req.body[i].examenes[j].examen.pruebas[k].id_detalle_examen_prueba == 793){
                          colesterolHDLHombres = Number(req.body[i].examenes[j].examen.pruebas[k].resultado)

                          /////////para 796 Trigliceridos/////////
                       }else if(req.body[i].examenes[j].examen.pruebas[k].id_detalle_examen_prueba == 796){
                          Trigliceridos = Number(req.body[i].examenes[j].examen.pruebas[k].resultado)

                        /////////////////////////////////////////////////PARA MUJERES/////////////////////////////////
                        /////////para 799 colesterol total mujeres///////////////
                       }else if(req.body[i].examenes[j].examen.pruebas[k].id_detalle_examen_prueba == 799){
                          colesterolTotalM = Number(req.body[i].examenes[j].examen.pruebas[k].resultado)

                          //////para 800 Colesterol HDL Mujeres////////////
                       }else if(req.body[i].examenes[j].examen.pruebas[k].id_detalle_examen_prueba == 800){
                          colesterolHDLMujeres = Number(req.body[i].examenes[j].examen.pruebas[k].resultado)

                          /////para 803 trigliceridos mujeres/////////////
                       }else if(req.body[i].examenes[j].examen.pruebas[k].id_detalle_examen_prueba == 803){
                         trigliceridosM = Number(req.body[i].examenes[j].examen.pruebas[k].resultado)
                       }else if(req.body[i].examenes[j].examen.pruebas[k].id_detalle_examen_prueba == 606){
                         PSATotal = Number(req.body[i].examenes[j].examen.pruebas[k].resultado)
                       }else if(req.body[i].examenes[j].examen.pruebas[k].id_detalle_examen_prueba == 607){
                         PSALibre = Number(req.body[i].examenes[j].examen.pruebas[k].resultado)
                       }
                    }
                }
            }
        }

        ///psa libre / psa total
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        /////////////////////////////////////PROBANDO QUE LAS PRUEBAS ESTEN BIEN////////////////////////////////////////
        //console.log("colesterolTotal", colesterolTotal);
        //console.log("colesterolTotalHDLHombres", colesterolTotalHDLHombres);
        //console.log("Trigliceridos", Trigliceridos);
        //console.log("colesterolTotalM", colesterolTotalM);
        //console.log("colesterolHDLMujeres", colesterolHDLMujeres);
        //console.log("trigliceridosM", trigliceridosM);
        //////////////////////////////////////CALCULADO EL LIPIH Y EL LIPIM////////////////////////////////
            /////////////////////////////LIPH//////////////////////////////////
            //1.
            //para Colesterol LDL Hombres 794
            /*794 = 792-793-(796/5)*/
            colesterolLDLHombres = Number(Math.round((colesterolTotal - colesterolHDLHombres - (Trigliceridos/5)) + "e+2") + "e-2");

            //2.
            /*795 = 796/5*/
            colesterolVLDL = Number(Math.round((Trigliceridos/5) + "e+2") + "e-2");

            //3.
            /*797 = 794 - 793*/
            colesterolLDLHDLHombres = Number(Math.round((colesterolLDLHombres / colesterolHDLHombres) + "e+2") + "e-2");
            //

            //4.
            /*798 = 792/793*/
            colesterolTotalHDLHombres = Number(Math.round((colesterolTotal / colesterolHDLHombres) + "e+2") + "e-2");
            ///////////////////////////////////////////////////////////////////////
            ////////////////////////////LIPIM//////////////////////////////////////
            //1.
            /*801 = 799-800-(803/5)*/
            colesterolLDLMujeres = Number(Math.round((colesterolTotalM - colesterolHDLMujeres - (trigliceridosM/5)) + "e+2") + "e-2");

            //2.
            /*802 = 803/5*/
            colesterolVLDLM = Number(Math.round((trigliceridosM/5) + "e+2") + "e-2");

            //3.
            /*804 = 801/800*/
            colesterolLDLHDLM = Number(Math.round((colesterolLDLMujeres/colesterolHDLMujeres) + "e+2") + "e-2");

            //4.
            /*805 = 799/800*/
            colesterolTotalHDLM = Number(Math.round((colesterolTotalM/colesterolHDLMujeres) + "e+2") + "e-2");
            ////////////////////////////////////////PARA PSAS LIBRE///////////////////////////////////////
            //5.
            //1217 = 607/606
            indicePSA = Number(Math.round((PSALibre/PSATotal) + "e+2") + "e-2");
            ///////////////////////////////////////////////////////////////////////
            ///////////////////////////////////////VERIFICACION DE OPERACIONES//////////////////////////////////////////
            //console.log("colesterolLDLHombres", colesterolLDLHombres);
            //console.log("colesterolVLDL", colesterolVLDL);
            //console.log("colesterolLDLHDLHombres", colesterolLDLHDLHombres);
            //console.log("colesterolTotalHDLHombres", colesterolTotalHDLHombres);
            //console.log("colesterolLDLMujeres", colesterolLDLMujeres);
            //console.log("colesterolVLDLM", colesterolVLDLM);
            //console.log("colesterolLDLHDLM", colesterolLDLHDLM);
            //console.log("colesterolTotalHDLM", colesterolTotalHDLM);
            ///////////////////////////////////////MONTANDO LOS VALORES AL JSON DE RESULTADOS////////////////////////////////////
            for(let i=0; i<req.body.length; i++){
                ////////NIVEL EXAMEN/////////
                for(let j=0; j<req.body[i].examenes.length; j++){
                ///////NIVEL PRUEBAS////////
                    for(let k=0; k<req.body[i].examenes[j].examen.pruebas.length; k++){
                            //console.log("PASO???????", req.body[i].examenes[j].examen.pruebas[k].id_detalle_examen_prueba, req.body[i].examenes[j].examen.pruebas[k].resultado)
                           /////para 792 Colesterol total hombres//////
                           if(req.body[i].examenes[j].examen.pruebas[k].id_detalle_examen_prueba == 794){
                              req.body[i].examenes[j].examen.pruebas[k].resultado = colesterolLDLHombres.toString()
                            ///////////para 793 colesterol HDL hombres///////
                           }else if(req.body[i].examenes[j].examen.pruebas[k].id_detalle_examen_prueba == 795){
                              req.body[i].examenes[j].examen.pruebas[k].resultado = colesterolVLDL.toString()
                              //console.log("777777777777777777777777777777777777777", req.body[i].examenes[j].examen.pruebas[k].resultado)
                           }else if(req.body[i].examenes[j].examen.pruebas[k].id_detalle_examen_prueba == 797){
                              req.body[i].examenes[j].examen.pruebas[k].resultado = colesterolLDLHDLHombres.toString();
                              //console.log("777777777777777777777777777777777777777", req.body[i].examenes[j].examen.pruebas[k].resultado)
                           }else if(req.body[i].examenes[j].examen.pruebas[k].id_detalle_examen_prueba == 798){
                              req.body[i].examenes[j].examen.pruebas[k].resultado = colesterolTotalHDLHombres.toString()
                              //console.log("777777777777777777777777777777777777777", req.body[i].examenes[j].examen.pruebas[k].resultado)
                           }else if(req.body[i].examenes[j].examen.pruebas[k].id_detalle_examen_prueba == 801){
                              req.body[i].examenes[j].examen.pruebas[k].resultado = colesterolLDLMujeres.toString()
                              //console.log("777777777777777777777777777777777777777", req.body[i].examenes[j].examen.pruebas[k].resultado)
                           }else if(req.body[i].examenes[j].examen.pruebas[k].id_detalle_examen_prueba == 802){
                             req.body[i].examenes[j].examen.pruebas[k].resultado = colesterolVLDLM.toString()
                             //console.log("777777777777777777777777777777777777777", req.body[i].examenes[j].examen.pruebas[k].resultado)
                           }else if(req.body[i].examenes[j].examen.pruebas[k].id_detalle_examen_prueba == 804){
                            req.body[i].examenes[j].examen.pruebas[k].resultado = colesterolLDLHDLM.toString()
                            //console.log("777777777777777777777777777777777777777", req.body[i].examenes[j].examen.pruebas[k].resultado)
                          }else if(req.body[i].examenes[j].examen.pruebas[k].id_detalle_examen_prueba == 805){
                            req.body[i].examenes[j].examen.pruebas[k].resultado = colesterolTotalHDLM.toString()
                            //console.log("777777777777777777777777777777777777777", req.body[i].examenes[j].examen.pruebas[k].resultado)
                          }else if(req.body[i].examenes[j].examen.pruebas[k].id_detalle_examen_prueba == 1217){
                            req.body[i].examenes[j].examen.pruebas[k].resultado = indicePSA.toString()
                            //console.log("777777777777777777777777777777777777777", req.body[i].examenes[j].examen.pruebas[k].resultado)
                          }
                    }
                }
            }
        
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        if(result[0].conteo > 0){
            //console.log('A modificar!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
            /////////////////REVISAR SI EXISTEN PRUEBAS NUEVAS DEL EXAMEN PARA AGREGAR/////////////////////////
            let request = req.body;
            //////NIVEL DEPARTAMENTO///////////
            for(let i=0; i<request.length; i++){
                ////////NIVEL EXAMEN/////////
                for(let j=0; j<request[i].examenes.length; j++){
                ///////NIVEL PRUEBAS////////
                    for(let k=0; k<request[i].examenes[j].examen.pruebas.length; k++){
                        valor = await verificarResultadoExtra(request[i].examenes[j].examen.id_detalle_orden, request[i].examenes[j].examen.pruebas[k].id_detalle_examen_prueba);
                        if(valor == 0){
                            //console.log("AGREGAR!!!!!!", i, j, k)
                            await agregarResultadoExtra(request[i].examenes[j].examen.id_detalle_orden, request[i].examenes[j].examen.pruebas[k].id_detalle_examen_prueba, request[i].examenes[j].examen.pruebas[k].valor_de_referencia);
                        }
                    }
                }
            }
            ///////////////////////////////////////////////////////////////////////////////////////////////////
            //console.log("...............................................................................................")
            resultadosCtrl.ModificarResultadosExamenes(req, res);
        }else if(result[0].conteo <= 0){
            //console.log('a crear!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
            resultadosCtrl.guardarResultadosExamenes(req, res);
        }
	})

    async function verificarResultadoExtra(idDetalleOrden, idDetalleExamenPrueba){
        //console.log("ENTRO PARA ACA?")
            return new Promise((resolve, reject) => {
                let sql = "SELECT id_resultado FROM tbl_resultado WHERE id_detalle_orden = '" + idDetalleOrden + "' AND id_detalle_examen_prueba = '" + idDetalleExamenPrueba + "'";
                connection.query(sql, function (err, result, fie) {
                    if (err) {
                        console.log('error en la conexion intente de nuevo', err)
                        res.send('3')
                    }else{
                        let valor = 0;
                        if(result.length == 0){
                            valor = 0;
                            resolve(valor);
                        }else{
                            valor = 1;
                            resolve(valor);
                        }
                    }
            })
        })
    }

    async function agregarResultadoExtra(idDetalleOrden, idDetalleExamenPrueba, valor_de_referencia){
        //console.log("ENTRO PARA ACA?")
            return new Promise((resolve, reject) => {
                connection.query('INSERT INTO `tbl_resultado` SET?', {
                    id_detalle_orden: idDetalleOrden,
                    id_detalle_examen_prueba: idDetalleExamenPrueba,
                    valor_referencia: valor_de_referencia
                }, (err, result) => {
                    if (err) {
                        console.log('no se pudo a agregar', err)
                        res.send('ERROR EN AGREGAR FACTURA!')
                    } else {
                        //console.log('agrego nota a credito!!')
                        //res.send('AGREGO FACTURA!')
                        resolve("1")
                    }
                });
            })
    }
}

resultadosCtrl.checkDetallesOrdenesCultivos = async(req, res) =>{
    //console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX", req.body.eliminados)
    
    for(const item of req.body.eliminados){
        for(const antibiotico of item.bacteriaItem.antibioticos){
            eliminarResultado(antibiotico.id_resultado)
        }
    }
    
    const sql = "SELECT COUNT(id_detalle_orden) AS conteo FROM `tbl_resultado` WHERE id_detalle_orden = '" + req.body.id_detalle_orden + "'";
    connection.query(sql, async function (err, result, fie) {
		if (err) {
			console.log('error en la conexion intente de nuevo', err)
			res.send('3')
		}
       //console.log(req.body[0].examenes[0].examen.id_detalle_orden)
        //console.log('el conteo: ', result)
		//res.send(result);
        if(result[0].conteo > 0){
            //console.log('A modificar');
            ///////////////////AGREGAR BACTERIAS EXTRA///////////////////////////////
            let request = req.body;
            let valor = -1;
            ////////////////////NIVEL BACTERIAS///////////////
            for(let i=0; i<request.bacterias.length; i++){
            ///////////////////NIVEL ANTIBIOTICOS/////////////
                for(let j=0; j<request.bacterias[i].bacteriaItem.antibioticos.length; j++){
                    valor = await verificarResultadoExtra(request.id_detalle_orden, request.bacterias[i].bacteriaItem.antibioticos[j].id_detalle_cultivo_bacteria_antibiotico)
                    if(valor == 0){
                        //console.log("PARA AGREGAR!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!", i,j)
                        agregarResultadoExtra(request.id_detalle_orden, request.bacterias[i].bacteriaItem.antibioticos[j].id_detalle_cultivo_bacteria_antibiotico)
                    }
                }
            }
            resultadosCtrl.modificarResultadosAntibioticos(req, res);
        }else if(result[0].conteo <= 0){
            //console.log('a crear')
            resultadosCtrl.guardarResultadosAntibioticos(req, res);
        }
	})

    async function eliminarResultado(id_resultado){
        
        return new Promise((resolve, reject) => {
            let sql = `DELETE FROM tbl_resultado WHERE id_resultado = ${id_resultado}`;
            connection.query(sql, function (err, result, fie) {
                if (err) {
                    console.log('error en la conexion intente de nuevo', err)
                    res.send('3')
                }else{
                    let valor = 0;
                    if(result.length == 0){
                        valor = 0;
                        resolve(valor);
                    }else{
                        valor = 1;
                        resolve(valor);
                    }
                }
        })
    })
    }

    async function verificarResultadoExtra(idDetalleOrden, idDetalleCultivoBacteriaAntibiotico){
        //console.log("ENTRO PARA ACA?????????????????????????????????", idDetalleOrden, idDetalleCultivoBacteriaAntibiotico)
            return new Promise((resolve, reject) => {
                let sql = "SELECT id_resultado FROM tbl_resultado WHERE id_detalle_orden = '" + idDetalleOrden + "' AND id_detalle_cultivo_bacteria_antibiotico = '" + idDetalleCultivoBacteriaAntibiotico + "'";
                connection.query(sql, function (err, result, fie) {
                    if (err) {
                        console.log('error en la conexion intente de nuevo', err)
                        res.send('3')
                    }else{
                        let valor = 0;
                        if(result.length == 0){
                            valor = 0;
                            resolve(valor);
                        }else{
                            valor = 1;
                            resolve(valor);
                        }
                    }
            })
        })
    }

    async function agregarResultadoExtra(idDetalleOrden, idDetalleCultivoBacteriaAntibiotico){
        //console.log("ENTRO PARA ACA?")
            return new Promise((resolve, reject) => {
                connection.query('INSERT INTO `tbl_resultado` SET?', {
                    id_detalle_orden: idDetalleOrden,
                    id_detalle_cultivo_bacteria_antibiotico: idDetalleCultivoBacteriaAntibiotico,
                }, (err, result) => {
                    if (err) {
                        console.log('no se pudo a agregar', err)
                        res.send('ERROR EN AGREGAR FACTURA!')
                    } else {
                        //console.log('agrego nota a credito!!')
                        //res.send('AGREGO FACTURA!')
                        resolve("1")
                    }
                });
            })
    }
}

resultadosCtrl.ModificarResultadosExamenes = async(req, res) =>{
    let memory = req.body[0].examenes[0].examen.pruebas;
    let conteo = 0;
    for(let i=0; i<req.body.length; i++){
        for(let j=0; j<req.body[i].examenes.length; j++){
            for(let k=0; k<req.body[i].examenes[j].examen.pruebas.length;k++){
                conteo++;
            }
        }
    }
    let myValues = new Array(conteo);
    let c = 0;
    let idDetalleOrden;
    let idDetalleExamenPrueba;
    let resultado;
    let paciente;
    for(let i=0; i<req.body.length; i++){
        for(let j=0; j<req.body[i].examenes.length; j++){
            for(let k=0; k<req.body[i].examenes[j].examen.pruebas.length;k++){
                myValues[c] = new Array(4);
                myValues[c][0]= req.body[i].examenes[j].examen.id_detalle_orden;
                myValues[c][1]= req.body[i].examenes[j].examen.pruebas[k].id_detalle_examen_prueba;
                myValues[c][2]= req.body[i].examenes[j].examen.pruebas[k].resultado;
                myValues[c][3]= 1;
                await modificarResultado(req.body[i].examenes[j].examen.id_detalle_orden, req.body[i].examenes[j].examen.pruebas[k].id_detalle_examen_prueba, req.body[i].examenes[j].examen.pruebas[k].resultado)
                c++;
            }
        }
    }
    //console.log(myValues, conteo)
    paciente = await extraerDatosPaciente(req.body)
    resultado = await buscarResultado(paciente[0].orden_qr)
    //console.log("0000000000000000000000000000000000000000000000000000000000", resultado)
    if(resultado != null){
        //console.log("???????????????????????????????????????")
        await modificarResultadoMongo(req.body, paciente, resultado)
    }
    //console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++")
    await comentarios();
    //res.send('MODIFICADO!')

    async function extraerDatosPaciente(body){
        return new Promise((resolve, reject) => {
            const sql = "SELECT tbl_detalle_orden.id_detalle_orden, tbl_detalle_orden.id_orden, tbl_detalle_orden.id_detalle_factura_paciente, tbl_detalle_orden.comentario, tbl_detalle_orden.id_usuario, tbl_detalle_orden.id_usuario_modificado, tbl_orden.id_orden, tbl_orden.numero_orden, tbl_orden.orden_qr, tbl_orden.orden_qr_nube, date_format(tbl_orden.fecha,'%d-%m-%Y') AS fecha, tbl_detalle_factura_paciente.id_detalle_factura_paciente, tbl_detalle_factura_paciente.id_factura, tbl_detalle_factura_paciente.id_paciente, tbl_paciente.paciente_nombre, tbl_paciente.paciente_apellido, tbl_paciente.paciente_cedula, tbl_paciente.edad, tbl_paciente.paciente_telefono, tbl_paciente.genero, tbl_genero.genero_nombre FROM tbl_detalle_orden LEFT JOIN tbl_orden ON tbl_detalle_orden.id_orden = tbl_orden.id_orden LEFT JOIN tbl_detalle_factura_paciente ON tbl_detalle_factura_paciente.id_detalle_factura_paciente = tbl_detalle_orden.id_detalle_factura_paciente LEFT JOIN tbl_paciente ON tbl_paciente.id_paciente = tbl_detalle_factura_paciente.id_paciente LEFT JOIN tbl_genero ON tbl_paciente.genero = tbl_genero.id_genero WHERE tbl_detalle_orden.id_detalle_orden = '" +body[0].examenes[0].examen.id_detalle_orden+"'";
            //console.log('nomnbre!!!', body[0].examenes[0].examen.id_detalle_orden)
            //const 
            //const 
            connection.query(sql, function (err, result, fie) {
                if (err) {
                    console.log('error en la conexion intente de nuevo', err)
                    res.send('3')
                    
                }else{
                    let detalleOrden = result
                    //console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXXX", detalleOrden)
                    resolve(detalleOrden)
                }
            })
        });
    }

    async function buscarResultado(qrOrden){
        return new Promise((resolve, reject) => {
            let resultado;
            resultado = resultadoModel.find({qr_orden: qrOrden, tipo: 1});
            //console.log("RESULTADO", cliente)
            resolve(resultado);
        });
    }

    async function modificarResultadoMongo(body, paciente, resultado){
        return new Promise(async (resolve, reject) => {
        await resultadoModel.findOneAndUpdate(
            {_id: resultado._id},
            {   
                resultados: body,
                datosPaciente: paciente,
                qr_documento: paciente[0].orden_qr_nube,
                qr_orden: paciente[0].orden_qr,
                fecha_orden: paciente[0].fecha_orden,
                tipo: 1,
                modificado: 0
            })
            resolve("1")
        })
    }

    async function modificarResultado(id_detalle_orden, id_detalle_examen_prueba, resultado){
        //console.log("ENTRO PARA ACA?")
            return new Promise(async (resolve, reject)  => {
                let buscar = await buscarResultadoLit(id_detalle_orden, id_detalle_examen_prueba)
                //console.log("CLUB JOJO LOS AMIGOS", buscar)
                if(buscar == '3'){
                    await buscarResultado(id_detalle_orden, id_detalle_examen_prueba)
                }else if(buscar == '0'){
                   if(resultado != 'null' || resultado != null || resultado != ''){
                        //console.log("DESDE MODIFICAR RESULTADO ENTRO EN 0")
                        const sql = "UPDATE `tbl_resultado` SET resultado = '" + resultado +"' WHERE id_detalle_orden= '"+id_detalle_orden+"' AND id_detalle_examen_prueba = '"+id_detalle_examen_prueba+"'";
                        //console.log(sql)
                        connection.query(sql, function (err, result, fie) {
                            if (err) {
                                console.log('error en la conexion intente de nuevo', err)
                                res.send('3')
                            }else{
                                //console.log('Resultado Modificado')
                                //console.log("DESDE MODIFICAR RESULTADO ENTRO EN 0 CON RESOLVE")
                                resolve('1')
                            }
                        })
                    }
                }else if(buscar == '1'){
                    //console.log("DESDE MODIFICAR RESULTADO ENTRO EN 1", resultado)
                    if(resultado == 'null' || resultado == null || resultado == '' ){
                        resultado = '';
                    }
                    if(resultado != 'null' && resultado != null && resultado != ''){
                        //console.log("DESDE MODIFICAR RESULTADO ENTRO EN 1 Y HAY DATA QUE MODIFICAR")
                        const sql = "UPDATE `tbl_resultado` SET resultado = '" + resultado +"' WHERE id_detalle_orden= '"+id_detalle_orden+"' AND id_detalle_examen_prueba = '"+id_detalle_examen_prueba+"'";
                        //console.log(sql)
                        connection.query(sql, function (err, result, fie) {
                            if (err) {
                                console.log('error en la conexion intente de nuevo', err)
                                res.send('3')
                            }else{
                                //console.log('Resultado Modificado')
                                //console.log("DESDE MODIFICAR RESULTADO ENTRO EN 0 CON RESOLVE")
                                resolve('1')
                            }
                        })
                    }else{
                        //console.log("LOS VALORES SON 0")
                        resolve("1")
                    }
                }
            });
    }

    async function buscarResultadoLit(id_detalle_orden, id_detalle_examen_prueba){
        return new Promise((resolve, reject) => {
            const sql = "SELECT resultado FROM `tbl_resultado` WHERE id_detalle_orden= '"+id_detalle_orden+"' AND id_detalle_examen_prueba = '"+id_detalle_examen_prueba+"'";
            connection.query(sql, function (err, result, fie) {
                if (err) {
                    console.log('error en la conexion intente de nuevo', err)
                    resolve('3')
                }else{
                    //console.log('Resultado BUSCADO!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!', result[0].resultado)
                    if(result[0].resultado == null || result[0].resultado == 'null' || result[0].resultado == ''){
                        //console.log("entro en 0")
                        resolve('0')
                    }else{
                        //console.log("entro en 1")
                        resolve('1')
                    }
                    
                }
            })
        });
    }

    async function comentarios(){
        let comentario;
        let idUsario;
        let idDetalleOrden;
        let resultado;
        let paciente;
        for(let i=0; i<req.body.length; i++){
            for(let j=0; j<req.body[i].examenes.length; j++){
                comentario = req.body[i].examenes[j].examen.comentario;
                idDetalleOrden = req.body[i].examenes[j].examen.id_detalle_orden;
                idUsario = req.body[i].examenes[j].examen.id_usuario;
                await guardarComentarioUsuario(comentario, idDetalleOrden, idUsario)
            }
        }
        paciente = await extraerDatosPaciente(req.body)
        resultado = await buscarResultado(paciente[0].orden_qr)
        if(resultado != null){
            await modificarResultadoMongo(req.body, paciente, resultado)
        }
        res.send('1');
    }

    async function guardarComentarioUsuario(comentario, idDetalleOrden, idUsario){
        return new Promise(async (resolve, reject) => {
            let sql;
            let busqueda = await buscarComentario(idDetalleOrden);
            //console.log(busqueda, "OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO")
            if(busqueda == "0"){
                if(idUsario == null){
                    sql = "UPDATE `tbl_detalle_orden` SET comentario = '" + comentario + "' WHERE id_detalle_orden= '"+idDetalleOrden+"'";
                }else{
                    if(comentario == null || comentario == ''){
                        sql = "UPDATE `tbl_detalle_orden` SET comentario = null, id_usuario = '" + idUsario + "' WHERE id_detalle_orden= '"+idDetalleOrden+"'";
                    }else{
                        sql = "UPDATE `tbl_detalle_orden` SET comentario = '" + comentario + "', id_usuario = '" + idUsario + "' WHERE id_detalle_orden= '"+idDetalleOrden+"'";
                    }
                }   
                        connection.query(sql, function (err, result, fie) {
                            if (err) {
                                console.log('error en la conexion intente de nuevo', err)
                                res.send('3')
                                
                            }else{
                                resolve('1')
                            }
                        })
            }else if(busqueda == "1"){
                if(idUsario == null || idUsario == "null"){
                    //console.log("vvvvvvvv")
                    sql = "UPDATE `tbl_detalle_orden` SET comentario = '" + comentario + "' WHERE id_detalle_orden= '"+idDetalleOrden+"'";
                }else{
                    if(comentario == null || comentario == ''){
                        //console.log("aaaaaaaaa")
                        sql = "UPDATE `tbl_detalle_orden` SET comentario = null, id_usuario = '" + idUsario + "' WHERE id_detalle_orden= '"+idDetalleOrden+"'";
                    }else{
                        //console.log("vqqqqqqqq")
                        sql = "UPDATE `tbl_detalle_orden` SET comentario = '" + comentario + "', id_usuario = '" + idUsario + "' WHERE id_detalle_orden= '"+idDetalleOrden+"'";
                    }
                }   
                    connection.query(sql, function (err, result, fie) {
                        if (err) {
                            console.log('error en la conexion intente de nuevo', err)
                            res.send('3')
                            
                        }else{
                            //console.log("##############################")
                            resolve('1')
                        }
                    })

            }else{
                //console.log("9111111111111111111111111111111")
                resolve('1');
            }
        });
    }

    async function buscarComentario(idDetalleOrden){
        return new Promise((resolve, reject) => {
            const sql = "SELECT comentario FROM tbl_detalle_orden WHERE id_detalle_orden = '" +idDetalleOrden+"'";
            connection.query(sql, function (err, result, fie) {
                if (err) {
                    console.log('error en la conexion intente de nuevo', err)
                    res.send('3')
                    
                }else{
                    //console.log("999999999999999999999999999999999999999999999999", result)
                    if(result[0].comentario != null && result[0].comentario != "null"){
                        //console.log("PASO A 1 EN COMENTARIO")
                        resolve('1')
                    }else{
                        //console.log("PASO A 0 EN COMENTARIO")
                        resolve('0')
                    }  
                }
            })
        })
    }

        async function extraerDatosPaciente(body){
            return new Promise((resolve, reject) => {
                const sql = "SELECT tbl_detalle_orden.id_detalle_orden, tbl_detalle_orden.id_orden, tbl_detalle_orden.id_detalle_factura_paciente, tbl_detalle_orden.comentario, tbl_detalle_orden.id_usuario, tbl_detalle_orden.id_usuario_modificado, tbl_orden.id_orden, tbl_orden.numero_orden, tbl_orden.orden_qr, tbl_orden.orden_qr_nube, date_format(tbl_orden.fecha,'%d-%m-%Y') AS fecha, tbl_detalle_factura_paciente.id_detalle_factura_paciente, tbl_detalle_factura_paciente.id_factura, tbl_detalle_factura_paciente.id_paciente, tbl_paciente.paciente_nombre, tbl_paciente.paciente_apellido, tbl_paciente.paciente_cedula, tbl_paciente.edad, tbl_paciente.paciente_telefono, tbl_paciente.genero, tbl_genero.genero_nombre FROM tbl_detalle_orden LEFT JOIN tbl_orden ON tbl_detalle_orden.id_orden = tbl_orden.id_orden LEFT JOIN tbl_detalle_factura_paciente ON tbl_detalle_factura_paciente.id_detalle_factura_paciente = tbl_detalle_orden.id_detalle_factura_paciente LEFT JOIN tbl_paciente ON tbl_paciente.id_paciente = tbl_detalle_factura_paciente.id_paciente LEFT JOIN tbl_genero ON tbl_paciente.genero = tbl_genero.id_genero WHERE tbl_detalle_orden.id_detalle_orden = '" +body[0].examenes[0].examen.id_detalle_orden+"'";
                //console.log('nomnbre!!!', body[0].examenes[0].examen.id_detalle_orden)
                //const 
                //const 
                connection.query(sql, function (err, result, fie) {
                    if (err) {
                        console.log('error en la conexion intente de nuevo', err)
                        res.send('3')
                        
                    }else{
                        let detalleOrden = result
                        //console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXXX", detalleOrden)
                        resolve(detalleOrden)
                    }
                })
            });
        }
        ///////////////////PARA EXAMENES///////////////////
        async function modificarResultadoMongo(body, paciente, resultado){
            return new Promise(async (resolve, reject) => {
            await resultadoModel.findOneAndUpdate(
                {_id: resultado._id},
                {$set:{   
                        resultados: body,
                        datosPaciente: paciente,
                        qr_documento: paciente[0].orden_qr_nube,
                        qr_orden: paciente[0].orden_qr,
                        fecha_orden: paciente[0].fecha_orden,
                        tipo: 1,
                        modificado: 0
                    }
                })
                resolve("1")
            })
        }

        async function buscarResultado(qrOrden){
            return new Promise((resolve, reject) => {
                let resultado;
                resultado = resultadoModel.findOne({qr_orden: qrOrden});
                //console.log("RESULTADO", cliente)
                resolve(resultado);
            });
        }
}

resultadosCtrl.guardarResultadosExamenes = async(req, res) =>{
    //console.log(req.body);
    //console.log(req.body[0].examenes)
    //console.log(req.body[0].examenes[0].examen.pruebas)
    //res.send(req.body)
    //console.log(req.body[0].examenes[0].examen.pruebas);
    //res.send();
    //const resultados = req.body.examenes[0].pruebas;
    let memory = req.body[0].examenes[0].examen.pruebas;
    let conteo = 0;
    for(let i=0; i<req.body.length; i++){
        for(let j=0; j<req.body[i].examenes.length; j++){
            for(let k=0; k<req.body[i].examenes[j].examen.pruebas.length;k++){
                conteo++;
            }
        }
    }
    let myValues = new Array(conteo);
    let c = 0;
    for(let i=0; i<req.body.length; i++){
        //console.log('EN I/////////////////////////////////////////////')
            //console.log(req.body[0])
        for(let j=0; j<req.body[i].examenes.length; j++){
            //console.log('EN J/////////////////////////////////////////////')
            //console.log(req.body[i].examenes[j].examen.id_detalle_orden)
            for(let k=0; k<req.body[i].examenes[j].examen.pruebas.length;k++){
                //console.log('EN K/////////////////////////////////////////////')
                //console.log(req.body[i].examenes[j].examen.pruebas.length)
                //console.log(req.body[i].examenes[j].examen.pruebas[k].id_detalle_examen_prueba)
                //console.log(req.body[i].examenes[j].examen.pruebas[k].resultado)
                myValues[c] = new Array(3);
                //console.log(myValues);
                myValues[c][0]= req.body[i].examenes[j].examen.id_detalle_orden;
                myValues[c][1]= req.body[i].examenes[j].examen.pruebas[k].id_detalle_examen_prueba;
                myValues[c][2]= req.body[i].examenes[j].examen.pruebas[k].resultado;
                myValues[c][3] = req.body[i].examenes[j].examen.pruebas[k].valor_de_referencia;
                c++;
            }
        }
    }
    //console.log(myValues, conteo)
    const sql = 'INSERT INTO tbl_resultado (id_detalle_orden, id_detalle_examen_prueba, resultado, valor_referencia) VALUES?';
    connection.query(sql, [myValues], (err, result) => {
        if (err) {
            console.log('no se pudo a agregar', err)
            res.send('3')
        } else {
            //console.log('agrego el detalle de orden!!', result)
            //res.send('AGREGO!');
            comentarios();
        }
    });

    async function comentarios(){
        let comentario;
        let idUsario;
        let idDetalleOrden;
        let detalleOrdenMongo;
        for(let i=0; i<req.body.length; i++){
            for(let j=0; j<req.body[i].examenes.length; j++){
                //console.log("comentario", req.body[i].examenes[j].examen.comentario);
                //console.log("idDetalleOrden", req.body[i].examenes[j].examen.id_detalle_orden);
                comentario = req.body[i].examenes[j].examen.comentario;
                idDetalleOrden = req.body[i].examenes[j].examen.id_detalle_orden;
                idUsario = req.body[i].examenes[j].examen.id_usuario;
                await guardarComentarioUsuario(comentario, idDetalleOrden, idUsario)
            }
        }
        detalleOrdenMongo = await extraerDatosPaciente(req.body)
        //console.log("!!!!!!!!!!!!!!!!!---------------!!!!!!!!!!!!!!!!!!", detalleOrdenMongo)
        await guardarResultadosMongo(req.body, detalleOrdenMongo)
        res.send('1');
    }

    async function guardarComentarioUsuario(comentario, idDetalleOrden, idUsario){
        //console.log("comentarioZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ", comentario, idDetalleOrden, idUsario);
        let sql;
        if(idUsario == null){
            sql = "UPDATE `tbl_detalle_orden` SET comentario = '" + comentario + "', id_usuario = null WHERE id_detalle_orden= '"+idDetalleOrden+"'";
        }else{
            if(comentario == null || comentario == ''){
                sql = "UPDATE `tbl_detalle_orden` SET comentario = null, id_usuario = '" + idUsario + "' WHERE id_detalle_orden= '"+idDetalleOrden+"'";
            }else{
                sql = "UPDATE `tbl_detalle_orden` SET comentario = '" + comentario + "', id_usuario = '" + idUsario + "' WHERE id_detalle_orden= '"+idDetalleOrden+"'";
            }
        }   
        //console.log("comentario", comentario, idDetalleOrden, idUsario);
        //console.log("detalle orden", idDetalleOrden);
        return new Promise((resolve, reject) => {
                //console.log('nomnbre!!!', query)
                //const 
                //const 
                connection.query(sql, function (err, result, fie) {
                    if (err) {
                        console.log('error en la conexion intente de nuevo', err)
                        res.send('3')
                        
                    }else{
                        resolve('1')
                    }
                })
        });
    }

    async function extraerDatosPaciente(body){
            return new Promise((resolve, reject) => {
                const sql = "SELECT tbl_detalle_orden.id_detalle_orden, tbl_detalle_orden.id_orden, tbl_detalle_orden.id_detalle_factura_paciente, tbl_detalle_orden.comentario, tbl_detalle_orden.id_usuario, tbl_detalle_orden.id_usuario_modificado, tbl_orden.id_orden, tbl_orden.numero_orden, tbl_orden.orden_qr, tbl_orden.orden_qr_nube, date_format(tbl_orden.fecha,'%d-%m-%Y') AS fecha, tbl_detalle_factura_paciente.id_detalle_factura_paciente, tbl_detalle_factura_paciente.id_paciente, tbl_detalle_factura_paciente.id_factura, tbl_paciente.paciente_nombre, tbl_paciente.paciente_apellido, tbl_paciente.paciente_cedula, tbl_paciente.edad, tbl_paciente.paciente_telefono, tbl_paciente.genero, tbl_genero.genero_nombre FROM tbl_detalle_orden LEFT JOIN tbl_orden ON tbl_detalle_orden.id_orden = tbl_orden.id_orden LEFT JOIN tbl_detalle_factura_paciente ON tbl_detalle_factura_paciente.id_detalle_factura_paciente = tbl_detalle_orden.id_detalle_factura_paciente LEFT JOIN tbl_paciente ON tbl_paciente.id_paciente = tbl_detalle_factura_paciente.id_paciente LEFT JOIN tbl_genero ON tbl_paciente.genero = tbl_genero.id_genero WHERE tbl_detalle_orden.id_detalle_orden = '" +body[0].examenes[0].examen.id_detalle_orden+"'";
                //console.log('nomnbre!!!', body[0].examenes[0].examen.id_detalle_orden)
                //const 
                //const 
                connection.query(sql, function (err, result, fie) {
                    if (err) {
                        console.log('error en la conexion intente de nuevo', err)
                        res.send('3')
                        
                    }else{
                        let detalleOrden = result
                        //console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXXX", detalleOrden)
                        resolve(detalleOrden)
                    }
                })
            });
    }

    async function guardarResultadosMongo(body, detalleOrdenMongo){
        return new Promise((resolve, reject) => {
            const cliente = resultadoModel({
                resultados: 		body,
                datosPaciente:   	detalleOrdenMongo,
                qr_documento:       detalleOrdenMongo[0].orden_qr_nube,
                qr_orden:           detalleOrdenMongo[0].orden_qr,
                fecha_orden:        detalleOrdenMongo[0].fecha_orden,
                tipo:               1,
                modificado:         1,
                subido:             0
            })

            try {
                cliente.save();
                resolve("1")
            } catch (error) {
                resolve("0")
            }
        })
    }
}

resultadosCtrl.guardarResultadosAntibioticos = async(req, res) =>{
             let conteo = 0;
             let detalleOrdenMongo;
             // console.log("EL ITEMBACTERIA", req.body)
             // console.log("EL ITEMBACTERIA", req.body.bacterias)
             // console.log("EL ITEMBACTERIA", req.body.bacterias[0])
             // console.log("EL ITEMBACTERIA", req.body.bacterias[0].bacteriaItem)
             // console.log("EL ITEMBACTERIA", req.body.bacterias[0].bacteriaItem.antibioticos)
             for(const item of req.body.bacterias){
                 for(const itemBacteria of item.bacteriaItem.antibioticos){
                     //console.log("itemBacteria!!", itemBacteria.id_detalle_cultivo_bacteria_antibiotico, req.body.id_detalle_orden, itemBacteria.resultado)
                     await insertarResultado(itemBacteria.id_detalle_cultivo_bacteria_antibiotico, req.body.id_detalle_orden, itemBacteria.resultado)
                 }
             }
           await guardarComentario(req.body.comentario, req.body.id_detalle_orden, req.body.id_usuario)
           detalleOrdenMongo = await extraerDatosPaciente(req.body)
           //console.log("!!!!!!!!!!!!!!!!!---------------!!!!!!!!!!!!!!!!!!", detalleOrdenMongo)
           await guardarResultadosMongo(req.body, detalleOrdenMongo)
           res.send("1")
        
    async function extraerDatosPaciente(body){
            return new Promise((resolve, reject) => {
                const sql = "SELECT tbl_detalle_orden.id_detalle_orden, tbl_detalle_orden.id_orden, tbl_detalle_orden.id_detalle_factura_paciente, tbl_detalle_orden.comentario, tbl_detalle_orden.id_usuario, tbl_detalle_orden.id_usuario_modificado, tbl_orden.id_orden, tbl_orden.numero_orden, tbl_orden.orden_qr, tbl_orden.orden_qr_nube, date_format(tbl_orden.fecha,'%d-%m-%Y') AS fecha, tbl_detalle_factura_paciente.id_detalle_factura_paciente, tbl_detalle_factura_paciente.id_paciente, tbl_detalle_factura_paciente.id_factura, tbl_paciente.paciente_nombre, tbl_paciente.paciente_apellido, tbl_paciente.paciente_cedula, tbl_paciente.edad, tbl_paciente.paciente_telefono, tbl_paciente.genero, tbl_genero.genero_nombre FROM tbl_detalle_orden LEFT JOIN tbl_orden ON tbl_detalle_orden.id_orden = tbl_orden.id_orden LEFT JOIN tbl_detalle_factura_paciente ON tbl_detalle_factura_paciente.id_detalle_factura_paciente = tbl_detalle_orden.id_detalle_factura_paciente LEFT JOIN tbl_paciente ON tbl_paciente.id_paciente = tbl_detalle_factura_paciente.id_paciente LEFT JOIN tbl_genero ON tbl_paciente.genero = tbl_genero.id_genero WHERE tbl_detalle_orden.id_detalle_orden = '" +body.id_detalle_orden+"'";
                //console.log('nomnbre!!!', body.id_detalle_orden)
                //const 
                //const 
                connection.query(sql, function (err, result, fie) {
                    if (err) {
                        console.log('error en la conexion intente de nuevo', err)
                        res.send('3')
                        
                    }else{
                        let detalleOrden = result
                        //console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXXX", detalleOrden)
                        resolve(detalleOrden)
                    }
                })
            });
    }
    /////////////////para resultados cultivos/////////////////////
    async function guardarResultadosMongo(body, detalleOrdenMongo){
        //console.log("EL BODYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY......................................................Y", body, detalleOrdenMongo)
        return new Promise((resolve, reject) => {
            let idUniq = uniqid();
            const cliente = resultadoModel({
                resultados: 		body,
                datosPaciente:   	detalleOrdenMongo,
                qr_documento:       detalleOrdenMongo[0].orden_qr_nube,
                qr_orden:           detalleOrdenMongo[0].orden_qr,
                fecha_orden:        detalleOrdenMongo[0].fecha_orden,
                tipo:               2,
                modificado:         1,
                subido:             0
            })

            try {
                cliente.save();
                resolve("1")
            } catch (error) {
                resolve("0")
            }
        })
    }
    
        async function insertarResultado(id_detalle_cultivo_bacteria_antibiotico, id_detalle_orden, resultado){
            return new Promise((resolve, reject) => {
                //console.log("EN INSERTAR RESULTADO!", id_detalle_cultivo_bacteria_antibiotico, id_detalle_orden, resultado)
                connection.query('INSERT INTO `tbl_resultado` SET?', {
                    id_detalle_cultivo_bacteria_antibiotico: id_detalle_cultivo_bacteria_antibiotico,
                    id_detalle_orden: id_detalle_orden,
                    resultado: resultado,
                }, (err, result) => {
                    if (err) {
                        console.log('no se pudo a agregar', err)
                        //res.send('ERROR EN AGREGAR FACTURA!')
                    } else {
                        //console.log('agrego!!', result)
                        //res.send('AGREGO FACTURA!')
                        resolve("1");
                    }
                });
            });
        }

    async function guardarComentario(comentario, idDetalleOrden, idUsario){
        return new Promise((resolve, reject) => {
                //console.log("comentario", comentario);
                //console.log("detalle orden", idDetalleOrden);
                //console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!", idUsario)
                let sql;

                    if(comentario == null || comentario == ''){
                        if(idUsario == null || idUsario == 'null'){
                            sql = "UPDATE `tbl_detalle_orden` SET comentario = null, id_usuario = null WHERE id_detalle_orden= '"+idDetalleOrden+"'";
                        }else{
                            sql = "UPDATE `tbl_detalle_orden` SET comentario = null, id_usuario = '" + idUsario + "' WHERE id_detalle_orden= '"+idDetalleOrden+"'";
                        }
                    }else{
                        if(idUsario == null || idUsario == 'null'){
                            sql = "UPDATE `tbl_detalle_orden` SET comentario = '" + comentario + "', id_usuario = null WHERE id_detalle_orden= '"+idDetalleOrden+"'";
                        }else{
                            sql = "UPDATE `tbl_detalle_orden` SET comentario = '" + comentario + "', id_usuario = '" + idUsario + "' WHERE id_detalle_orden= '"+idDetalleOrden+"'";
                        }
                    }
                connection.query(sql, function (err, result, fie) {
                    if (err) {
                        console.log('error en la conexion intente de nuevo', err)
                        res.send('3')
                        
                    }else{
                        resolve('1')
                    }
                })
        });
    }
}

resultadosCtrl.modificarResultadosAntibioticos = async(req, res) =>{
    let conteo = 0;
    let validador = 0;
    let resultado;
    let paciente;
    //console.log("EL ITEMBACTERIA", req.body)
    //console.log("EL ITEMBACTERIA", req.body.bacterias)
    //console.log("EL ITEMBACTERIA", req.body.bacterias[0])
    //console.log("EL ITEMBACTERIA", req.body.bacterias[0].bacteriaItem)
    //console.log("EL ITEMBACTERIA", req.body.bacterias[0].bacteriaItem.antibioticos)
    for(const item of req.body.bacterias){
        for(const itemBacteria of item.bacteriaItem.antibioticos){
            //console.log("itemBacteria!!", itemBacteria.id_detalle_cultivo_bacteria_antibiotico, req.body.id_detalle_orden, itemBacteria.resultado)
            validador = await revisarResultados(itemBacteria.id_detalle_cultivo_bacteria_antibiotico, req.body.id_detalle_orden)
            //console.log("EL VALIDADOR", validador)
            if(validador == 1){
                await modificarResultado(itemBacteria.id_detalle_cultivo_bacteria_antibiotico, req.body.id_detalle_orden, itemBacteria.resultado)
            }else if(validador == 2){
                await insertarResultado(itemBacteria.id_detalle_cultivo_bacteria_antibiotico, req.body.id_detalle_orden, itemBacteria.resultado)
            }
        }
    }
  await guardarComentario(req.body.comentario, req.body.id_detalle_orden, req.body.id_usuario)
  //console.log("TE ESTOY MANDANDO EL UNO!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!", req.body.id_usuario)
  paciente = await extraerDatosPaciente(req.body)
  resultado = await buscarResultado(paciente)
  if(resultado != null){
    //console.log("??????????????????????????????????????????????")
      await modificarResultadoMongo(req.body, paciente, resultado)
  }
  res.send("1")

    async function extraerDatosPaciente(body){
        return new Promise((resolve, reject) => {
            const sql = "SELECT tbl_detalle_orden.id_detalle_orden, tbl_detalle_orden.id_orden, tbl_detalle_orden.id_detalle_factura_paciente, tbl_detalle_orden.comentario, tbl_detalle_orden.id_usuario, tbl_detalle_orden.comentario, tbl_detalle_orden.id_usuario_modificado, tbl_orden.id_orden, tbl_orden.numero_orden, tbl_orden.orden_qr, tbl_orden.orden_qr_nube, date_format(tbl_orden.fecha,'%d-%m-%Y') AS fecha, tbl_detalle_factura_paciente.id_detalle_factura_paciente, tbl_detalle_factura_paciente.id_paciente, tbl_detalle_factura_paciente.id_factura, tbl_paciente.paciente_nombre, tbl_paciente.paciente_apellido, tbl_paciente.paciente_cedula, tbl_paciente.edad, tbl_paciente.paciente_telefono, tbl_paciente.genero, tbl_genero.genero_nombre FROM tbl_detalle_orden LEFT JOIN tbl_orden ON tbl_detalle_orden.id_orden = tbl_orden.id_orden LEFT JOIN tbl_detalle_factura_paciente ON tbl_detalle_factura_paciente.id_detalle_factura_paciente = tbl_detalle_orden.id_detalle_factura_paciente LEFT JOIN tbl_paciente ON tbl_paciente.id_paciente = tbl_detalle_factura_paciente.id_paciente LEFT JOIN tbl_genero ON tbl_paciente.genero = tbl_genero.id_genero WHERE tbl_detalle_orden.id_detalle_orden = '" +body.id_detalle_orden+"'";
            //console.log('nomnbre!!!', body[0].examenes[0].examen.id_detalle_orden)
            //const 
            //const 
            connection.query(sql, function (err, result, fie) {
                if (err) {
                    console.log('error en la conexion intente de nuevo', err)
                    res.send('3')
                    
                }else{
                    let detalleOrden = result
                    //console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXXX", detalleOrden)
                    resolve(detalleOrden)
                }
            })
        });
    }

    async function buscarResultado(paciente){
        //console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", req.body.id_detalle_orden);
        //console.log("[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[", paciente)
            let resultado, resultadoCheck;
            resultado = await resultadoModel.find({qr_orden: paciente[0].orden_qr, tipo: 2, "resultados.id_detalle_orden": req.body.id_detalle_orden});
            //console.log("-------------------------------------------------------------------------------", resultado)
            for(const item of resultado){
                if(item.datosPaciente[0].id_detalle_orden == paciente[0].id_detalle_orden){
                    resultadoCheck = item
                    break;
                }
            }
            //console.log("RESULTADO", cliente)
            return resultadoCheck;
    }

    /*async function modificarResultadoMongo(body, paciente, resultado){
        return new Promise((resolve, reject) => {
            console.log("EEEEEEEEEEEEEEEEEEEEE", resultado)

            resultado.overwrite({
                resultados: 		body,
                datosPaciente:   	paciente,
                qr_documento:       paciente.orden_qr_nube,
                qr_orden:           paciente.orden_qr,
                tipo:               2
        });
            
            try {
                resultado.save();
                resolve("1")
            } catch (error) {
                resolve("0");
            }
            
        })
    }*/

      async function extraerDatosPaciente(body){
        return new Promise((resolve, reject) => {
            const sql = "SELECT tbl_detalle_orden.id_detalle_orden, tbl_detalle_orden.id_orden, tbl_detalle_orden.id_detalle_factura_paciente, tbl_detalle_orden.comentario, tbl_detalle_orden.id_usuario, tbl_detalle_orden.id_usuario_modificado, tbl_orden.id_orden, tbl_orden.numero_orden, tbl_orden.orden_qr, tbl_orden.orden_qr_nube, date_format(tbl_orden.fecha,'%d-%m-%Y') AS fecha, tbl_detalle_factura_paciente.id_detalle_factura_paciente, tbl_detalle_factura_paciente.id_paciente, tbl_detalle_factura_paciente.id_factura, tbl_paciente.paciente_nombre, tbl_paciente.paciente_apellido, tbl_paciente.paciente_cedula, tbl_paciente.edad, tbl_paciente.paciente_telefono, tbl_paciente.genero, tbl_genero.genero_nombre FROM tbl_detalle_orden LEFT JOIN tbl_orden ON tbl_detalle_orden.id_orden = tbl_orden.id_orden LEFT JOIN tbl_detalle_factura_paciente ON tbl_detalle_factura_paciente.id_detalle_factura_paciente = tbl_detalle_orden.id_detalle_factura_paciente LEFT JOIN tbl_paciente ON tbl_paciente.id_paciente = tbl_detalle_factura_paciente.id_paciente LEFT JOIN tbl_genero ON tbl_paciente.genero = tbl_genero.id_genero WHERE tbl_detalle_orden.id_detalle_orden = '" +body.id_detalle_orden+"'";
            //console.log('nomnbre!!!', body.id_detalle_orden)
            //const 
            //const 
            connection.query(sql, function (err, result, fie) {
                if (err) {
                    console.log('error en la conexion intente de nuevo', err)
                    res.send('3')
                    
                }else{
                    let detalleOrden = result
                    //console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXXX", detalleOrden)
                    resolve(detalleOrden)
                }
            })
        });
    }

   /* async function buscarResultado(qrOrden){
        return new Promise((resolve, reject) => {
            let resultado;
            resultado = resultadoModel.findOne({qr_orden: qrOrden});
            //console.log("RESULTADO", cliente)
            resolve(resultado);
        });
    }*/

    async function modificarResultadoMongo(body, paciente, resultado){
        return new Promise(async (resolve, reject) => {
            //console.log("EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE", paciente)
            /*console.log("EEEEEEEEEEEEEEEEEEEEE",resultado, body,
            paciente,
            paciente[0].orden_qr_nube,
            paciente[0].orden_qr,
            paciente[0].fecha_orden,
            1,
            0)*/
           /*resultado.overwrite({
                resultados: body,
                datosPaciente: paciente,
                qr_documento: paciente[0].orden_qr_nube,
                qr_orden: paciente[0].orden_qr,
                fecha_orden: paciente[0].fecha_orden,
                tipo: 2,
                subido: 0,
                modificado: 0
        });*/
        await resultadoModel.findOneAndUpdate(
                {_id: resultado._id},
                {   
                    resultados: body,
                    datosPaciente: paciente,
                    qr_documento: paciente[0].orden_qr_nube,
                    qr_orden: paciente[0].orden_qr,
                    fecha_orden: paciente[0].fecha_orden,
                    tipo: 2,
                    modificado: 0
                })
                resolve("1")
            /*try {
                //resultado.update();
                resultado.save();
                resolve("1")
            } catch (error) {
                resolve("0");
            }*/
            
        })
    }

  async function revisarResultados(id_detalle_cultivo_bacteria_antibiotico, idDetalleOrden){

    return new Promise((resolve, reject) => {
        const sql = "SELECT COUNT(id_detalle_orden) AS conteo FROM `tbl_resultado` WHERE id_detalle_orden = '" + idDetalleOrden + "' AND id_detalle_cultivo_bacteria_antibiotico= '"+id_detalle_cultivo_bacteria_antibiotico+"'";
        connection.query(sql, function (err, result, fie) {
            if (err) {
                console.log('error en la conexion intente de nuevo', err)
                res.send('3')
            }
        //console.log(req.body[0].examenes[0].examen.id_detalle_orden)
            //console.log('el conteo: ', result)
            //res.send(result);
            if(result[0].conteo > 0){
                //console.log('MODIFICAR!');
                validador = 1;
                resolve(validador)
            }else if(result[0].conteo <= 0){
                //console.log('CREAR!')
                validador = 2;
                resolve(validador)   
            }
        })
    });

  }

  async function modificarResultado(id_detalle_cultivo_bacteria_antibiotico, id_detalle_orden, resultado){
    //console.log("ENTRO PARA ACA?")
    //console.log("EN INSERTAR RESULTADO MODIFICAR!", id_detalle_cultivo_bacteria_antibiotico, id_detalle_orden, resultado)
        return new Promise((resolve, reject) => {
            const sql = "UPDATE `tbl_resultado` SET resultado = '" + resultado +"' WHERE id_detalle_orden= '"+id_detalle_orden+"' AND id_detalle_cultivo_bacteria_antibiotico= '" + id_detalle_cultivo_bacteria_antibiotico +"'";
            connection.query(sql, function (err, result, fie) {
                if (err) {
                    console.log('error en la conexion intente de nuevo', err)
                    res.send('3')
                }else{
                    //console.log('Resultado Modificado')
                    resolve('1')
                }
            })
        });
}

    async function insertarResultado(id_detalle_cultivo_bacteria_antibiotico, id_detalle_orden, resultado){
        return new Promise((resolve, reject) => {
                    //console.log("EN INSERTAR RESULTADO!", id_detalle_cultivo_bacteria_antibiotico, id_detalle_orden, resultado)
                    connection.query('INSERT INTO `tbl_resultado` SET?', {
                        id_detalle_cultivo_bacteria_antibiotico: id_detalle_cultivo_bacteria_antibiotico,
                        id_detalle_orden: id_detalle_orden,
                        resultado: resultado,
                    }, (err, result) => {
                        if (err) {
                            console.log('no se pudo a agregar', err)
                            //res.send('ERROR EN AGREGAR FACTURA!')
                        } else {
                            //console.log('agrego!!', result)
                            //res.send('AGREGO FACTURA!')
                            resolve("1");
                        }
                    });
        });    
    }

    async function guardarComentario(comentario, idDetalleOrden, idUsario){
    return new Promise((resolve, reject) => {
        //console.log("comentario", comentario);
        //console.log("detalle orden", idDetalleOrden);
        //console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!", idUsario)
        let sql;

        if(idUsario == null || idUsario == 'null'){
            sql = "UPDATE `tbl_detalle_orden` SET comentario = '" + comentario + "', id_usuario = null WHERE id_detalle_orden= '"+idDetalleOrden+"'";
        } else if(comentario == null || comentario == ''){
                sql = "UPDATE `tbl_detalle_orden` SET comentario = null, id_usuario = '" + idUsario + "' WHERE id_detalle_orden= '"+idDetalleOrden+"'";
            }else{
                sql = "UPDATE `tbl_detalle_orden` SET comentario = '" + comentario + "', id_usuario = '" + idUsario + "' WHERE id_detalle_orden= '"+idDetalleOrden+"'";
            }
        connection.query(sql, function (err, result, fie) {
            if (err) {
                console.log('error en la conexion intente de nuevo', err)
                res.send('3')
                
            }else{
                resolve('1')
            }
        })
    });
    }
}

resultadosCtrl.habilitarCultivoMontado = async(req, res) =>{

    await habilitar(req.body.id_detalle_orden)
    let idOrden = await buscarOrden(req.body.id_detalle_orden)
    let detallesOrden = await clasificarOrden(idOrden)
    let memoryDetallesOrden = detallesOrden.length;
    let suma = 0;
    //console.log(detallesOrden)
    for(const detalle of detallesOrden){
        if(detalle.cultivo_montado == 1) suma++
    }
    if(memoryDetallesOrden == suma){
        //console.log("paso")
        let resp = await modificarOrden(idOrden);
        res.send(resp);
    }else{
        //console.log("no paso")
        res.send("1")
    }
    //res.send(detallesOrden);

    async function habilitar(idDetalleOrden){
        return new Promise((resolve, reject) => {
            const sqlUpdate = `UPDATE tbl_detalle_orden SET cultivo_montado = 1  WHERE id_detalle_orden = ${idDetalleOrden}`
            connection.query(sqlUpdate, function (err, result, fie) {
                if (err) {
                    console.log('error en la conexion intente de nuevo', err)
                    res.send('3')
                    
                }else{
                    resolve("1")
                }
            })
        });
    }

    async function buscarOrden(idDetalleOrden){
        return new Promise((resolve, reject) => {
            const sql = `SELECT id_orden FROM tbl_detalle_orden WHERE id_detalle_orden = ${idDetalleOrden}`
            connection.query(sql, function (err, result, fie) {
                if (err) {
                    console.log('error en la conexion intente de nuevo', err)
                    res.send('3')
                    
                }else{
                    resolve(result[0].id_orden)
                }
            })
        })
    }

    async function clasificarOrden(idOrden){
        return new Promise((resolve, reject) => {
            const sql = `SELECT tbl_detalle_orden.id_detalle_factura_paciente, tbl_detalle_orden.cultivo_montado, tbl_detalle_factura_paciente.id_cultivo FROM tbl_detalle_orden LEFT JOIN tbl_detalle_factura_paciente ON tbl_detalle_factura_paciente.id_detalle_factura_paciente = tbl_detalle_orden.id_detalle_factura_paciente WHERE tbl_detalle_factura_paciente.id_cultivo IS NOT NULL AND tbl_detalle_orden.id_orden = ${idOrden}`
            connection.query(sql, function (err, result, fie) {
                if (err) {
                    console.log('error en la conexion intente de nuevo', err)
                    res.send('3')
                    
                }else{
                    resolve(result)
                }
            })
        })
    }

    async function modificarOrden(idOrden){
        return new Promise((resolve, reject) => {
            const sql = `UPDATE tbl_orden SET cultivos_montados = 1 WHERE id_orden = ${idOrden}`
            connection.query(sql, function (err, result, fie) {
                if (err) {
                    console.log('error en la conexion intente de nuevo', err)
                    res.send('3')
                    
                }else{
                    resolve("1")
                }
            })
        })
    }

}

resultadosCtrl.imprimirResultados = async(req, res) =>{
    //////////PARA GUARDAR IMPRESION///////////////
    if(req.body.accion == "1"){
        let puede = 0
        impresionesTemplate.impresiones.forEach(impresion => {
            if(impresion.numeroAleatorio == req.body.numeroAleatorio){
                puede = 1
            }
        })
        if(puede == 1){
            res.send("0")
        }else{
            let impresion = {...req.body};
            impresionesTemplate.impresiones.push(impresion);
            console.log(impresionesTemplate.impresiones)
            res.send("1")
        }

    }else if(req.body.accion == "2"){
    //////////PARA IMPRIMIR IMPRESION////////////////
    let impresionVar = "0"
        impresionesTemplate.impresiones.forEach(impresion => {
            impresionesTemplate.impresiones.forEach(function(impresion, index){
                if(impresion.numeroAleatorio == req.body.numeroAleatorio){
                    impresionVar = {...impresion}
                    impresionesTemplate.impresiones.splice(index);
                }
            })
        })
        //console.log(impresionesTemplate.impresiones)
        //console.log(impresionVar)
        res.send(impresionVar)
    }
}



module.exports = resultadosCtrl;