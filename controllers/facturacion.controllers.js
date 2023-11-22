const facturacionCtrl = {};
const session = require('express-session');
const { updateLocale } = require('moment');
const connection = require('../src/database');
const config = require('../src/config');
const uniqid = require('uniqid');
const qrcode = require('qrcode');
const path = require('path');
const { examenes } = require('./perfExamPrueCult.controllers');
const { DATETIME, TIMESTAMP, DATETIME2 } = require('mysql/lib/protocol/constants/types');
const PrintNodeClient = require('printnode-client/index.js');
const { response } = require('../src/app');
const { resolve } = require('path');
const { timeEnd } = require('console');
global.WebSocket = require('ws');
const qz = require("qz-tray");
let QRCode = require('qrcode');
const bwipjs = require('bwip-js');
const axios = require('axios').default;
const ip = require('ip');
var os = require('os');
const getenv = require('getenv');
const facturaModel = require("../models/facturas");
const clienteModel = require("../models/clientes");
const { detallesRecibo } = require('./recibo.controllers');
const keygenerator = require('keygenerator');

facturacionCtrl.pruebaQr = async(req, res) =>{
      let ipSocket, ipNormal, ip, ipDef;
      ipSocket = req.socket.remoteAddress;
      ipNormal = req.ip;

      ipNormal = ipNormal.split(":");
      ipDef = ipNormal[3];
      //ipNormal = "192.168.1.64"
      //ipDef = ipNormal;
     //console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX", ipSocket);
     //console.log("ipNormal!", ipNormal)
     //console.log("SPLIT!", ipDef)
     //console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX", req);

     axios.get('http://localhost:3000/ordenesImpresion/121')
     .then(function (response) {
         imprimirFacturaOrdenes(response.data)
      })

    function imprimirFacturaOrdenes(respOrdenes){
        //console.log("JAJAJAJAJAJAJAJAJAJAJAJAJAJAJAJJAJAJAJAJAA", respOrdenes);
        let numOrdenes = respOrdenes.length;
        //console.log("DESDE LA FUNCION", ipDef);
        //http://'+ipDef+':5000/impresion
        axios.post('http://'+ipDef+':5000/impresion', {
           ordenes: respOrdenes,
           numero_impresiones: numOrdenes,
           id_factura: 119
         }).then(function (response) {
           //console.log(response.data);
   
           //res.send(response.data)
           res.redirect('/imprimirFactura/119/1');
         }).catch(function (error) {
            // handle error
            console.log(error);
            res.redirect('/imprimirFactura/'+factura+'/'+req.body.id_tipo_factura)
          })
    }

     
    
    /*let qr = {};
    qr = await QRCode.toDataURL('8902')
    .then(url => {
      //console.log(url)
      return url
    })
    .catch(err => {
      console.error(err)
    })*/
}

facturacionCtrl.facturas = async(req, res) =>{
    const sql = "SELECT tbl_factura.id_factura, tbl_factura.id_estado_factura, date_format(fecha_cancelacion, '%d-%m-%Y %T') AS fecha_cancelacion ,date_format(fecha_creacion_factura, '%d-%m-%Y %T') AS fecha_creacion_factura, date_format(fecha_creacion_orden_trabajo, '%d-%m-%Y %T') AS fecha_creacion_orden_trabajo, tbl_factura.id_cliente, tbl_factura.id_tipo_factura, tbl_factura.id_usuario, tbl_factura.numero_factura, tbl_factura.orden_trabajo, tbl_cliente.cliente_nombre, tbl_cliente.cliente_apellido, tbl_cliente.cedula_RIF, tbl_usuario.usuario_nombre, tbl_usuario.usuario_apellido, tbl_estado_factura.nombre, tbl_tipo_factura.tipo_factura_nombre FROM `tbl_factura` LEFT JOIN tbl_cliente ON tbl_cliente.id_cliente = tbl_factura.id_cliente LEFT JOIN tbl_usuario ON tbl_usuario.id_usuario = tbl_factura.id_usuario LEFT JOIN tbl_estado_factura ON tbl_estado_factura.id_estado_factura = tbl_factura.id_estado_factura LEFT JOIN tbl_tipo_factura ON tbl_factura.id_tipo_factura = tbl_tipo_factura.id_tipo_factura WHERE numero_factura > 0 AND (tbl_factura.id_estado_factura = 1 OR tbl_factura.id_estado_factura = 2)";
    let numFact;                                                                                                                                                                                                
    connection.query(sql, function (err, result, fields) {
        if (err) {
            console.log('ERROR en CheckTemplate', err);
            res.send('3');
        }
        if(result){
            res.send(result)
        }
    });
}

facturacionCtrl.ordenesDeTrabajo = async(req, res) =>{
    const sql = "SELECT tbl_factura.id_factura, tbl_factura.numero_factura, tbl_factura.id_estado_factura, date_format(fecha_cancelacion, '%d-%m-%Y %T') AS fecha_cancelacion ,date_format(fecha_creacion_factura, '%d-%m-%Y %T') AS fecha_creacion_factura, date_format(fecha_creacion_orden_trabajo, '%d-%m-%Y %T') AS fecha_creacion_orden_trabajo, tbl_factura.id_cliente, tbl_factura.id_tipo_factura, tbl_factura.id_usuario, tbl_factura.orden_trabajo, tbl_factura.orden_trabajo, tbl_cliente.cliente_nombre, tbl_cliente.cliente_apellido, tbl_cliente.cedula_RIF, tbl_usuario.usuario_nombre, tbl_usuario.usuario_apellido, tbl_estado_factura.nombre, tbl_tipo_factura.tipo_factura_nombre FROM `tbl_factura` LEFT JOIN tbl_cliente ON tbl_cliente.id_cliente = tbl_factura.id_cliente LEFT JOIN tbl_usuario ON tbl_usuario.id_usuario = tbl_factura.id_usuario LEFT JOIN tbl_estado_factura ON tbl_estado_factura.id_estado_factura = tbl_factura.id_estado_factura LEFT JOIN tbl_tipo_factura ON tbl_factura.id_tipo_factura = tbl_tipo_factura.id_tipo_factura WHERE orden_trabajo > 0";
    connection.query(sql, function (err, result, fields) {
        if (err) {
            console.log('ERROR en CheckTemplate', err);
            res.send('3');
        }
        if(result){
            res.send(result)
        }
    });
}

facturacionCtrl.facturasAnuladas = async(req, res) =>{
    const sql = "SELECT tbl_factura.id_factura, tbl_factura.id_estado_factura, date_format(fecha_cancelacion, '%d-%m-%Y') AS fecha_cancelacion ,date_format(fecha_creacion_factura, '%d-%m-%Y') AS fecha_creacion_factura, date_format(fecha_creacion_orden_trabajo, '%d-%m-%Y') AS fecha_creacion_orden_trabajo, tbl_factura.id_cliente, tbl_factura.id_tipo_factura, tbl_factura.id_usuario, tbl_factura.numero_factura, tbl_factura.orden_trabajo, tbl_cliente.cliente_nombre, tbl_cliente.cliente_apellido, tbl_cliente.cedula_RIF, tbl_usuario.usuario_nombre, tbl_usuario.usuario_apellido, tbl_estado_factura.nombre, tbl_tipo_factura.tipo_factura_nombre FROM `tbl_factura` INNER JOIN tbl_cliente ON tbl_cliente.id_cliente = tbl_factura.id_cliente INNER JOIN tbl_usuario ON tbl_usuario.id_usuario = tbl_factura.id_usuario INNER JOIN tbl_estado_factura ON tbl_estado_factura.id_estado_factura = tbl_factura.id_estado_factura INNER JOIN tbl_tipo_factura ON tbl_factura.id_tipo_factura = tbl_tipo_factura.id_tipo_factura WHERE (numero_factura > 0) AND (tbl_factura.id_estado_factura = 3)";
    let numFact;                                                                                                                                                                                                
    connection.query(sql, function (err, result, fields) {
        if (err) {
            console.log('ERROR en CheckTemplate', err);
            res.send('3');
        }
        if(result){
            res.send(result)
        }
    });
}

facturacionCtrl.facturasCredito = async(req, res) =>{
    const sql = "SELECT * FROM `tbl_factura` WHERE id_tipo_factura = 2";
    let numFact;
    connection.query(sql, function (err, result, fields) {
        if (err) {
            console.log('ERROR en CheckTemplate', err);
            res.send('3');
        }
        if(result){
            res.send(result)
        }
    });
}

facturacionCtrl.buscarFactura = async(req, res) =>{
    const sql = "SELECT tbl_factura.id_factura, tbl_factura.id_estado_factura, tbl_factura.anulacion_motivo, tbl_factura.id_usuario_anulacion, date_format(fecha_cancelacion, '%d-%m-%Y %T') AS fecha_cancelacion ,date_format(fecha_creacion_factura, '%d-%m-%Y %T') AS fecha_creacion_factura, date_format(fecha_creacion_orden_trabajo, '%d-%m-%Y %T') AS fecha_creacion_orden_trabajo, tbl_factura.id_cliente, tbl_factura.id_tipo_factura, tbl_factura.id_usuario, tbl_factura.numero_factura, tbl_factura.debe_dolares, tbl_factura.orden_trabajo, tbl_factura.total_bolivares, tbl_factura.total_dolares, tbl_factura.total_pesos, tbl_factura.tasa_bolivar_dia, tbl_factura.IGTF_bolivares, tbl_factura.IGTF_dolares, tbl_factura.IGTF_pesos, tbl_factura.tasa_pesos_dia, tbl_cliente.cliente_nombre, tbl_cliente.cliente_apellido, tbl_cliente.cedula_RIF, tbl_usuario.usuario_nombre, tbl_usuario.usuario_apellido, tbl_cliente.descuento_fijo, tbl_estado_factura.nombre, tbl_tipo_factura.tipo_factura_nombre FROM `tbl_factura` LEFT JOIN tbl_cliente ON tbl_cliente.id_cliente = tbl_factura.id_cliente LEFT JOIN tbl_usuario ON tbl_usuario.id_usuario = tbl_factura.id_usuario LEFT JOIN tbl_estado_factura ON tbl_estado_factura.id_estado_factura = tbl_factura.id_estado_factura LEFT JOIN tbl_tipo_factura ON tbl_factura.id_tipo_factura = tbl_tipo_factura.id_tipo_factura WHERE tbl_factura.id_factura='" +req.body.id_factura+"'";

    let numFact;
    connection.query(sql, async function (err, result, fields) {
        if (err) {
            console.log('ERROR en CheckTemplate', err);
            res.send('3');
        }
        if(result){
            //console.log("555555555555", result)
            //res.send(result)
            let detallesFiscales = result[0];
            let usuarioAnulacion;
            usuarioAnulacion = await buscarUsuarioAnulacion(usuarioAnulacion, detallesFiscales.id_factura)
            //console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!", usuarioAnulacion)
            detallesFiscales.usuario_nombre_anulacion = usuarioAnulacion.usuario_nombre,
            detallesFiscales.usuario_apellido_anulacion = usuarioAnulacion.usuario_apellido,
            detallesFiscales.usuario_cedula_anulacion = usuarioAnulacion.usuario_cedula
            buscarExamenesPacientes(detallesFiscales)
        }
    });

    async function buscarUsuarioAnulacion(usuarioAnulacion, idFactura){
        return new Promise((resolve, reject) => {
            const sql = "SELECT tbl_factura.id_usuario_anulacion, tbl_usuario.usuario_nombre, tbl_usuario.usuario_apellido, tbl_usuario.usuario_cedula FROM tbl_factura LEFT JOIN tbl_usuario ON tbl_usuario.id_usuario = tbl_factura.id_usuario_anulacion WHERE tbl_factura.id_factura = '" +idFactura+"'";
            connection.query(sql, function (err, result, fields) {
                if (err) {
                    console.log('ERROR en CheckTemplate', err);
                    res.send('3');
                }
                if(result){
                    usuarioAnulacion = result[0];
                    resolve(usuarioAnulacion);
                }
            })
        });
    }

    function buscarExamenesPacientes(detallesFiscales){
        const sql = "SELECT tbl_detalle_factura_paciente.id_examen, id_detalle_factura_paciente, tbl_examen.examen_nombre, tbl_examen.examen_precio, tbl_examen.examen_codigo, tbl_paciente.paciente_nombre, tbl_paciente.paciente_apellido, tbl_paciente.paciente_cedula FROM tbl_detalle_factura_paciente INNER JOIN `tbl_examen` ON tbl_examen.id_examen = tbl_detalle_factura_paciente.id_examen LEFT JOIN tbl_paciente ON tbl_detalle_factura_paciente.id_paciente = tbl_paciente.id_paciente WHERE tbl_detalle_factura_paciente.id_factura = '" +req.body.id_factura+"'";
        connection.query(sql, function (err, result, fields) {
            if (err) {
                console.log('ERROR en CheckTemplate', err);
                res.send('3');
            }
            if(result){
            /*
                //res.send(result)
                //let detallesFiscales = result[0];
                let sumadorDeExamenes = 0;
                //console.log('EL LENGTH', result.length)
                for(let i=0; i<result.length; i++){
                     sumadorDeExamenes = 0
                      //console.log("la I:",i);
                    for(let j=0; j<result.length; j++){
                        //console.log(j);
                        //console.log('ANTES DE J: ',sumadorDeExamenes);
                        if(result[j].examen_nombre != null && result[j].id_examen != null){
                            if(result[i].examen_nombre == result[j].examen_nombre){
                                sumadorDeExamenes++;
                                if(sumadorDeExamenes >= 2){
                                    //console.log('ENTRO: ',sumadorDeExamenes);
                                    //console.log(result[j])
                                    result[j].examen_nombre = null;
                                    result[j].id_examen = null;
                                    result[j].id_detalle_factura_paciente = null;
                                    //result.splice(j);
                                } 
                            }
                            if(j == result.length-1){
                                //console.log(j, result.length-1)
                                result[i].cantidad = sumadorDeExamenes;
                            }
                        }
                    }
                    //console.log('DESPUES DE J: ',sumadorDeExamenes);
                }
                */

                //let examenes = result.filter((item) => item.id_examen != null);
                let examenes = result;
                //res.send(examenes);
                buscarCultivosPacientes(detallesFiscales, examenes);
            }
        });
    }

    function buscarCultivosPacientes(detallesFiscales, examenes){
        const sql = "SELECT tbl_detalle_factura_paciente.id_cultivo, tbl_detalle_factura_paciente.id_detalle_factura_paciente, tbl_cultivo.cultivo_nombre, tbl_cultivo.cultivo_codigo, tbl_cultivo.cultivo_precio, tbl_paciente.paciente_nombre, tbl_paciente.paciente_apellido, tbl_paciente.paciente_cedula FROM tbl_detalle_factura_paciente INNER JOIN `tbl_cultivo` ON tbl_cultivo.id_cultivo = tbl_detalle_factura_paciente.id_cultivo LEFT JOIN tbl_paciente ON tbl_paciente.id_paciente = tbl_detalle_factura_paciente.id_paciente WHERE tbl_detalle_factura_paciente.id_factura = '" +req.body.id_factura+"'";
        connection.query(sql, function (err, result, fields) {
            if (err) {
                console.log('ERROR en CheckTemplate', err);
                res.send('3');
            }
            if(result){
            /*
                //res.send(result)
                //let detallesFiscales = result[0];
                let sumadorDeCultivos = 0;
                //console.log('EL LENGTH', result.length)
                for(let i=0; i<result.length; i++){
                     sumadorDeCultivos = 0
                      //console.log("la I:",i);
                    for(let j=0; j<result.length; j++){
                        //console.log(j);
                        //console.log('ANTES DE J: ',sumadorDeExamenes);
                        if(result[j].cultivo_nombre != null && result[j].id_cultivo != null){
                            if(result[i].cultivo_nombre == result[j].cultivo_nombre){
                                sumadorDeCultivos++;
                                if(sumadorDeCultivos >= 2){
                                    //console.log('ENTRO: ',sumadorDeExamenes);
                                    //console.log(result[j])
                                    result[j].cultivo_nombre = null;
                                    result[j].id_cultivo = null;
                                    result[j].id_detalle_factura_paciente;
                                    //result.splice(j);
                                } 
                            }
                            if(j == result.length-1){
                                //console.log(j, result.length-1)
                                result[i].cantidad = sumadorDeCultivos;
                            }
                        }
                    }
                    //console.log('DESPUES DE J: ',sumadorDeExamenes);
                }
                let cultivos = result.filter((item) => item.id_cultivo != null);
                */
               let cultivos = result;
                //res.send(cultivos);
                buscarRegistroDePagos(detallesFiscales, examenes, cultivos);
            }
        });
    }

    function buscarRegistroDePagos(detallesFiscales, examenes, cultivos){
        const sql = "SELECT tbl_registro_pago.id_registro_pago, tbl_registro_pago.tipo_registro, tbl_registro_pago.igtf_monto, tbl_registro_pago.igtf_pago, tbl_registro_pago.tipo_registro, tbl_registro_pago.igtf_pago, tbl_registro_pago.id_registro_divisa, tbl_registro_pago.id_tipo_pago, tbl_registro_pago.id_banco, tbl_registro_pago.numero_referencia, tbl_registro_pago.monto, DATE_FORMAT(fecha_creacion, '%d-%m-%Y') AS fecha, tbl_tipo_pago.tipo_pago_nombre, tbl_banco.banco_nombre, tbl_registro_divisa.tasa_actual, tbl_divisa.id_divisa, tbl_divisa.divisa_nombre FROM `tbl_registro_pago` LEFT JOIN `tbl_tipo_pago` ON tbl_tipo_pago.id_tipo_pago = tbl_registro_pago.id_tipo_pago LEFT JOIN `tbl_banco` ON tbl_banco.id_banco = tbl_registro_pago.id_banco LEFT JOIN `tbl_registro_divisa` ON tbl_registro_pago.id_registro_divisa = tbl_registro_divisa.id_registro_divisa LEFT JOIN `tbl_divisa` ON tbl_divisa.id_divisa = tbl_registro_divisa.id_divisa WHERE tbl_registro_pago.id_factura = '" +req.body.id_factura+"'";
        connection.query(sql, function (err, result, fields) {
            if (err) {
                console.log('ERROR en CheckTemplate', err);
                res.send('3');
            }
            if(result){
                //console.log("/////////////////////////////", result, req.body.id_factura)
                /////////////////////////////////////PARA AGREGAR EL ITEM AGREGADO/////////////////////////////
                for(const item of result){
                    item.agregado = "1",
                    item.accion = 2
                }
                let factura = {};
                factura.detallesFiscales = detallesFiscales;
                factura.examenes = examenes;
                factura.cultivos = cultivos;
                factura.registroDePagos = result;
                //res.send(factura);
                buscarOrdenes(factura)
            }
        });
    }

    function buscarOrdenes(factura){    
        return new Promise((resolve, reject) => {
            let sql = "SELECT tbl_detalle_factura_paciente.id_detalle_factura_paciente, tbl_detalle_factura_paciente.id_factura, tbl_detalle_factura_paciente.id_registro_convenio, tbl_detalle_orden.id_orden, tbl_orden.numero_orden FROM tbl_detalle_factura_paciente LEFT JOIN tbl_detalle_orden ON tbl_detalle_orden.id_detalle_factura_paciente = tbl_detalle_factura_paciente.id_detalle_factura_paciente LEFT JOIN tbl_orden ON tbl_orden.id_orden = tbl_detalle_orden.id_orden WHERE tbl_detalle_factura_paciente.id_factura = '" +factura.detallesFiscales.id_factura+ "' GROUP BY tbl_orden.id_orden";
            connection.query(sql, function (err, result, fields) {
                if (err) {
                    console.log('ERROR en CheckTemplate', err);
                    res.send('3');
                }
                if(result){
                    factura.ordenes = result;
                    //resolve(result)
                    res.send(factura)
                }
            });
        })
    }
}

//////////////////////////////////////NO USADO AUN////////////////////////////////////////////////////
facturacionCtrl.buscarFacturaFullDetalle = async(req, res) =>{
    //const sql = "SELECT tbl_factura.id_factura, tbl_factura.numero_factura, tbl_factura.id_cliente, tbl_factura.fecha_creacion, tbl_factura.fecha_cancelacion, tbl_factura.total_bolivares, tbl_factura.total_dolares, tbl_factura.total_pesos, tbl_factura.factura_tip, tbl_factura.id_usuario, tbl_factura.id_cliente, tbl_cliente.cliente_nombre, tbl_cliente.cliente_apellido, tbl_cliente.cedula_RIF, tbl_usuario.id_usuario, tbl_usuario.usuario_nombre, tbl_usuario.usuario_apellido, tbl_usuario.usuario_cedula, tbl_detalle_factura_paciente.id_examen, tbl_detalle_factura_paciente.id_cultivo, tbl_examen.examen_nombre, tbl_cultivo.cultivo_nombre FROM `tbl_factura` INNER JOIN `tbl_cliente` ON tbl_factura.id_cliente = tbl_cliente.id_cliente INNER JOIN `tbl_usuario` ON tbl_factura.id_usuario = tbl_usuario.id_usuario INNER JOIN `tbl_detalle_factura_paciente` ON tbl_factura.id_factura = tbl_detalle_factura_paciente.id_factura INNER JOIN `tbl_examen` ON tbl_examen.id_examen = tbl_detalle_factura_paciente.id_examen INNER JOIN `tbl_cultivo` ON tbl_cultivo.id_cultivo = tbl_detalle_factura_paciente.id_cutivo WHERE tbl_factura.id_factura='" +req.body.id_factura+"'";
    //INNER JOIN `tbl_cliente` ON tbl_factura.id_cliente = tbl_cliente.id_cliente  INNER JOIN `tbl_usuario` ON tbl_factura.id_usuario = tbl_usuario.id_usuario INNER JOIN `tbl_detalle_factura_paciente` ON tbl_factura.id_factura = tbl_detalle_factura_paciente.id_factura
    
    //const sql = "SELECT tbl_factura.id_factura, tbl_factura.numero_factura, tbl_factura.id_cliente, date_format(fecha_cancelacion, '%d-%m-%Y') AS fecha_cancelacion, date_format(fecha_creacion_factura, '%d-%m-%Y') AS fecha_creacion_factura, date_format(fecha_creacion_orden_trabajo, '%d-%m-%Y') AS fecha_creacion_orden_trabajo, tbl_factura.total_bolivares, tbl_factura.total_dolares, tbl_factura.total_pesos, tbl_factura.id_tipo_factura, tbl_factura.id_usuario, tbl_factura.id_cliente, tbl_cliente.cliente_nombre, tbl_cliente.cliente_apellido, tbl_cliente.cedula_RIF, tbl_usuario.id_usuario, tbl_usuario.usuario_nombre, tbl_usuario.usuario_apellido, tbl_usuario.usuario_cedula FROM `tbl_factura` INNER JOIN `tbl_cliente` ON tbl_factura.id_cliente = tbl_cliente.id_cliente INNER JOIN `tbl_usuario` ON tbl_factura.id_usuario = tbl_usuario.id_usuario WHERE tbl_factura.id_factura='" +req.body.id_factura+"'";
    const sql = "SELECT tbl_factura.id_factura, tbl_factura.id_estado_factura, tbl_factura.anulacion_motivo, tbl_factura.id_usuario_anulacion, date_format(fecha_cancelacion, '%d-%m-%Y') AS fecha_cancelacion ,date_format(fecha_creacion_factura, '%d-%m-%Y') AS fecha_creacion_factura, date_format(fecha_creacion_orden_trabajo, '%d-%m-%Y') AS fecha_creacion_orden_trabajo, tbl_factura.id_cliente, tbl_factura.id_tipo_factura, tbl_factura.id_usuario, tbl_factura.numero_factura, tbl_factura.debe_dolares, tbl_factura.orden_trabajo, tbl_factura.total_bolivares, tbl_factura.total_dolares, tbl_factura.total_pesos, tbl_factura.tasa_bolivar_dia, tbl_factura.IGTF_bolivares, tbl_factura.IGTF_dolares, tbl_factura.IGTF_pesos, tbl_factura.tasa_pesos_dia, tbl_cliente.cliente_nombre, tbl_cliente.cliente_apellido, tbl_cliente.cedula_RIF, tbl_usuario.usuario_nombre, tbl_usuario.usuario_apellido, tbl_estado_factura.nombre, tbl_tipo_factura.tipo_factura_nombre FROM `tbl_factura` INNER JOIN tbl_cliente ON tbl_cliente.id_cliente = tbl_factura.id_cliente LEFT JOIN tbl_usuario ON tbl_usuario.id_usuario = tbl_factura.id_usuario INNER JOIN tbl_estado_factura ON tbl_estado_factura.id_estado_factura = tbl_factura.id_estado_factura INNER JOIN tbl_tipo_factura ON tbl_factura.id_tipo_factura = tbl_tipo_factura.id_tipo_factura WHERE tbl_factura.id_factura='" +req.body.id_factura+"'";

    let numFact;
    connection.query(sql, async function (err, result, fields) {
        if (err) {
            console.log('ERROR en CheckTemplate', err);
            res.send('3');
        }
        if(result){
            //res.send(result)
            let detallesFiscales = result[0];
            let usuarioAnulacion;
            usuarioAnulacion = await buscarUsuarioAnulacion(usuarioAnulacion, detallesFiscales.id_factura)
            //console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!", usuarioAnulacion)
            detallesFiscales.usuario_nombre_anulacion = usuarioAnulacion.usuario_nombre,
            detallesFiscales.usuario_apellido_anulacion = usuarioAnulacion.usuario_apellido,
            detallesFiscales.usuario_cedula_anulacion = usuarioAnulacion.usuario_cedula
            buscarExamenesPacientes(detallesFiscales)
        }
    });

    async function buscarUsuarioAnulacion(usuarioAnulacion, idFactura){
        return new Promise((resolve, reject) => {
            const sql = "SELECT tbl_factura.id_usuario_anulacion, tbl_usuario.usuario_nombre, tbl_usuario.usuario_apellido, tbl_usuario.usuario_cedula FROM tbl_factura LEFT JOIN tbl_usuario ON tbl_usuario.id_usuario = tbl_factura.id_usuario_anulacion WHERE tbl_factura.id_factura = '" +idFactura+"'";
            connection.query(sql, function (err, result, fields) {
                if (err) {
                    console.log('ERROR en CheckTemplate', err);
                    res.send('3');
                }
                if(result){
                    usuarioAnulacion = result[0];
                    resolve(usuarioAnulacion);
                }
            })
        });
    }

    function buscarExamenesPacientes(detallesFiscales){
        const sql = "SELECT tbl_detalle_factura_paciente.id_examen, tbl_examen.examen_nombre FROM tbl_detalle_factura_paciente INNER JOIN `tbl_examen` ON tbl_examen.id_examen = tbl_detalle_factura_paciente.id_examen WHERE tbl_detalle_factura_paciente.id_factura = '" +req.body.id_factura+"'";
        connection.query(sql, function (err, result, fields) {
            if (err) {
                console.log('ERROR en CheckTemplate', err);
                res.send('3');
            }
            if(result){
                //res.send(result)
                //let detallesFiscales = result[0];
                let sumadorDeExamenes = 0;
                //console.log('EL LENGTH', result.length)
                for(let i=0; i<result.length; i++){
                     sumadorDeExamenes = 0
                      //console.log("la I:",i);
                    for(let j=0; j<result.length; j++){
                        //console.log(j);
                        //console.log('ANTES DE J: ',sumadorDeExamenes);
                        if(result[j].examen_nombre != null && result[j].id_examen != null){
                            if(result[i].examen_nombre == result[j].examen_nombre){
                                sumadorDeExamenes++;
                                if(sumadorDeExamenes >= 2){
                                    //console.log('ENTRO: ',sumadorDeExamenes);
                                    //console.log(result[j])
                                    result[j].examen_nombre = null;
                                    result[j].id_examen = null;
                                    //result.splice(j);
                                } 
                            }
                            if(j == result.length-1){
                                //console.log(j, result.length-1)
                                result[i].cantidad = sumadorDeExamenes;
                            }
                        }
                    }
                    //console.log('DESPUES DE J: ',sumadorDeExamenes);
                }
                let examenes = result.filter((item) => item.id_examen != null);
                //res.send(examenes);
                buscarCultivosPacientes(detallesFiscales, examenes);
            }
        });
    }

    function buscarCultivosPacientes(detallesFiscales, examenes){
        const sql = "SELECT tbl_detalle_factura_paciente.id_cultivo, tbl_cultivo.cultivo_nombre FROM tbl_detalle_factura_paciente INNER JOIN `tbl_cultivo` ON tbl_cultivo.id_cultivo = tbl_detalle_factura_paciente.id_cultivo WHERE tbl_detalle_factura_paciente.id_factura = '" +req.body.id_factura+"'";
        connection.query(sql, function (err, result, fields) {
            if (err) {
                console.log('ERROR en CheckTemplate', err);
                res.send('3');
            }
            if(result){
                //res.send(result)
                //let detallesFiscales = result[0];
                let sumadorDeCultivos = 0;
                //console.log('EL LENGTH', result.length)
                for(let i=0; i<result.length; i++){
                     sumadorDeCultivos = 0
                      //console.log("la I:",i);
                    for(let j=0; j<result.length; j++){
                        //console.log(j);
                        //console.log('ANTES DE J: ',sumadorDeExamenes);
                        if(result[j].cultivo_nombre != null && result[j].id_cultivo != null){
                            if(result[i].cultivo_nombre == result[j].cultivo_nombre){
                                sumadorDeCultivos++;
                                if(sumadorDeCultivos >= 2){
                                    //console.log('ENTRO: ',sumadorDeExamenes);
                                    //console.log(result[j])
                                    result[j].cultivo_nombre = null;
                                    result[j].id_cultivo = null;
                                    //result.splice(j);
                                } 
                            }
                            if(j == result.length-1){
                                //console.log(j, result.length-1)
                                result[i].cantidad = sumadorDeCultivos;
                            }
                        }
                    }
                    //console.log('DESPUES DE J: ',sumadorDeExamenes);
                }
                let cultivos = result.filter((item) => item.id_cultivo != null);
                //res.send(cultivos);
                buscarRegistroDePagos(detallesFiscales, examenes, cultivos);
            }
        });
    }

    function buscarRegistroDePagos(detallesFiscales, examenes, cultivos){
        const sql = "SELECT tbl_registro_pago.id_registro_pago, tbl_registro_pago.tipo_registro, tbl_registro_pago.igtf_monto, tbl_registro_pago.tipo_registro, tbl_registro_pago.igtf_pago, tbl_registro_pago.id_registro_divisa, tbl_registro_pago.id_tipo_pago, tbl_registro_pago.id_banco, tbl_registro_pago.numero_referencia, tbl_registro_pago.monto, tbl_tipo_pago.tipo_pago_nombre, tbl_banco.banco_nombre, tbl_registro_divisa.tasa_actual, tbl_divisa.id_divisa, tbl_divisa.divisa_nombre FROM `tbl_registro_pago` LEFT JOIN `tbl_tipo_pago` ON tbl_tipo_pago.id_tipo_pago = tbl_registro_pago.id_tipo_pago LEFT JOIN `tbl_banco` ON tbl_banco.id_banco = tbl_registro_pago.id_banco LEFT JOIN `tbl_registro_divisa` ON tbl_registro_pago.id_registro_divisa = tbl_registro_divisa.id_registro_divisa LEFT JOIN `tbl_divisa` ON tbl_divisa.id_divisa = tbl_registro_divisa.id_divisa WHERE tbl_registro_pago.id_factura = '" +req.body.id_factura+"'";
        connection.query(sql, function (err, result, fields) {
            if (err) {
                console.log('ERROR en CheckTemplate', err);
                res.send('3');
            }
            if(result){
                //console.log("/////////////////////////////", result, req.body.id_factura)
                /////////////////////////////////////PARA AGREGAR EL ITEM AGREGADO/////////////////////////////
                for(const item of result){
                    item.agregado = "1",
                    item.accion = 2
                }
                let factura = {};
                factura.detallesFiscales = detallesFiscales;
                factura.examenes = examenes;
                factura.cultivos = cultivos;
                factura.registroDePagos = result;
                res.send(factura);
            }
        });
    }
}
//////////////////////////////////////////////////////////////////////////////////////////////////////

facturacionCtrl.crearFacturaOrdenTrabajo = async(req, res) =>{
    console.log("///////////////////////////////////////////////////////////////////////////", req.body.pacientes[0].examenes)
    //////////1 decontado
    //////////2 credito
    //////////3 orden de trabajo
    //console.log('/////////////////////////////////////////')
    //console.log(req.body)
    //console.log('/////////////////////////////////////////')
    //console.log('FACTURACION!', req.body.pacientes[0].examenes)
    //console.log("LO SIENTO BB", DATETIME)
    
    //console.log('EN FACTURACION', req.body)
    
    if(req.body.id_tipo_factura == 1 || req.body.id_tipo_factura == 2){
        //console.log(req.body.pagos);
        ///////////////////SI ES FACTURA///////////////////////
        let sumaPesos = 0;
        let sumaDolares = 0;
        let sumaBolivares = 0;
        let sumaPesosVueltos = 0;
        let sumaDolaresVueltos = 0;
        let sumaBolivaresVueltos = 0;
        let sumaPesosIGTF = 0; 
        let sumaDolaresIGTF = 0;
        let sumaBolivaresIGTF = 0;
        //console.log('EN RESULT!!!!!!!!!!!!!!!!!!!!!!!!!!!', result)
        ////////////////////CONVERTIR PESOS A DOLARES////////////////////////
        for(const item of req.body.pagos){
            //console.log("CCCCCCCCCCCCCCCCCCCCCCCCCCCC", item.igtf_pago)
            /////////////////////////////////SUMATORIA DE PAGOS//////////////////////////////////
            if(item.divisa_nombre == "DOLARES" && item.igtf_pago == 0 && item.tipo_registro == 0){
                sumaDolares = sumaDolares + item.monto;
            }else if(item.divisa_nombre == "PESOS" && item.igtf_pago == 0 && item.tipo_registro == 0){
                sumaPesos = sumaPesos + item.monto
                //console.log("SUMA PESOS!!!", sumaPesos)
            }else if(item.divisa_nombre == "BOLIVARES" && item.igtf_pago == 0 && item.tipo_registro == 0){
            //console.log("!!!!!!", item.monto)
                sumaBolivares = sumaBolivares + item.monto;
            }   
            //////////////////////////////SUMATORIA DE VUELTOS//////////////////////////////////////
            if(item.divisa_nombre == "DOLARES" && item.igtf_pago == 0 && item.tipo_registro == 1){
                sumaDolaresVueltos = sumaDolaresVueltos + item.monto;
            }else if(item.divisa_nombre == "PESOS" && item.igtf_pago == 0 && item.tipo_registro == 1){
                sumaPesosVueltos = sumaPesosVueltos + item.monto
                //console.log("SUMA PESOS VUELTOS!!!", sumaPesosVueltos)
            }else if(item.divisa_nombre == "BOLIVARES" && item.igtf_pago == 0 && item.tipo_registro == 1){
            //console.log("!!!!!!", item.monto)
                sumaBolivaresVueltos = sumaBolivaresVueltos + item.monto;
            }
            //////////////////////////////SUMATORIA DE IGTF//////////////////////////////////////
            if(item.divisa_nombre == "DOLARES" && item.igtf_pago == 1){
                sumaDolaresIGTF = sumaDolaresIGTF + item.monto;
            }else if(item.divisa_nombre == "PESOS" && item.igtf_pago == 1){
                sumaPesosIGTF = sumaPesosIGTF + item.monto
                //console.log("SUMA PESOS IGTF!!!", sumaPesosIGTF)
            }else if(item.divisa_nombre == "BOLIVARES" && item.igtf_pago == 1){
            //console.log("!!!!!!", item.monto)
                sumaBolivaresIGTF = sumaBolivaresIGTF + item.monto;
            }      
        }
   
        let pesosConvertidos =  Number(Math.round(sumaPesos+ "e+2") + "e-2");
        let totalDolares = 0;
        let dolaresRedondeado = 0; //LA BASE IMPONIBLE EN IGTF
        let bolivaresRedondeado = 0; //LA BASE IMPONIBLE EN IGTF
        let conversionDolarBolivar = 0;
        let vueltosPesosToDolares = 0, vueltosBolivaresToDolares = 0;
        let sumaBolivaresToDolares = 0, sumaPesosToDolares = 0;
        let igtfBolivaresToDolares = 0, igtfPesosToDolares = 0;
        let dolaresTotales = 0, vueltosDolaresTotales = 0, igtfDolarTotal = 0;

        vueltosPesosToDolares = sumaPesosVueltos / req.body.tasa_pesos_dia;
        sumaPesosToDolares = sumaPesos / req.body.tasa_pesos_dia;
        igtfPesosToDolares = sumaPesosIGTF / req.body.tasa_pesos_dia;

        vueltosBolivaresToDolares = sumaBolivares / req.body.tasa_bolivar_dia;
        sumaBolivaresToDolares = sumaBolivares / req.body.tasa_bolivar_dia;
        igtfBolivaresToDolares = sumaBolivaresIGTF / req.body.tasa_bolivar_dia;

        
        dolaresTotales = sumaPesosToDolares + sumaBolivaresToDolares + sumaDolares;
        vueltosDolaresTotales = sumaDolaresVueltos + vueltosPesosToDolares + vueltosBolivaresToDolares;
        igtfDolarTotal = sumaDolaresIGTF + igtfBolivaresToDolares + igtfPesosToDolares;

        if(vueltosPesosToDolares > 0  || vueltosBolivaresToDolares > 0 || sumaDolaresVueltos > 0){
            dolaresRedondeado = Number(Math.round((dolaresTotales - vueltosDolaresTotales - igtfDolarTotal)+ "e+2") + "e-2");
            bolivaresRedondeado = dolaresRedondeado * req.body.tasa_bolivar_dia
        }else{
            dolaresRedondeado = Number(Math.round(dolaresTotales+ "e+2") + "e-2");
            bolivaresRedondeado = dolaresRedondeado * req.body.tasa_bolivar_dia;
        }
        
        
        req.body.bolivaresRedondeado = Number(Math.round(bolivaresRedondeado+ "e+2") + "e-2");
        req.body.dolaresRedondeado = Number(Math.round(dolaresRedondeado+ "e+2") + "e-2");

        const sql = "SELECT * FROM `tbl_numero_factura_tmp`";
        let numFact;
        connection.query(sql, function (err, result, fields) {
            if (err) {
                console.log('ERROR en CheckTemplate', err);
                res.send('3');
            }
            if(result){
                numFact=result[0].numero_factura;
                crearFactura(numFact)
            }
        });

        async function crearFactura(numFact){
            //console.log('PASO A AGREGAR!!!!!!!', req.body)
            //console.log("888888888888888888888888888888888888888888888888888888888888888888888888", req.body.bolivaresRedondeado, req.body.dolaresRedondeado)
            if(req.body.id_tipo_factura == 1){
                let time = new Date(new Date().toLocaleString("en-US", {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: true
                }));
                    connection.query('INSERT INTO `tbl_factura` SET?', {
                        numero_factura: numFact,
                        id_cliente: req.body.id_cliente,
                        total_bolivares: req.body.total_bolivares,
                        total_dolares: req.body.total_dolares,
                        total_pesos: req.body.total_pesos,
                        descuento_bolivares: req.body.descuento_bolivares,
                        descuento_dolares: req.body.descuento_dolares,
                        descuento_pesos: req.body.descuento_pesos,
                        tasa_bolivar_dia: req.body.tasa_bolivar_dia,
                        tasa_pesos_dia: req.body.tasa_pesos_dia,
                        IGTF_bolivares: req.body.IGTF_bolivares,
                        IGTF_dolares: req.body.IGTF_dolares, 
                        IGTF_pesos: req.body.IGTF_pesos,
                        base_imponible_bolivares: req.body.bolivaresRedondeado,
                        base_imponible_dolares: req.body.dolaresRedondeado,
                        debe_dolares: 0,
                        id_tipo_factura: req.body.id_tipo_factura,
                        id_usuario: req.body.id_usuario,
                        id_estado_factura: 1,
                        fecha_creacion_orden_trabajo: null,
                        fecha_creacion_factura: time,
                        fecha_cancelacion: time,
                        impreso: 1,
                        factura_qr: config.URL+uniqid()
                    }, (err, result) => {
                        if (err) {
                            console.log('no se pudo a agregar', err)
                            res.send('ERROR EN AGREGAR FACTURA!')
                        } else {
                            //console.log('agrego!!', result)
                            //res.send('AGREGO FACTURA!')
                            update(numFact, 1);
                        }
                    });
                
                
            }else if(req.body.id_tipo_factura == 2){
                let debe = 0;
                let montoPago = 0;
                let time = new Date(new Date().toLocaleString("en-US", {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: true
                }));

                let sumaDolares = 0, sumaPesos = 0, sumaBolivares = 0;
                let nombreDivisa;
                let pesosToDolares;
                let bsToDolares;
                let montoPagoDolaresTotal;
                let montoPagoDolaresTotalRedondeado;
                for(const itemPago of req.body.pagos){
                    //console.log("--------------------------------------", itemPago)
                    nombreDivisa = await getNombreDivisa(nombreDivisa, itemPago.id_registro_divisa)
                    if(nombreDivisa == "DOLARES" && itemPago.igtf_pago == '0' && itemPago.id_tipo_pago == 2){
                        sumaDolares = sumaDolares + itemPago.monto;
                    }else if(nombreDivisa == "PESOS"  && itemPago.igtf_pago == '0' && itemPago.id_tipo_pago == 2){
                        sumaPesos = sumaPesos + itemPago.monto;
                    }else if(nombreDivisa == "BOLIVARES"  && itemPago.igtf_pago == '0' && itemPago.id_tipo_pago == 2){
                       sumaBolivares =sumaBolivares + itemPago.monto;
                    }
                }
                pesosToDolares = sumaPesos / req.body.tasa_pesos_dia;
                bsToDolares = sumaBolivares / req.body.tasa_bolivar_dia;
                montoPagoDolaresTotal = pesosToDolares + bsToDolares + sumaDolares;
                montoPagoDolaresTotalRedondeado = Number(Math.round(montoPagoDolaresTotal + "e+2") + "e-2")
                //console.log(itemPago.monto);
                debe = req.body.total_dolares - montoPagoDolaresTotalRedondeado;
                //console.log("!!!!!!!!!!!!!!!!!!!XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX", debe, montoPagoDolaresTotalRedondeado)
                connection.query('INSERT INTO `tbl_factura` SET?', {
                    numero_factura: numFact,
                    id_cliente: req.body.id_cliente,
                    total_bolivares: req.body.total_bolivares,
                    total_dolares: req.body.total_dolares,
                    total_pesos: req.body.total_pesos,
                    descuento_bolivares: req.body.descuento_bolivares,
                    descuento_dolares: req.body.descuento_dolares,
                    descuento_pesos: req.body.descuento_pesos,
                    tasa_pesos_dia: req.body.tasa_pesos_dia,
                    tasa_bolivar_dia: req.body.tasa_bolivar_dia,
                    debe_dolares: debe - req.body.descuento_dolares, 
                    IGTF_bolivares: req.body.IGTF_bolivares,
                    IGTF_dolares: req.body.IGTF_dolares, 
                    IGTF_pesos: req.body.IGTF_pesos,
                    id_tipo_factura: req.body.id_tipo_factura,
                    id_usuario: req.body.id_usuario,
                    id_estado_factura: 2,
                    fecha_creacion_orden_trabajo: null,
                    fecha_cancelacion: null,
                    fecha_creacion_factura: time,
                    base_imponible_bolivares: req.body.bolivaresRedondeado,
                    base_imponible_dolares: req.body.dolaresRedondeado,
                    impreso: 1,
                    factura_qr: config.URL+uniqid()
                }, (err, result) => {
                    if (err) {
                        console.log('no se pudo a agregar', err)
                        res.send('ERROR EN AGREGAR FACTURA!')
                    } else {
                        //console.log('agrego!!', result)
                        //res.send('AGREGO FACTURA!')
                        update(numFact, 1);
                    }
                });
            }
            
        }

        function update(numFact){
            const sqlUpdate = "UPDATE `tbl_numero_factura_tmp` SET numero_factura = numero_factura + 1 WHERE id_numero_factura = 1"
            connection.query(sqlUpdate, function (err, result, fie) {
                if (err) {
                    console.log('error en la conexion intente de nuevo', err)
                    res.send('3')
                }else{
                    //console.log('numero de factura aumentado!')
                    //res.send('sea agrego factura y numero de factura aumentado!')
                    //detallesDeFactura(numFact);
                    extraerFactura(numFact);
                }
            })
        }
        ///////////////////////////////////////////////////////
    }
    else if(req.body.id_tipo_factura == 3){
        //////////////////SI ES ORDEN DE TRABAJO//////////////////////
        const sql = "SELECT * FROM `tbl_numero_orden_trabajo_tmp`";
        let numNC;
        connection.query(sql, function (err, result, fields) {
            if (err) {
                console.log('ERROR en CheckTemplate', err);
                res.send('3');
            }
            if(result){
                numNC=result[0].numero_orden_trabajo;
                //console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', result)
                crearFactura(numNC)
            }
        });

        async function crearFactura(numNC){
            let time = new Date(new Date().toLocaleString("en-US", {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true
            }));
            /*console.log('!!!!!!!!!!!!!!!!!!!!!!TIME', new Date(new Date().toLocaleString("en-US", {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true
            })))*/
            let sumaDolares = 0, sumaPesos = 0, sumaBolivares = 0;
            let nombreDivisa;
            let pesosToDolares;
            let bsToDolares;
            let montoPagoDolaresTotal;
            let montoPagoDolaresTotalRedondeado;
            let sumaPesosVueltos = 0;
            let sumaDolaresVueltos = 0;
            let sumaBolivaresVueltos = 0;
            let sumaPesosIGTF = 0; 
            let sumaDolaresIGTF = 0;
            let sumaBolivaresIGTF = 0;
            for(const itemPago of req.body.pagos){
                //console.log("--------------------------------------", itemPago)
                nombreDivisa = await getNombreDivisa(nombreDivisa, itemPago.id_registro_divisa)
                if(nombreDivisa == "DOLARES" && itemPago.igtf_pago == '0' && itemPago.id_tipo_pago == 2){
                    sumaDolares = sumaDolares + itemPago.monto;
                }else if(nombreDivisa == "PESOS" && itemPago.igtf_pago == '0' && itemPago.id_tipo_pago == 2){
                    sumaPesos = sumaPesos + itemPago.monto;
                }else if(nombreDivisa == "BOLIVARES" && itemPago.igtf_pago == '0' && itemPago.id_tipo_pago == 2){
                   sumaBolivares =sumaBolivares + itemPago.monto;
                }
                //////////////////////////////SUMATORIA DE VUELTOS//////////////////////////////////////
                if(itemPago.divisa_nombre == "DOLARES" && itemPago.igtf_pago == '0' && itemPago.tipo_registro == '1'){
                    sumaDolaresVueltos = sumaDolaresVueltos + itemPago.monto;
                }else if(itemPago.divisa_nombre == "PESOS" && itemPago.igtf_pago == '0' && itemPago.tipo_registro == '1'){
                    sumaPesosVueltos = sumaPesosVueltos + (itemPago.monto / req.body.tasa_pesos_dia);
                }else if(itemPago.divisa_nombre == "BOLIVARES" && itemPago.igtf_pago == '0' && itemPago.tipo_registro == '1'){
                //console.log("!!!!!!", itemPago.monto)
                    sumaBolivaresVueltos = sumaBolivaresVueltos + itemPago.monto;
                }   
                //////////////////////////////SUMATORIA DE IGTF//////////////////////////////////////
                if(itemPago.divisa_nombre == "DOLARES" && itemPago.igtf_pago == '1'){
                    sumaDolaresIGTF = sumaDolaresIGTF + itemPago.monto;
                }else if(itemPago.divisa_nombre == "PESOS" && itemPago.igtf_pago == '1'){
                    sumaPesosIGTF = sumaPesosIGTF + (itemPago.monto / req.body.tasa_pesos_dia);
                }else if(itemPago.divisa_nombre == "BOLIVARES" && itemPago.igtf_pago == '1'){
                //console.log("!!!!!!", itemPago.monto)
                    sumaBolivaresIGTF = sumaBolivaresIGTF + itemPago.monto;
                }  
            }
            pesosToDolares = sumaPesos / req.body.tasa_pesos_dia;
            bsToDolares = sumaBolivares / req.body.tasa_bolivar_dia;
            montoPagoDolaresTotal = pesosToDolares + bsToDolares + sumaDolares;
            montoPagoDolaresTotalRedondeado = Number(Math.round(montoPagoDolaresTotal + "e+2") + "e-2")
            debe = req.body.total_dolares - montoPagoDolaresTotalRedondeado;
            if(sumaPesosVueltos > 0){
                sumaPesos = sumaPesos - sumaPesosVueltos - sumaPesosIGTF;
            }else{
                sumaPesos = sumaPesos
            }
            let pesosConvertidos =  Number(Math.round(sumaPesos+ "e+2") + "e-2");
            let totalDolares;
            let dolaresRedondeado; //LA BASE IMPONIBLE EN IGTF
            let bolivaresRedondeado; //LA BASE IMPONIBLE EN IGTF
            let conversionDolarBolivar;
            if(sumaDolaresVueltos > 0){
                sumaDolares = sumaDolares - sumaDolaresVueltos - sumaDolaresIGTF;
            }else{
                sumaDolares = sumaDolares
            }
            
            sumaBolivares = sumaBolivares - sumaBolivaresVueltos - sumaBolivaresIGTF;
            totalDolares = pesosConvertidos + sumaDolares;
            //console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!", /*sumaDolares*/ totalDolares, sumaPesos);
            dolaresRedondeado = Number(Math.round((totalDolares)+ "e+2") + "e-2");
            //console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!", /*sumaDolares*/ sumaBolivares);
            ///////////////////CONVIRTIENDO DOLARES//////////////////////////
            conversionDolarBolivar = ((totalDolares) * req.body.tasa_bolivar_dia)
            //totalBolivares = conversionDolarBolivar + sumaBolivares;
            bolivaresRedondeado = Number(Math.round((conversionDolarBolivar)+ "e+2") + "e-2");

            req.body.bolivaresRedondeado = bolivaresRedondeado;
            req.body.dolaresRedondeado = dolaresRedondeado;
            //console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!", totalBolivares, bolivaresRedondeado);
            //console.log('PASO A AGREGAR!!!!!!!', req.body)
                connection.query('INSERT INTO `tbl_factura` SET?', {
                    orden_trabajo: numNC,
                    id_cliente: req.body.id_cliente,
                    total_bolivares: req.body.total_bolivares,
                    total_dolares: req.body.total_dolares,
                    total_pesos: req.body.total_pesos,
                    descuento_bolivares: req.body.descuento_bolivares,
                    descuento_dolares: req.body.descuento_dolares,
                    descuento_pesos: req.body.descuento_pesos,
                    tasa_pesos_dia: req.body.tasa_pesos_dia,
                    tasa_bolivar_dia: req.body.tasa_bolivar_dia,
                    debe_dolares: 0,
                    id_tipo_factura: req.body.id_tipo_factura,
                    IGTF_bolivares: req.body.IGTF_bolivares,
                    IGTF_dolares: req.body.IGTF_dolares, 
                    IGTF_pesos: req.body.IGTF_pesos,
                    base_imponible_bolivares: req.body.bolivaresRedondeado,
                    base_imponible_dolares: req.body.dolaresRedondeado,
                    id_usuario: req.body.id_usuario,
                    id_estado_factura: 1,
                    fecha_creacion_factura: null,
                    fecha_creacion_orden_trabajo: time,
                    fecha_cancelacion: null,
                    impreso: 1,
                    factura_qr: config.URL+uniqid()
                }, (err, result) => {
                    if (err) {
                        console.log('no se pudo a agregar', err)
                        res.send('ERROR EN AGREGAR FACTURA!')
                    } else {
                        //console.log('agrego!!', result)
                        //res.send('AGREGO FACTURA!')
                        update(numNC, 3);
                    }
                });
        }

        function update(numNC, tip){
            const sqlUpdate = "UPDATE `tbl_numero_orden_trabajo_tmp` SET numero_orden_trabajo = numero_orden_trabajo + 1 WHERE id_orden_trabajo = 1"
            connection.query(sqlUpdate, function (err, result, fie) {
                if (err) {
                    console.log('error en la conexion intente de nuevo', err)
                    res.send('3')
                }else{
                    //console.log('numero de orden de trabajo aumentado!')
                    //res.send('sea agrego factura con orden de trabajo y numero de orden de trabajo aumentado!')
                    extraerIdOrdenTrabajo(numNC);
                }
            })
        }

        function extraerIdOrdenTrabajo(num){
            const sql = "SELECT id_factura FROM `tbl_factura` WHERE orden_trabajo='" +num+"'";
            connection.query(sql, function (err, result, fields) {
                if (err) {
                    console.log('ERROR en CheckTemplate', err);
                    res.send('3');
                }
                if(result){
                    //console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', result[0].id_factura);
                    let factura = result[0].id_factura
                    detallesDeFactura(factura)
                }
            });
        }
        //////////////////////////////////////////////////////////////
    }    
    else if(req.body.id_tipo_factura == 5){
        //////////////////SI ES ORDEN DE TRABAJO A CREDITO//////////////////////
        const sql = "SELECT * FROM `tbl_numero_orden_trabajo_tmp`";
        let numNC;
        connection.query(sql, function (err, result, fields) {
            if (err) {
                console.log('ERROR en CheckTemplate 1', err);
                res.send('3');
            }
            if(result){
                numNC=result[0].numero_orden_trabajo;
                //console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', result)
                crearFactura(numNC)
            }
        });

        async function crearFactura(numNC){
            let time = new Date(new Date().toLocaleString("en-US", {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true
            }));
            /*console.log('!!!!!!!!!!!!!!!!!!!!!!TIME', new Date(new Date().toLocaleString("en-US", {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true
            })))*/
            let sumaDolares = 0, sumaPesos = 0, sumaBolivares = 0;
            let nombreDivisa;
            let pesosToDolares;
            let bsToDolares;
            let montoPagoDolaresTotal;
            let montoPagoDolaresTotalRedondeado;
            let sumaPesosVueltos = 0;
            let sumaDolaresVueltos = 0;
            let sumaBolivaresVueltos = 0;
            let sumaPesosIGTF = 0; 
            let sumaDolaresIGTF = 0;
            let sumaBolivaresIGTF = 0;
            for(const itemPago of req.body.pagos){
                //console.log("--------------------------------------", itemPago)
                nombreDivisa = await getNombreDivisa(nombreDivisa, itemPago.id_registro_divisa)
                if(nombreDivisa == "DOLARES" && itemPago.igtf_pago == '0' && itemPago.id_tipo_pago == 2){
                    sumaDolares = sumaDolares + itemPago.monto;
                }else if(nombreDivisa == "PESOS" && itemPago.igtf_pago == '0' && itemPago.id_tipo_pago == 2){
                    sumaPesos = sumaPesos + itemPago.monto;
                }else if(nombreDivisa == "BOLIVARES" && itemPago.igtf_pago == '0' && itemPago.id_tipo_pago == 2){
                   sumaBolivares =sumaBolivares + itemPago.monto;
                }
                //////////////////////////////SUMATORIA DE VUELTOS//////////////////////////////////////
                if(itemPago.divisa_nombre == "DOLARES" && itemPago.igtf_pago == '0' && itemPago.tipo_registro == '1'){
                    sumaDolaresVueltos = sumaDolaresVueltos + itemPago.monto;
                }else if(itemPago.divisa_nombre == "PESOS" && itemPago.igtf_pago == '0' && itemPago.tipo_registro == '1'){
                    sumaPesosVueltos = sumaPesosVueltos + (itemPago.monto / req.body.tasa_pesos_dia);
                }else if(itemPago.divisa_nombre == "BOLIVARES" && itemPago.igtf_pago == '0' && itemPago.tipo_registro == '1'){
                //console.log("!!!!!!", itemPago.monto)
                    sumaBolivaresVueltos = sumaBolivaresVueltos + itemPago.monto;
                }   
                //////////////////////////////SUMATORIA DE IGTF//////////////////////////////////////
                if(itemPago.divisa_nombre == "DOLARES" && itemPago.igtf_pago == '1'){
                    sumaDolaresIGTF = sumaDolaresIGTF + itemPago.monto;
                }else if(itemPago.divisa_nombre == "PESOS" && itemPago.igtf_pago == '1'){
                    sumaPesosIGTF = sumaPesosIGTF + (itemPago.monto / req.body.tasa_pesos_dia);
                }else if(itemPago.divisa_nombre == "BOLIVARES" && itemPago.igtf_pago == '1'){
                //console.log("!!!!!!", itemPago.monto)
                    sumaBolivaresIGTF = sumaBolivaresIGTF + itemPago.monto;
                }  
            }
            pesosToDolares = sumaPesos / req.body.tasa_pesos_dia;
            bsToDolares = sumaBolivares / req.body.tasa_bolivar_dia;
            montoPagoDolaresTotal = pesosToDolares + bsToDolares + sumaDolares;
            montoPagoDolaresTotalRedondeado = Number(Math.round(montoPagoDolaresTotal + "e+2") + "e-2")
            debe = req.body.total_dolares - montoPagoDolaresTotalRedondeado;
            //console.log("ERRRRR DEBE", debe)
            if(sumaPesosVueltos > 0){
                sumaPesos = sumaPesos - sumaPesosVueltos - sumaPesosIGTF;
            }else{
                sumaPesos = sumaPesos
            }
            let pesosConvertidos =  Number(Math.round(sumaPesos+ "e+2") + "e-2");
            let totalDolares;
            let dolaresRedondeado; //LA BASE IMPONIBLE EN IGTF
            let bolivaresRedondeado; //LA BASE IMPONIBLE EN IGTF
            let conversionDolarBolivar;
            if(sumaDolaresVueltos > 0){
                sumaDolares = sumaDolares - sumaDolaresVueltos - sumaDolaresIGTF;
            }else{
                sumaDolares = sumaDolares
            }
            
            sumaBolivares = sumaBolivares - sumaBolivaresVueltos - sumaBolivaresIGTF;
            totalDolares = pesosConvertidos + sumaDolares;
            //console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!", /*sumaDolares*/ totalDolares, sumaPesos);
            dolaresRedondeado = Number(Math.round((totalDolares)+ "e+2") + "e-2");
            //console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!", /*sumaDolares*/ sumaBolivares);
            ///////////////////CONVIRTIENDO DOLARES//////////////////////////
            conversionDolarBolivar = ((totalDolares) * req.body.tasa_bolivar_dia)
            //totalBolivares = conversionDolarBolivar + sumaBolivares;
            bolivaresRedondeado = Number(Math.round((conversionDolarBolivar)+ "e+2") + "e-2");

            req.body.bolivaresRedondeado = bolivaresRedondeado;
            req.body.dolaresRedondeado = dolaresRedondeado;
            //console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!", totalBolivares, bolivaresRedondeado);
            //console.log('PASO A AGREGAR!!!!!!!', req.body)
                connection.query('INSERT INTO `tbl_factura` SET?', {
                    orden_trabajo: numNC,
                    id_cliente: req.body.id_cliente,
                    total_bolivares: req.body.total_bolivares,
                    total_dolares: req.body.total_dolares,
                    total_pesos: req.body.total_pesos,
                    descuento_bolivares: req.body.descuento_bolivares,
                    descuento_dolares: req.body.descuento_dolares,
                    descuento_pesos: req.body.descuento_pesos,
                    tasa_pesos_dia: req.body.tasa_pesos_dia,
                    tasa_bolivar_dia: req.body.tasa_bolivar_dia,
                    debe_dolares: debe,
                    id_tipo_factura: req.body.id_tipo_factura,
                    IGTF_bolivares: req.body.IGTF_bolivares,
                    IGTF_dolares: req.body.IGTF_dolares, 
                    IGTF_pesos: req.body.IGTF_pesos,
                    base_imponible_bolivares: req.body.bolivaresRedondeado,
                    base_imponible_dolares: req.body.dolaresRedondeado,
                    id_usuario: req.body.id_usuario,
                    id_estado_factura: 2,
                    fecha_creacion_factura: null,
                    fecha_creacion_orden_trabajo: time,
                    fecha_cancelacion: null,
                    impreso: 1,
                    factura_qr: config.URL+uniqid()
                }, (err, result) => {
                    if (err) {
                        console.log('no se pudo a agregar', err)
                        res.send('ERROR EN AGREGAR FACTURA!')
                    } else {
                        //console.log('agrego!!', result)
                        //res.send('AGREGO FACTURA!')
                        update(numNC, 3);
                    }
                });
        }

        function update(numNC, tip){
            const sqlUpdate = "UPDATE `tbl_numero_orden_trabajo_tmp` SET numero_orden_trabajo = numero_orden_trabajo + 1 WHERE id_orden_trabajo = 1"
            connection.query(sqlUpdate, function (err, result, fie) {
                if (err) {
                    console.log('error en la conexion intente de nuevo', err)
                    res.send('3')
                }else{
                    //console.log('numero de orden de trabajo aumentado!')
                    //res.send('sea agrego factura con orden de trabajo y numero de orden de trabajo aumentado!')
                    extraerIdOrdenTrabajo(numNC);
                }
            })
        }

        function extraerIdOrdenTrabajo(num){
            const sql = "SELECT id_factura FROM `tbl_factura` WHERE orden_trabajo='" +num+"'";
            connection.query(sql, function (err, result, fields) {
                if (err) {
                    console.log('ERROR en CheckTemplate 2', err);
                    res.send('3');
                }
                if(result){
                    //console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', result[0].id_factura);
                    let factura = result[0].id_factura
                    detallesDeFactura(factura)
                }
            });
        }
        //////////////////////////////////////////////////////////////
    }

    async function getNombreDivisa(nombre, idRegistroDivisa){
        return new Promise((resolve, reject) => {
            let sql = "SELECT tbl_registro_divisa.id_divisa, tbl_divisa.divisa_nombre FROM tbl_registro_divisa INNER JOIN tbl_divisa ON tbl_divisa.id_divisa = tbl_registro_divisa.id_divisa WHERE tbl_registro_divisa.id_registro_divisa ='" +idRegistroDivisa+"'";
            connection.query(sql, function (err, result, fields) {
                if (err) {
                    console.log('ERROR en CheckTemplate 3', err);
                    res.send('3');
                }
                if(result){
                    //console.log("ERROR DEL FUTURO!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!", result, idRegistroDivisa, nombre)
                    nombre = result[0].divisa_nombre;
                    resolve(nombre);
                }
            });
        })
    }

    function extraerFactura(num){
        //console.log('EN EXTRAER FACTRUAAAAAAAAAAAAAAAAAAAAA', num)
        const sql = "SELECT id_factura FROM `tbl_factura` WHERE numero_factura='" +num+"'";
        connection.query(sql, function (err, result, fields) {
            if (err) {
                console.log('ERROR en CheckTemplate 4', err);
                res.send('3');
            }
            if(result){
                //console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', result[0].id_factura);
                let factura = result[0].id_factura
                detallesDeFactura(factura)
            }
        });
    }

    function detallesDeFactura(factura){
        //console.log('EN DETALLES DE FACTURA', req.body.pacientes)
        //console.log('LA FACTURA', factura)
        let pacientesExamenesREQ = req.body.pacientes
        let memory = 0;
        for(let i=0; i<pacientesExamenesREQ.length; i++){
            for(let j=0; j<pacientesExamenesREQ[i].examenes.length; j++){
                memory++;
            }   
        }
        let myValues = new Array(memory);
        //console.log('MEMORIA DE MEMORY', memory);
        for(let i=0; i<memory; i++){
            myValues[i] = new Array(7);
        }

        //console.log('LA MEMORY DEL ARRAY MYVALUES', myValues)

        //PARA LA SUMATORIA EN VALUES
        let r = 0;
        for(let i=0; i<pacientesExamenesREQ.length; i++){
            //console.log('PASO i', i)
            for(let j=0; j<pacientesExamenesREQ[i].examenes.length; j++){
                //console.log('PASO j', j)
                //console.log('EL ID DEL PACIENTE',pacientesExamenesREQ[i].id_paciente)
                let key = Object.keys(pacientesExamenesREQ[i].examenes[j])[0].toString()
                //console.log(pacientesExamenesREQ[i].examenes[j])
                //console.log('!!', key);
                //console.log("00000000000000000000000000", pacientesExamenesREQ[i].examenes[j].nombre)
                if(key == "id_examen"){
                    //console.log('ESTAS ES UN EXAMEN')
                    myValues[r][0]= factura,
                    myValues[r][1]= null,
                    myValues[r][2]= pacientesExamenesREQ[i].id_paciente,
                    myValues[r][3]= pacientesExamenesREQ[i].examenes[j].id_examen,
                    myValues[r][4]= null,
                    myValues[r][5]= pacientesExamenesREQ[i].examenes[j].nombre,
                    myValues[r][6] = pacientesExamenesREQ[i].examenes[j].precio
                }else if(key == "id_cultivo"){
                    //console.log('ESTAS ES UN CULTIVO')
                    myValues[r][0]= factura,
                    myValues[r][1]= null,
                    myValues[r][2]= pacientesExamenesREQ[i].id_paciente,
                    myValues[r][3]= null,
                    myValues[r][4]= pacientesExamenesREQ[i].examenes[j].id_cultivo,
                    myValues[r][5]= pacientesExamenesREQ[i].examenes[j].nombre,
                    myValues[r][6] = pacientesExamenesREQ[i].examenes[j].precio
                }  
                r++;
            }
        }
        //console.log('LOS VALUES', myValues);
        const sql = 'INSERT INTO tbl_detalle_factura_paciente (id_factura, id_registro_convenio, id_paciente, id_examen, id_cultivo, nombre_especifico, precio) VALUES?';
        connection.query(sql, [myValues], (err, result) => {
            if (err) {
                console.log('no se pudo a agregar', err)
                res.send('ERROR!')
            } else {
                //console.log('agrego!!', result)
                //res.send('AGREGO!');
                detallesFiscales(factura);
            }
        });
        
    }

    function detallesFiscales(factura){
        let pagos = req.body.pagos;
        let memory = pagos.length;
        //console.log('LOS PAGOS', pagos);
        let myValues = new Array(memory);
        //console.log('MEMORIA DE MEMORY', memory);
        let fecha_creacion = new Date(new Date().toLocaleString("en-US", {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        }));
        
        for(let i=0; i<memory; i++){
            myValues[i] = new Array(11);
        }
        for(let i=0; i<memory; i++){
            for(let j=0; j<1; j++){
               myValues[i][0] = factura;
               myValues[i][1] = pagos[i].id_registro_divisa
               myValues[i][2] = pagos[i].id_tipo_pago
               myValues[i][3] = pagos[i].id_banco
               myValues[i][4] = pagos[i].numero_referencia
               myValues[i][5] = pagos[i].tipo_registro
               myValues[i][6] = pagos[i].monto
               myValues[i][7] = pagos[i].igtf_pago
               myValues[i][8] = fecha_creacion
               myValues[i][9] = pagos[i].igtf_monto
               myValues[i][10] = req.body.id_usuario
            }
        }
        //console.log('LOS VALUES DE LOS PAGOS', myValues);
        if(myValues == 0){
            extraerDetallesFacturaPaciente(factura);
        }else{
            const sql = 'INSERT INTO `tbl_registro_pago` (id_factura, id_registro_divisa, id_tipo_pago, id_banco, numero_referencia, tipo_registro, monto, igtf_pago, fecha_creacion, igtf_monto, id_usuario) VALUES?';
            connection.query(sql, [myValues], (err, result) => {
                if (err) {
                    console.log('no se pudo a agregar', err)
                    res.send('ERROR!')
                } else {
                    //console.log('agrego!!', result)
                    //res.send('AGREGO!');
                    //extraerNumeroOrden(factura)
                    extraerDetallesFacturaPaciente(factura);
                }
            });
        }
    }

    function moduladorDeOrden(factura, num, result, memoryRest){
        //console.log('PREEEEEEE', factura)
        if(num == 1){
            //extraerDetallesFacturaPaciente(numOrden, factura, num);
            crearOrden(factura, result, memoryRest);
        }else if(num == 2){
            //res.send('CREACION DE TODO')
            imprimirFactura(factura);
        }
    }

    function crearOrden(factura, result, memoryRest){
        //console.log('USANDO!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!', memoryRest)
        if(memoryRest == 0){
            ////SI YA PASO TODOS LOS PACIENTES////
            moduladorDeOrden(factura, 2, '');
        }else{
                //console.log('RESULT DEL PRINCIPIO', result)
                //result.splice(0, 1);
                //console.log('RESULT DEL SPLICE', result)
                const sql = "SELECT numero_orden FROM `tbl_numero_orden_tmp`";
                connection.query(sql, function (err, result, fields) {
                    if (err) {
                        //console.log('ERROR en CheckTemplate', err);
                        res.send('3');
                    }
                    if (result) {
                        //console.log('ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ', result)
                        numOrden = result[0].numero_orden;
                        //console.log('MEMORY RESTO DENTRO DEL CONNECT MYSQL', memoryRest)
                        insertarOrden(numOrden, memoryRest);
                    }
                    });

                //////SI SIGUE HABIENDO PACIENTES///////
                ////QUITO LOS PACIENTES QUE YA SE PUSIERON EN LA ORDEN Y MANDO LOS QUE FALTAN/////
                //moduladorDeOrden(factura, 1, result)

                function insertarOrden(numOrden, memoryRest){
                    let orden_qr = uniqid();
                    let orden_qr_nube = config.URL2+uniqid()
                    let time = new Date(new Date().toLocaleString("en-US", {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        hour12: true
                    }));
                    connection.query('INSERT INTO `tbl_orden` SET?', {
                        numero_orden: numOrden,
                        orden_qr: orden_qr,
                        orden_qr_nube: orden_qr_nube,
                        fecha: time
                    }, (err, result) => {
                        if (err) {
                            console.log('no se pudo a agregar', err)
                            res.send('ERROR EN CREAR LA ORDEN!')
                        } else {
                            updateOrden(numOrden, memoryRest, orden_qr);
                        }
                    });
                }

                function updateOrden(numOrden, memoryRest, orden_qr){
                    const sqlUpdate = "UPDATE `tbl_numero_orden_tmp` SET numero_orden = numero_orden + 1 WHERE id_numero_orden = 1"
                    connection.query(sqlUpdate, function (err, result, fie) {
                        if (err) {
                            console.log('error en la conexion intente de nuevo', err)
                            res.send('3')
                        }else{
                            //console.log('numero de factura aumentado!')
                            //res.send('sea modifico la factura y numero de factura aumentado!')
                            //crearDetalleOrden(numOrden, memoryRest);
                            extraerIdOrden(numOrden, memoryRest, orden_qr);
                        }
                    })
                }
            
                function extraerIdOrden(numOrden, memoryRest, orden_qr){
                    const sql = "SELECT id_orden FROM `tbl_orden` WHERE orden_qr='" +orden_qr+"'";
                    connection.query(sql, function (err, result, fields) {
                        if (err) {
                            console.log('ERROR en CheckTemplate 5', err);
                            res.send('3');
                        }
                        if(result){
                            //console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', result[0].id_factura);
                            let idOrden = result[0].id_orden
                            crearDetalleOrden(numOrden, memoryRest, idOrden);
                        }
                     });
                }

            function crearDetalleOrden(numOrden, memoryRest, idOrden){
                //console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!', result[0].id_paciente)
                //console.log('!!!!!!!!!!!!!!!!!!!!!!RESULT!!!!!!!!!!!!!!!!!!!!!!!!!!!', result)
                let memory = 0;
                let myValues;
                let id_paciente = result[0].id_paciente;
                let i = 0;
                let conteo;
                let resultRes
                if(memoryRest == 99){
                    memoryRest = 0;
                    memory = memory - memoryRest;
                }else if(memoryRest != 99){
                    memory = memory - memoryRest;
                }
                //console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', id_paciente)
                
                //console.log('CUANTO VALE LA MEMORYREST?', memoryRest)
                //console.log('CUANTO VALE LA MEMORY?', memory)
                if(memory == 0){
                    let i = 0;
                    //let conteo = 1;
                    //console.log('00000000000000000000000000000000000000000000', result)
                    //console.log('EN LA 493XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX', id_paciente, result[i].id_paciente)

                    for(let i=0;i<result.length;i++){
                        if(id_paciente != result[i].id_paciente){break;}
                        //console.log('LA MEMROY', memory)
                        //console.log(id_paciente, result[i].id_paciente)
                        memory++;
                    }
                    myValues = new Array(memory);
                    for(let i=0;i<memory;i++){
                        myValues[i] = new Array(2);
                    }
                    i=0;

                    for(let i=0;i<result.length;i++){
                        if(id_paciente != result[i].id_paciente){break;}
                        myValues[i][0]=idOrden
                        myValues[i][1]=result[i].id_detalle_factura_paciente
                        //console.log(i)
                    }
                    result.splice(0,memory);
                    //console.log('LOS VALUES PARA EL DETALLE ORDEN', myValues)
                }else{
                    let i = 0;  
                    let restAux = 0;
                    let memoryAUX = 0;
                    for(let i=0;i<memoryRest;i++){
                        //console.log('!!!!!!!!!!!!!!!!!!!!!!!!!111', id_paciente, result[i].id_paciente)
                        if(id_paciente == result[i].id_paciente)
                        {
                            memoryAUX++;
                        }else{
                            break;
                        }
                    }
                   //console.log('LA MEMORY AUX', memoryAUX)
                    myValues = new Array(memoryAUX);
                    //console.log('EN EL ELSEEEEE', myValues)
                    for(let i=0;i<memoryAUX;i++){
                        myValues[i] = new Array(2);
                    }
                    i=0;
                    restAux = memoryRest;
                    for(let i=0;i<memoryAUX;i++){
                        myValues[i][0]=idOrden
                        myValues[i][1]=result[i].id_detalle_factura_paciente
                        //if(id_paciente != result[i].id_paciente) break;
                    }
                    result.splice(0,memoryAUX);
                    memoryRest = restAux;
                    //console.log('LOS VALUES PARA EL DETALLE ORDEN EN MEMORYREST', myValues)
            
                }

                const sql = 'INSERT INTO tbl_detalle_orden (id_orden, id_detalle_factura_paciente) VALUES?';
                connection.query(sql, [myValues], (err, result) => {
                    if (err) {
                        //console.log('no se pudo a agregar', err)
                        res.send('ERROR!')
                    } else {
                        //console.log('agrego el detalle de orden!!', result)
                        //res.send('AGREGO!');
                        //extraerNumeroOrden(factura)
                    }
                });
                
                
                //console.log('RESULT DEL FINAL', result)
                resultRes = result;
                if(resultRes.length == 0){
                    //console.log('ENTRO A RESULTRES', resultRes)
                    memoryRest = 0;
                }else if(resultRes.length != 0){
                    memoryRest = resultRes.length;
                    //console.log('EL RESULTRES DIFERENTE DE 0', memoryRest)
                    //console.log('LA MEMORYREST EN EL IF2', memoryRest)
                }
                //console.log('LA MEMORY DESPUES DE TODO', memoryRest);
                moduladorDeOrden(factura, 1, resultRes, memoryRest)
            }
        }
    }

    function extraerDetallesFacturaPaciente(factura){
        //console.log('LA FACTURA', factura)
        const sql = "SELECT id_detalle_factura_paciente, id_paciente FROM `tbl_detalle_factura_paciente` WHERE id_factura='" +factura+"'";
        connection.query(sql, function (err, result, fields) {
            if (err) {
                //console.log('ERROR en CheckTemplate', err);
                res.send('3');
            }
            if(result){
                //console.log('PASO A RESULT!', result)
                //return result;
                moduladorDeOrden(factura, 1, result, 99)
            }
        });
    }
    function imprimirFactura(factura){
            let ipSocket, ipNormal, ip, ipDef;
            //ipSocket = req.socket.remoteAddress;
            ipNormal = req.ip;
            //ip = "192.168.0.112";

            ipNormal = ipNormal.split(":");
            ipDef = ipNormal[3];
            //console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX", ipSocket);
            //console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX", ipNormal);
            //console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX", req);
                    //http://localhost:3000/ordenesImpresion
            axios.get('http://localhost:3000/ordenesImpresion/'+factura)
            .then(function (response) {
                imprimirFacturaOrdenes(response.data)
            })

            function imprimirFacturaOrdenes(respOrdenes){
                //console.log("JAJAJAJAJAJAJAJAJAJAJAJAJAJAJAJJAJAJAJAJAA", respOrdenes);
                let numOrdenes = respOrdenes.length;
                //'http://'+ipDef+':5000/impresion'
                axios.post('http://'+ipDef+':5000/impresion',{
                ordenes: respOrdenes,
                numero_impresiones: numOrdenes,
                id_factura: factura
                }).then(function (response) {
                //response.data);
                
                //res.send(response.data)
                //res.redirect('/imprimirFactura/119/1');
                res.redirect('/imprimirFactura/'+factura+'/'+req.body.id_tipo_factura)
                }).catch(function (error) {
                    // handle error
                    //console.log(error);
                    //console.log("OJOJOJOJOJOJOJJOJOJOJOJOJOJO")
                    res.redirect('/imprimirFactura/'+factura+'/'+req.body.id_tipo_factura)
                  })
            }
        //res.redirect('/imprimirFactura/'+factura+'/'+req.body.id_tipo_factura);
    }
    
}

facturacionCtrl.modificarPago = async(req, res) =>{
    //console.log("///////////////////////////////////////////////////////////////////")
    //console.log(req.body)
    let agregarModificar = req.body.agregar_modificar;
    let eliminar = req.body.eliminar;
    let idFactura = req.body.id_factura;
    let factura;
    let respuesta;

    if(agregarModificar.length > 0){
        factura = await buscarFactura(idFactura);
        //console.log("))))))))))))))))", factura[0].fecha_creacion_factura)
        for(const item of agregarModificar){
            //console.log(item)
            if(item.accion == 1){
                //console.log("LLEGO 1")
                await crearRegistroPago(item, idFactura, factura[0].fecha_creacion_factura);
            }
            if(item.accion == 2){
                //console.log("LLEGO 2")
                await modificarRegistroPago(item, idFactura)
            }
        }
    }
    if(eliminar.length > 0){
        for(const item of eliminar){
            let idRegistroPago = item.id_registro_pago
            await eliminarRegistroPago(idRegistroPago)
        }
    }
    res.send('1');

    async function buscarFactura(idFactura){
        return new Promise((resolve, reject) => {
            const sql = "SELECT fecha_creacion_factura FROM `tbl_factura` WHERE id_factura = '" + idFactura+ "'";
            connection.query(sql, function (err, result, fields) {
                if (err) {
                    console.log('ERROR en CheckTemplate 100', err);
                    res.send('3');
                }
                if(result){
                    resolve(result);
                }
            });
        })
    }

    async function modificarRegistroPago(registroPago){
        return new Promise((resolve, reject) => {
            //console.log(registroPago.id_banco)
            if(registroPago.id_banco == null || registroPago.id_banco == 'null'){
                const sql = "UPDATE tbl_registro_pago SET id_registro_divisa = '" + registroPago.id_registro_divisa + "', id_tipo_pago = '" + registroPago.id_tipo_pago + "', id_banco = NULL, numero_referencia = NULL, monto = '" + registroPago.monto + "', id_usuario = '"+req.body.id_usuario+"' WHERE id_registro_pago = '" +registroPago.id_registro_pago+ "'";
                connection.query(sql, function (error, result, fields) {
                    if (result) {
                        resolve('1');
                    }else if(error){
                        //console.log(error)
                        res.send('3');
                    }
                });
            }else{
                const sql = "UPDATE tbl_registro_pago SET id_registro_divisa = '" + registroPago.id_registro_divisa + "', id_tipo_pago = '" + registroPago.id_tipo_pago + "', id_banco = '" + registroPago.id_banco + "', numero_referencia = '" + registroPago.numero_referencia + "', monto = '" + registroPago.monto + "', id_usuario = '"+req.body.id_usuario+"' WHERE id_registro_pago = '" +registroPago.id_registro_pago+ "'";
                connection.query(sql, function (error, result, fields) {
                    if (result) {
                        resolve('1');
                    }else if(error){
                        //console.log(error)
                        res.send('3');
                    }
                });
            }
        });
    }

    async function crearRegistroPago(registroPago, idFactura, fechaCreacion){
        //console.log("000000000000000000000000000000000000000000000000000000000000000", registroPago)
        return new Promise((resolve, reject) => {

            let time = new Date(new Date().toLocaleString("en-US", {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true
            }));
            //("000000000000000000000000000000000000000000000000000000000000000", fechaCreacion)
            connection.query('INSERT INTO `tbl_registro_pago` SET?', {
                id_factura: idFactura,
                id_nota_credito: registroPago.id_nota_credito,
                id_nota_debito: registroPago.id_nota_debito,
                id_recibo: registroPago.id_recibo,
                id_registro_divisa: registroPago.id_registro_divisa,
                igtf_pago: registroPago.igtf_pago,
                id_tipo_pago: registroPago.id_tipo_pago,
                id_banco: registroPago.id_banco,
                tipo_registro: registroPago.tipo_registro,
                numero_referencia: registroPago.numero_referencia,
                monto: registroPago.monto,
                fecha_creacion: fechaCreacion,
                id_usuario: req.body.id_usuario
            }, (err, result) => {
                if (err) {
                    console.log(err)
                    res.send('3');
                } else {
                    resolve('1');
                }
            });
        })
    }

    async function eliminarRegistroPago(idRegistroPago){
        return new Promise((resolve, reject) => {
            let sql = "DELETE FROM `tbl_registro_pago` WHERE id_registro_pago = " + idRegistroPago
            connection.query(sql, (err, result) => {
                if (err) {
                    console.log('no se pudo eliminar', err)
                    res.send('3');
                } else {
                    //console.log('agrego!!', result)
                    resolve('1');
                }
            });
        })
    }
}

facturacionCtrl.cancelarFactura = async(req, res) =>{
    const sql = "SELECT * FROM `tbl_numero_factura_tmp`";
        let numFact;
        connection.query(sql, function (err, result, fields) {
            if (err) {
                console.log('ERROR en CheckTemplate', err);
                res.send('3');
            }
            if(result){
                numFact=result[0].numero_factura;
                modificarFactura(numFact)
            }
        });

        function modificarFactura(numFact){
            //console.log('PASO A AGREGAR!!!!!!!', req.body)
            const sql = "UPDATE tbl_factura SET id_tipo_factura = 3, numero_factura = '" + numFact + " 'WHERE id_factura = '" + req.body.id_factura+ "'";
            connection.query(sql, function (error, result, fields) {
                if (result) {
                    //res.send('MODIFICO FACTURA!')
                    update();
                }else if(error){
                    console.log('Error en la modificacion:', error)
                    //res.send('ERROR EN LA MODIFICACION DE FACTURA!')
                }
            });
        }

        function update(){
            const sqlUpdate = "UPDATE `tbl_numero_factura_tmp` SET numero_factura = numero_factura + 1 WHERE id_numero_factura = 1"
            connection.query(sqlUpdate, function (err, result, fie) {
                if (err) {
                    console.log('error en la conexion intente de nuevo', err)
                    res.send('3')
                }else{
                    //console.log('numero de factura aumentado!')
                    res.send('sea modifico la factura y numero de factura aumentado!')
                }
            })
        }
}

facturacionCtrl.crearFacturaOrdenTrabajoConvenios = async(req, res) =>{
    //1 SI ES FACTURA NORMAL
    //2 SI ES SOLO ORDEN DE TRABAJO
    //3 SI ES UN REGISTRO CONVENIO
    //4 SI ES UNA FACTURA A CREDITO
    //console.log("JELOU!", req.body)
    //console.log("AYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY YAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", req.body)
    if(req.body.id_tipo_factura == 1){ 
        ///////////////////SI ES FACTURA A CONTADO///////////////////////
        let sumaPesos = 0;
        let sumaDolares = 0;
        let sumaBolivares = 0;
        let sumaPesosVueltos = 0;
        let sumaDolaresVueltos = 0;
        let sumaBolivaresVueltos = 0;
        let sumaPesosIGTF = 0; 
        let sumaDolaresIGTF = 0;
        let sumaBolivaresIGTF = 0;
        //console.log('EN RESULT!!!!!!!!!!!!!!!!!!!!!!!!!!!', result)
        ////////////////////CONVERTIR PESOS A DOLARES////////////////////////
        for(const item of req.body.pagos){
            //console.log("CCCCCCCCCCCCCCCCCCCCCCCCCCCC", item.igtf_pago)
            ////////////////////////////////////////SUMA DE PAGOS EN FACTURA CONVENIO///////////////////////////////////////////
                        /////////////////////////////////SUMATORIA DE PAGOS//////////////////////////////////
                        if(item.divisa_nombre == "DOLARES" && item.igtf_pago == 0 && item.tipo_registro == 0){
                            sumaDolares = sumaDolares + item.monto;
                        }else if(item.divisa_nombre == "PESOS" && item.igtf_pago == 0 && item.tipo_registro == 0){
                            sumaPesos = sumaPesos + item.monto
                        }else if(item.divisa_nombre == "BOLIVARES" && item.igtf_pago == 0 && item.tipo_registro == 0){
                        //console.log("!!!!!!", item.monto)
                            sumaBolivares = sumaBolivares + item.monto;
                        }   
                        //////////////////////////////SUMATORIA DE VUELTOS//////////////////////////////////////
                        if(item.divisa_nombre == "DOLARES" && item.igtf_pago == 0 && item.tipo_registro == 1){
                            sumaDolaresVueltos = sumaDolaresVueltos + item.monto;
                        }else if(item.divisa_nombre == "PESOS" && item.igtf_pago == 0 && item.tipo_registro == 1){
                            sumaPesosVueltos = sumaPesosVueltos + item.monto
                        }else if(item.divisa_nombre == "BOLIVARES" && item.igtf_pago == 0 && item.tipo_registro == 1){
                        //console.log("!!!!!!", item.monto)
                            sumaBolivaresVueltos = sumaBolivaresVueltos + item.monto;
                        }   
                        //////////////////////////////SUMATORIA DE IGTF//////////////////////////////////////
                        if(item.divisa_nombre == "DOLARES" && item.igtf_pago == 1){
                            sumaDolaresIGTF = sumaDolaresIGTF + item.monto;
                        }else if(item.divisa_nombre == "PESOS" && item.igtf_pago == 1){
                            sumaPesosIGTF = sumaPesosIGTF + item.monto
                        }else if(item.divisa_nombre == "BOLIVARES" && item.igtf_pago == 1){
                        //console.log("!!!!!!", item.monto)
                            sumaBolivaresIGTF = sumaBolivaresIGTF + item.monto;
                        }  
        }

        let pesosConvertidos =  Number(Math.round(sumaPesos+ "e+2") + "e-2");
        let totalDolares = 0;
        let dolaresRedondeado = 0; //LA BASE IMPONIBLE EN IGTF
        let bolivaresRedondeado = 0; //LA BASE IMPONIBLE EN IGTF
        let conversionDolarBolivar = 0;
        let vueltosPesosToDolares = 0, vueltosBolivaresToDolares = 0;
        let sumaBolivaresToDolares = 0, sumaPesosToDolares = 0;
        let igtfBolivaresToDolares = 0, igtfPesosToDolares = 0;
        let dolaresTotales = 0, vueltosDolaresTotales = 0, igtfDolarTotal = 0;

        vueltosPesosToDolares = sumaPesosVueltos / req.body.tasa_pesos_dia;
        sumaPesosToDolares = sumaPesos / req.body.tasa_pesos_dia;
        igtfPesosToDolares = sumaPesosIGTF / req.body.tasa_pesos_dia;

        vueltosBolivaresToDolares = sumaBolivares / req.body.tasa_bolivar_dia;
        sumaBolivaresToDolares = sumaBolivares / req.body.tasa_bolivar_dia;
        igtfBolivaresToDolares = sumaBolivaresIGTF / req.body.tasa_bolivar_dia;

        
        dolaresTotales = sumaPesosToDolares + sumaBolivaresToDolares + sumaDolares;
        vueltosDolaresTotales = sumaDolaresVueltos + vueltosPesosToDolares + vueltosBolivaresToDolares;
        igtfDolarTotal = sumaDolaresIGTF + igtfBolivaresToDolares + igtfPesosToDolares;

        if(vueltosPesosToDolares > 0  || vueltosBolivaresToDolares > 0 || sumaDolaresVueltos > 0){
            dolaresRedondeado = Number(Math.round((dolaresTotales - vueltosDolaresTotales - igtfDolarTotal)+ "e+2") + "e-2");
            bolivaresRedondeado = dolaresRedondeado * req.body.tasa_bolivar_dia
        }else{
            dolaresRedondeado = Number(Math.round(dolaresTotales+ "e+2") + "e-2");
            bolivaresRedondeado = dolaresRedondeado * req.body.tasa_bolivar_dia;
        }
        
        
        req.body.bolivaresRedondeado = Number(Math.round(bolivaresRedondeado+ "e+2") + "e-2");
        req.body.dolaresRedondeado = Number(Math.round(dolaresRedondeado+ "e+2") + "e-2");
        const sql = "SELECT * FROM `tbl_numero_factura_tmp`";
        let numFact;
        connection.query(sql, function (err, result, fields) {
            if (err) {
                console.log('ERROR en CheckTemplate', err);
                res.send('3');
            }
            if(result){
                numFact=result[0].numero_factura;
                crearFactura(numFact)
            }
        });

        function crearFactura(numFact){
            let time = new Date(new Date().toLocaleString("en-US", {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true
            }));
            //console.log('PASO A AGREGAR EN CONVENIO!!!!!!!', req.body)
                connection.query('INSERT INTO `tbl_factura` SET?', {
                    numero_factura: numFact,
                    id_cliente: req.body.id_cliente,
                    total_bolivares: req.body.total_bolivares,
                    total_dolares: req.body.total_dolares,
                    total_pesos: req.body.total_pesos,
                    descuento_bolivares: req.body.descuento_bolivares,
                    descuento_dolares: req.body.descuento_dolares,
                    descuento_pesos: req.body.descuento_pesos,
                    id_tipo_factura: req.body.id_tipo_factura,
                    IGTF_bolivares: req.body.IGTF_bolivares,
                    IGTF_dolares: req.body.IGTF_dolares, 
                    IGTF_pesos: req.body.IGTF_pesos,
                    base_imponible_bolivares : req.body.bolivaresRedondeado,
                    base_imponible_dolares : req.body.dolaresRedondeado,
                    debe_dolares: 0,
                    tasa_pesos_dia: req.body.tasa_pesos_dia,
                    tasa_bolivar_dia: req.body.tasa_bolivar_dia,
                    fecha_creacion_factura: time,
                    fecha_cancelacion: time,
                    fecha_creacion_orden_trabajo: null,
                    id_usuario: req.body.id_usuario,
                    id_estado_factura: 1,
                    impreso: 1,
                    factura_qr: config.URL+uniqid()
                }, (err, result) => {
                    if (err) {
                        console.log('no se pudo a agregar', err)
                        res.send('ERROR EN AGREGAR FACTURA!')
                    } else {
                        //console.log('agrego!!', result)
                        //res.send('AGREGO FACTURA!')
                        update(numFact, 1);
                    }
                });
        }

        function update(numFact){
            const sqlUpdate = "UPDATE `tbl_numero_factura_tmp` SET numero_factura = numero_factura + 1 WHERE id_numero_factura = 1"
            connection.query(sqlUpdate, function (err, result, fie) {
                if (err) {
                    console.log('error en la conexion intente de nuevo', err)
                    res.send('3')
                }else{
                    //console.log('numero de factura aumentado!')
                    //res.send('sea agrego factura y numero de factura aumentado!')
                    //detallesDeFactura(numFact);
                    extraerFactura(numFact);
                }
            })
        }
        ///////////////////////////////////////////////////////
    }else if(req.body.id_tipo_factura == 3){
        //////////////////SI ES ORDEN DE TRABAJO//////////////////////
        let sumaPesos = 0;
        let sumaDolares = 0;
        let sumaBolivares = 0;
        let sumaPesosVueltos = 0;
        let sumaDolaresVueltos = 0;
        let sumaBolivaresVueltos = 0;
        let sumaPesosIGTF = 0; 
        let sumaDolaresIGTF = 0;
        let sumaBolivaresIGTF = 0;
        //console.log('EN RESULT!!!!!!!!!!!!!!!!!!!!!!!!!!!', result)
        ////////////////////CONVERTIR PESOS A DOLARES////////////////////////
        for(const item of req.body.pagos){
            //console.log("CCCCCCCCCCCCCCCCCCCCCCCCCCCC", item.igtf_pago)
            ////////////////////////////////////////SUMA DE PAGOS EN FACTURA CONVENIO///////////////////////////////////////////
                        /////////////////////////////////SUMATORIA DE PAGOS//////////////////////////////////
                        if(item.divisa_nombre == "DOLARES" && item.igtf_pago == 0 && item.tipo_registro == 0){
                            sumaDolares = sumaDolares + item.monto;
                        }else if(item.divisa_nombre == "PESOS" && item.igtf_pago == 0 && item.tipo_registro == 0){
                            sumaPesos = sumaPesos + item.monto
                        }else if(item.divisa_nombre == "BOLIVARES" && item.igtf_pago == 0 && item.tipo_registro == 0){
                        //console.log("!!!!!!", item.monto)
                            sumaBolivares = sumaBolivares + item.monto;
                        }   
                        //////////////////////////////SUMATORIA DE VUELTOS//////////////////////////////////////
                        if(item.divisa_nombre == "DOLARES" && item.igtf_pago == 0 && item.tipo_registro == 1){
                            sumaDolaresVueltos = sumaDolaresVueltos + item.monto;
                        }else if(item.divisa_nombre == "PESOS" && item.igtf_pago == 0 && item.tipo_registro == 1){
                            sumaPesosVueltos = sumaPesosVueltos + item.monto
                        }else if(item.divisa_nombre == "BOLIVARES" && item.igtf_pago == 0 && item.tipo_registro == 1){
                        //console.log("!!!!!!", item.monto)
                            sumaBolivaresVueltos = sumaBolivaresVueltos + item.monto;
                        }   
                        //////////////////////////////SUMATORIA DE IGTF//////////////////////////////////////
                        if(item.divisa_nombre == "DOLARES" && item.igtf_pago == 1){
                            sumaDolaresIGTF = sumaDolaresIGTF + item.monto;
                        }else if(item.divisa_nombre == "PESOS" && item.igtf_pago == 1){
                            sumaPesosIGTF = sumaPesosIGTF + item.monto
                        }else if(item.divisa_nombre == "BOLIVARES" && item.igtf_pago == 1){
                        //console.log("!!!!!!", item.monto)
                            sumaBolivaresIGTF = sumaBolivaresIGTF + item.monto;
                        }  
        }

        let pesosConvertidos =  Number(Math.round(sumaPesos+ "e+2") + "e-2");
        let totalDolares = 0;
        let dolaresRedondeado = 0; //LA BASE IMPONIBLE EN IGTF
        let bolivaresRedondeado = 0; //LA BASE IMPONIBLE EN IGTF
        let conversionDolarBolivar = 0;
        let vueltosPesosToDolares = 0, vueltosBolivaresToDolares = 0;
        let sumaBolivaresToDolares = 0, sumaPesosToDolares = 0;
        let igtfBolivaresToDolares = 0, igtfPesosToDolares = 0;
        let dolaresTotales = 0, vueltosDolaresTotales = 0, igtfDolarTotal = 0;

        vueltosPesosToDolares = sumaPesosVueltos / req.body.tasa_pesos_dia;
        sumaPesosToDolares = sumaPesos / req.body.tasa_pesos_dia;
        igtfPesosToDolares = sumaPesosIGTF / req.body.tasa_pesos_dia;

        vueltosBolivaresToDolares = sumaBolivares / req.body.tasa_bolivar_dia;
        sumaBolivaresToDolares = sumaBolivares / req.body.tasa_bolivar_dia;
        igtfBolivaresToDolares = sumaBolivaresIGTF / req.body.tasa_bolivar_dia;

        
        dolaresTotales = sumaPesosToDolares + sumaBolivaresToDolares + sumaDolares;
        vueltosDolaresTotales = sumaDolaresVueltos + vueltosPesosToDolares + vueltosBolivaresToDolares;
        igtfDolarTotal = sumaDolaresIGTF + igtfBolivaresToDolares + igtfPesosToDolares;

        if(vueltosPesosToDolares > 0  || vueltosBolivaresToDolares > 0 || sumaDolaresVueltos > 0){
            dolaresRedondeado = Number(Math.round((dolaresTotales - vueltosDolaresTotales - igtfDolarTotal)+ "e+2") + "e-2");
            bolivaresRedondeado = dolaresRedondeado * req.body.tasa_bolivar_dia
        }else{
            dolaresRedondeado = Number(Math.round(dolaresTotales+ "e+2") + "e-2");
            bolivaresRedondeado = dolaresRedondeado * req.body.tasa_bolivar_dia;
        }
        
        
        req.body.bolivaresRedondeado = Number(Math.round(bolivaresRedondeado+ "e+2") + "e-2");
        req.body.dolaresRedondeado = Number(Math.round(dolaresRedondeado+ "e+2") + "e-2");

        
        const sql = "SELECT * FROM `tbl_numero_orden_trabajo_tmp`";
        let numNC;
        connection.query(sql, function (err, result, fields) {
            if (err) {
                console.log('ERROR en CheckTemplate', err);
                res.send('3');
            }
            if(result){
                numNC=result[0].numero_orden_trabajo;
                //console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', result)
                crearFactura(numNC)
            }
        });

        function crearFactura(numNC){
            //console.log('PASO A AGREGAR CONVENIO!!!!!!!', req.body)
            let time = new Date(new Date().toLocaleString("en-US", {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true
            }));
                connection.query('INSERT INTO `tbl_factura` SET?', {
                    orden_trabajo: numNC,
                    id_cliente: req.body.id_cliente,
                    total_bolivares: req.body.total_bolivares,
                    total_dolares: req.body.total_dolares,
                    total_pesos: req.body.total_pesos,
                    descuento_bolivares: req.body.descuento_bolivares,
                    descuento_dolares: req.body.descuento_dolares,
                    descuento_pesos: req.body.descuento_pesos,
                    IGTF_bolivares: req.body.IGTF_bolivares,
                    IGTF_dolares: req.body.IGTF_dolares, 
                    IGTF_pesos: req.body.IGTF_pesos,
                    base_imponible_bolivares : req.body.bolivaresRedondeado,
                    base_imponible_dolares : req.body.dolaresRedondeado,
                    tasa_pesos_dia: req.body.tasa_pesos_dia,
                    tasa_bolivar_dia: req.body.tasa_bolivar_dia,
                    id_tipo_factura: 3,
                    debe_dolares: 0,
                    id_usuario: req.body.id_usuario,
                    id_estado_factura: 1,
                    fecha_creacion_factura: null,
                    fecha_creacion_orden_trabajo: time,
                    fecha_cancelacion: time,
                    impreso: 1,
                    factura_qr: config.URL+uniqid()
                }, (err, result) => {
                    if (err) {
                        console.log('no se pudo a agregar', err)
                        res.send('ERROR EN AGREGAR FACTURA!')
                    } else {
                        //console.log('agrego!!', result)
                        //res.send('AGREGO FACTURA!')
                        update(numNC, 3);
                    }
                });
        }

        function update(numNC, tip){
            const sqlUpdate = "UPDATE `tbl_numero_orden_trabajo_tmp` SET numero_orden_trabajo = numero_orden_trabajo + 1 WHERE id_orden_trabajo = 1"
            connection.query(sqlUpdate, function (err, result, fie) {
                if (err) {
                    console.log('error en la conexion intente de nuevo', err)
                    res.send('3')
                }else{
                    //console.log('numero de orden de trabajo aumentado!')
                    //res.send('sea agrego factura con orden de trabajo y numero de orden de trabajo aumentado!')
                    extraerFactura(numNC);
                }
            })
        }
        //////////////////////////////////////////////////////////////
    }else if(req.body.id_tipo_factura == 4){
        //////////////////SI ES REGISTRO CONVENIO//////////////////////
        //console.log("AYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY YAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA0", req.body)
        
        //res.send(req.body)
        const sql = "SELECT * FROM `tbl_numero_registro_convenio_tmp`";
        let numR;

        connection.query(sql, function (err, result, fields) {
            if (err) {
                console.log('ERROR en CheckTemplate', err);
                res.send('3');
            }
            if(result){
                numR=result[0].numero_registro_convenio;
                //console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', result)

                //res.send(result)
                crearRegistroConvenio(numR)
            }
        });

        function crearRegistroConvenio(numR){
            let time = new Date(new Date().toLocaleString("en-US", {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true
            }));
            //console.log('PASO A AGREGAR CONVENIO!!!!!!!', req.body)
                connection.query('INSERT INTO `tbl_registro_convenio` SET?', {
                    numero_registro_convenio: numR,
                    id_cliente: req.body.id_cliente,
                    id_factura: null,
                    total_bolivares: req.body.total_bolivares,
                    total_pesos: req.body.total_pesos,
                    total_dolares: req.body.total_dolares,
                    id_usuario: req.body.id_usuario,
                    fecha: time,
                    estatus: 0, //0 POR PAGAR 1 PAGADO 2 ANULADO Y 3 FACTURADO
                    estado_registro: 2 
                }, (err, result) => {
                    if (err) {
                        console.log('no se pudo a agregar', err)
                        res.send('ERROR EN AGREGAR FACTURA!')
                    } else {
                        //console.log('agrego!!', result)
                        //res.send('AGREGO !')
                        update(numR);
                    }
                });
        }

        function update(numR){
            const sqlUpdate = "UPDATE `tbl_numero_registro_convenio_tmp` SET numero_registro_convenio = numero_registro_convenio + 1 WHERE id_numero_registro_convenio = 1"
            connection.query(sqlUpdate, function (err, result, fie) {
                if (err) {
                    console.log('error en la conexion intente de nuevo', err)
                    res.send('3')
                }else{
                    //console.log('numero de registro convenio aumentado!')
                    //res.send('se agrego numero de registro convenio y se registro un numero registro convenio!')
                    extraerRegistroConvenio(numR);
                }
            })
        }

        function extraerRegistroConvenio(numR){
            const sql = "SELECT id_registro_convenio FROM `tbl_registro_convenio` WHERE numero_registro_convenio ='" +numR+"'";
            connection.query(sql, function (err, result, fields) {
                if (err) {
                    console.log('ERROR en CheckTemplate', err);
                    res.send('3');
                }
                if(result){
                    //console.log('OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO', result);
                    let registroConvenio = result[0].id_registro_convenio
                    detallesDeFactura(registroConvenio)
                    //console.log('Registro convenio!!!!!!!', registroConvenio);
                    //res.send(result);
                }
            });
    
            function detallesDeFactura(registroConvenio){
                //console.log('EN DETALLES DE FACTURA CONVENIO', req.body.detallesExamenes)
    
               let detallesExamenes = req.body.detallesExamenes;
               let memory = 0;
               let r = 0;
               for(let i = 0; i<detallesExamenes.length; i++){
                    //console.log('Posicion del vector', i)
                   for(let j=0; j<detallesExamenes[i].pacientes.length; j++){
                       //console.log('id del paciente', detallesExamenes[i].pacientes[j])
                        for(let k=0; k<detallesExamenes[i].items.length; k++){
                            //console.log('id del examen', detallesExamenes[i].examenes[k])
                            memory++;
                        }
                   }
               }
               //console.log('Cuanto es memory?', memory)
               let myValues = new Array(memory);
               //console.log('MEMORIA DE MEMORY', memory);
               for(let i=0; i<memory; i++){
                   myValues[i] = new Array(7);
               }
               //console.log('EN DETALLES DE FACTURA CONVENIO', detallesExamenes, lengthDetalles)
               //console.log(myValues)
               for(let i = 0; i<detallesExamenes.length; i++){
                    for(let j=0; j<detallesExamenes[i].pacientes.length; j++){
                            for(let k=0; k<detallesExamenes[i].items.length; k++){
                                //memory++;
                                //console.log('PASO j', j)
                            console.log('EL ID DEL PACIENTE',detallesExamenes[i])
                            let key = Object.keys(detallesExamenes[i].items[k])[0].toString()
                            key = key.split(",")
                            //console.log('!!', key[0]);
                            //console.log("1111111111111111111111111111111111", registroConvenio, detallesExamenes[i].pacientes[j].id_paciente, detallesExamenes[i].items[k].id_examen, detallesExamenes[i].items[k].id_cultivo, detallesExamenes[i].items[k].nombre, detallesExamenes[i].items[k].precio)
                            if(key == "id_examen"){
                                //console.log('ESTAS ES UN EXAMEN')
                                myValues[r][0]= null,
                                myValues[r][1]= registroConvenio,
                                myValues[r][2]= detallesExamenes[i].pacientes[j].id_paciente,
                                myValues[r][3]= detallesExamenes[i].items[k].id_examen,
                                myValues[r][4]= null,
                                myValues[r][5]= detallesExamenes[i].items[k].nombre,
                                myValues[r][6] = detallesExamenes[i].items[k].precio
                            }else if(key == "id_cultivo"){
                                console.log('ESTAS ES UN CULTIVO')
                                myValues[r][0]= null,
                                myValues[r][1]= registroConvenio,
                                myValues[r][2]= detallesExamenes[i].pacientes[j].id_paciente,
                                myValues[r][3]= null,
                                myValues[r][4]= detallesExamenes[i].items[k].id_cultivo,
                                myValues[r][5]= detallesExamenes[i].items[k].nombre,
                                myValues[r][6] = detallesExamenes[i].items[k].precio
                            }  
                                r++;
                        }
                    }
                }
                //console.log("en myValues", myValues);
                //res.send(myValues);
                //console.log('LOS VALUES', myValues);
                const sql = 'INSERT INTO tbl_detalle_factura_paciente (id_factura, id_registro_convenio, id_paciente, id_examen, id_cultivo, nombre_especifico, precio) VALUES?';
                connection.query(sql, [myValues], (err, result) => {
                    if (err) {
                        console.log('no se pudo a agregar', err)
                        res.send('ERROR!')
                    } else {
                        //console.log('agrego!!', result)
                        //res.send('AGREGO!');
                        extraerDetallesFacturaPaciente(registroConvenio);
                    }
                });
            }
    
            function extraerDetallesFacturaPaciente(numR){
                //console.log("EL NUMR", numR)
                const sql = "SELECT id_detalle_factura_paciente, id_paciente FROM `tbl_detalle_factura_paciente` WHERE id_registro_convenio='" +numR+"'";
                connection.query(sql, function (err, result, fields) {
                    if (err) {
                        console.log('ERROR en CheckTemplate', err);
                        res.send('3');
                    }
                    if(result){
                        //moduladorDeOrden(factura, 1, result, 99)
                        crearOrdenRegistroConvenio(result, numR);
                        //res.send(result)
                    }
                });
            }
        
        }
        //////////////////////////////////////////////////////////////
    }else if(req.body.id_tipo_factura == 2){ 
        ///////////////////SI ES FACTURA A CREDITO///////////////////////
        //console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
        let sumaPesos = 0;
        let sumaDolares = 0;
        let sumaBolivares = 0;
        let sumaPesosVueltos = 0;
        let sumaDolaresVueltos = 0;
        let sumaBolivaresVueltos = 0;
        let sumaPesosIGTF = 0; 
        let sumaDolaresIGTF = 0;
        let sumaBolivaresIGTF = 0;
        //console.log('EN RESULT!!!!!!!!!!!!!!!!!!!!!!!!!!!', result)
        ////////////////////CONVERTIR PESOS A DOLARES////////////////////////
        for(const item of req.body.pagos){
            //console.log("CCCCCCCCCCCCCCCCCCCCCCCCCCCC", item.igtf_pago)
                        /////////////////////////////////SUMATORIA DE PAGOS//////////////////////////////////
            if(item.divisa_nombre == "DOLARES" && item.igtf_pago == 0 && item.tipo_registro == 0){
                sumaDolares = sumaDolares + item.monto;
            }else if(item.divisa_nombre == "PESOS" && item.igtf_pago == 0 && item.tipo_registro == 0){
                sumaPesos = sumaPesos + item.monto
            }else if(item.divisa_nombre == "BOLIVARES" && item.igtf_pago == 0 && item.tipo_registro == 0){
            //console.log("!!!!!!", item.monto)
                sumaBolivares = sumaBolivares + item.monto;
            }   
            //////////////////////////////SUMATORIA DE VUELTOS//////////////////////////////////////
            if(item.divisa_nombre == "DOLARES" && item.igtf_pago == 0 && item.tipo_registro == 1){
                sumaDolaresVueltos = sumaDolaresVueltos + item.monto;
            }else if(item.divisa_nombre == "PESOS" && item.igtf_pago == 0 && item.tipo_registro == 1){
                sumaPesosVueltos = sumaPesosVueltos + item.monto
            }else if(item.divisa_nombre == "BOLIVARES" && item.igtf_pago == 0 && item.tipo_registro == 1){
            //console.log("!!!!!!", item.monto)
                sumaBolivaresVueltos = sumaBolivaresVueltos + item.monto;
            }   
            //////////////////////////////SUMATORIA DE IGTF//////////////////////////////////////
            if(item.divisa_nombre == "DOLARES" && item.igtf_pago == 1){
                sumaDolaresIGTF = sumaDolaresIGTF + item.monto;
            }else if(item.divisa_nombre == "PESOS" && item.igtf_pago == 1){
                sumaPesosIGTF = sumaPesosIGTF + item.monto
            }else if(item.divisa_nombre == "BOLIVARES" && item.igtf_pago == 1){
                //console.log("!!!!!!", item.monto)
                sumaBolivaresIGTF = sumaBolivaresIGTF + item.monto;
            } 
        }
        let pesosConvertidos =  Number(Math.round(sumaPesos+ "e+2") + "e-2");
        let totalDolares = 0;
        let dolaresRedondeado = 0; //LA BASE IMPONIBLE EN IGTF
        let bolivaresRedondeado = 0; //LA BASE IMPONIBLE EN IGTF
        let conversionDolarBolivar = 0;
        let vueltosPesosToDolares = 0, vueltosBolivaresToDolares = 0;
        let sumaBolivaresToDolares = 0, sumaPesosToDolares = 0;
        let igtfBolivaresToDolares = 0, igtfPesosToDolares = 0;
        let dolaresTotales = 0, vueltosDolaresTotales = 0, igtfDolarTotal = 0;

        vueltosPesosToDolares = sumaPesosVueltos / req.body.tasa_pesos_dia;
        sumaPesosToDolares = sumaPesos / req.body.tasa_pesos_dia;
        igtfPesosToDolares = sumaPesosIGTF / req.body.tasa_pesos_dia;

        vueltosBolivaresToDolares = sumaBolivares / req.body.tasa_bolivar_dia;
        sumaBolivaresToDolares = sumaBolivares / req.body.tasa_bolivar_dia;
        igtfBolivaresToDolares = sumaBolivaresIGTF / req.body.tasa_bolivar_dia;

        
        dolaresTotales = sumaPesosToDolares + sumaBolivaresToDolares + sumaDolares;
        vueltosDolaresTotales = sumaDolaresVueltos + vueltosPesosToDolares + vueltosBolivaresToDolares;
        igtfDolarTotal = sumaDolaresIGTF + igtfBolivaresToDolares + igtfPesosToDolares;

        if(vueltosPesosToDolares > 0  || vueltosBolivaresToDolares > 0 || sumaDolaresVueltos > 0){
            dolaresRedondeado = Number(Math.round((dolaresTotales - vueltosDolaresTotales - igtfDolarTotal)+ "e+2") + "e-2");
            bolivaresRedondeado = dolaresRedondeado * req.body.tasa_bolivar_dia
        }else{
            dolaresRedondeado = Number(Math.round(dolaresTotales+ "e+2") + "e-2");
            bolivaresRedondeado = dolaresRedondeado * req.body.tasa_bolivar_dia;
        }
        
        
        req.body.bolivaresRedondeado = Number(Math.round(bolivaresRedondeado+ "e+2") + "e-2");
        req.body.dolaresRedondeado = Number(Math.round(dolaresRedondeado+ "e+2") + "e-2");
        ///////////////////////
        const sql = "SELECT * FROM `tbl_numero_factura_tmp`";
        let numFact;
        connection.query(sql, function (err, result, fields) {
            if (err) {
                console.log('ERROR en CheckTemplate', err);
                res.send('3');
            }
            if(result){
                numFact=result[0].numero_factura;
                crearFactura(numFact)
            }
        });

        function crearFactura(numFact){
            //console.log('PASO A AGREGAR EN CONVENIO!!!!!!!', req.body)
            let time = new Date(new Date().toLocaleString("en-US", {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true
            }));
                connection.query('INSERT INTO `tbl_factura` SET?', {
                    numero_factura: numFact,
                    id_cliente: req.body.id_cliente,
                    total_bolivares: req.body.total_bolivares,
                    total_dolares: req.body.total_dolares,
                    total_pesos: req.body.total_pesos,
                    descuento_bolivares: req.body.descuento_bolivares,
                    descuento_dolares: req.body.descuento_dolares,
                    descuento_pesos: req.body.descuento_pesos,
                    IGTF_bolivares: req.body.IGTF_bolivares,
                    IGTF_dolares: req.body.IGTF_dolares, 
                    IGTF_pesos: req.body.IGTF_pesos,
                    base_imponible_bolivares: req.body.bolivaresRedondeado,
                    base_imponible_dolares: req.body.dolaresRedondeado,
                    tasa_pesos_dia: req.body.tasa_pesos_dia,
                    tasa_bolivar_dia: req.body.tasa_bolivar_dia,
                    debe_dolares: req.body.total_dolares - req.body.descuento_dolares,
                    id_tipo_factura: 2,
                    fecha_creacion_factura: time,
                    fecha_cancelacion: null,
                    fecha_creacion_orden_trabajo: null,
                    id_usuario: req.body.id_usuario,
                    id_estado_factura: 2,
                    impreso: 1,
                    factura_qr: config.URL+uniqid()
                }, (err, result) => {
                    if (err) {
                        console.log('no se pudo a agregar', err)
                        res.send('ERROR EN AGREGAR FACTURA!')
                    } else {
                        //console.log('agrego!!', result)
                        //res.send('AGREGO FACTURA!')
                        update(numFact, 1);
                    }
                });
        }

        function update(numFact){
            const sqlUpdate = "UPDATE `tbl_numero_factura_tmp` SET numero_factura = numero_factura + 1 WHERE id_numero_factura = 1"
            connection.query(sqlUpdate, function (err, result, fie) {
                if (err) {
                    console.log('error en la conexion intente de nuevo', err)
                    res.send('3')
                }else{
                    //console.log('numero de factura aumentado!')
                    //res.send('sea agrego factura y numero de factura aumentado!')
                    //detallesDeFactura(numFact);
                    extraerFactura(numFact);
                }
            })
        }
        ///////////////////////////////////////////////////////
    }else if(req.body.id_tipo_factura == 5){
        //////////////////SI ES ORDEN DE TRABAJO//////////////////////
        let sumaPesos = 0;
        let sumaDolares = 0;
        let sumaBolivares = 0;
        let sumaPesosVueltos = 0;
        let sumaDolaresVueltos = 0;
        let sumaBolivaresVueltos = 0;
        let sumaPesosIGTF = 0; 
        let sumaDolaresIGTF = 0;
        let sumaBolivaresIGTF = 0;
        //console.log('EN RESULT!!!!!!!!!!!!!!!!!!!!!!!!!!!', result)
        ////////////////////CONVERTIR PESOS A DOLARES////////////////////////
        for(const item of req.body.pagos){
            //console.log("CCCCCCCCCCCCCCCCCCCCCCCCCCCC", item.igtf_pago)
            ////////////////////////////////////////SUMA DE PAGOS EN FACTURA CONVENIO///////////////////////////////////////////
                        /////////////////////////////////SUMATORIA DE PAGOS//////////////////////////////////
                        if(item.divisa_nombre == "DOLARES" && item.igtf_pago == 0 && item.tipo_registro == 0){
                            sumaDolares = sumaDolares + item.monto;
                        }else if(item.divisa_nombre == "PESOS" && item.igtf_pago == 0 && item.tipo_registro == 0){
                            sumaPesos = sumaPesos + item.monto
                        }else if(item.divisa_nombre == "BOLIVARES" && item.igtf_pago == 0 && item.tipo_registro == 0){
                        //console.log("!!!!!!", item.monto)
                            sumaBolivares = sumaBolivares + item.monto;
                        }   
                        //////////////////////////////SUMATORIA DE VUELTOS//////////////////////////////////////
                        if(item.divisa_nombre == "DOLARES" && item.igtf_pago == 0 && item.tipo_registro == 1){
                            sumaDolaresVueltos = sumaDolaresVueltos + item.monto;
                        }else if(item.divisa_nombre == "PESOS" && item.igtf_pago == 0 && item.tipo_registro == 1){
                            sumaPesosVueltos = sumaPesosVueltos + item.monto
                        }else if(item.divisa_nombre == "BOLIVARES" && item.igtf_pago == 0 && item.tipo_registro == 1){
                        //console.log("!!!!!!", item.monto)
                            sumaBolivaresVueltos = sumaBolivaresVueltos + item.monto;
                        }   
                        //////////////////////////////SUMATORIA DE IGTF//////////////////////////////////////
                        if(item.divisa_nombre == "DOLARES" && item.igtf_pago == 1){
                            sumaDolaresIGTF = sumaDolaresIGTF + item.monto;
                        }else if(item.divisa_nombre == "PESOS" && item.igtf_pago == 1){
                            sumaPesosIGTF = sumaPesosIGTF + item.monto
                        }else if(item.divisa_nombre == "BOLIVARES" && item.igtf_pago == 1){
                        //console.log("!!!!!!", item.monto)
                            sumaBolivaresIGTF = sumaBolivaresIGTF + item.monto;
                        }  
        }

        let pesosConvertidos =  Number(Math.round(sumaPesos+ "e+2") + "e-2");
        let totalDolares = 0;
        let dolaresRedondeado = 0; //LA BASE IMPONIBLE EN IGTF
        let bolivaresRedondeado = 0; //LA BASE IMPONIBLE EN IGTF
        let conversionDolarBolivar = 0;
        let vueltosPesosToDolares = 0, vueltosBolivaresToDolares = 0;
        let sumaBolivaresToDolares = 0, sumaPesosToDolares = 0;
        let igtfBolivaresToDolares = 0, igtfPesosToDolares = 0;
        let dolaresTotales = 0, vueltosDolaresTotales = 0, igtfDolarTotal = 0;

        vueltosPesosToDolares = sumaPesosVueltos / req.body.tasa_pesos_dia;
        sumaPesosToDolares = sumaPesos / req.body.tasa_pesos_dia;
        igtfPesosToDolares = sumaPesosIGTF / req.body.tasa_pesos_dia;

        vueltosBolivaresToDolares = sumaBolivares / req.body.tasa_bolivar_dia;
        sumaBolivaresToDolares = sumaBolivares / req.body.tasa_bolivar_dia;
        igtfBolivaresToDolares = sumaBolivaresIGTF / req.body.tasa_bolivar_dia;

        
        dolaresTotales = sumaPesosToDolares + sumaBolivaresToDolares + sumaDolares;
        vueltosDolaresTotales = sumaDolaresVueltos + vueltosPesosToDolares + vueltosBolivaresToDolares;
        igtfDolarTotal = sumaDolaresIGTF + igtfBolivaresToDolares + igtfPesosToDolares;

        if(vueltosPesosToDolares > 0  || vueltosBolivaresToDolares > 0 || sumaDolaresVueltos > 0){
            dolaresRedondeado = Number(Math.round((dolaresTotales - vueltosDolaresTotales - igtfDolarTotal)+ "e+2") + "e-2");
            bolivaresRedondeado = dolaresRedondeado * req.body.tasa_bolivar_dia
        }else{
            dolaresRedondeado = Number(Math.round(dolaresTotales+ "e+2") + "e-2");
            bolivaresRedondeado = dolaresRedondeado * req.body.tasa_bolivar_dia;
        }
        
        
        req.body.bolivaresRedondeado = Number(Math.round(bolivaresRedondeado+ "e+2") + "e-2");
        req.body.dolaresRedondeado = Number(Math.round(dolaresRedondeado+ "e+2") + "e-2");

        
        const sql = "SELECT * FROM `tbl_numero_orden_trabajo_tmp`";
        let numNC;
        connection.query(sql, function (err, result, fields) {
            if (err) {
                console.log('ERROR en CheckTemplate', err);
                res.send('3');
            }
            if(result){
                numNC=result[0].numero_orden_trabajo;
                //console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', result)
                crearFactura(numNC)
            }
        });

        function crearFactura(numNC){
            //console.log('PASO A AGREGAR CONVENIO!!!!!!!', req.body)
            let time = new Date(new Date().toLocaleString("en-US", {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true
            }));
                connection.query('INSERT INTO `tbl_factura` SET?', {
                    orden_trabajo: numNC,
                    id_cliente: req.body.id_cliente,
                    total_bolivares: req.body.total_bolivares,
                    total_dolares: req.body.total_dolares,
                    total_pesos: req.body.total_pesos,
                    descuento_bolivares: req.body.descuento_bolivares,
                    descuento_dolares: req.body.descuento_dolares,
                    descuento_pesos: req.body.descuento_pesos,
                    IGTF_bolivares: req.body.IGTF_bolivares,
                    IGTF_dolares: req.body.IGTF_dolares, 
                    IGTF_pesos: req.body.IGTF_pesos,
                    base_imponible_bolivares : req.body.bolivaresRedondeado,
                    base_imponible_dolares : req.body.dolaresRedondeado,
                    tasa_pesos_dia: req.body.tasa_pesos_dia,
                    tasa_bolivar_dia: req.body.tasa_bolivar_dia,
                    id_tipo_factura: 5,
                    debe_dolares: req.body.total_dolares - req.body.descuento_dolares,
                    id_usuario: req.body.id_usuario,
                    id_estado_factura: 2,
                    fecha_creacion_factura: null,
                    fecha_creacion_orden_trabajo: time,
                    fecha_cancelacion: time,
                    impreso: 1,
                    factura_qr: config.URL+uniqid()
                }, (err, result) => {
                    if (err) {
                        console.log('no se pudo a agregar', err)
                        res.send('ERROR EN AGREGAR FACTURA!')
                    } else {
                        //console.log('agrego!!', result)
                        //res.send('AGREGO FACTURA!')
                        update(numNC, 3);
                    }
                });
        }

        function update(numNC, tip){
            const sqlUpdate = "UPDATE `tbl_numero_orden_trabajo_tmp` SET numero_orden_trabajo = numero_orden_trabajo + 1 WHERE id_orden_trabajo = 1"
            connection.query(sqlUpdate, function (err, result, fie) {
                if (err) {
                    console.log('error en la conexion intente de nuevo', err)
                    res.send('3')
                }else{
                    //console.log('numero de orden de trabajo aumentado!')
                    //res.send('sea agrego factura con orden de trabajo y numero de orden de trabajo aumentado!')
                    extraerFactura(numNC);
                }
            })
        }
        //////////////////////////////////////////////////////////////
    }

    function extraerFactura(num){
        let sql;
        if(req.body.id_tipo_factura == 1 || req.body.id_tipo_factura == 2){
             sql = "SELECT id_factura FROM `tbl_factura` WHERE numero_factura='" +num+"'";
        }else if(req.body.id_tipo_factura == 3 || req.body.id_tipo_factura == 5){
             sql = "SELECT id_factura FROM `tbl_factura` WHERE orden_trabajo='" +num+"'";
        }
        
        connection.query(sql, function (err, result, fields) {
            if (err) {
                console.log('ERROR en CheckTemplate !!!', err);
                res.send('3');
            }
            if(result){
                //console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', result);
                let factura = result[0].id_factura
                detallesDeFactura(factura)
                //console.log('FACTURA!!!!!!!', factura);
                //res.send(result);
            }
        });

        function detallesDeFactura(factura){
            //console.log('EN DETALLES DE FACTURA CONVENIO', req.body.detallesExamenes)

           let detallesExamenes = req.body.detallesExamenes;
           let memory = 0;
           let r = 0;
           for(let i = 0; i<detallesExamenes.length; i++){
                //console.log('Posicion del vector', i)
               for(let j=0; j<detallesExamenes[i].pacientes.length; j++){
                   //console.log('id del paciente', detallesExamenes[i].pacientes[j])
                    for(let k=0; k<detallesExamenes[i].items.length; k++){
                        //console.log('id del examen', detallesExamenes[i].examenes[k])
                        memory++;
                    }
               }
           }
           //console.log('Cuanto es memory?', memory)
           let myValues = new Array(memory);
           //console.log('MEMORIA DE MEMORY', memory);
           for(let i=0; i<memory; i++){
               myValues[i] = new Array(7);
           }
           //console.log('EN DETALLES DE FACTURA CONVENIO', detallesExamenes, lengthDetalles)
           //console.log(myValues)
           for(let i = 0; i<detallesExamenes.length; i++){
            console.log("999999999999999999999999999999999999999", detallesExamenes[i])
                for(let j=0; j<detallesExamenes[i].pacientes.length; j++){
                        for(let k=0; k<detallesExamenes[i].items.length; k++){
                            //memory++;
                            //console.log('PASO j', j)
                        //console.log('EL ID DEL PACIENTE',pacientesExamenesREQ[i].id_paciente)
                        let key = Object.keys(detallesExamenes[i].items[k]).toString()
                        key = key.split(",");
                        //console.log('!!', key);
                        if(key[0] == "id_examen"){
                            //console.log('ESTAS ES UN EXAMEN')
                            myValues[r][0]= factura,
                            myValues[r][1]= null,
                            myValues[r][2]= detallesExamenes[i].pacientes[j].id_paciente,
                            myValues[r][3]= detallesExamenes[i].items[k].id_examen,
                            myValues[r][4]= null
                            myValues[r][5]= detallesExamenes[i].items[k].nombre,
                            myValues[r][6] = detallesExamenes[i].items[k].precio
                        }else if(key[0] == "id_cultivo"){
                            //console.log('ESTAS ES UN CULTIVO')
                            myValues[r][0]= factura,
                            myValues[r][1]= null,
                            myValues[r][2]= detallesExamenes[i].pacientes[j].id_paciente,
                            myValues[r][3]= null,
                            myValues[r][4]= detallesExamenes[i].items[k].id_cultivo
                            myValues[r][5]= detallesExamenes[i].items[k].nombre,
                            myValues[r][6] = detallesExamenes[i].items[k].precio
                        }   
                            r++;
                        }
                }
            }
            //console.log("en myValues", myValues);
            //res.send(myValues);
            //console.log('LOS VALUES', myValues);
            const sql = 'INSERT INTO tbl_detalle_factura_paciente (id_factura, id_registro_convenio, id_paciente, id_examen, id_cultivo, nombre_especifico, precio) VALUES?';
            connection.query(sql, [myValues], (err, result) => {
                if (err) {
                    //console.log('no se pudo a agregar', err)
                    res.send('ERROR!')
                } else {
                    //console.log('agrego!!', result)
                    //res.send('AGREGO!');
                    detallesFiscales(factura);
                }
            });
        }

        function detallesFiscales(factura){
            let pagos = req.body.pagos;
            let memory = pagos.length;
            //console.log('LOS PAGOS', pagos);
            let myValues = new Array(memory);
            //console.log('MEMORIA DE MEMORY', memory);
            let fecha_creacion = new Date(new Date().toLocaleString("en-US", {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true
            }));
            for(let i=0; i<memory; i++){
                myValues[i] = new Array(11);
            }
            for(let i=0; i<memory; i++){
                for(let j=0; j<1; j++){
                   myValues[i][0] = factura;
                   myValues[i][1] = pagos[i].id_registro_divisa
                   myValues[i][2] = pagos[i].id_tipo_pago
                   myValues[i][3] = pagos[i].id_banco
                   myValues[i][4] = pagos[i].numero_referencia
                   myValues[i][5] = pagos[i].tipo_registro
                   myValues[i][6] = pagos[i].monto,
                   myValues[i][7] = pagos[i].igtf_pago
                   myValues[i][8] = fecha_creacion
                   myValues[i][9] = pagos[i].igtf_monto
                   myValues[i][10] = req.body.id_usuario
                }
            }
            //console.log('LOS VALUES DE LOS PAGOS', myValues);
            if(myValues == 0){
                extraerDetallesFacturaPaciente(factura);
            }else{
                const sql = 'INSERT INTO `tbl_registro_pago` (id_factura, id_registro_divisa, id_tipo_pago, id_banco, numero_referencia, tipo_registro, monto, igtf_pago, fecha_creacion, igtf_monto, id_usuario) VALUES?';
                connection.query(sql, [myValues], (err, result) => {
                    if (err) {
                        console.log('no se pudo a agregar', err)
                        res.send('ERROR!')
                    } else {
                        //console.log('agrego!!', result)
                        //res.send('AGREGO REGISTROS DE PAGO!');
                        //extraerNumeroOrden(factura)
                        extraerDetallesFacturaPaciente(factura);
                    }
                });
            }
        }
        function extraerDetallesFacturaPaciente(factura){
            const sql = "SELECT id_detalle_factura_paciente, id_paciente FROM `tbl_detalle_factura_paciente` WHERE id_factura='" +factura+"'";
            connection.query(sql, function (err, result, fields) {
                if (err) {
                    console.log('ERROR en CheckTemplate', err);
                    res.send('3');
                }
                if(result){
                    //moduladorDeOrden(factura, 1, result, 99)
                    crearOrdenConvenio(result, factura);
                }
            });
        }
    
    }

    ////////////////////VARIABLES PARA ORDENES Y DETALLES DE ORDENES///////////////////
    let numOrden = 0;
    let loop = 0;
    let idPaciente = 0;
    let idOrden = 0;
    let detalleOrden = 0;

    async function crearOrdenConvenio(result, factura){
        //console.log('PASO A extraerDetallesFacturaPaciente!', result);
        loop = result.length;
        let ordenQr;
        for(let i=0; i<loop; i++){
            if(result[i].id_paciente != null){
                idPaciente = result[i].id_paciente;
               //result[i].id_paciente = null;
                await crearOrden();
                ordenQr = await insertarOrden();
                await updateOrden();
                await extraerIdOrden(ordenQr);
                //console.log('EL NUMERO DE ORDEN:', numOrden)
                //console.log('EL ID ORDEN:', idOrden)
            }
            for(let j=0; j<loop; j++){
                //if(result[j].id_paciente != null){
                    if(result[j].id_paciente == idPaciente){
                        result[j].id_paciente = null;
                        //console.log('CORO', result[j].id_detalle_factura_paciente)
                        await crearDetalleOrden(result[j].id_detalle_factura_paciente)
                    }
                //}
            }
        }
        //console.log(result)
        //res.send('CREACION DE TODO!')
        //console.log("/////////////////////////////////////////////////////////", factura, req.body.id_tipo_factura)
        let ipSocket, ipNormal, ip, ipDef
            ipSocket = req.socket.remoteAddress;
            ipNormal = req.ip;
            ipNormal = ipNormal.split(":");
            ipDef = ipNormal[3];
            //ip = "192.168.0.112";

            //console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX", ipSocket);
            //console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX", ipNormal);
            //console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX", req);
                        //http://localhost:3000/ordenesImpresion
            axios.get('http://localhost:3000/ordenesImpresion/'+factura)
            .then(function (response) {
                imprimirFacturaOrdenes(response.data)
            })

            function imprimirFacturaOrdenes(respOrdenes){
                //console.log("JAJAJAJAJAJAJAJAJAJAJAJAJAJAJAJJAJAJAJAJAA", respOrdenes);
                let numOrdenes = respOrdenes.length;
                //http://'+ipDef+':5000/impresion
                axios.post('http://'+ipDef+':5000/impresion', {
                ordenes: respOrdenes,
                numero_impresiones: numOrdenes,
                id_factura: factura
                }).then(function (response) {
                //console.log(response.data);
                //res.send(response.data)
                res.redirect('/imprimirFactura/'+factura+'/'+req.body.id_tipo_factura)
                }).catch(function (error) {
                    // handle error
                    //console.log(error);
                    res.redirect('/imprimirFactura/'+factura+'/'+req.body.id_tipo_factura)
                  })
            }
        //res.redirect('/imprimirFactura/'+factura+'/'+req.body.id_tipo_factura);
    }

    async function crearOrdenRegistroConvenio(result, numR){
        //console.log('crearOrdenRegistroConvenio!', result);
        loop = result.length;
        let ordenQr;
        for(let i=0; i<loop; i++){
            if(result[i].id_paciente != null){
                idPaciente = result[i].id_paciente;
               //result[i].id_paciente = null;
                await crearOrden();
                ordenQr = await insertarOrden();
                await updateOrden();
                await extraerIdOrden(ordenQr);
                //console.log('EL NUMERO DE ORDEN:', numOrden)
                //console.log('EL ID ORDEN:', idOrden)
            }
            for(let j=0; j<loop; j++){
                //if(result[j].id_paciente != null){
                    if(result[j].id_paciente == idPaciente){
                        result[j].id_paciente = null;
                        //console.log('CORO', result[j].id_detalle_factura_paciente)
                        await crearDetalleOrden(result[j].id_detalle_factura_paciente)
                    }
                //}
            }
        }
        //console.log(result)
        //res.send('CREACION DE TODO!')
        //console.log("/////////////////////////////////////////////////////////", numR, req.body.id_tipo_factura)
        let ipSocket, ipNormal, ip, ipDef;
        //ipSocket = req.socket.remoteAddress;
        ipNormal = req.ip;
        ipNormal = ipNormal.split(":");
        ipDef = ipNormal[3];
        //ip = "192.168.0.112";
  
       //console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX", ipSocket);
       //console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX", ipNormal);
       //console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX", req);
                    //http://localhost:3000/ordenesImpresion
       axios.get('http://localhost:3000/ordenesImpresionRegistroConvenio/'+numR)
       .then(function (response) {
           imprimirFacturaOrdenes(response.data)
        })
  
      function imprimirFacturaOrdenes(respOrdenes){
          //console.log("JAJAJAJAJAJAJAJAJAJAJAJAJAJAJAJJAJAJAJAJAA", respOrdenes);
          let numOrdenes = respOrdenes.length;
          //http://'+ipDef+':5000/impresion
          axios.post('http://'+ipDef+':5000/impresion', {
             ordenes: respOrdenes,
             numero_impresiones: numOrdenes,
             id_factura: numR
           }).then(function (response) {
             //console.log(response.data);
     
             //res.send(response.data)
             res.redirect('/imprimirRegistroConvenio/'+numR);
           }).catch(function (error) {
            // handle error
            //console.log(error);
            //res.redirect('/imprimirFactura/'+factura+'/'+req.body.id_tipo_factura)
            res.redirect('/imprimirRegistroConvenio/'+numR);
          })
      }
        //
    }

    async function crearOrden(){
        return new Promise((resolve, reject) => {
                    //result.splice(0, 1);
                    //console.log('RESULT DEL SPLICE', result)
                    const sql = "SELECT numero_orden FROM `tbl_numero_orden_tmp`";
                    connection.query(sql, function (err, result, fields) {
                        if (err) {
                            //console.log('ERROR en CheckTemplate', err);
                            res.send('3');
                        }
                        if (result) {
                            //console.log('ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ', result)
                            numOrden = result[0].numero_orden;
                            //insertarOrden(numOrden, memoryRest);
                            resolve('1')
                        }
                        });
        });
    }

    async function insertarOrden(){
        return new Promise((resolve, reject) => {
            let orden_qr;
            let orden_qr_nube = config.URL2+uniqid()
            let time = new Date(new Date().toLocaleString("en-US", {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true
            }));
            orden_qr = uniqid();
            connection.query('INSERT INTO `tbl_orden` SET?', {
                numero_orden: numOrden,
                orden_qr: orden_qr,
                orden_qr_nube: orden_qr_nube,
                fecha: time
            }, (err, result) => {
                if (err) {
                    console.log('no se pudo a agregar', err)
                    res.send('ERROR EN CREAR LA ORDEN!')
                } else {
                   resolve(orden_qr)
                }
            });
        });
    }
    
    async function updateOrden(){
        return new Promise((resolve, reject) => {
            const sqlUpdate = "UPDATE `tbl_numero_orden_tmp` SET numero_orden = numero_orden + 1 WHERE id_numero_orden = 1"
                    connection.query(sqlUpdate, function (err, result, fie) {
                        if (err) {
                            console.log('error en la conexion intente de nuevo', err)
                            res.send('3')
                        }else{
                            //console.log('numero de factura aumentado!')
                            //res.send('sea modifico la factura y numero de factura aumentado!')
                            //crearDetalleOrden(numOrden, memoryRest);
                            resolve('1')
                        }
                    })
        });
    }

    async function extraerIdOrden(ordenQr){
        return new Promise((resolve, reject) => {
            const sql = "SELECT id_orden FROM `tbl_orden` WHERE orden_qr='" +ordenQr+"'";
                    connection.query(sql, function (err, result, fields) {
                        if (err) {
                            console.log('ERROR en CheckTemplate', err);
                            res.send('3');
                        }
                        if(result){
                            //console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', result[0].id_factura);
                            idOrden = result[0].id_orden
                            resolve(idOrden)
                        }
                     });
        });
    }

    async function crearDetalleOrden(detalleFacturaPaciente){
        return new Promise((resolve, reject) => {
            //const sql = 'INSERT INTO tbl_detalle_orden (id_orden, id_detalle_factura_paciente) VALUES?';
            connection.query('INSERT INTO tbl_detalle_orden SET?', {
                id_orden: idOrden,
                id_detalle_factura_paciente: detalleFacturaPaciente
            }, (err, result) => {
                if (err) {
                    console.log('no se pudo a agregar', err)
                    res.send('ERROR EN AGREGAR FACTURA!')
                } else {
                    //console.log('agrego!!', result)
                    //res.send('AGREGO FACTURA!')
                    resolve('1');
                }
            });
        });
    }

}

facturacionCtrl.crearFacturaPorOrdenTrabajo = async(req, res) =>{
    //console.log("!!!!!!!!!!!!!!!!!!!!!", req.body);
    let factura = await buscarFactura(req.body.id_factura)
    let numFact;
    let check;
    let detalle;
    let sumaPesos = 0;
    let sumaDolares = 0;
    let sumaBolivares = 0;
    let sumaPesosVueltos = 0;
    let sumaDolaresVueltos = 0;
    let sumaBolivaresVueltos = 0;
    let registroDePagos;
    let divisas;
    let pesos, dolares, bolivares
    //console.log('EN RESULT!!!!!!!!!!!!!!!!!!!!!!!!!!!', result)

    registroDePagos = await getRegistroPagos(registroDePagos, req.body.id_factura);
    divisas = await getDivisas();
    for(const divisa of divisas){
        if(divisa.divisa_nombre == "DOLARES"){
            dolares = divisa.tasa_actual;
        }
    }
    bolivares = factura[0].tasa_bolivar_dia;
    pesos = factura[0].tasa_pesos_dia;
    //console.log("!!!!!!!!!!!!!!!!11", registroDePagos, divisas)

    ////////////////////CONVERTIR PESOS A DOLARES////////////////////////
    for(const item of registroDePagos){
        //console.log("CCCCCCCCCCCCCCCCCCCCCCCCCCCC", item.igtf_pago)
        /////////////////////////////////SUMATORIA DE PAGOS//////////////////////////////////
        if(item.divisa_nombre == "DOLARES" && item.igtf_pago == '0' && item.tipo_registro == 0){
            sumaDolares = sumaDolares + item.monto;
        }else if(item.divisa_nombre == "PESOS" && item.igtf_pago == '0' && item.tipo_registro == 0){
            sumaPesos = sumaPesos + item.monto;
        }else if(item.divisa_nombre == "BOLIVARES" && item.igtf_pago == '0' && item.tipo_registro == 0){
        //console.log("!!!!!!", item.monto)
            sumaBolivares = sumaBolivares + item.monto;
        }   
        //////////////////////////////SUMATORIA DE VUELTOS//////////////////////////////////////
        if(item.divisa_nombre == "DOLARES" && item.igtf_pago == '0' && item.tipo_registro == 1){
            sumaDolaresVueltos = sumaDolaresVueltos + item.monto;
        }else if(item.divisa_nombre == "PESOS" && item.igtf_pago == '0' && item.tipo_registro == 1){
            sumaPesosVueltos = sumaPesosVueltos + item.monto;
        }else if(item.divisa_nombre == "BOLIVARES" && item.igtf_pago == '0' && item.tipo_registro == 1){
        //console.log("!!!!!!", item.monto)
            sumaBolivaresVueltos = sumaBolivaresVueltos + item.monto;
        }   
    }
    //console.log("......................", sumaDolares, sumaPesos, sumaBolivares)
    //let pesosConvertidos =  Number(Math.round(sumaPesos+ "e+2") + "e-2");
    let totalDolares;
    let dolaresRedondeado; //LA BASE IMPONIBLE EN IGTF
    let bolivaresRedondeado; //LA BASE IMPONIBLE EN IGTF
    let conversionDolarBolivar;
    let conversionPesoDolar = 0;
    let conversionPesoBolivar = 0;

    sumaDolares = sumaDolares - sumaDolaresVueltos;
    sumaPesos = sumaPesos - sumaPesosVueltos;
    sumaBolivares = sumaBolivares - sumaBolivaresVueltos;
    conversionPesoDolar = sumaPesos / pesos//Number(Math.round((sumaPesos / pesos)+ "e+2") + "e-2");
    totalDolares = conversionPesoDolar + sumaDolares;
    dolaresRedondeado = Number(Math.round(totalDolares+ "e+2") + "e-2");
    ///////////////////CONVIRTIENDO DOLARES//////////////////////////
    conversionDolarBolivar = (totalDolares * bolivares)
    bolivaresRedondeado = Number(Math.round((dolaresRedondeado * bolivares)+ "e+2") + "e-2");
    req.body.bolivaresRedondeado = bolivaresRedondeado;
    req.body.dolaresRedondeado = dolaresRedondeado;

    numFact = await extraerNumeroFactura(numFact);
    check = await crearFactura(numFact);
    check = await update(check);
    detalle = await extrerDetalleFactura(numFact, detalle);
    imprimirFactura(detalle.id_factura, detalle.id_tipo_factura)

    //res.send(detalle);
    
    async function extraerNumeroFactura(numFact){
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM `tbl_numero_factura_tmp`";
            connection.query(sql, function (err, result, fields) {
                if (err) {
                    console.log('ERROR en CheckTemplate', err);
                    res.send('3');
                }
                if(result){
                    let numFact;
                    numFact=result[0].numero_factura;
                    resolve(numFact);
                }
            });
        });
    }
    
    async function crearFactura(numFact){
        return new Promise((resolve, reject) => {
            let time = new Date(new Date().toLocaleString("en-US", {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true
            }));
            //let time;
            let year, month, day, hour, minute, second, formatTime;
            year = time.getFullYear();
            month = time.getMonth() + 1;
            day = time.getDate();
            hour = time.getHours();
            minute = time.getMinutes();
            second = time.getSeconds();

            

            formatTime = year+"-"+month+"-"+day+" "+hour+":"+minute+":"+second;

            //console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX", year, month, day, hour, minute, second, formatTime, req.body.bolivaresRedondeado, req.body.dolaresRedondeado)
            const sqlUpdate = "UPDATE `tbl_factura` SET numero_factura = '"+numFact+"', fecha_creacion_factura = '"+formatTime+"', fecha_cancelacion = '"+formatTime+"', id_tipo_factura = '1', base_imponible_bolivares = '"+req.body.bolivaresRedondeado+"', base_imponible_dolares = '"+req.body.dolaresRedondeado+"' WHERE id_factura = '"+req.body.id_factura+"'"
            connection.query(sqlUpdate, function (err, result, fie) {
                if (err) {
                    console.log('error en la conexion intente de nuevo', err)
                    res.send('3')
                }else{
                    //console.log('numero de factura aumentado!')
                    //res.send('sea agrego factura y numero de factura aumentado!')
                    //detallesDeFactura(numFact);
                    //console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!", result)
                    resolve("1")
                }
            })
        })
    }
    
    async function update(numFact){
        return new Promise((resolve, reject) => {
            const sqlUpdate = "UPDATE `tbl_numero_factura_tmp` SET numero_factura = numero_factura + 1 WHERE id_numero_factura = 1"
            connection.query(sqlUpdate, function (err, result, fie) {
                if (err) {
                    console.log('error en la conexion intente de nuevo', err)
                    res.send('3')
                }else{
                    //console.log('numero de factura aumentado!')
                    //res.send('sea agrego factura y numero de factura aumentado!')
                    //detallesDeFactura(numFact);
                    resolve("1");
                }
            })
        });
    }

    async function extrerDetalleFactura(numFact, detalle){
        return new Promise((resolve, reject) => {
            const sql = "SELECT id_factura, id_tipo_factura FROM `tbl_factura` WHERE numero_factura = '"+numFact+"'";
            connection.query(sql, function (err, result, fie) {
                if (err) {
                    console.log('error en la conexion intente de nuevo', err)
                    res.send('3')
                }else{
                    //console.log('numero de factura aumentado!')
                    //res.send('sea agrego factura y numero de factura aumentado!')
                    //detallesDeFactura(numFact);
                    detalle = result[0]
                    resolve(detalle);
                }
            })
        })  
    }

    async function getRegistroPagos(registroDePagos, idFactura){
        return new Promise((resolve, reject) => {
            let sql = "SELECT tbl_registro_pago.id_registro_divisa, tbl_registro_pago.id_registro_pago, tbl_registro_pago.tipo_registro, tbl_registro_pago.monto, tbl_registro_pago.igtf_pago, tbl_registro_divisa.id_divisa, tbl_registro_divisa.tasa_actual, tbl_divisa.divisa_nombre FROM tbl_registro_pago INNER JOIN tbl_registro_divisa ON tbl_registro_divisa.id_registro_divisa = tbl_registro_pago.id_registro_divisa INNER JOIN tbl_divisa ON tbl_registro_divisa.id_divisa = tbl_divisa.id_divisa WHERE id_factura='" +idFactura+"'";
            connection.query(sql, function (err, result, fields) {
                if (err) {
                    console.log('ERROR en CheckTemplate', err);
                    res.send('3');
                }
                if(result){
                    //console.log(result)
                    registroDePagos = result;
                    resolve(registroDePagos)
                }
            });
        })
    }

    async function getDivisas(){
        return new Promise((resolve, reject) => {
            const sql = "SELECT a.tasa_actual, a.id_registro_divisa, a.id_divisa, c.divisa_nombre FROM tbl_registro_divisa a INNER JOIN tbl_divisa c ON c.id_divisa = a.id_divisa WHERE id_registro_divisa = (SELECT MAX(id_registro_divisa) FROM `tbl_registro_divisa` b WHERE a.id_divisa = b.id_divisa)"
            connection.query(sql, function (err, result, fie) {
                if (err) {
                    console.log('error en la conexion intente de nuevo', err)
                    res.send('3')
                }
                //console.log('el result examen: ', result)
                resolve(result)
            })
        })
    }

    async function buscarFactura(idFactura){
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM tbl_factura WHERE id_factura = ${idFactura}`
            connection.query(sql, function (err, result, fie) {
                if (err) {
                    console.log('error en buscar factura', err)
                    res.send('3')
                }
                //console.log('el result examen: ', result)
                resolve(result)
            })
        })
    }

    function imprimirFactura(idFactura, idTipoFactura){
        res.redirect('/imprimirFactura/'+idFactura+'/'+idTipoFactura);
    }
}
///////////////////////////////////////////////////////////////////////////////////////////////////////
facturacionCtrl.facturarReciboRegistroConvenio = async(req, res) =>{
    //console.log("1")
    let numFact;
    let idFactura;
    let idRegistroConvenio = {};
    let recibo = {};
    let registroDePagos;
    let dolares, bolivares, pesos;
    registroDePagos = await getRegistroPagos(req.body.id_recibo);
    divisas = await getDivisas();
    for(const divisa of divisas){
        if(divisa.divisa_nombre == "DOLARES"){
            dolares = divisa.tasa_actual;
        }else if(divisa.divisa_nombre == "BOLIVARES"){
            bolivares = divisa.tasa_actual;
        }else if(divisa.divisa_nombre == "PESOS"){
            pesos = divisa.tasa_actual;
        }
    }

    
    let pesosConvertidos = 0;
    let totalDolares = 0;
    let dolaresRedondeado = 0; //LA BASE IMPONIBLE EN IGTF
    let bolivaresRedondeado = 0; //LA BASE IMPONIBLE EN IGTF
    let conversionDolarBolivar = 0;
    let sumaBolivaresIGTFVueltos= 0;
        ///////////////////////////////////////////////BASE IMPONIBLE///////////////////////////////////////////
        let sumaPesos = 0;
        let sumaDolares = 0;
        let sumaBolivares = 0;
        let sumaPesosVueltos = 0;
        let sumaDolaresVueltos = 0;
        let sumaBolivaresVueltos = 0;
        let sumaPesosIGTF = 0; 
        let sumaDolaresIGTF = 0;
        let sumaBolivaresIGTF = 0;

        ////////////////////CONVERTIR PESOS A DOLARES////////////////////////
        //console.log("BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB", registroDePagos)
    for(const item of registroDePagos){
        //console.log("CCCCCCCCCCCCCCCCCCCCCCCCCCCC", item.igtf_pago)
        /////////////////////////////////SUMATORIA DE PAGOS//////////////////////////////////
        if(item.divisa_nombre == "DOLARES" && item.igtf_pago == '0' && item.tipo_registro == '0'){
            sumaDolares = sumaDolares + item.monto;
        }else if(item.divisa_nombre == "PESOS" && item.igtf_pago == '0' && item.tipo_registro == '0'){
            sumaPesos = sumaPesos + (item.monto / pesos);
            //console.log("SUMA PESOS!!!", sumaPesos)
        }else if(item.divisa_nombre == "BOLIVARES" && item.igtf_pago == '0' && item.tipo_registro == '0'){
        //console.log("!!!!!!", item.monto)
            //sumaBolivares = sumaBolivares + (item.monto / req.body.tasa_bolivar_dia);
        }   
        //////////////////////////////SUMATORIA DE VUELTOS//////////////////////////////////////
        if(item.divisa_nombre == "DOLARES" && item.igtf_pago == '0' && item.tipo_registro == '1'){
            sumaDolaresVueltos = sumaDolaresVueltos + item.monto;
        }else if(item.divisa_nombre == "PESOS" && item.igtf_pago == '0' && item.tipo_registro == '1'){
            sumaPesosVueltos = sumaPesosVueltos + (item.monto / pesos);
            //console.log("SUMA PESOS VUELTOS!!!", sumaPesosVueltos)
        }else if(item.divisa_nombre == "BOLIVARES" && item.igtf_pago == '0' && item.tipo_registro == '1'){
        //console.log("!!!!!!", item.monto)
            sumaBolivaresVueltos = sumaBolivaresVueltos + (item.monto / bolivares);
        }   
        //////////////////////////////SUMATORIA DE IGTF//////////////////////////////////////
        if(item.divisa_nombre == "DOLARES" && item.igtf_pago == '1'){
            sumaDolaresIGTF = sumaDolaresIGTF + item.monto;
        }else if(item.divisa_nombre == "PESOS" && item.igtf_pago == '1'){
            sumaPesosIGTF = sumaPesosIGTF + (item.monto / pesos);
            //console.log("SUMA PESOS IGTF!!!", sumaPesosIGTF)
        }else if(item.divisa_nombre == "BOLIVARES" && item.igtf_pago == '1'){
        //console.log("!!!!!!", item.monto)
            sumaBolivaresIGTF = sumaBolivaresIGTF + (item.monto / bolivares);
        }   
    }
    pesosConvertidos = Number(Math.round(sumaPesos+ "e+2") + "e-2");
    sumaBolivaresIGTFVueltos = sumaBolivaresVueltos + sumaBolivaresIGTF;
    if(sumaDolaresVueltos == 0 && sumaBolivaresVueltos == 0 && sumaPesosVueltos == 0){
        sumaDolares = sumaDolares;
        totalDolares = pesosConvertidos + sumaDolares
    }else{
        //sumaBolivares = /*sumaBolivares*/ sumaBolivaresVueltos + sumaBolivaresIGTF; //YA ESTA CONVERTIDO EN DOLARES
        sumaDolares = sumaDolares - sumaDolaresVueltos - sumaBolivaresIGTFVueltos - sumaDolaresIGTF;
        totalDolares = pesosConvertidos + sumaDolares;
    }
    if(sumaDolaresVueltos == 0 && sumaBolivaresVueltos == 0 && sumaPesosVueltos == 0){
        sumaPesos = sumaPesos
    }else{
        sumaPesos = sumaPesos - sumaPesosVueltos - sumaPesosIGTF;
    }
    dolaresRedondeado = Number(Math.round(totalDolares+ "e+2") + "e-2");
    ///////////////////CONVIRTIENDO DOLARES//////////////////////////
    conversionDolarBolivar = (totalDolares * bolivares)
    //totalBolivares = conversionDolarBolivar + sumaBolivares;
    bolivaresRedondeado = Number(Math.round(conversionDolarBolivar+ "e+2") + "e-2");
    if(bolivaresRedondeado < 0) bolivaresRedondeado = 0;
    if(dolaresRedondeado < 0) dolaresRedondeado = 0;
    req.body.bolivaresRedondeado = bolivaresRedondeado;
    req.body.dolaresRedondeado = dolaresRedondeado;
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //console.log("CCCCCCCCCCCCCCCCCCCCCCCCCCCCCC", sumaDolares, sumaBolivares, sumaPesos, sumaBolivaresIGTF, sumaPesosIGTF, sumaDolaresIGTF, sumaDolaresVueltos, sumaPesosVueltos, sumaBolivaresVueltos)
    recibo = await extraerReciboConvenio(req.body.id_recibo)
    //console.log("EL RECIBO", recibo)
    numFact = await extraerNumeroFactura(numFact);
    await crearFactura(numFact, recibo);
    await update();
    idFactura = await extraerFactura(numFact);
    idRegistroConvenio = await extraerIdRegistroConvenioTablaDetalleRecibo(req.body.id_recibo)    
    await insertarFacturaRegistroPagos(idFactura);
    await insertarFacturaRecibo(idFactura);


    //console.log('EN RESULT!!!!!!!!!!!!!!!!!!!!!!!!!!!', result)
    for(const item of idRegistroConvenio){
        //console.log("XXXXXXXXXXXXXXXXXXXXXXX", item)
        await insertarFacturaRegistroConvenio(idFactura, item.id_registro_convenio)
    }
    for(const item of idRegistroConvenio){
        await insertarFacturaDetalleFacturaPaciente(idFactura, item.id_registro_convenio)
    }
    res.redirect('/imprimirFactura/'+idFactura+'/'+1);
    //res.send("1");

    async function getRegistroPagos(idRecibo){
        return new Promise((resolve, reject) => {
            let sql = "SELECT tbl_registro_pago.id_registro_divisa, tbl_registro_pago.monto, tbl_registro_pago.igtf_pago, tbl_registro_pago.tipo_registro, tbl_registro_divisa.id_divisa, tbl_registro_divisa.tasa_actual, tbl_divisa.divisa_nombre FROM tbl_registro_pago INNER JOIN tbl_registro_divisa ON tbl_registro_divisa.id_registro_divisa = tbl_registro_pago.id_registro_divisa INNER JOIN tbl_divisa ON tbl_registro_divisa.id_divisa = tbl_divisa.id_divisa WHERE id_recibo='" +idRecibo+"'";
            connection.query(sql, function (err, result, fields) {
                if (err) {
                    console.log('ERROR en CheckTemplate', err);
                    res.send('3');
                }
                if(result){
                    //console.log(result)
                    registroDePagos = result;
                    resolve(registroDePagos)
                }
            });
        })
    }

    async function getDivisas(){
        return new Promise((resolve, reject) => {
            const sql = "SELECT a.tasa_actual, a.id_registro_divisa, a.id_divisa, c.divisa_nombre FROM tbl_registro_divisa a INNER JOIN tbl_divisa c ON c.id_divisa = a.id_divisa WHERE id_registro_divisa = (SELECT MAX(id_registro_divisa) FROM `tbl_registro_divisa` b WHERE a.id_divisa = b.id_divisa)"
            connection.query(sql, function (err, result, fie) {
                if (err) {
                    console.log('error en la conexion intente de nuevo', err)
                    res.send('3')
                }
                //console.log('el result examen: ', result)
                resolve(result)
            })
        })
    }

    async function extraerReciboConvenio(idRecibo){
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM `tbl_recibo` WHERE id_recibo ='" +idRecibo+"'";;
            connection.query(sql, function (err, result, fields) {
                if (err) {
                    console.log('ERROR en CheckTemplate', err);
                    res.send('3');
                }
                if(result){
                    let recibo;
                    recibo = result[0];
                    resolve(recibo);
                }
            });
        })
    }

    async function extraerNumeroFactura(numFact){
        return new Promise((resolve, reject) => {
            //console.log("extraerNumeroFactura")
            const sql = "SELECT * FROM `tbl_numero_factura_tmp`";
            connection.query(sql, function (err, result, fields) {
                if (err) {
                    console.log('ERROR en CheckTemplate', err);
                    res.send('3');
                }
                if(result){
                    numFact=result[0].numero_factura;
                    resolve(numFact);
                }
            });
        });
    }
    
    async function crearFactura(numFact, recibo){
        //console.log("crearFactura")
        
        return new Promise((resolve, reject) => {
            let time = new Date(new Date().toLocaleString("en-US", {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true
            }));
                connection.query('INSERT INTO `tbl_factura` SET?', {
                    numero_factura: numFact,
                    id_cliente: req.body.id_cliente,
                    total_bolivares: recibo.monto_bolivares,
                    total_dolares: recibo.monto_dolares,
                    total_pesos: recibo.monto_pesos,
                    descuento_bolivares: recibo.descuento_bolivares,
                    descuento_dolares: recibo.descuento_dolares,
                    descuento_pesos: recibo.descuento_pesos,
                    tasa_bolivar_dia: recibo.tasa_bolivar_dia,
                    tasa_pesos_dia: recibo.tasa_pesos_dia,
                    base_imponible_bolivares: req.body.bolivaresRedondeado,
                    base_imponible_dolares: req.body.dolaresRedondeado,
                    IGTF_bolivares: recibo.IGTF_bolivares,
                    IGTF_dolares: recibo.IGTF_dolares, 
                    IGTF_pesos: recibo.IGTF_pesos,
                    debe_dolares: 0,
                    id_tipo_factura: 1,
                    id_usuario: req.body.id_usuario,
                    id_estado_factura: 1,
                    fecha_creacion_orden_trabajo: null,
                    fecha_creacion_factura: time,
                    fecha_cancelacion: time,
                    impreso: 1
                }, (err, result) => {
                    if (err) {
                        console.log('no se pudo a agregar', err)
                        res.send('ERROR EN AGREGAR FACTURA!')
                    } else {
                        resolve("1");
                    }
                });
        })
    }
    
    async function update(){
        //console.log("update")
        return new Promise((resolve, reject) => {
            const sqlUpdate = "UPDATE `tbl_numero_factura_tmp` SET numero_factura = numero_factura + 1 WHERE id_numero_factura = 1"
            connection.query(sqlUpdate, function (err, result, fie) {
                if (err) {
                    console.log('error en la conexion intente de nuevo', err)
                    res.send('3')
                }else{
                    resolve("1");
                }
            })
        });
    }

    function extraerFactura(num){
        //console.log("extraerFactura")
        return new Promise((resolve, reject) => {
            const sql = "SELECT id_factura FROM `tbl_factura` WHERE numero_factura='" +num+"'";
            connection.query(sql, function (err, result, fields) {
                if (err) {
                    console.log('ERROR en CheckTemplate', err);
                    res.send('3');
                }
                if(result){
                    let factura = result[0].id_factura
                    resolve(factura);
                }
            });
        });
    }

    function extraerIdRegistroConvenioTablaDetalleRecibo(idRecibo){
        //console.log("extraerIdRegistroConvenioTablaDetalleRecibo")
        return new Promise((resolve, reject) => {
            const sql = "SELECT id_registro_convenio FROM `tbl_detalle_recibo_registro_convenio` WHERE id_recibo='" +idRecibo+"'";
            connection.query(sql, function (err, result, fields) {
                if (err) {
                    console.log('ERROR en CheckTemplate', err);
                    res.send('3');
                }
                if(result){
                    resolve(result);
                }
            });
        });
    }

    async function insertarFacturaRegistroPagos(idFactura){
        //console.log("insertarFacturaRegistroPagos")
            return new Promise((resolve, reject) => {
                const sqlUpdate = "UPDATE `tbl_registro_pago` SET id_factura = '" +idFactura+"' WHERE id_recibo = '" +req.body.id_recibo+"'";
                connection.query(sqlUpdate, function (err, result, fie) {
                    if (err) {
                        console.log('error en la conexion intente de nuevo', err)
                        res.send('3')
                    }else{
                        console.log("ENTRO EN EL RESULT?")
                        resolve("1");
                    }
                })
            });
    }

    async function insertarFacturaRecibo(idFactura){
        //console.log("insertarFacturaRecibo")
        return new Promise((resolve, reject) => {
                const sqlUpdate = "UPDATE `tbl_recibo` SET id_factura = '" +idFactura+"' WHERE id_recibo = '" +req.body.id_recibo+"'";
                connection.query(sqlUpdate, function (err, result, fie) {
                    if (err) {
                        console.log('error en la conexion intente de nuevo', err)
                        res.send('3')
                    }else{
                        console.log("!!!!!!!!!!!!!!!!!!!!!!")
                        resolve("1");
                    }
                })
            });
    }

    async function insertarFacturaRegistroConvenio(idFactura, idRegistroConvenio){
        //console.log("insertarFacturaRegistroConvenio")
            return new Promise((resolve, reject) => {//3 PARA FACTURADO
                const sqlUpdate = "UPDATE `tbl_registro_convenio` SET id_factura = '" +idFactura+"', estado_registro = 3 WHERE id_registro_convenio = '" +idRegistroConvenio+"'";
                connection.query(sqlUpdate, function (err, result, fie) {
                    if (err) {
                        console.log('error en la conexion intente de nuevo', err)
                        res.send('3')
                    }else{
                        resolve("1");
                    }
                })
            });
    }

    async function insertarFacturaDetalleFacturaPaciente(idFactura, idRegistroConvenio){
        //console.log("insertarFacturaDetalleFacturaPaciente")
        return new Promise((resolve, reject) => {
            const sqlUpdate = "UPDATE `tbl_detalle_factura_paciente` SET id_factura = '" +idFactura+"' WHERE id_registro_convenio = '" +idRegistroConvenio+"'";
                connection.query(sqlUpdate, function (err, result, fie) {
                    if (err) {
                        console.log('error en la conexion intente de nuevo', err)
                        res.send('3')
                    }else{
                        resolve("1");
                    }
                })
            });
    }
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
facturacionCtrl.ordenesImpresion = async(req, res) =>{

    let ordenes;

    ordenes = await configOrdenesImpresion();
    //console.log("LOOLOLOLOLOLOLOLOLOLOLOLOLOLOLOL", ordenes)
    res.send(ordenes);
    async function configOrdenesImpresion(){
        return new Promise((resolve, reject) => {
            const sql = "SELECT tbl_detalle_factura_paciente.id_detalle_factura_paciente, tbl_detalle_factura_paciente.id_paciente, tbl_detalle_factura_paciente.id_examen, tbl_detalle_factura_paciente.id_cultivo, tbl_detalle_orden.id_orden, tbl_orden.numero_orden, tbl_paciente.paciente_nombre, tbl_paciente.paciente_apellido, tbl_paciente.paciente_cedula, tbl_paciente.edad, tbl_examen.id_departamento, tbl_departamento.departamento_nombre FROM `tbl_detalle_factura_paciente`  LEFT JOIN `tbl_detalle_orden` ON tbl_detalle_orden.id_detalle_factura_paciente = tbl_detalle_factura_paciente.id_detalle_factura_paciente LEFT JOIN tbl_orden ON tbl_detalle_orden.id_orden = tbl_orden.id_orden LEFT JOIN tbl_paciente ON tbl_detalle_factura_paciente.id_paciente = tbl_paciente.id_paciente LEFT JOIN tbl_examen ON tbl_examen.id_examen = tbl_detalle_factura_paciente.id_examen LEFT JOIN tbl_departamento ON tbl_departamento.id_departamento = tbl_examen.id_departamento LEFT JOIN tbl_cultivo ON tbl_cultivo.id_cultivo = tbl_detalle_factura_paciente.id_cultivo WHERE tbl_detalle_factura_paciente.id_factura='" +req.params.id_factura+"'";
            connection.query(sql, function (err, result, fields) {
                if (err) {
                    console.log('ERROR en CheckTemplate', err);
                    res.send('3');
                }
                if(result){
                    //console.log('PASO A RESULT!')
                    //return result;
                    //res.send(result);
                    //console.log('EL RESULT!', result);
                    let i=0;
                    let j=0;
                    let contador = 0;
                    let primario = 0;
                    let ordenPos = 0;
                    let nombre;
                    let cedula;
                    let idOrden = 0;
                    let reqImpresion = [];
                    let examen = [];
                    let cultivo = [];
                    let orden = [];
                    const resultAux = result;
                    //resultAux 
                    //console.log("[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[", resultAux)

                    for(let i=0; i<result.length;i++){
                        contador = 0;
                        if(result[i].id_examen != null){
                            primario = result[i].id_examen;
                            //console.log('VALOR DE PRIMARIO', primario)
                            for(let j=0; j<result.length;j++){
                                if(primario==result[j].id_examen ){
                                    //console.log('SUMA');
                                    result[j].id_examen = null;
                                    //console.log(result[j].id_ex)
                                    contador++;
                                }
                            }
                            examen.push({
                                id_examen: primario,
                                contador: contador,
                            });
                            //console.log('CONTADOR SUMADO!', contador);
                        } else if(result[i].id_cultivo != null){
                            primario = result[i].id_cultivo;
                            //console.log('VALOR DE PRIMARIO', primario)
                            for(let j=0; j<result.length;j++){
                                if(primario==result[j].id_cultivo ){
                                    //console.log('SUMA');
                                    result[j].id_cultivo = null;
                                    //console.log(result[j].id_ex)
                                    contador++;
                                }
                            }
                            //console.log('CONTADOR SUMADO!', contador);
                            cultivo.push({
                                id_cultivo: primario,
                                contador: contador,
                            });
                        }
                    }
                    for(let i=0; i<result.length;i++){
                        //contador = 0;
                        if(result[i].id_orden != null){
                            ordenPos = result[i].numero_orden;
                            idOrden = result[i].id_orden;
                            cedula = result[i].paciente_cedula;
                            nombre = result[i].paciente_nombre +" "+result[i].paciente_apellido;
                            edad = result[i].edad
                            //console.log('VALOR DE ordenPos', ordenPos)
                            for(let j=0; j<result.length;j++){
                                if(ordenPos==result[j].numero_orden){
                                    //console.log('SUMA');
                                    result[j].id_orden = null;
                                    //console.log(result[j].id_ex)
                                    contador++;
                                }
                            }
                            orden.push({
                                orden_numero: ordenPos,
                                id_orden: idOrden,
                                paciente_cedula: cedula,
                                paciente_nombre: nombre,
                                paciente_edad: edad,
                                departamentos: []
                                //contador: contador,
                            });
                        }
                    }
                    /*reqImpresion.push({
                        orden
                    })*/
                    //console.log('EL RESULT!', reqFactura)
                    //console.log("ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ", orden)
                    let auxNombre;
                    for(itemOrden of orden){
                        for(item of resultAux){
                            auxNombre = item.paciente_nombre +" "+item.paciente_apellido;
                            if(itemOrden.paciente_nombre == auxNombre){
                                let mod = 0;
                                //console.log("PA VE LOS NOMBRES", itemOrden.paciente_nombre, auxNombre, item.id_examen, item.id_departamento)
                                for(departamento of itemOrden.departamentos){
                                    if(departamento.id_departamento == item.id_departamento){
                                        mod = 1
                                    }
                                }
                                if(mod == 0){
                                    if(item.id_departamento == null){
                                        itemOrden.departamentos.push({
                                            id_departamento: 4,
                                            departamento_nombre: "BACTERIOLOGIA"
                                        })
                                    }else{
                                        itemOrden.departamentos.push({
                                            id_departamento: item.id_departamento,
                                            departamento_nombre: item.departamento_nombre
                                        })
                                    }
                                }
                            }
                        }
                    }
                    let copias = 0;
                    let depStr = ''
                    for(item of orden){
                        copias = 0;
                        for(departamento of item.departamentos){
                            //console.log("FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF", departamento)
                            if(departamento.id_departamento == 6 || departamento.id_departamento == 2){
                                copias = copias + 2
                            }else{
                                copias = copias + 1
                            }
                            item.copias = copias;
                        }
                    }
                    resolve(orden)
                }
            });
        });
    }
}

facturacionCtrl.ordenesImpresionRegistroConvenio = async(req, res) =>{

    let ordenes;
    //console.log("CCCCCCCCCCCCCCCCCCCCCCCCCCCCCC", req.params)
    ordenes = await configOrdenesImpresion();
    //console.log("LOOLOLOLOLOLOLOLOLOLOLOLOLOLOLOL", ordenes)
    res.send(ordenes);
    async function configOrdenesImpresion(){
        return new Promise((resolve, reject) => {
            //const sql = "SELECT tbl_detalle_factura_paciente.id_detalle_factura_paciente, tbl_detalle_factura_paciente.id_paciente, tbl_detalle_factura_paciente.id_examen, tbl_detalle_factura_paciente.id_cultivo, tbl_detalle_orden.id_orden, tbl_orden.numero_orden, tbl_paciente.paciente_nombre, tbl_paciente.paciente_apellido, tbl_paciente.paciente_cedula, tbl_paciente.edad FROM `tbl_detalle_factura_paciente`  INNER JOIN `tbl_detalle_orden` ON tbl_detalle_orden.id_detalle_factura_paciente = tbl_detalle_factura_paciente.id_detalle_factura_paciente INNER JOIN tbl_orden ON tbl_detalle_orden.id_orden = tbl_orden.id_orden LEFT JOIN tbl_paciente ON tbl_detalle_factura_paciente.id_paciente = tbl_paciente.id_paciente WHERE tbl_detalle_factura_paciente.id_registro_convenio='" +req.params.id_registro_convenio+"'";
            const sql = "SELECT tbl_detalle_factura_paciente.id_detalle_factura_paciente, tbl_detalle_factura_paciente.id_paciente, tbl_detalle_factura_paciente.id_examen, tbl_detalle_factura_paciente.id_cultivo, tbl_detalle_orden.id_orden, tbl_orden.numero_orden, tbl_paciente.paciente_nombre, tbl_paciente.paciente_apellido, tbl_paciente.paciente_cedula, tbl_paciente.edad, tbl_examen.id_departamento FROM `tbl_detalle_factura_paciente`  LEFT JOIN `tbl_detalle_orden` ON tbl_detalle_orden.id_detalle_factura_paciente = tbl_detalle_factura_paciente.id_detalle_factura_paciente LEFT JOIN tbl_orden ON tbl_detalle_orden.id_orden = tbl_orden.id_orden LEFT JOIN tbl_paciente ON tbl_detalle_factura_paciente.id_paciente = tbl_paciente.id_paciente LEFT JOIN tbl_examen ON tbl_examen.id_examen = tbl_detalle_factura_paciente.id_examen WHERE tbl_detalle_factura_paciente.id_registro_convenio='" +req.params.id_registro_convenio+"'";
            connection.query(sql, function (err, result, fields) {
                if (err) {
                    console.log('ERROR en CheckTemplate', err);
                    res.send('3');
                }
                if(result){
                    //console.log('PASO A RESULT!')
                    //return result;
                    //res.send(result);
                    //console.log('EL RESULT!', result);
                    let i=0;
                    let j=0;
                    let contador = 0;
                    let primario = 0;
                    let ordenPos = 0;
                    let nombre;
                    let cedula;
                    let idOrden = 0;
                    let reqImpresion = [];
                    let examen = [];
                    let cultivo = [];
                    let orden = [];
                    const resultAux = result;
                    //resultAux 

                    for(let i=0; i<result.length;i++){
                        contador = 0;
                        if(result[i].id_examen != null){
                            primario = result[i].id_examen;
                            //console.log('VALOR DE PRIMARIO', primario)
                            for(let j=0; j<result.length;j++){
                                if(primario==result[j].id_examen ){
                                    //console.log('SUMA');
                                    result[j].id_examen = null;
                                    //console.log(result[j].id_ex)
                                    contador++;
                                }
                            }
                            examen.push({
                                id_examen: primario,
                                contador: contador,
                            });
                            //console.log('CONTADOR SUMADO!', contador);
                        } else if(result[i].id_cultivo != null){
                            primario = result[i].id_cultivo;
                            //console.log('VALOR DE PRIMARIO', primario)
                            for(let j=0; j<result.length;j++){
                                if(primario==result[j].id_cultivo ){
                                    //console.log('SUMA');
                                    result[j].id_cultivo = null;
                                    //console.log(result[j].id_ex)
                                    contador++;
                                }
                            }
                            //console.log('CONTADOR SUMADO!', contador);
                            cultivo.push({
                                id_cultivo: primario,
                                contador: contador,
                            });
                        }
                    }
                    for(let i=0; i<result.length;i++){
                        //contador = 0;
                    if(result[i].id_orden != null){
                        ordenPos = result[i].numero_orden;
                        idOrden = result[i].id_orden;
                        cedula = result[i].paciente_cedula;
                        nombre = result[i].paciente_nombre +" "+result[i].paciente_apellido;
                        edad = result[i].edad
                        //console.log('VALOR DE ordenPos', ordenPos)
                        for(let j=0; j<result.length;j++){
                            if(ordenPos==result[j].numero_orden){
                                //console.log('SUMA');
                                result[j].id_orden = null;
                                //console.log(result[j].id_ex)
                                contador++;
                            }
                        }
                        orden.push({
                            orden_numero: ordenPos,
                            id_orden: idOrden,
                            paciente_cedula: cedula,
                            paciente_nombre: nombre,
                            paciente_edad: edad,
                            departamentos: []
                            //contador: contador,
                        });
                    }
                    }
                    /*reqImpresion.push({
                        orden
                    })*/
                    //console.log('EL RESULT!', reqFactura)
                    //console.log("ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ", orden)
                    let auxNombre;
                    for(itemOrden of orden){
                        for(item of resultAux){
                            auxNombre = item.paciente_nombre +" "+item.paciente_apellido;
                            if(itemOrden.paciente_nombre == auxNombre){
                                let mod = 0;
                                //console.log("PA VE LOS NOMBRES", itemOrden.paciente_nombre, auxNombre, item.id_examen, item.id_departamento)
                                for(departamento of itemOrden.departamentos){
                                    if(departamento.id_departamento == item.id_departamento){
                                        mod = 1
                                    }
                                }
                                if(mod == 0){
                                    itemOrden.departamentos.push({
                                        id_departamento: item.id_departamento
                                    })
                                }
                            }
                        }
                    }
                    let copias = 0;
                    for(item of orden){
                        copias = 0;
                        for(departamento of item.departamentos){
                            if(departamento.id_departamento == 6 || departamento.id_departamento == 2){
                                copias = copias + 2
                            }else{
                                copias = copias + 1
                            }
                            item.copias = copias;
                        }
                    }
                    resolve(orden)
                }
            });
        });
    }
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
facturacionCtrl.imprimirFactura = async(req, res) =>{
    const sql = "SELECT tbl_detalle_factura_paciente.id_detalle_factura_paciente, tbl_detalle_factura_paciente.id_paciente, tbl_detalle_factura_paciente.id_examen, tbl_detalle_factura_paciente.id_cultivo, tbl_detalle_factura_paciente.precio, tbl_detalle_orden.id_orden, tbl_orden.numero_orden FROM `tbl_detalle_factura_paciente`  INNER JOIN `tbl_detalle_orden` ON tbl_detalle_orden.id_detalle_factura_paciente = tbl_detalle_factura_paciente.id_detalle_factura_paciente INNER JOIN tbl_orden ON tbl_orden.id_orden = tbl_detalle_orden.id_orden WHERE tbl_detalle_factura_paciente.id_factura='" +req.params.id_factura+"'";
    connection.query(sql, function (err, result, fields) {
        if (err) {
            console.log('ERROR en CheckTemplate 100', err);
            res.send('3');
        }
        if(result){
            //console.log('PASO A RESULT!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!', result)
                //return result;
                //res.send(result);
                //console.log('EL RESULT!', result);
                let i=0;
                let j=0;
                let contador = 0;
                let primario = 0;
                let precio = 0;
                let ordenPos = 0;
                let reqFactura = [];
                let examen = [];
                let cultivo = [];
                let orden = [];

                for(let i=0; i<result.length;i++){
                    contador = 0;
                    if(result[i].id_examen != null){
                        primario = result[i].id_examen;
                        precio = result[i].precio;
                        //console.log('VALOR DE PRIMARIO', primario)
                        for(let j=0; j<result.length;j++){
                            if(primario==result[j].id_examen ){
                                //console.log('SUMA');
                                result[j].id_examen = null;
                                //console.log(result[j].id_ex)
                                contador++;
                            }
                        }
                        examen.push({
                            id_examen: primario,
                            precio: precio,
                            contador: contador,
                        });
                        //console.log('CONTADOR SUMADO!', contador);
                    } else if(result[i].id_cultivo != null){
                        primario = result[i].id_cultivo;
                        precio = result[i].precio;
                        //console.log('VALOR DE PRIMARIO', primario)
                        for(let j=0; j<result.length;j++){
                            if(primario==result[j].id_cultivo ){
                                //console.log('SUMA');
                                result[j].id_cultivo = null;
                                //console.log(result[j].id_ex)
                                contador++;
                            }
                        }
                        //console.log('CONTADOR SUMADO!', contador);
                        cultivo.push({
                            id_cultivo: primario,
                            precio: precio,
                            contador: contador,
                        });
                    }
                }
                for(let i=0; i<result.length;i++){
                    //contador = 0;
                    if(result[i].id_orden != null){
                        ordenPos = result[i].numero_orden;
                        //console.log('VALOR DE ordenPos', ordenPos)
                        for(let j=0; j<result.length;j++){
                            if(ordenPos==result[j].numero_orden){
                                //console.log('SUMA');
                                result[j].id_orden = null;
                                //console.log(result[j].id_ex)
                                contador++;
                            }
                        }
                        orden.push({
                            orden_numero: ordenPos,
                            //contador: contador,
                        });
                    }
                }
                reqFactura.push({
                    examenes: examen,
                    cultivos: cultivo,
                    ordenes: orden
                })
                console.log('EL RESULT!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!', reqFactura.ordenes)
                buscarPreciosNombres(reqFactura)
        }
    });

    function buscarPreciosNombres(reqFactura){
        //console.log('DESDE BUSCAR PRECIOS NOMBRES', reqFactura)
        var async = require('async');
        let impresion = [];
        let examenes = reqFactura[0].examenes;
        let cultivos = reqFactura[0].cultivos;
        let sqlExamenes;
        let sqlCultivos;
        let itemsFinal = [];
        //console.log('DESDE BUSCAR PRECIOS NOMBRES', examenes, cultivos)

        async function getExamenes(item){
            return new Promise((resolve, reject) => {
                sqlExamenes = "SELECT examen_nombre, examen_precio FROM tbl_examen WHERE id_examen='" +item.id_examen+"'";
                connection.query(sqlExamenes, function (err, result, fields) {
                if (err) {
                    console.log('ERROR en CheckTemplate 200', err);
                    res.send('3');
                }
                if(result){
                    //console.log(result)
                    item.nombre = result[0].examen_nombre;
                    //item.precio = result[0].examen_precio;
                    item.subtotal = item.contador * item.precio;
                    //item.subtotal = Number(Math.round(item.subtotal + "e2") + "e-2")
                    itemsFinal.push({
                        item: item
                    })
                    //examenesFinal = examen;
                    resolve(itemsFinal)
                    //console.log('-----------',examenesFinal);
                }
            });
            });
        }

        async function getCultivos(item){
            return new Promise((resolve, reject) => {
                    sqlCultivos = "SELECT cultivo_nombre, cultivo_precio FROM tbl_cultivo WHERE id_cultivo='" +item.id_cultivo+"'";
                    connection.query(sqlCultivos, function (err, result, fields) {
                    if (err) {
                        console.log('ERROR en CheckTemplate 300', err);
                        res.send('3');
                    }
                    if(result){
                        //console.log('!!!!!!!!',result)
                        item.nombre = result[0].cultivo_nombre;
                        //item.precio = result[0].cultivo_precio;
                        item.subtotal = item.contador * item.precio;
                        //console.log(cultivo);
                        itemsFinal.push({
                            item: item
                        })
                        resolve(itemsFinal)
                    }
                });
            });
        }

        async function getNumeroFactura(){
            //console.log("LA CONSOLEASDA!!!", req.params.id_tipo_factura)
            let registrosDePagos;
                registrosDePagos = await getRegistroPagos(registrosDePagos);
            return new Promise((resolve, reject) => {

                //console.log("LA FACTURA!!!!", req.params.id_factura)
                if(req.params.id_tipo_factura == 1 || req.params.id_tipo_factura == 2 || req.params.id_tipo_factura == 4){
                    sqlNumFactura = "SELECT tbl_factura.numero_factura, tbl_factura.factura_qr, tbl_factura.total_dolares, tbl_factura.total_pesos, tbl_factura.total_bolivares, tbl_factura.tasa_bolivar_dia, tbl_factura.tasa_pesos_dia, tbl_factura.descuento_bolivares, tbl_factura.descuento_dolares, tbl_factura.descuento_pesos, tbl_factura.IGTF_bolivares, tbl_factura.IGTF_dolares, tbl_factura.IGTF_pesos, tbl_factura.orden_trabajo, date_format(fecha_creacion_factura,'%d-%m-%Y') AS fecha_creacion, date_format(fecha_creacion_orden_trabajo,'%d-%m-%Y T%') AS fecha_creacion_orden_trabajo, tbl_factura.id_cliente, tbl_cliente.cliente_nombre, tbl_cliente.cliente_apellido, tbl_cliente.cedula_RIF, tbl_cliente.contacto_persona_convenio, tbl_cliente.telefono, tbl_cliente.correo, tbl_cliente.id_tipo_cliente, tbl_factura.id_tipo_factura, tbl_tipo_factura.tipo_factura_nombre, tbl_factura.base_imponible_dolares, tbl_factura.base_imponible_bolivares, tbl_tipo_cliente.tipo_nombre FROM tbl_factura LEFT JOIN tbl_cliente ON tbl_factura.id_cliente = tbl_cliente.id_cliente LEFT JOIN tbl_tipo_factura ON tbl_tipo_factura.id_tipo_factura = tbl_factura.id_tipo_factura LEFT JOIN tbl_tipo_cliente ON tbl_tipo_cliente.id_tipo_cliente = tbl_cliente.id_tipo_cliente WHERE id_factura='" +req.params.id_factura+"'";
                }else if(req.params.id_tipo_factura == 3 || req.params.id_tipo_factura == 5){
                    sqlNumFactura = "SELECT tbl_factura.numero_factura, tbl_factura.factura_qr, tbl_factura.total_dolares, tbl_factura.total_pesos, tbl_factura.total_bolivares, tbl_factura.tasa_bolivar_dia, tbl_factura.tasa_pesos_dia, tbl_factura.descuento_bolivares, tbl_factura.descuento_dolares, tbl_factura.descuento_pesos, tbl_factura.IGTF_bolivares, tbl_factura.IGTF_dolares, tbl_factura.IGTF_pesos, tbl_factura.orden_trabajo, date_format(fecha_creacion_orden_trabajo,'%d-%m-%Y') AS fecha_creacion, date_format(fecha_creacion_orden_trabajo,'%d-%m-%Y T%') AS fecha_creacion_orden_trabajo, tbl_factura.id_cliente, tbl_cliente.cliente_nombre, tbl_cliente.cliente_apellido, tbl_cliente.cedula_RIF, tbl_cliente.contacto_persona_convenio, tbl_cliente.telefono, tbl_cliente.correo, tbl_cliente.id_tipo_cliente, tbl_factura.id_tipo_factura, tbl_tipo_factura.tipo_factura_nombre, tbl_factura.base_imponible_dolares, tbl_factura.base_imponible_bolivares, tbl_tipo_cliente.tipo_nombre FROM tbl_factura LEFT JOIN tbl_cliente ON tbl_factura.id_cliente = tbl_cliente.id_cliente LEFT JOIN tbl_tipo_factura ON tbl_factura.id_tipo_factura = tbl_tipo_factura.id_tipo_factura LEFT JOIN tbl_tipo_cliente ON tbl_tipo_cliente.id_tipo_cliente = tbl_cliente.id_tipo_cliente WHERE id_factura='" +req.params.id_factura+"'";
                }
                
                connection.query(sqlNumFactura, registrosDePagos, function (err, result, fields) {
                if (err) {
                    console.log('ERROR en CheckTemplate 400', err);
                    res.send('3');
                }
                if(result){
                    //console.log("AAAAAAAAAAAAAAAAAAAAAAAAAA", registrosDePagos)
                    //console.log("mmmmmmmmmmmmmmmmmmmmmmmm", result)
                    let sumaPesos = 0;
                    let sumaDolares = 0;
                    let sumaBolivares = 0;
                    let sumaPesosVueltos = 0;
                    let sumaDolaresVueltos = 0;
                    let sumaBolivaresVueltos = 0;
                    //console.log('EN RESULT!!!!!!!!!!!!!!!!!!!!!!!!!!!', result)
                    ////////////////////CONVERTIR PESOS A DOLARES////////////////////////
                    for(const item of registrosDePagos){
                        //console.log("CCCCCCCCCCCCCCCCCCCCCCCCCCCC", item.igtf_pago)
                        /////////////////////////////////SUMATORIA DE PAGOS//////////////////////////////////
                        if(item.divisa_nombre == "DOLARES" && item.igtf_pago == 0 && item.tipo_registro == 0){
                            sumaDolares = sumaDolares + item.monto;
                        }else if(item.divisa_nombre == "PESOS" && item.igtf_pago == 0 && item.tipo_registro == 0){
                            sumaPesos = sumaPesos + item.monto
                        }else if(item.divisa_nombre == "BOLIVARES" && item.igtf_pago == 0 && item.tipo_registro == 0){
                        //console.log("!!!!!!", item.monto)
                            sumaBolivares = sumaBolivares + item.monto;
                        }   
                        //////////////////////////////SUMATORIA DE VUELTOS//////////////////////////////////////
                        if(item.divisa_nombre == "DOLARES" && item.igtf_pago == 0 && item.tipo_registro == 1){
                            sumaDolaresVueltos = sumaDolaresVueltos + item.monto;
                        }else if(item.divisa_nombre == "PESOS" && item.igtf_pago == 0 && item.tipo_registro == 1){
                            sumaPesosVueltos = sumaPesosVueltos + item.monto
                        }else if(item.divisa_nombre == "BOLIVARES" && item.igtf_pago == 0 && item.tipo_registro == 1){
                        //console.log("!!!!!!", item.monto)
                            sumaBolivaresVueltos = sumaBolivaresVueltos + item.monto;
                        }   
                    }
                    let pesosConvertidos =  Number(Math.round(sumaPesos+ "e+2") + "e-2");
                    let totalDolares;
                    let dolaresRedondeado; //LA BASE IMPONIBLE EN IGTF
                    let bolivaresRedondeado; //LA BASE IMPONIBLE EN IGTF
                    let conversionDolarBolivar;
                    sumaDolares = sumaDolares - sumaDolaresVueltos;
                    sumaPesos = sumaPesos - sumaPesosVueltos;
                    sumaBolivares = sumaBolivares - sumaBolivaresVueltos;
                    totalDolares = pesosConvertidos + sumaDolares;

                    //console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!", /*sumaDolares*/ totalDolares, sumaPesos);
                    
                    dolaresRedondeado = Number(Math.round(totalDolares+ "e+2") + "e-2");
                    //console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!", /*sumaDolares*/ sumaBolivares);

                    ///////////////////CONVIRTIENDO DOLARES//////////////////////////
                    conversionDolarBolivar = (totalDolares * result[0].tasa_bolivar_dia)
                    //totalBolivares = conversionDolarBolivar + sumaBolivares;
                    bolivaresRedondeado = Number(Math.round(conversionDolarBolivar+ "e+2") + "e-2");
                    //console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!", totalBolivares, bolivaresRedondeado);

                    ///////////////////////
                    let valor_total_venta_bolivares = result[0].total_bolivares - result[0].descuento_bolivares;
                    let valor_total_venta_pesos = result[0].total_pesos - result[0].descuento_pesos;
                    let valor_total_venta_dolares = result[0].total_dolares - result[0].descuento_dolares;
                    let total_pagar_bolivares = Number(Math.round(valor_total_venta_bolivares + result[0].IGTF_bolivares+ "e+2") + "e-2");;
                    let total_pagar_dolares = valor_total_venta_dolares + result[0].IGTF_dolares;
                    let total_pagar_pesos = valor_total_venta_pesos + result[0].IGTF_pesos;

                    impresion.push({
                        numero_factura: result[0].numero_factura,
                        orden_trabajo: result[0].orden_trabajo,
                        fecha_creacion: result[0].fecha_creacion,
                        fecha_creacion_orden_trabajo: result[0].fecha_creacion_orden_trabajo,
                        id_cliente: result[0].id_cliente,
                        cliente_nombre: result[0].cliente_nombre,
                        cliente_apellido: result[0].cliente_apellido,
                        cedula_RIF: result[0].cedula_RIF,
                        contacto_persona_convenio: result[0].contacto_persona_convenio,
                        telefono: result[0].telefono,
                        tipo_cliente: result[0].tipo_nombre,
                        id_tipo_cliente: result[0].id_tipo_cliente,
                        correo: result[0].correo,
                        telefono: result[0].telefono,
                        tipo_factura_nombre: result[0].tipo_factura_nombre,
                        id_factura: req.params.id_factura,
                        total_bolivares: result[0].total_bolivares,
                        total_dolares: result[0].total_dolares,
                        total_pesos: result[0].total_pesos,
                        descuento_dolares: result[0].descuento_dolares,
                        descuento_bolivares: result[0].descuento_bolivares,
                        descuento_pesos: result[0].descuento_pesos,
                        valor_total_venta_bolivares: Number(Math.round(valor_total_venta_bolivares+ "e+2") + "e-2"),
                        valor_total_venta_dolares: valor_total_venta_dolares,
                        valor_total_venta_pesos: valor_total_venta_pesos,
                        IGTF_bolivares: result[0].IGTF_bolivares,
                        IGTF_pesos: result[0].IGTF_pesos,
                        IGTF_dolares: result[0].IGTF_dolares,
                        tasa_bolivar_dia: result[0].tasa_bolivar_dia,
                        tasa_pesos_dia: result[0].tasa_pesos_dia,
                        total_pagar_bolivares: total_pagar_bolivares,
                        total_pagar_pesos: total_pagar_pesos,
                        total_pagar_dolares: total_pagar_dolares,
                        base_imponible_dolares: result[0].base_imponible_dolares,
                        base_imponible_bolivares: result[0].base_imponible_bolivares,
                        factura_qr: result[0].factura_qr
                    });
                    resolve(impresion);
                }
            });
            })
        }

        async function getRegistroPagos(registroDePagos){
            return new Promise((resolve, reject) => {
                let sql = "SELECT tbl_registro_pago.id_registro_divisa, tbl_registro_pago.monto, tbl_registro_pago.igtf_pago, tbl_registro_divisa.id_divisa, tbl_registro_divisa.tasa_actual, tbl_divisa.divisa_nombre FROM tbl_registro_pago INNER JOIN tbl_registro_divisa ON tbl_registro_divisa.id_registro_divisa = tbl_registro_pago.id_registro_divisa INNER JOIN tbl_divisa ON tbl_registro_divisa.id_divisa = tbl_divisa.id_divisa WHERE id_factura='" +req.params.id_factura+"'";
                connection.query(sql, function (err, result, fields) {
                    if (err) {
                        console.log('ERROR en CheckTemplate 500', err);
                        res.send('3');
                    }
                    if(result){
                        //console.log(result)
                        registroDePagos = result;
                        resolve(registroDePagos)
                    }
                });
            })
        }

        async function getTipoPago(){
            return new Promise((resolve, reject) => {
                sqlNumFactura = "SELECT tbl_registro_pago.id_tipo_pago, tbl_tipo_pago.tipo_pago_nombre FROM tbl_registro_pago INNER JOIN `tbl_tipo_pago` ON tbl_registro_pago.id_tipo_pago = tbl_tipo_pago.id_tipo_pago WHERE id_factura='" +req.params.id_factura+"'";
                connection.query(sqlNumFactura, function (err, result, fields) {
                if (err) {
                    console.log('ERROR en CheckTemplate 600', err);
                    res.send('3');
                }
                if(result){
                    
                    let pago;
                    let id_tipo_pago;
                    let nombre_pago = [];
                    for(let i=0; i<result.length; i++){
                        if(result[i].id_tipo_pago != null){
                            pago = result[i].tipo_pago_nombre;
                            id_tipo_pago = result[i].id_tipo_pago;
                            result[i].tipo_pago_nombre = null;
                            result[i].id_tipo_pago = null;
                            nombre_pago.push({
                                nombre: pago
                            })
                        }
                        //console.log(i);
                        for(let j=0; j<result.length; j++){
                            if(id_tipo_pago == result[j].id_tipo_pago){
                                result[j].id_tipo_pago = null;
                                result[j].tipo_pago_nombre = null;
                            }
                        }
                    }
                    //console.log('LOS NOMBRES DE LOS PAGOS', nombre_pago)
                    //console.log('TIPO PAGO!!!!!!', result)
                    impresion.push({
                        pagos: nombre_pago
                    })
                    /*impresion.push({
                        numero_factura: result[0].numero_factura,
                        orden_trabajo: result[0].orden_trabajo,
                        fecha_creacion: result[0].fecha_creacion,
                        id_factura: req.params.id_factura
                    });*/
                    resolve(nombre_pago);
                }
            });
            })
        }

        async function buscarCliente(idCliente){
            return new Promise((resolve, reject) => {
                let cliente;
                cliente = clienteModel.findOne({idCliente: idCliente});
                //console.log("RESULTADO", cliente)
                resolve(cliente);
            });
        }

        async function buscarFactura(idFactura){
            return new Promise((resolve, reject) => {
                let factura, bool;
                factura = facturaModel.findOne({id_factura: idFactura});
                //console.log("RESULTADO", factura)
                resolve(factura);
            })
        }

        async function buscarPacientes(idFactura){
            return new Promise((resolve, reject) => {
                let sql = "SELECT tbl_detalle_factura_paciente.id_detalle_factura_paciente, tbl_detalle_factura_paciente.id_factura, tbl_detalle_factura_paciente.id_paciente, tbl_detalle_factura_paciente.id_examen, tbl_detalle_factura_paciente.id_cultivo, tbl_examen.examen_nombre, tbl_cultivo.cultivo_nombre, tbl_paciente.paciente_nombre, tbl_paciente.paciente_apellido, tbl_paciente.paciente_cedula, tbl_paciente.paciente_telefono FROM tbl_detalle_factura_paciente LEFT JOIN tbl_examen ON tbl_examen.id_examen = tbl_detalle_factura_paciente.id_examen LEFT JOIN tbl_cultivo ON tbl_cultivo.id_cultivo = tbl_detalle_factura_paciente.id_cultivo LEFT JOIN tbl_paciente ON tbl_paciente.id_paciente = tbl_detalle_factura_paciente.id_paciente WHERE tbl_detalle_factura_paciente.id_factura = '"+idFactura+"'";
                connection.query(sql, function (err, result, fields) {
                    if (err) {
                        console.log('ERROR en CheckTemplate 700', err);
                        res.send('3');
                    }
                    if(result){
                       let pacientes;
                       pacientes = result;
                       resolve(pacientes);
                    }
                })
            })
        }

        async function agruparPacientes(pacientesVar){
            return new Promise((resolve, reject) => {
                let agrupados = {};
                //Recorremos el arreglo 
                pacientesVar.forEach(item => {
                //console.log("**************", item)
                //Si la ciudad no existe en nuevoObjeto entonces
                //la creamos e inicializamos el arreglo de profesionales. 
                if(!agrupados.hasOwnProperty(item.id_paciente)){
                    agrupados[item.id_paciente] = {
                        id_paciente: item.id_paciente,
                        paciente_nombre: item.paciente_nombre,
                        paciente_apellido: item.paciente_apellido,
                        paciente_cedula: item.paciente_cedula,
                        paciente_telefono: item.paciente_telefono,
                        examenes_cultivos: []
                    }
                }
                //Agregamos los datos de profesionales. 
                agrupados[item.id_paciente].examenes_cultivos.push({
                        cultivo_nombre: item.cultivo_nombre,
                        examen_nombre:  item.examen_nombre
                    })
                })
                resolve(agrupados);
            })
        }

        async function agregarFactura(impresion){
            //console.log("/////////////////////////////////////////////////", impresion[0])
            return new Promise((resolve, reject) => {
                const factura = facturaModel({
                    id_cliente:                   impresion[0].id_cliente,
                    numero_factura:               impresion[0].numero_factura,
                    orden_trabajo:                impresion[0].orden_trabajo,
                    fecha_creacion:               impresion[0].fecha_creacion,
                    fecha_creacion_orden_trabajo: impresion[0].fecha_creacion_orden_trabajo,
                    cliente_nombre:               impresion[0].cliente_nombre,
                    cliente_apellido:             impresion[0].cliente_apellido,
                    cedula_RIF:                   impresion[0].cedula_RIF,
                    contacto_persona_convenio:    impresion[0].contacto_persona_convenio,
                    telefono:                     impresion[0].telefono,
                    tipo_factura_nombre:          impresion[0].tipo_factura_nombre,
                    id_factura:                   impresion[0].id_factura,
                    total_bolivares:              impresion[0].total_bolivares,
                    total_dolares:                impresion[0].total_dolares,
                    total_pesos:                  impresion[0].total_pesos,
                    descuento_dolares:            impresion[0].descuento_dolares,
                    descuento_bolivares:          impresion[0].descuento_bolivares,
                    descuento_pesos:              impresion[0].descuento_pesos,
                    valor_total_venta_bolivares:  impresion[0].valor_total_venta_bolivares,
                    valor_total_venta_dolares:    impresion[0].valor_total_venta_dolares,
                    valor_total_venta_pesos:      impresion[0].valor_total_venta_pesos,
                    IGTF_bolivares:               impresion[0].IGTF_bolivares,
                    IGTF_pesos:                   impresion[0].IGTF_pesos,
                    IGTF_dolares:                 impresion[0].IGTF_dolares,
                    tasa_bolivar_dia:             impresion[0].tasa_bolivar_dia,
                    tasa_pesos_dia:               impresion[0].tasa_pesos_dia,
                    total_pagar_bolivares:        impresion[0].total_pagar_bolivares, 
                    total_pagar_pesos:            impresion[0].total_pagar_pesos,
                    total_pagar_dolares:          impresion[0].total_pagar_dolares,
                    base_imponible_dolares:       impresion[0].base_imponible_dolares,
                    base_imponible_bolivares:     impresion[0].base_imponible_bolivares,
                    factura_qr:                   impresion[0].factura_qr,
                    cantidad_items:               impresion[2].cantidad_items,
                    pagos:                        impresion[1].pagos,
                    items:                        impresion[2].items,
                    ordenes:                      impresion[2].ordenes,
                    pacientes:                    impresion[0].pacientes,
                    subido: 0
                })
                //console.log("!!!!!!!!!!!!!!!!!!!!!!!!", factura)
                try {
                    factura.save();
                    resolve("1")
                } catch (error) {
                    resolve("0")
                }
            })
        }

        async function agregarCliente(impresion){
            //console.log("desde agregar cliente!!!!", impresion)
            return new Promise((resolve, reject) => {
                const cliente = clienteModel({       
                    idCliente: 			impresion[0].id_cliente,
                    clienteNombre:   	impresion[0].cliente_nombre,
                    clienteApellido:   	impresion[0].cliente_apellido,
                    cedula_RIF: 		impresion[0].cedula_RIF,
                    contacto: 			impresion[0].contacto_persona_convenio,
                    correo: 			impresion[0].correo,
                    telefono: 			impresion[0].telefono,
                    tipoCliente: 		impresion[0].tipo_cliente,
                    subido: 0
                })
    
                try {
                    cliente.save();
                    resolve("1")
                } catch (error) {
                    resolve("0")
                }
            })
        }

        async function loopExamenesCultivos(){
            let busquedaCliente, busquedaFactura, busquedaPaciente, agrupacionPacientes;
            for (const examen of examenes){
              /*let examenGet =*/ await getExamenes(examen);
              //console.log('EL EXAMEN!!', examenGet)
            }
            for (const cultivo of cultivos){
              /*let cultivoGet =*/ await getCultivos(cultivo);
              //console.log('EL CULTIVOS!!', cultivoGet)
            }
            //console.log('LUEGO: ',cultivos);
            /*let numFactura =*/ await getNumeroFactura();
            await getTipoPago();
             //console.log('EL CULTIVOS!!', numFactura)
             let contItems = 0;
             for(const item of itemsFinal){
                 //console.log('EL ITEM', item.item.contador)
                contItems = contItems + item.item.contador;
             }
            impresion.push({
                cantidad_items: contItems,
                items: itemsFinal,
                ordenes: reqFactura[0].ordenes
            });
            res.req.headers.connection = 'keep-alive';
            //console.log("!!!!!!!!!!!!!!!!!!!!!!!!", impresion)
            busquedaCliente = await buscarCliente(impresion[0].id_cliente);
            busquedaFactura = await buscarFactura(impresion[0].id_factura);
            busquedaPaciente = await buscarPacientes(impresion[0].id_factura);
            agrupacionPacientes = await agruparPacientes(busquedaPaciente);
            let agrupacionPacientesArray = [];
            agrupacionPacientesArray = Object.values(agrupacionPacientes);
            //console.log("PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP", agrupacionPacientes)
            impresion[0].pacientes = agrupacionPacientesArray;
            //console.log("*************************************************************************************", impresion)

            //console.log("WOLOLO", busquedaCliente, busquedaFactura)
            if(busquedaCliente == null || busquedaCliente.length == 0){
                let agregarResp;
                agregarResp = await agregarCliente(impresion);
                if(agregarResp == "0"){
                    //console.log("ERROR EN AGREGAR CLIENTE!!!");
                }else{
                    //console.log("EL CLIENTE AGREGO")
                }
            }else{
                //console.log("CLIENTE EXISTENTE")
            }
            if(busquedaFactura == null || busquedaFactura.length == 0){
                //console.log("Paso?")
                let agregarFacturaResp;
                agregarFacturaResp = await agregarFactura(impresion);
                if(agregarFacturaResp == "0"){
                    //console.log("ERROR EN AGREGAR CLIENTE!!!");
                }else{
                    //console.log("LA FACTURA AGREGO")
                }
            }else{
                //console.log("FACTURA EXISTENTE")
            }
            console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", impresion);
            res.send(impresion)
           
        }

        loopExamenesCultivos();
        
        //console.log('LUEGO: ', examenesFinal);

        
    }
}

facturacionCtrl.imprimirFacturaConvenio = async(req, res) =>{
    const sql = "SELECT tbl_detalle_factura_paciente.id_detalle_factura_paciente, tbl_detalle_factura_paciente.precio, tbl_detalle_factura_paciente.id_paciente, tbl_detalle_factura_paciente.id_examen, tbl_detalle_factura_paciente.id_cultivo, tbl_detalle_orden.id_orden, tbl_orden.numero_orden FROM `tbl_detalle_factura_paciente`  INNER JOIN `tbl_detalle_orden` ON tbl_detalle_orden.id_detalle_factura_paciente = tbl_detalle_factura_paciente.id_detalle_factura_paciente INNER JOIN tbl_orden ON tbl_orden.id_orden = tbl_detalle_orden.id_orden WHERE tbl_detalle_factura_paciente.id_factura='" +req.params.id_factura+"'";
    connection.query(sql, function (err, result, fields) {
        if (err) {
            console.log('ERROR en CheckTemplate', err);
            res.send('3');
        }
        if(result){
            //console.log('PASO A RESULT!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!', result)
            //return result;
            //res.send(result);
            //console.log('EL RESULT!', result);
            let i=0;
            let j=0;
            let contador = 0;
            let primario = 0;
            let ordenPos = 0;
            let reqFactura = [];
            let examen = [];
            let precio = 0;
            let cultivo = [];
            let orden = [];

            for(let i=0; i<result.length;i++){
                contador = 0;
                if(result[i].id_examen != null){
                    primario = result[i].id_examen;
                    precio = result[i].precio;
                    //console.log('VALOR DE PRIMARIO', primario)
                    for(let j=0; j<result.length;j++){
                        if(primario==result[j].id_examen ){
                            //console.log('SUMA');
                            result[j].id_examen = null;
                            //console.log(result[j].id_ex)
                            contador++;
                        }
                    }
                    examen.push({
                        id_examen: primario,
                        precio: precio,
                        contador: contador,
                    });
                    //console.log('CONTADOR SUMADO!', contador);
                } else if(result[i].id_cultivo != null){
                    primario = result[i].id_cultivo;
                    precio = result[i].precio
                    //console.log('VALOR DE PRIMARIO', primario)
                    for(let j=0; j<result.length;j++){
                        if(primario==result[j].id_cultivo ){
                            //console.log('SUMA');
                            result[j].id_cultivo = null;
                            //console.log(result[j].id_ex)
                            contador++;
                        }
                    }
                    //console.log('CONTADOR SUMADO!', contador);
                    cultivo.push({
                        id_cultivo: primario,
                        precio: precio,
                        contador: contador,
                    });
                }
            }
            for(let i=0; i<result.length;i++){
                //contador = 0;
            if(result[i].id_orden != null){
                ordenPos = result[i].numero_orden;
                //console.log('VALOR DE ordenPos', ordenPos)
                for(let j=0; j<result.length;j++){
                    if(ordenPos==result[j].numero_orden ){
                        //console.log('SUMA');
                        result[j].id_orden = null;
                        //console.log(result[j].id_ex)
                        contador++;
                    }
                }
                orden.push({
                    orden_numero: ordenPos,
                    //contador: contador,
                });
            }
            }
            reqFactura.push({
                examenes: examen,
                cultivos: cultivo,
                ordenes: orden
            })
            //console.log('EL RESULT!', reqFactura)
            buscarPreciosNombres(reqFactura)
        }
    });

    function buscarPreciosNombres(reqFactura){
        //console.log('DESDE BUSCAR PRECIOS NOMBRES', reqFactura)
        var async = require('async');
        let impresion = [];
        let examenes = reqFactura[0].examenes;
        let cultivos = reqFactura[0].cultivos;
        let sqlExamenes;
        let sqlCultivos;
        let itemsFinal = [];
        //console.log('DESDE BUSCAR PRECIOS NOMBRES', examenes, cultivos)

        async function getExamenes(item){
            return new Promise((resolve, reject) => {
                sqlExamenes = "SELECT examen_nombre, examen_precio FROM tbl_examen WHERE id_examen='" +item.id_examen+"'";
                connection.query(sqlExamenes, function (err, result, fields) {
                if (err) {
                    console.log('ERROR en CheckTemplate', err);
                    res.send('3');
                }
                if(result){
                    //console.log(result)
                    item.nombre = result[0].examen_nombre;
                    //item.precio = result[0].examen_precio;
                    item.subtotal = item.contador * item.precio;
                    //item.subtotal = Number(Math.round(item.subtotal + "e2") + "e-2")
                    itemsFinal.push({
                        item: item
                    })
                    //examenesFinal = examen;
                    resolve(itemsFinal)
                    //console.log('-----------',examenesFinal);
                }
            });
            });
        }

        async function getCultivos(item){
            return new Promise((resolve, reject) => {
                    sqlCultivos = "SELECT cultivo_nombre, cultivo_precio FROM tbl_cultivo WHERE id_cultivo='" +item.id_cultivo+"'";
                    connection.query(sqlCultivos, function (err, result, fields) {
                    if (err) {
                        console.log('ERROR en CheckTemplate', err);
                        res.send('3');
                    }
                    if(result){
                        //console.log('!!!!!!!!',result)
                        item.nombre = result[0].cultivo_nombre;
                       //item.precio = result[0].cultivo_precio;
                        item.subtotal = item.contador * item.precio;
                        //console.log(cultivo);
                        itemsFinal.push({
                            item: item
                        })
                        resolve(itemsFinal)
                    }
                });
            });
        }

        async function getNumeroFactura(){
            //console.log("LA CONSOLEASDA!!!", req.params.id_tipo_factura)
            return new Promise((resolve, reject) => {
                //console.log("LA FACTURA!!!!", req.params.id_factura)
                if(req.params.id_tipo_factura == 1 || req.params.id_tipo_factura == 2){
                    sqlNumFactura = "SELECT numero_factura, orden_trabajo, date_format(fecha_creacion_factura,'%d-%m-%Y') AS fecha_creacion, tbl_factura.total_dolares, tbl_factura.total_pesos, tbl_factura.total_bolivares, tbl_factura.descuento_bolivares, tbl_factura.descuento_dolares, tbl_factura.descuento_pesos, tbl_factura.IGTF_bolivares, tbl_factura.IGTF_dolares, tbl_factura.IGTF_pesos, tbl_factura.base_imponible_bolivares, tbl_factura.base_imponible_dolares FROM tbl_factura WHERE id_factura='" +req.params.id_factura+"'";
                }else if(req.params.id_tipo_factura == 3){
                    sqlNumFactura = "SELECT numero_factura, orden_trabajo, date_format(fecha_creacion_orden_trabajo,'%d-%m-%Y') AS fecha_creacion, tbl_factura.total_dolares, tbl_factura.total_pesos, tbl_factura.total_bolivares, tbl_factura.descuento_bolivares, tbl_factura.descuento_dolares, tbl_factura.descuento_pesos, tbl_factura.IGTF_bolivares, tbl_factura.IGTF_dolares, tbl_factura.IGTF_pesos, tbl_factura.base_imponible_bolivares, tbl_factura.base_imponible_dolares FROM tbl_factura WHERE id_factura='" +req.params.id_factura+"'";
                }
                
                connection.query(sqlNumFactura, function (err, result, fields) {
                if (err) {
                    console.log('ERROR en CheckTemplate', err);
                    res.send('3');
                }
                if(result){
                    //console.log('EN RESULT!!!!!!', result)
                    let valor_total_venta_bolivares = result[0].total_bolivares;
                    let valor_total_venta_pesos = result[0].total_pesos;
                    let valor_total_venta_dolares = result[0].total_dolares;
                    let total_pagar_bolivares = valor_total_venta_bolivares + result[0].IGTF_bolivares;
                    let total_pagar_dolares = valor_total_venta_dolares + result[0].IGTF_dolares;
                    let total_pagar_pesos = valor_total_venta_pesos + result[0].IGTF_pesos;
                    impresion.push({
                        numero_factura: result[0].numero_factura,
                        orden_trabajo: result[0].orden_trabajo,
                        fecha_creacion: result[0].fecha_creacion,
                        id_factura: req.params.id_factura,
                        total_dolares: result[0].total_dolares, 
                        total_pesos: result[0].total_pesos, 
                        total_bolivares: result[0].total_bolivares, 
                        descuento_bolivares: result[0].descuento_bolivares, 
                        descuento_dolares: result[0].descuento_dolares, 
                        descuento_pesos: result[0].descuento_pesos, 
                        IGTF_bolivares: result[0].IGTF_bolivares, 
                        IGTF_dolares: result[0].IGTF_dolares, 
                        IGTF_pesos: result[0].IGTF_pesos,
                        valor_total_venta_bolivares: valor_total_venta_bolivares,
                        valor_total_venta_pesos: valor_total_venta_pesos,
                        valor_total_venta_dolares: valor_total_venta_dolares,
                        total_pagar_bolivares: total_pagar_bolivares,
                        total_pagar_dolares: total_pagar_dolares,
                        total_pagar_pesos: total_pagar_pesos,
                        base_imponible_bolivares: result[0].base_imponible_bolivares,
                        base_imponible_dolares: result[0].base_imponible_dolares
                    });
                    resolve(impresion);
                }
            });
            })
        }

        async function getTipoPago(){
            return new Promise((resolve, reject) => {
                sqlNumFactura = "SELECT tbl_registro_pago.id_tipo_pago, tbl_tipo_pago.tipo_pago_nombre FROM tbl_registro_pago INNER JOIN `tbl_tipo_pago` ON tbl_registro_pago.id_tipo_pago = tbl_tipo_pago.id_tipo_pago WHERE id_factura='" +req.params.id_factura+"'";
                connection.query(sqlNumFactura, function (err, result, fields) {
                if (err) {
                    console.log('ERROR en CheckTemplate', err);
                    res.send('3');
                }
                if(result){
                    
                    let pago;
                    let id_tipo_pago;
                    let nombre_pago = [];
                    for(let i=0; i<result.length; i++){
                        if(result[i].id_tipo_pago != null){
                            pago = result[i].tipo_pago_nombre;
                            id_tipo_pago = result[i].id_tipo_pago;
                            result[i].tipo_pago_nombre = null;
                            result[i].id_tipo_pago = null;
                            nombre_pago.push({
                                nombre: pago
                            })
                        }
                        //console.log(i);
                        for(let j=0; j<result.length; j++){
                            if(id_tipo_pago == result[j].id_tipo_pago){
                                result[j].id_tipo_pago = null;
                                result[j].tipo_pago_nombre = null;
                            }
                        }
                    }
                    //console.log('LOS NOMBRES DE LOS PAGOS', nombre_pago)
                    //console.log('TIPO PAGO!!!!!!', result)
                    impresion.push({
                        pagos: nombre_pago
                    })
                    /*impresion.push({
                        numero_factura: result[0].numero_factura,
                        orden_trabajo: result[0].orden_trabajo,
                        fecha_creacion: result[0].fecha_creacion,
                        id_factura: req.params.id_factura
                    });*/
                    resolve(nombre_pago);
                }
            });
            })
        }

        async function loopExamenesCultivos(){
            for (const examen of examenes){
              /*let examenGet =*/ await getExamenes(examen);
              //console.log('EL EXAMEN!!', examenGet)
            }
            for (const cultivo of cultivos){
              /*let cultivoGet =*/ await getCultivos(cultivo);
              //console.log('EL CULTIVOS!!', cultivoGet)
            }
           //console.log('LUEGO: ',cultivos);
            /*let numFactura =*/ await getNumeroFactura();
            await getTipoPago();
             //console.log('EL CULTIVOS!!', numFactura)
             let contItems = 0;
             for(const item of itemsFinal){
                 //console.log('EL ITEM', item.item.contador)
                contItems = contItems + item.item.contador;
             }
            impresion.push({
                cantidad_items: contItems,
                items: itemsFinal,
                ordenes: reqFactura[0].ordenes
            });

            res.send(impresion)

           
        }

        loopExamenesCultivos();
        
        //console.log('LUEGO: ', examenesFinal);

        
    }
}

facturacionCtrl.imprimirRegistroConvenio = async(req, res) =>{
    //console.log('EN IMPRIMIRREGISTROCONVENIO', req.params.id_registro_convenio)
    const sql = "SELECT tbl_detalle_factura_paciente.id_detalle_factura_paciente, tbl_detalle_factura_paciente.precio, tbl_detalle_factura_paciente.id_paciente, tbl_detalle_factura_paciente.id_examen, tbl_detalle_factura_paciente.id_cultivo, tbl_detalle_orden.id_orden, tbl_orden.numero_orden FROM `tbl_detalle_factura_paciente`  INNER JOIN `tbl_detalle_orden` ON tbl_detalle_orden.id_detalle_factura_paciente = tbl_detalle_factura_paciente.id_detalle_factura_paciente LEFT JOIN tbl_orden ON tbl_detalle_orden.id_orden = tbl_orden.id_orden WHERE tbl_detalle_factura_paciente.id_registro_convenio='" +req.params.id_registro_convenio+"'";
    connection.query(sql, function (err, result, fields) {
        if (err) {
            console.log('ERROR en CheckTemplate', err);
            res.send('3');
        }
        if(result){
            //console.log('PASO A RESULT!', result)
            //return result;
            //res.send(result);
            //console.log('EL RESULT!', result);
            let i=0;
            let j=0;
            let contador = 0;
            let primario = 0;
            let precio = 0;
            let ordenPos = 0;
            let reqFactura = [];
            let examen = [];
            let cultivo = [];
            let orden = [];

            for(let i=0; i<result.length;i++){
                contador = 0;
                if(result[i].id_examen != null){
                    primario = result[i].id_examen;
                    precio = result[i].precio;
                    //console.log('VALOR DE PRIMARIO', primario)
                    for(let j=0; j<result.length;j++){
                        if(primario==result[j].id_examen ){
                            //console.log('SUMA');
                            result[j].id_examen = null;
                            //console.log(result[j].id_ex)
                            contador++;
                        }
                    }
                    examen.push({
                        id_examen: primario,
                        precio: precio,
                        contador: contador,
                    });
                    //console.log('CONTADOR SUMADO!', contador);
                } else if(result[i].id_cultivo != null){
                    primario = result[i].id_cultivo;
                    precio = result[i].precio;
                    //console.log('VALOR DE PRIMARIO', primario)
                    for(let j=0; j<result.length;j++){
                        if(primario==result[j].id_cultivo ){
                            //console.log('SUMA');
                            result[j].id_cultivo = null;
                            //console.log(result[j].id_ex)
                            contador++;
                        }
                    }
                    //console.log('CONTADOR SUMADO!', contador);
                    cultivo.push({
                        id_cultivo: primario,
                        precio: precio,
                        contador: contador,
                    });
                }
            }
            for(let i=0; i<result.length;i++){
                //contador = 0;
            if(result[i].id_orden != null){
                ordenPos = result[i].numero_orden;
                //console.log('VALOR DE ordenPos', ordenPos)
                for(let j=0; j<result.length;j++){
                    if(ordenPos==result[j].numero_orden ){
                        //console.log('SUMA');
                        result[j].id_orden = null;
                        //console.log(result[j].id_ex)
                        contador++;
                    }
                }
                orden.push({
                    orden_numero: ordenPos,
                    //contador: contador,
                });
            }
            }
            reqFactura.push({
                examenes: examen,
                cultivos: cultivo,
                ordenes: orden
            })
            //console.log('EL RESULT!', reqFactura)
            buscarPreciosNombres(reqFactura)
        }
    });

    function buscarPreciosNombres(reqFactura){
        //console.log('DESDE BUSCAR PRECIOS NOMBRES', reqFactura)
        var async = require('async');
        let impresion = [];
        let examenes = reqFactura[0].examenes;
        let cultivos = reqFactura[0].cultivos;
        let sqlExamenes;
        let sqlCultivos;
        let itemsFinal = [];
        //console.log('DESDE BUSCAR PRECIOS NOMBRES', examenes, cultivos)

        async function getExamenes(item){
            return new Promise((resolve, reject) => {
                sqlExamenes = "SELECT examen_nombre, examen_precio FROM tbl_examen WHERE id_examen='" +item.id_examen+"'";
                connection.query(sqlExamenes, function (err, result, fields) {
                if (err) {
                    console.log('ERROR en CheckTemplate', err);
                    res.send('3');
                }
                if(result){
                    //console.log(result)
                    item.nombre = result[0].examen_nombre;
                    //item.precio = result[0].examen_precio;
                    item.subtotal = item.contador * item.precio;
                    //item.subtotal = Number(Math.round(item.subtotal + "e2") + "e-2")
                    itemsFinal.push({
                        item: item
                    })
                    //examenesFinal = examen;
                    resolve(itemsFinal)
                    //console.log('-----------',examenesFinal);
                }
            });
            });
        }

        async function getCultivos(item){
            return new Promise((resolve, reject) => {
                    sqlCultivos = "SELECT cultivo_nombre, cultivo_precio FROM tbl_cultivo WHERE id_cultivo='" +item.id_cultivo+"'";
                    connection.query(sqlCultivos, function (err, result, fields) {
                    if (err) {
                        console.log('ERROR en CheckTemplate', err);
                        res.send('3');
                    }
                    if(result){
                        //console.log('!!!!!!!!',result)
                        item.nombre = result[0].cultivo_nombre;
                        //item.precio = result[0].cultivo_precio;
                        item.subtotal = item.contador * item.precio;
                        //console.log(cultivo);
                        itemsFinal.push({
                            item: item
                        })
                        resolve(itemsFinal)
                    }
                });
            });
        }

        async function getNumeroFactura(){
            //console.log("LA CONSOLEASDA!!!", req.params.id_tipo_factura)
            return new Promise((resolve, reject) => {
                //console.log("EL REGISTRO CONVENIO!!!!", req.params.id_registro_convenio)
                /*if(req.params.id_tipo_factura == 1 || req.params.id_tipo_factura == 4){
                    sqlNumFactura = "SELECT numero_factura, orden_trabajo, date_format(fecha_creacion_factura,'%d-%m-%Y') AS fecha_creacion FROM tbl_factura WHERE id_factura='" +req.params.id_factura+"'";
                }else if(req.params.id_tipo_factura == 2){
                    sqlNumFactura = "SELECT numero_factura, orden_trabajo, date_format(fecha_creacion_orden_trabajo,'%d-%m-%Y') AS fecha_creacion FROM tbl_factura WHERE id_factura='" +req.params.id_factura+"'";
                }*/

                let sqlNumRegistro = "SELECT id_registro_convenio, numero_registro_convenio, date_format(fecha, '%d-%m-%Y') AS fecha_creacion FROM tbl_registro_convenio WHERE id_registro_convenio='" +req.params.id_registro_convenio+"'";
                
                connection.query(sqlNumRegistro, function (err, result, fields) {
                if (err) {
                    console.log('ERROR en CheckTemplate', err);
                    res.send('3');
                }
                if(result){
                    //console.log('EN RESULT!!!!!!', result)
                    impresion.push({
                        numero_registro_convenio: result[0].numero_registro_convenio,
                        fecha_creacion: result[0].fecha_creacion,
                        id_registro_convenio: req.params.id_registro_convenio
                    });
                    resolve(impresion);
                }
            });
            })
        }

        async function getTipoPago(){
            return new Promise((resolve, reject) => {
                sqlNumFactura = "SELECT tbl_registro_pago.id_tipo_pago, tbl_tipo_pago.tipo_pago_nombre FROM tbl_registro_pago INNER JOIN `tbl_tipo_pago` ON tbl_registro_pago.id_tipo_pago = tbl_tipo_pago.id_tipo_pago WHERE id_factura='" +req.params.id_factura+"'";
                connection.query(sqlNumFactura, function (err, result, fields) {
                if (err) {
                    console.log('ERROR en CheckTemplate', err);
                    res.send('3');
                }
                if(result){
                    
                    let pago;
                    let id_tipo_pago;
                    let nombre_pago = [];
                    for(let i=0; i<result.length; i++){
                        if(result[i].id_tipo_pago != null){
                            pago = result[i].tipo_pago_nombre;
                            id_tipo_pago = result[i].id_tipo_pago;
                            result[i].tipo_pago_nombre = null;
                            result[i].id_tipo_pago = null;
                            nombre_pago.push({
                                nombre: pago
                            })
                        }
                        //console.log(i);
                        for(let j=0; j<result.length; j++){
                            if(id_tipo_pago == result[j].id_tipo_pago){
                                result[j].id_tipo_pago = null;
                                result[j].tipo_pago_nombre = null;
                            }
                        }
                    }
                    //console.log('LOS NOMBRES DE LOS PAGOS', nombre_pago)
                    //console.log('TIPO PAGO!!!!!!', result)
                    impresion.push({
                        pagos: nombre_pago
                    })
                    /*impresion.push({
                        numero_factura: result[0].numero_factura,
                        orden_trabajo: result[0].orden_trabajo,
                        fecha_creacion: result[0].fecha_creacion,
                        id_factura: req.params.id_factura
                    });*/
                    resolve(nombre_pago);
                }
            });
            })
        }

        async function loopExamenesCultivos(){
            for (const examen of examenes){
              /*let examenGet =*/ await getExamenes(examen);
              //console.log('EL EXAMEN!!', examenGet)
            }
            for (const cultivo of cultivos){
              /*let cultivoGet =*/ await getCultivos(cultivo);
              //console.log('EL CULTIVOS!!', cultivoGet)
            }
            //console.log('LUEGO: ',cultivos);
            /*let numFactura =*/ await getNumeroFactura();
            await getTipoPago();
             //console.log('EL CULTIVOS!!', numFactura)
             let contItems = 0;
             for(const item of itemsFinal){
                 //console.log('EL ITEM', item.item.contador)
                contItems = contItems + item.item.contador;
             }
            impresion.push({
                cantidad_items: contItems,
                items: itemsFinal,
                ordenes: reqFactura[0].ordenes
            });

            res.send(impresion)

           
        }

        loopExamenesCultivos();
        
        //console.log('LUEGO: ', examenesFinal);

        
    }
}

facturacionCtrl.buscarFacturaPorNumero = async(req, res) =>{
    let sql = "SELECT id_factura FROM tbl_factura WHERE numero_factura='"+req.body.numero_factura+"'";
    connection.query(sql, function (err, result, fields) {
        if (err) {
            console.log('ERROR en CheckTemplate', err);
            res.send('3');
        }
        if(result){
            if(result.length > 0){
                //idFactura = result[0].id_factura;
                res.send(result[0]);
            }else if(result.length <= 0){
                //idFactura = 0;
                res.send("0");
            }
        }
    });
}

facturacionCtrl.crearNotaCredito = async(req, res) =>{
    //console.log(req.body);
    let numeroNotaCredito;
    let idNotaCredito;
    let detalleFacturaPaciente;


    numeroNotaCredito = await crearNumeroNotaCredito(numeroNotaCredito);
    await update();
    await crearNota(req.body.id_factura, numeroNotaCredito)
    idNotaCredito = await extraerIdNota(numeroNotaCredito, idNotaCredito)
    //console.log(req.body.id_factura, idNotaCredito)
    for(const pago of req.body.pagos){
        insertarPago(idNotaCredito, pago.idRegistroDivisa, pago.idTipoPago, pago.idBanco, pago.numeroReferencia, pago.monto, pago.igtf_pago)
    }
    if(req.body.num == 0){
        for(const devolucion of req.body.detalles_factura_paciente){
            await activarDevolucionDetalleFacturaPaciente(devolucion.id_detalle_factura_paciente);
            await guardarDetalleNotaCredito(devolucion.id_detalle_factura_paciente, idNotaCredito)
        }
    }
    if(req.body.num == 1){
        ////////////////////////////ANULAR LA FACTURA DE LA NOTA CREDITO//////////////////////////
        await activarDevolucionTotalDetalleFacturaPaciente(req.body.id_factura);
        for(const devolucion of req.body.detalles_factura_paciente){
            await guardarDetalleNotaCredito(devolucion.id_detalle_factura_paciente, idNotaCredito)
        }
        await anularFactura(req.body.id_factura);
    }
    //res.send("1")
    res.redirect('/imprimirNotaCredito/'+req.body.id_factura+'/'+idNotaCredito);

    async function activarDevolucionDetalleFacturaPaciente(idDetalleFacturaPaciente){
        return new Promise((resolve, reject) => {
            const sql = "UPDATE `tbl_detalle_factura_paciente` SET devolucion = 1 WHERE id_detalle_factura_paciente ='"+idDetalleFacturaPaciente+"'"
            connection.query(sql, function (err, result, fields) {
                if (err) {
                    console.log('ERROR en CheckTemplate', err);
                    res.send('3');
                }
                if(result){
                    resolve("1");
                }
            });
        })  
    }

    async function guardarDetalleNotaCredito(idDetalleFacturaPaciente, idNotaCredito){
        return new Promise((resolve, reject) => {
            let time = new Date(new Date().toLocaleString("en-US", {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true
            }));
                connection.query('INSERT INTO `tbl_detalle_nota_credito` SET?', {
                    id_nota_credito: idNotaCredito,
                    id_detalle_factura_paciente: idDetalleFacturaPaciente
                }, (err, result) => {
                    if (err) {
                        console.log('no se pudo a agregar', err)
                        res.send('ERROR EN AGREGAR detalle nota credito!')
                    } else {
                        //console.log('agrego nota a credito!!')
                        //res.send('AGREGO FACTURA!')
                        resolve("1")
                    }
                });
        })
    }

    async function activarDevolucionTotalDetalleFacturaPaciente(){
        return new Promise((resolve, reject) => {
            const sql = "UPDATE `tbl_detalle_factura_paciente` SET devolucion = 1 WHERE id_factura ='"+req.body.id_factura+"'"
            connection.query(sql, function (err, result, fields) {
                if (err) {
                    console.log('ERROR en CheckTemplate', err);
                    res.send('3');
                }
                if(result){
                    resolve("1");
                }
            });
        })
    }

    async function anularFactura(idFactura){
        return new Promise((resolve, reject) => {
            //const sql = "UPDATE `tbl_factura` SET id_estado_factura = 3, anulacion_motivo = '"+req.body.concepto+"' WHERE id_factura ='"+idFactura+"'"
            const sql = `UPDATE tbl_factura SET id_estado_factura = 3, anulacion_motivo = "${req.body.concepto}", id_usuario_anulacion = ${req.body.id_usuario} WHERE id_factura = ${idFactura}`
            connection.query(sql, function (err, result, fields) {
                if (err) {
                    console.log('ERROR en CheckTemplate', err);
                    res.send('3');
                }
                if(result){
                    resolve("1");
                }
            });
        })
    }

    async function crearNumeroNotaCredito(numeroNotaCredito){
        return new Promise((resolve, reject) => {
            const sqlUpdate = "UPDATE `tbl_numero_nota_credito_tmp` SET numero_nota_credito = numero_nota_credito + 1 WHERE id_numero_nota_credito = 1"
            connection.query(sql, function (err, result, fields) {
                if (err) {
                    console.log('ERROR en CheckTemplate', err);
                    res.send('3');
                }
                if(result){
                    numeroNotaCredito=result[0].numero_nota_credito;
                    resolve(numeroNotaCredito)
                }
            });
        })
    }

    async function crearNumeroNotaCredito(numeroNotaCredito){
        return new Promise((resolve, reject) => {
            const sql = "SELECT numero_nota_credito FROM `tbl_numero_nota_credito_tmp`";
            let numFact;
            connection.query(sql, function (err, result, fields) {
                if (err) {
                    console.log('ERROR en CheckTemplate', err);
                    res.send('3');
                }
                if(result){
                    numeroNotaCredito=result[0].numero_nota_credito;
                    resolve(numeroNotaCredito)
                }
            });
        });
    }

    function update(){
        return new Promise((resolve, reject) => {
            const sqlUpdate = "UPDATE `tbl_numero_nota_credito_tmp` SET numero_nota_credito = numero_nota_credito + 1 WHERE id_numero_nota_credito = 1"
            connection.query(sqlUpdate, function (err, result, fie) {
                if (err) {
                    console.log('error en la conexion intente de nuevo', err)
                    res.send('3')
                }else{
                    //console.log('numero de nota a credito aumentado!')
                    resolve("1");   
                }
            })
        });
    }

    async function crearNota(idFactura, numeroNotaCredito){
        return new Promise((resolve, reject) => {
            let time = new Date(new Date().toLocaleString("en-US", {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true
            }));
                connection.query('INSERT INTO `tbl_nota_credito` SET?', {
                    nota_credito_numero: numeroNotaCredito,
                    //id_factura: idFactura,
                    fecha_emision: time,
                    monto_bolivares: req.body.monto_bolivares,
                    monto_pesos: req.body.monto_pesos,
                    monto_dolares: req.body.monto_dolares,
                    concepto: req.body.concepto
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

    async function insertarPago(idNotaCredito, idRegistroDivisa, idTipoPago, idBanco, numeroReferencia, monto, igtf_pago){
        return new Promise((resolve, reject) => {
            let fecha_creacion = new Date(new Date().toLocaleString("en-US", {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true
            }));
            //console.log("00000000000000000000000000000000000000000000000000000000000", igtf_pago)
            connection.query('INSERT INTO `tbl_registro_pago` SET?', {
                id_nota_credito: idNotaCredito,
                id_registro_divisa: idRegistroDivisa,
                id_tipo_pago: idTipoPago,
                id_banco: idBanco,
                numero_referencia: numeroReferencia,
                monto: monto,
                igtf_pago: igtf_pago,
                fecha_creacion: fecha_creacion,
                id_usuario: req.body.id_usuario
            }, (err, result) => {
                if (err) {
                    console.log('no se pudo a agregar', err)
                    res.send('ERROR EN CREAR LA ORDEN!')
                } else {
                   resolve('1')
                }
            });
        });
    }

    async function extraerIdNota(numeroNotaCredito, idNotaCredito){
        return new Promise((resolve, reject) => {
            let sql = "SELECT id_nota_credito FROM `tbl_nota_credito` WHERE nota_credito_numero ='"+numeroNotaCredito+"'"
            connection.query(sql, function (err, result, fie) {
                if (err) {
                    console.log('error en la conexion intente de nuevo', err)
                    res.send('3')
                }else{
                    //console.log('numero de nota a credito aumentado!')
                    idNotaCredito = result[0].id_nota_credito;
                    resolve(idNotaCredito);   
                }
            })
        })
    }
}

facturacionCtrl.crearNotaDebito = async(req, res) =>{
    //console.log(req.body);
    let numeroNotaDebito;
    let idNotaDebito;


    numeroNotaDebito = await crearNumeroNotaDebito(numeroNotaDebito);
    await update();
    await crearNota(req.body.id_factura, numeroNotaDebito)
    idNotaDebito = await extraerIdNota(numeroNotaDebito, idNotaDebito)
    //console.log(req.body.id_factura, idNotaCredito)
    for(const pago of req.body.pagos){
        insertarPago(idNotaDebito, pago.idRegistroDivisa, pago.idTipoPago, pago.idBanco, pago.numeroReferencia, pago.monto, pago.igtf_pago)
    }
    res.send("1")
    //res.redirect('/imprimirNotaCredito/'+req.body.id_factura+'/'+idNotaCredito);


    async function crearNumeroNotaDebito(numeroNotaDebito){
        return new Promise((resolve, reject) => {
            const sql = "SELECT numero_nota_debito FROM `tbl_numero_nota_debito_tmp`";
            let numFact;
            connection.query(sql, function (err, result, fields) {
                if (err) {
                    console.log('ERROR en CheckTemplate', err);
                    res.send('3');
                }
                if(result){
                    numeroNotaDebito=result[0].numero_nota_debito;
                    resolve(numeroNotaDebito)
                }
            });
        });
    }

    function update(){
        return new Promise((resolve, reject) => {
            const sqlUpdate = "UPDATE `tbl_numero_nota_debito_tmp` SET numero_nota_debito = numero_nota_debito + 1 WHERE id_numero_nota_debito = 1"
            connection.query(sqlUpdate, function (err, result, fie) {
                if (err) {
                    console.log('error en la conexion intente de nuevo', err)
                    res.send('3')
                }else{
                    //console.log('numero de nota a debito aumentado!')
                    resolve("1");   
                }
            })
        });
    }

    async function crearNota(idFactura, numeroNotaDebito){
        return new Promise((resolve, reject) => {
            let time = new Date(new Date().toLocaleString("en-US", {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true
            }));
                connection.query('INSERT INTO `tbl_nota_debito` SET?', {
                    nota_debito_numero: numeroNotaDebito,
                    id_factura: idFactura,
                    fecha_emision: time,
                    monto_bolivares: req.body.monto_bolivares,
                    monto_pesos: req.body.monto_pesos,
                    //igtf_pago: req.body.igtf_pago,
                    monto_dolares: req.body.monto_dolares,
                    concepto: req.body.concepto,
                    id_usuario: req.body.id_usuario
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

    async function insertarPago(idNotaDebito, idRegistroDivisa, idTipoPago, idBanco, numeroReferencia, monto, igtf_pago){
        //console.log("0000000000000000000000000000000000000000000000", igtf_pago)
        return new Promise((resolve, reject) => {
            let fecha_creacion = new Date(new Date().toLocaleString("en-US", {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true
            }));
            connection.query('INSERT INTO `tbl_registro_pago` SET?', {
                id_nota_debito: idNotaDebito,
                id_registro_divisa: idRegistroDivisa,
                id_tipo_pago: idTipoPago,
                id_banco: idBanco,
                numero_referencia: numeroReferencia,
                monto: monto,
                igtf_pago: igtf_pago,
                fecha_creacion: fecha_creacion,
                id_usuario: req.body.id_usuario
            }, (err, result) => {
                if (err) {
                    console.log('no se pudo a agregar', err)
                    res.send('ERROR EN CREAR LA ORDEN!')
                } else {
                   resolve('1')
                }
            });
        });
    }

    async function extraerIdNota(numeroNotaDebito, idNotaDebito){
        return new Promise((resolve, reject) => {
            let sql = "SELECT id_nota_debito FROM `tbl_nota_debito` WHERE nota_debito_numero ='"+numeroNotaDebito+"'"
            connection.query(sql, function (err, result, fie) {
                if (err) {
                    console.log('error en la conexion intente de nuevo', err)
                    res.send('3')
                }else{
                    //console.log('numero de nota a credito aumentado!')
                    idNotaDebito = result[0].id_nota_debito;
                    resolve(idNotaDebito);   
                }
            })
        })
    }
}

facturacionCtrl.imprimirNotaCredito = async(req, res) =>{
    
    //console.log(req.params.id_nota_credito);
        let idNotaCredito = req.params.id_nota_credito;
        let idFactura = req.params.id_factura
        let notaCredito;
        let detalleFacturaPaciente;
        let detallesNotaCredito;
        let factura;
        let datos = {};

        notaCredito = await extraerDatosNotaCredito(idNotaCredito);


        if(notaCredito.id_factura == null){
            console.log("POR LA NUEVA TABLA")
            detallesNotaCredito = await extraerDatosDetallesNotaCredito(idNotaCredito)
            datos.datos_nota_credito = {
                id_nota_credito: detallesNotaCredito[0].id_nota_credito,
                id_factura:      detallesNotaCredito[0].id_factura,
                nota_credito_numero: detallesNotaCredito[0].nota_credito_numero,
                fecha_emision:       detallesNotaCredito[0].fecha_emision,
                monto_bolivares:     detallesNotaCredito[0].monto_bolivares,
                monto_pesos:         detallesNotaCredito[0].monto_pesos,
                monto_dolares:       detallesNotaCredito[0].monto_dolares,
                concepto:            detallesNotaCredito[0].concepto
            }
            datos.datos_factura = {
                id_factura: detallesNotaCredito[0].datos_factura,
                numero_factura: detallesNotaCredito[0].numero_factura,
                tasa_bolivar_dia: detallesNotaCredito[0].tasa_bolivar_dia,
                tasa_pesos_dia:   detallesNotaCredito[0].tasa_pesos_dia,
                id_cliente:       detallesNotaCredito[0].id_cliente,
                cliente_nombre:   detallesNotaCredito[0].cliente_nombre,
                cliente_apellido: detallesNotaCredito[0].cliente_apellido,
                cedula_RIF:       detallesNotaCredito[0].cedula_RIF,
                telefono:         detallesNotaCredito[0].telefono
            },
            
            datos.items_devueltos = [];
            detallesNotaCredito.forEach(element => {
                datos.items_devueltos.push({
                    id_detalle_factura_paciente: element.id_detalle_factura_paciente,
                    id_factura: element.id_factura,
                    id_paciente: element.id_paciente,
                    id_examen: element.id_examen,
                    id_cultivo: element.id_cultivo,
                    examen_nombre: element.examen_nombre,
                    examen_precio: element.examen_precio,
                    cultivo_nombre: element.cultivo_nombre,
                    cultivo_precio: element.cultivo_precio
                })
                //i++;
            });
        }else{
            console.log("POR LA VIEJA TABLA")
                factura = await extraerDatosFactura(idFactura)
                detalleFacturaPaciente = await extraerDetallesFacturaPaciente(idFactura);
                datos.datos_nota_credito= notaCredito,
                datos.datos_factura = factura,
                datos.items_devueltos = detalleFacturaPaciente;
        }


        res.send(datos)

    async function extraerDatosNotaCredito(idNotaCredito){
        return new Promise((resolve, reject) => {
            let sql = "SELECT id_nota_credito, id_factura, nota_credito_numero, date_format(fecha_emision, '%d-%m-%Y') AS fecha_emision, monto_bolivares, monto_pesos, monto_dolares, concepto FROM tbl_nota_credito WHERE id_nota_credito='" +req.params.id_nota_credito+"'";
            connection.query(sql, function (err, result, fields) {
                if (err) {
                    console.log('ERROR en CheckTemplate', err);
                    res.send('3');
                }
                if(result){
                    let notaCredito = result[0];
                    resolve(notaCredito)
                }
            });
        })
    }

    async function extraerDatosDetallesNotaCredito(idNotaCredito){
        return new Promise((resolve, reject) => {
            let sql = `SELECT tbl_detalle_nota_credito.id_detalle_nota_credito, tbl_detalle_nota_credito.id_nota_credito, tbl_detalle_nota_credito.id_detalle_factura_paciente, tbl_detalle_factura_paciente.id_factura, tbl_factura.numero_factura, tbl_factura.tasa_bolivar_dia, tbl_factura.tasa_pesos_dia, tbl_factura.id_cliente, tbl_cliente.cliente_nombre, tbl_cliente.cliente_apellido, tbl_cliente.cedula_RIF, tbl_cliente.telefono, tbl_detalle_factura_paciente.id_examen, tbl_detalle_factura_paciente.id_cultivo, tbl_examen.examen_nombre, tbl_examen.examen_precio, tbl_cultivo.cultivo_nombre, tbl_cultivo.cultivo_precio, tbl_nota_credito.nota_credito_numero, date_format(fecha_emision, '%d-%m-%Y') AS fecha_emision, tbl_nota_credito.monto_bolivares, tbl_nota_credito.monto_pesos, tbl_nota_credito.monto_dolares, tbl_nota_credito.concepto FROM tbl_detalle_nota_credito LEFT JOIN tbl_detalle_factura_paciente ON tbl_detalle_factura_paciente.id_detalle_factura_paciente = tbl_detalle_nota_credito.id_detalle_factura_paciente LEFT JOIN tbl_factura ON tbl_factura.id_factura = tbl_detalle_factura_paciente.id_factura LEFT JOIN tbl_examen ON tbl_examen.id_examen = tbl_detalle_factura_paciente.id_examen LEFT JOIN tbl_cultivo ON tbl_cultivo.id_cultivo = tbl_detalle_factura_paciente.id_cultivo LEFT JOIN tbl_cliente ON tbl_cliente.id_cliente = tbl_factura.id_cliente LEFT JOIN tbl_nota_credito ON tbl_nota_credito.id_nota_credito = tbl_detalle_nota_credito.id_nota_credito WHERE tbl_detalle_nota_credito.id_nota_credito= ${idNotaCredito}`;
            connection.query(sql, function (err, result, fields) {
                if (err) {
                    console.log('ERROR en CheckTemplate', err);
                    res.send('3');
                }
                if(result){
                    //console.log("[[[[", result)
                    let detalles = result;
                    resolve(detalles)
                }
            });
        })
    }

    async function extraerDatosFactura(idFactura){
        return new Promise((resolve, reject) => {
            let sql = "SELECT tbl_factura.id_factura, tbl_factura.numero_factura, tbl_factura.tasa_bolivar_dia, tbl_factura.tasa_pesos_dia, tbl_factura.id_cliente, tbl_cliente.cliente_nombre, tbl_cliente.cliente_apellido, tbl_cliente.cedula_RIF, tbl_cliente.telefono FROM tbl_factura LEFT JOIN tbl_cliente ON tbl_cliente.id_cliente = tbl_factura.id_cliente WHERE id_factura='" +idFactura+"'";
            connection.query(sql, function (err, result, fields) {
                if (err) {
                    console.log('ERROR en CheckTemplate', err);
                    res.send('3');
                }
                if(result){
                    let factura = result[0];
                    resolve(factura)
                }
            });
        })
    }

    async function extraerDetallesFacturaPaciente(idFactura){
        return new Promise((resolve, reject) => {
            let sql = "SELECT tbl_detalle_factura_paciente.id_detalle_factura_paciente, tbl_detalle_factura_paciente.id_factura, tbl_detalle_factura_paciente.id_paciente, tbl_detalle_factura_paciente.id_examen, tbl_detalle_factura_paciente.id_cultivo, tbl_examen.examen_nombre, tbl_examen.examen_precio, tbl_cultivo.cultivo_nombre, tbl_cultivo.cultivo_precio FROM tbl_detalle_factura_paciente LEFT JOIN tbl_examen ON tbl_examen.id_examen = tbl_detalle_factura_paciente.id_examen LEFT JOIN tbl_cultivo ON tbl_cultivo.id_cultivo = tbl_detalle_factura_paciente.id_cultivo WHERE id_factura='" +idFactura+"' AND devolucion = 1";
            connection.query(sql, function (err, result, fields) {
                if (err) {
                    console.log('ERROR en CheckTemplate', err);
                    res.send('3');
                }
                if(result){
                    let detallesFacturaPaciente = result;
                    //console.log("")
                    resolve(detallesFacturaPaciente)
                }
            });
        })
    }
}

facturacionCtrl.anulacionFactura = async(req, res) =>{
    let returnAnulacion;
    let ordenes;

    returnAnulacion = await anular(returnAnulacion);
    ordenes = await extraerOrdenes();
    for(const item of ordenes){
        await anularOrdenes(item.id_orden)
    }
    //console.log(ordenes)
    res.send(returnAnulacion)

    async function anular(returnAnulacion){
        return new Promise((resolve, returnAnulacion, reject) => {
            const sql = "UPDATE tbl_factura SET id_usuario_anulacion = '" + req.body.id_usuario + "', anulacion_motivo = '" + req.body.anulacion_motivo + "', id_estado_factura = 3 WHERE id_factura = '" +req.body.id_factura+ "'";
            connection.query(sql, function (err, result, fields) {
                if (err) {
                    console.log('ERROR en CheckTemplate', err);
                    res.send('3');
                }
                if(result){
                    returnAnulacion = "1";
                    resolve(returnAnulacion)
                }
            });
        })
    }

    async function extraerOrdenes(){
        return new Promise((resolve, reject) => {
            let sql = "SELECT tbl_detalle_factura_paciente.id_detalle_factura_paciente, tbl_detalle_factura_paciente.id_factura, tbl_detalle_factura_paciente.id_registro_convenio, tbl_detalle_orden.id_orden, tbl_orden.numero_orden FROM tbl_detalle_factura_paciente LEFT JOIN tbl_detalle_orden ON tbl_detalle_orden.id_detalle_factura_paciente = tbl_detalle_factura_paciente.id_detalle_factura_paciente LEFT JOIN tbl_orden ON tbl_orden.id_orden = tbl_detalle_orden.id_orden WHERE tbl_detalle_factura_paciente.id_factura = '" +req.body.id_factura+ "' GROUP BY tbl_orden.id_orden";
            connection.query(sql, function (err, result, fields) {
                if (err) {
                    console.log('ERROR en CheckTemplate', err);
                    res.send('3');
                }
                if(result){
                    
                    resolve(result)
                }
            });
        })
    }

    async function anularOrdenes(idOrden){
        return new Promise((resolve, reject) => {
            const sql = "UPDATE tbl_orden SET check_sueros = 1, check_laboratorios = 1, check_toma_muestra = 1, anulado = 1 WHERE id_orden = '" +idOrden+ "'";
            connection.query(sql, function (err, result, fields) {
                if (err) {
                    console.log('ERROR en CheckTemplate', err);
                    res.send('3');
                }
                if(result){
                    
                    resolve("1")
                }
            });
        })
    }


  
}

facturacionCtrl.anulacionRegistroConvenio = async(req, res) =>{
    let returnAnulacion;
    let ordenes;

    returnAnulacion = await anular(returnAnulacion);
    ordenes = await extraerOrdenes();
    for(const item of ordenes){
        await anularOrdenes(item.id_orden)
    }
    //console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!", ordenes)
    res.send(returnAnulacion)

    async function anular(returnAnulacion){
        //0 por pagar, 1 pagado, 2 anulado
        return new Promise((resolve, returnAnulacion, reject) => {
            const sql = "UPDATE tbl_registro_convenio SET id_usuario_anulacion = '" + req.body.id_usuario + "', anulacion_motivo = '" + req.body.anulacion_motivo + "', estatus = 2 WHERE id_registro_convenio = '" +req.body.id_registro_convenio+ "'";
            connection.query(sql, function (err, result, fields) {
                if (err) {
                    console.log('ERROR en CheckTemplate', err);
                    res.send('3');
                }
                if(result){
                    returnAnulacion = "1";
                    resolve(returnAnulacion)
                }
            });
        })
    }

    async function extraerOrdenes(){
        return new Promise((resolve, reject) => {
            let sql = "SELECT tbl_detalle_factura_paciente.id_detalle_factura_paciente, tbl_detalle_factura_paciente.id_factura, tbl_detalle_factura_paciente.id_registro_convenio, tbl_detalle_orden.id_orden, tbl_orden.numero_orden FROM tbl_detalle_factura_paciente LEFT JOIN tbl_detalle_orden ON tbl_detalle_orden.id_detalle_factura_paciente = tbl_detalle_factura_paciente.id_detalle_factura_paciente LEFT JOIN tbl_orden ON tbl_orden.id_orden = tbl_detalle_orden.id_orden WHERE tbl_detalle_factura_paciente.id_registro_convenio = '" +req.body.id_registro_convenio+ "' GROUP BY tbl_orden.id_orden";
            connection.query(sql, function (err, result, fields) {
                if (err) {
                    console.log('ERROR en CheckTemplate', err);
                    res.send('3');
                }
                if(result){
                    
                    resolve(result)
                }
            });
        })
    }

    async function anularOrdenes(idOrden){
        return new Promise((resolve, reject) => {
            const sql = "UPDATE tbl_orden SET check_sueros = 1, check_laboratorios = 1, check_toma_muestra = 1, anulado = 1 WHERE id_orden = '" +idOrden+ "'";
            connection.query(sql, function (err, result, fields) {
                if (err) {
                    console.log('ERROR en CheckTemplate', err);
                    res.send('3');
                }
                if(result){
                    
                    resolve("1")
                }
            });
        })
    }
}

facturacionCtrl.modificacionClienteFacturasOrdenesTrabajo = async(req, res) =>{
    let respFactura;

    respFactura = await modificar()
    res.send("1");

    async function modificar(){
        return new Promise((resolve, reject) => {
            const sql = "UPDATE `tbl_factura` SET id_cliente = "+req.body.id_cliente+" WHERE id_factura ="+req.body.id_factura;
            connection.query(sql, function (err, result, fields) {
                if (err) {
                    console.log('ERROR en CheckTemplate', err);
                    res.send('3');
                }
                if (result) {
                    res.send("1")
                }
            });
        })
    }
}

facturacionCtrl.notasCredito = async(req, res) =>{

    let notasCredito = await extraerNotasCredito();
    for(const notaCredito of notasCredito){
        if(notaCredito.id_factura == null){
           let nota = await verificarNotasCredito(notaCredito);
           //console.log(nota)
           notaCredito.numero_factura = nota.numero_factura,
           notaCredito.cliente_nombre = nota.cliente_nombre,
           notaCredito.cliente_apellido = nota.cliente_apellido,
           notaCredito.cedula_RIF = nota.cedula_RIF,
           notaCredito.id_factura = nota.id_factura
        }
    }

    res.send(notasCredito);

    async function extraerNotasCredito(){
        return new Promise((resolve, reject) => {
            let sql = `SELECT tbl_nota_credito.id_nota_credito, tbl_nota_credito.nota_credito_numero, tbl_nota_credito.id_factura, date_format(fecha_emision, '%d-%m-%Y') AS fecha_emision, tbl_nota_credito.monto_bolivares, tbl_nota_credito.monto_pesos, tbl_nota_credito.monto_dolares, tbl_nota_credito.concepto, tbl_factura.numero_factura, tbl_cliente.cliente_nombre, tbl_cliente.cliente_apellido, tbl_cliente.cedula_RIF FROM tbl_nota_credito LEFT JOIN tbl_factura ON tbl_factura.id_factura = tbl_nota_credito.id_factura LEFT JOIN tbl_cliente ON tbl_cliente.id_cliente = tbl_factura.id_cliente`;
            connection.query(sql, function (err, result, fields) {
                if (err) {
                    console.log('ERROR en CheckTemplate', err);
                    res.send('3');
                }
                if(result){
                    
                    resolve(result)
                }
            });
        })
    }

    async function verificarNotasCredito(notaCredito){
        return new Promise((resolve, reject) => {
            let sql = `SELECT tbl_detalle_factura_paciente.id_factura, tbl_factura.numero_factura, tbl_cliente.cliente_nombre, tbl_cliente.cliente_apellido, tbl_cliente.cedula_RIF FROM tbl_detalle_nota_credito LEFT JOIN tbl_detalle_factura_paciente ON tbl_detalle_factura_paciente.id_detalle_factura_paciente = tbl_detalle_nota_credito.id_detalle_factura_paciente LEFT JOIN tbl_factura ON tbl_factura.id_factura = tbl_detalle_factura_paciente.id_factura LEFT JOIN tbl_cliente ON tbl_cliente.id_cliente = tbl_factura.id_cliente WHERE tbl_detalle_nota_credito.id_nota_credito = ${notaCredito.id_nota_credito} GROUP BY tbl_detalle_factura_paciente.id_factura`
            connection.query(sql, function (err, result, fields) {
                if (err) {
                    console.log('ERROR en CheckTemplate', err);
                    res.send('3');
                }
                if(result){
                    if(result.length > 0){
                        resolve(result[0])
                    }else{
                        resolve('no data')
                    }
                    
                }
            });
        })
    }
}

module.exports = facturacionCtrl;