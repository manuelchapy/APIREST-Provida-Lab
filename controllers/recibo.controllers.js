const recibosCtrl = {};
const session = require('express-session');
const { updateLocale } = require('moment');
const { resolve } = require('path');
const connection = require('../src/database');

recibosCtrl.recibos = async (req, res) => {
    res.send('RECIBOS!')
}

recibosCtrl.recibosRegistroConvenio = async (req, res) => {

    let detallesRecibo;
    let objetoRes = {};
    let divisas;

    detallesRecibo = await extraerDetallesReciboRegistroConvenio();
    divisas = await getDivisas();
    objetoRes.recibos = detallesRecibo;
    objetoRes.divisas = divisas;
    res.send(objetoRes);

    async function extraerDetallesReciboRegistroConvenio(){
        return new Promise((resolve, reject) => {
                const sql = "SELECT tbl_detalle_recibo_registro_convenio.id_recibo, tbl_detalle_recibo_registro_convenio.id_registro_convenio, tbl_recibo.numero_recibo, date_format(tbl_recibo.fecha_creacion, '%d-%m-%Y') AS fecha_creacion, date_format(tbl_recibo.fecha_cancelacion, '%d-%m-%Y') AS fecha_cancelacion, tbl_recibo.monto_bolivares, tbl_recibo.monto_dolares, tbl_recibo.monto_pesos, tbl_recibo.IGTF_bolivares, tbl_recibo.IGTF_dolares, tbl_recibo.IGTF_pesos, tbl_registro_convenio.id_cliente, tbl_cliente.cliente_nombre, tbl_cliente.cliente_apellido, tbl_cliente.cedula_RIF, tbl_cliente.telefono FROM tbl_detalle_recibo_registro_convenio INNER JOIN tbl_recibo ON tbl_recibo.id_recibo = tbl_detalle_recibo_registro_convenio.id_recibo LEFT JOIN tbl_registro_convenio ON tbl_registro_convenio.id_registro_convenio = tbl_detalle_recibo_registro_convenio.id_registro_convenio LEFT JOIN tbl_cliente ON tbl_registro_convenio.id_cliente = tbl_cliente.id_cliente GROUP BY tbl_detalle_recibo_registro_convenio.id_recibo";
                let numFact;
                connection.query(sql, function (err, result, fields) {
                    if (err) {
                        console.log('ERROR en CheckTemplate', err);
                        res.send('3');
                    }
                    if(result){
                        resolve(result)
                    }
                })
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

    
}

recibosCtrl.recibosFacturasCredito = async (req, res) => {

    let recibos;
    let objetoRes = {};
    let divisas;

    recibos = await extraerRecibos();
    divisas = await getDivisas();
    objetoRes.recibos = recibos;
    objetoRes.divisas = divisas;
    res.send(objetoRes);


    async function extraerRecibos(){
        return new Promise((resolve, reject) => {
            let sql = "SELECT tbl_recibo.id_recibo, tbl_recibo.numero_recibo, tbl_recibo.id_factura, DATE_FORMAT(tbl_recibo.fecha_creacion, '%d-%m-%Y %T') AS fecha_creacion, DATE_FORMAT(tbl_recibo.fecha_cancelacion, '%d-%m-%Y %T') AS fecha_cancelacion, tbl_recibo.monto_bolivares, tbl_recibo.monto_dolares, tbl_recibo.monto_pesos, tbl_recibo.descuento_bolivares, tbl_recibo.descuento_dolares, tbl_recibo.descuento_pesos, tbl_recibo.IGTF_bolivares, tbl_recibo.IGTF_dolares, tbl_recibo.IGTF_pesos, tbl_recibo.tasa_bolivar_dia, tbl_recibo.tasa_pesos_dia, tbl_recibo.id_tipo_recibo, tbl_recibo.id_usuario, tbl_factura.numero_factura, tbl_cliente.cliente_nombre, tbl_cliente.cedula_RIF FROM `tbl_recibo` LEFT JOIN tbl_factura ON tbl_recibo.id_factura = tbl_factura.id_factura LEFT JOIN tbl_cliente ON tbl_cliente.id_cliente = tbl_factura.id_cliente WHERE tbl_recibo.id_factura is not null"
            connection.query(sql, function (err, result, fields) {
                if (err) {
                    console.log('ERROR en CheckTemplate', err);
                    res.send('3');
                }
                if(result){
                    resolve(result)
                }
            })
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
}

recibosCtrl.detallesRecibo = async (req, res) => {

    let recibo = {}
    let pagos  = {}
    let registrosConvenio;
    let resp   = {}

    recibo = await extraerRecibo();
    registrosConvenio = await verificarRegistroConvenio();
    pagos  = await extraerRegistrosPago();
    console.log("!!!!!!!!!!!!", registrosConvenio.length)
    if(registrosConvenio.length > 0){
        resp.registrosConvenio = registrosConvenio
    }else{
        resp.registrosConvenio = [];
    }
    resp.recibo = recibo[0];
    resp.pagos  = pagos;

    res.send(resp);

    async function extraerRecibo(){
        return new Promise((resolve, reject) => {
            let sql = "SELECT * FROM `tbl_recibo` WHERE id_recibo ='" +req.body.id_recibo+"'"
            connection.query(sql, function (err, result, fields) {
                if (err) {
                    console.log('ERROR en CheckTemplate', err);
                    res.send('3');
                }
                if(result){
                    resolve(result)
                }
            })
        })
    }

    async function verificarRegistroConvenio(){
        return new Promise((resolve, reject) => {
            let sql = "SELECT tbl_detalle_recibo_registro_convenio.id_detalle_recibo_registro_convenio, tbl_detalle_recibo_registro_convenio.id_recibo, tbl_detalle_recibo_registro_convenio.id_registro_convenio, tbl_registro_convenio.numero_registro_convenio, tbl_registro_convenio.id_cliente, tbl_registro_convenio.total_bolivares, tbl_registro_convenio.total_pesos, tbl_registro_convenio.total_dolares, tbl_registro_convenio.descuento_bolivares, tbl_registro_convenio.descuento_pesos, tbl_registro_convenio.descuento_dolares, tbl_registro_convenio.debe_dolares, tbl_registro_convenio.id_usuario, tbl_registro_convenio.fecha, tbl_registro_convenio.id_cliente, tbl_cliente.cliente_nombre, tbl_cliente.cliente_apellido, tbl_cliente.cedula_RIF, tbl_cliente.telefono FROM tbl_detalle_recibo_registro_convenio LEFT JOIN tbl_registro_convenio ON tbl_registro_convenio.id_registro_convenio = tbl_detalle_recibo_registro_convenio.id_registro_convenio LEFT JOIN tbl_cliente ON tbl_cliente.id_cliente = tbl_registro_convenio.id_cliente WHERE id_recibo ='" +req.body.id_recibo+"'";
            connection.query(sql, function (err, result, fields) {
                if (err) {
                    console.log('ERROR en CheckTemplate', err);
                    res.send('3');
                }
                if(result){
                    resolve(result)
                }
            })
        })
    }

    async function extraerRegistrosPago(){
        return new Promise((resolve, reject) => {
            let sql = "SELECT * FROM tbl_registro_pago WHERE id_recibo ='" +req.body.id_recibo+"'"
            connection.query(sql, function (err, result, fields) {
                if (err) {
                    console.log('ERROR en CheckTemplate', err);
                    res.send('3');
                }
                if(result){
                    resolve(result)
                }
            })
        })
    }
}

recibosCtrl.crearRecibo = async (req, res) => {
    //res.send('RECIBOS!')

    let numRecibo;
    let idRecibo;
    let restaDebe = req.body.monto_dolares;
    let restaDolares;
    let debe;
    //let monto;

    await extraerNumeroRecibo();
    await crearRecibo(numRecibo);
    await update();
    await extraerIdRecibo(numRecibo);
    for (const pago of req.body.pagos){
        //console.log('PAGO', pago)
        await detallesFiscales(req.body.id_factura, idRecibo, pago.id_registro_divisa, pago.id_tipo_pago, pago.id_banco, pago.numero_referencia, pago.monto, pago.tipo_registro, pago.igtf_monto, pago.igtf_pago)
    }
    debe = await extraerDebeDolares(req.body.id_factura, debe)
    restaDolares = debe - restaDebe;
    await updateDebeDolares(req.body.id_factura, restaDolares);
    res.redirect('/imprimirRecibo/'+idRecibo);
    //res.send("1");

    async function extraerNumeroRecibo(){
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM tbl_numero_recibo_tmp";
                let numFact;
                connection.query(sql, function (err, result, fields) {
                    if (err) {
                        console.log('ERROR en CheckTemplate', err);
                        res.send('3');
                    }
                    if(result){
                        numRecibo=result[0].numero_recibo;
                        resolve(numRecibo);
                    }
                });
        });
    }

    async function crearRecibo(numRecibo){
        return new Promise((resolve, reject) => {
                console.log('PASO A AGREGAR!!!!!!!', req.body)
                let time = new Date(new Date().toLocaleString("en-US", {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: true
                }));
                connection.query('INSERT INTO `tbl_recibo` SET?', {
                    id_factura: req.body.id_factura,
                    numero_recibo: numRecibo,
                    fecha_creacion: time,
                    fecha_cancelacion: time,
                    monto_bolivares: req.body.monto_bolivares,
                    monto_dolares: req.body.monto_dolares,
                    monto_pesos: req.body.monto_pesos,
                    IGTF_bolivares: req.body.IGTF_bolivares,
                    IGTF_dolares: req.body.IGTF_dolares,
                    IGTF_pesos: req.body.IGTF_pesos,
                    id_usuario: req.body.id_usuario
                }, (err, result) => {
                    if (err) {
                        console.log('no se pudo a agregar', err)
                        res.send('ERROR EN AGREGAR FACTURA!')
                    } else {
                        console.log('agrego!!', result)
                        resolve('1');
                    }
                });
        });
    }

    async function update(){
        return new Promise((resolve, reject) => {
            const sqlUpdate = "UPDATE `tbl_numero_recibo_tmp` SET numero_recibo = numero_recibo + 1 WHERE id_numero_recibo = 1"
            connection.query(sqlUpdate, function (err, result, fie) {
                if (err) {
                    console.log('error en la conexion intente de nuevo', err)
                    res.send('3')
                }else{
                    console.log('numero de recibo aumentado!')
                    resolve('1')
                }
            })
        });
    }

    async function extraerIdRecibo(numRecibo){
        return new Promise((resolve, reject) => {
            const sql = "SELECT id_recibo FROM `tbl_recibo` WHERE numero_recibo='" +numRecibo+"'";
            connection.query(sql, function (err, result, fields) {
                if (err) {
                    console.log('ERROR en CheckTemplate', err);
                    res.send('3');
                }
                if(result){
                    //console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', result[0].id_factura);
                    idRecibo = result[0].id_recibo
                    resolve(idRecibo)
                }
            });
        });
    }

    async function detallesFiscales(idFactura, idRecibo, id_registro_divisa, id_tipo_pago, id_banco, numero_referencia, monto, tipo_registro, igtf_monto, igtf_pago){
        return new Promise((resolve, reject) => {
            console.log("OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO",idFactura, idRecibo, id_registro_divisa, id_tipo_pago, id_banco, numero_referencia, monto, tipo_registro)
            let time = new Date(new Date().toLocaleString("en-US", {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true
            }));
            connection.query('INSERT INTO `tbl_registro_pago` SET?', {
                id_factura: idFactura,
                id_recibo: idRecibo,
                id_registro_divisa: id_registro_divisa,
                id_tipo_pago: id_tipo_pago,
                id_banco: id_banco,
                numero_referencia: numero_referencia,
                monto: monto,
                fecha_creacion: time,
                tipo_registro: tipo_registro,
                igtf_pago: igtf_pago,
                id_usuario: req.body.id_usuario
            }, (err, result) => {
                if (err) {
                    console.log('no se pudo a agregar', err)
                    res.send('ERROR EN AGREGAR FACTURA!')
                } else {
                    console.log('agrego!!', result)
                    //res.send('AGREGO FACTURA!')
                    resolve('1');
                }
            });
        });
    }

    async function extraerDebeDolares(idFactura, debe){
        return new Promise((resolve, reject) => {
            const sqlUpdate = "SELECT debe_dolares FROM `tbl_factura` WHERE id_factura='" +idFactura+"'";
            connection.query(sqlUpdate, function (err, result, fie) {
                if (err) {
                    console.log('error en la conexion intente de nuevo', err)
                    res.send('3')
                }else{
                    console.log('numero de recibo aumentado!')
                    debe = result[0].debe_dolares;
                    resolve(debe)
                }
            })
        });
    }

    async function updateDebeDolares(idFactura, restaDolares){
        return new Promise((resolve, reject) => {
            let sql;
            console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!11", restaDolares)
            if(restaDolares <= 0){
                sqlUpdate = "UPDATE `tbl_factura` SET debe_dolares = '" +restaDolares+"', IGTF_bolivares = '" +req.body.IGTF_bolivares+"', IGTF_dolares = '" +req.body.IGTF_dolares+"', IGTF_pesos = '" +req.body.IGTF_pesos+"', id_estado_factura = 1 WHERE id_factura='" +idFactura+"'";
            }else if(restaDolares > 0){
                sqlUpdate = "UPDATE `tbl_factura` SET debe_dolares = '" +restaDolares+"', IGTF_bolivares = '" +req.body.IGTF_bolivares+"', IGTF_dolares = '" +req.body.IGTF_dolares+"', IGTF_pesos = '" +req.body.IGTF_pesos+"' WHERE id_factura='" +idFactura+"'";
            }
            connection.query(sqlUpdate, function (err, result, fie) {
                if (err) {
                    console.log('error en la conexion intente de nuevo', err)
                    res.send('3')
                }else{
                    console.log('reducido los dolares!')
                    resolve('1')
                }
            })
        });
    }
}

recibosCtrl.imprimirReciboRegistroConvenio = async (req, res) => {
    let recibo = {};
    let detallesRecibo = {};
    let reciboFull = {};
    let registroConvenios = [];

    recibo = await extraerRecibo(req.params.id_recibo);
    detallesRecibo = await extraerDetalleRecibo(req.params.id_recibo);
    registroConvenios = await extraerRegistrosConvenio(req.params.id_recibo);
    reciboFull.detalles_registro_convenio = registroConvenios;
    reciboFull.recibo = recibo;
    reciboFull.detallesRecibo = detallesRecibo;
    res.send(reciboFull);
    
    async function extraerRecibo(idRecibo){
        return new Promise((resolve, reject) => {
            let sql = "SELECT tbl_recibo.id_recibo, tbl_recibo.numero_recibo, date_format(fecha_creacion,'%d-%m-%Y') AS fecha_creacion, date_format(fecha_cancelacion,'%d-%m-%Y') AS fecha_cancelacion, tbl_recibo.monto_bolivares, tbl_recibo.monto_dolares, tbl_recibo.monto_pesos, tbl_recibo.IGTF_bolivares, tbl_recibo.IGTF_pesos, tbl_recibo.IGTF_dolares, tbl_cliente.cliente_nombre, tbl_cliente.cliente_apellido, tbl_cliente.cedula_RIF, tbl_cliente.telefono, tbl_detalle_recibo_registro_convenio.id_recibo FROM tbl_detalle_recibo_registro_convenio LEFT JOIN tbl_recibo ON tbl_recibo.id_recibo = tbl_detalle_recibo_registro_convenio.id_recibo LEFT JOIN tbl_registro_convenio ON tbl_registro_convenio.id_registro_convenio = tbl_detalle_recibo_registro_convenio.id_registro_convenio LEFT JOIN tbl_cliente ON tbl_cliente.id_cliente = tbl_registro_convenio.id_cliente WHERE tbl_detalle_recibo_registro_convenio.id_recibo='" +idRecibo+"' GROUP BY tbl_detalle_recibo_registro_convenio.id_recibo"
            connection.query(sql, function (err, result, fie) {
                if (err) {
                    console.log('error en la conexion intente de nuevo', err)
                    res.send('3')
                }else{
                    let recibo;
                    recibo = result
                    resolve(recibo)
                }
            })
        })
    }

    async function extraerDetalleRecibo(idRecibo){
        return new Promise((resolve, reject) => {
            let sql = "SELECT tbl_registro_pago.id_registro_pago, tbl_registro_pago.id_factura, tbl_registro_pago.id_recibo, tbl_registro_pago.id_registro_divisa, tbl_registro_pago.id_tipo_pago, tbl_registro_pago.tipo_registro, tbl_registro_pago.id_banco, tbl_registro_pago.numero_referencia, tbl_registro_pago.monto, tbl_registro_pago.igtf_pago, tbl_registro_divisa.id_divisa, tbl_divisa.divisa_nombre, tbl_banco.banco_nombre, tbl_tipo_pago.tipo_pago_nombre FROM tbl_registro_pago LEFT JOIN tbl_registro_divisa ON tbl_registro_divisa.id_registro_divisa = tbl_registro_pago.id_registro_divisa LEFT JOIN tbl_divisa ON tbl_registro_divisa.id_divisa = tbl_divisa.id_divisa LEFT JOIN tbl_banco ON tbl_banco.id_banco = tbl_registro_pago.id_banco LEFT JOIN tbl_tipo_pago ON tbl_registro_pago.id_tipo_pago = tbl_tipo_pago.id_tipo_pago WHERE id_recibo='" +idRecibo+"'"
            connection.query(sql, function (err, result, fie) {
                if (err) {
                    console.log('error en la conexion intente de nuevo', err)
                    res.send('3')
                }else{
                    let detalleRecibo;
                    detalleRecibo = result;
                    resolve(detalleRecibo)
                }
            })
        })
    }

    async function extraerRegistrosConvenio(idRecibo){
        return new Promise((resolve, reject) => {
            let sql = `SELECT tbl_detalle_recibo_registro_convenio.id_registro_convenio, tbl_registro_convenio.total_dolares, tbl_registro_convenio.numero_registro_convenio, date_format(fecha, '%d-%m-%Y') AS fecha FROM tbl_detalle_recibo_registro_convenio LEFT JOIN tbl_registro_convenio ON tbl_registro_convenio.id_registro_convenio = tbl_detalle_recibo_registro_convenio.id_registro_convenio WHERE tbl_detalle_recibo_registro_convenio.id_recibo = ${idRecibo}`
            connection.query(sql, function (err, result, fie) {
                if (err) {
                    console.log('error en la conexion intente de nuevo', err)
                    res.send('3')
                }else{
                    let detalleRecibo;
                    detalleRecibo = result;
                    resolve(detalleRecibo)
                }
            })
        })
    }
}

recibosCtrl.imprimirRecibo = async (req, res) => {
    //console.log(req.params);

    let recibo = {};
    let detallesRecibo = {};
    let reciboFull = {};

    recibo = await extraerRecibo(req.params.id_recibo);
    detallesRecibo = await extraerDetalleRecibo(req.params.id_recibo)
    reciboFull.recibo = recibo;
    reciboFull.detallesRecibo = detallesRecibo;
    res.send(reciboFull);
    
    async function extraerRecibo(idRecibo){
        return new Promise((resolve, reject) => {
            let sql = "SELECT tbl_recibo.id_recibo, tbl_recibo.id_factura, tbl_recibo.numero_recibo, date_format(tbl_recibo.fecha_creacion,'%d-%m-%Y') AS fecha_creacion,  date_format(tbl_recibo.fecha_cancelacion,'%d-%m-%Y') AS fecha_creacion, tbl_recibo.monto_bolivares, tbl_recibo.monto_dolares, tbl_recibo.monto_pesos, tbl_recibo.IGTF_bolivares, tbl_recibo.IGTF_pesos, tbl_recibo.IGTF_dolares, tbl_factura.numero_factura, tbl_factura.orden_trabajo, tbl_factura.id_cliente, tbl_cliente.cliente_nombre, tbl_cliente.cliente_apellido, tbl_cliente.cedula_RIF, tbl_cliente.telefono FROM tbl_recibo LEFT JOIN tbl_factura ON tbl_recibo.id_factura = tbl_factura.id_factura LEFT JOIN tbl_cliente ON tbl_cliente.id_cliente = tbl_factura.id_cliente WHERE id_recibo='" +idRecibo+"'"
            connection.query(sql, function (err, result, fie) {
                if (err) {
                    console.log('error en la conexion intente de nuevo', err)
                    res.send('3')
                }else{
                    let recibo;
                    recibo = result;
                    console.log("!!!!!!!!!!!!", recibo)
                    resolve(recibo)
                }
            })
        })
    }

    async function extraerDetalleRecibo(idRecibo){
        return new Promise((resolve, reject) => {
            let sql = "SELECT tbl_registro_pago.id_registro_pago, tbl_registro_pago.id_factura, tbl_registro_pago.id_recibo, tbl_registro_pago.id_registro_divisa, tbl_registro_pago.id_tipo_pago, tbl_registro_pago.tipo_registro, tbl_registro_pago.id_banco, tbl_registro_pago.numero_referencia, tbl_registro_pago.monto, tbl_registro_pago.igtf_pago, tbl_registro_divisa.id_divisa, tbl_divisa.divisa_nombre, tbl_banco.banco_nombre, tbl_tipo_pago.tipo_pago_nombre FROM tbl_registro_pago LEFT JOIN tbl_registro_divisa ON tbl_registro_divisa.id_registro_divisa = tbl_registro_pago.id_registro_divisa LEFT JOIN tbl_divisa ON tbl_registro_divisa.id_divisa = tbl_divisa.id_divisa LEFT JOIN tbl_banco ON tbl_banco.id_banco = tbl_registro_pago.id_banco LEFT JOIN tbl_tipo_pago ON tbl_registro_pago.id_tipo_pago = tbl_tipo_pago.id_tipo_pago WHERE id_recibo='" +idRecibo+"'"
            connection.query(sql, function (err, result, fie) {
                if (err) {
                    console.log('error en la conexion intente de nuevo', err)
                    res.send('3')
                }else{
                    let detalleRecibo;
                    detalleRecibo = result;
                    resolve(detalleRecibo)
                }
            })
        })
    }
}

recibosCtrl.crearReciboRegistroConvenio = async (req, res) => {
    //res.send('RECIBOS!')

    let numRecibo;
    let idRecibo;
    let restaDebe = req.body.monto_dolares;
    let restaDolares;
    let debe;
    //let monto;

    await extraerNumeroRecibo();
    await crearRecibo(numRecibo);
    await update();
    await extraerIdRecibo(numRecibo);
    for (const pago of req.body.pagos){
        //console.log('PAGO', pago)
        await detallesFiscales(idRecibo, pago.id_registro_divisa, pago.id_tipo_pago, pago.id_banco, pago.numero_referencia, pago.monto, pago.igtf_pago, pago.tipo_registro)
    }
    for(const idRegistroConvenio of req.body.registros_convenio){
        await guardarDetallesReciboRegistroConvenio(idRecibo, idRegistroConvenio.id_registro_convenio);
        await editarRegistoConvenio(idRegistroConvenio.id_registro_convenio);
    }
    res.redirect('/imprimirReciboRegistroConvenio/'+idRecibo);
    //res.send("1");

    async function extraerNumeroRecibo(){
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM tbl_numero_recibo_tmp";
                let numFact;
                connection.query(sql, function (err, result, fields) {
                    if (err) {
                        console.log('ERROR en CheckTemplate', err);
                        res.send('3');
                    }
                    if(result){
                        numRecibo=result[0].numero_recibo;
                        resolve(numRecibo);
                    }
                });
        });
    }

    async function editarRegistoConvenio(idRegistroConvenio){
        return new Promise((resolve, reject) => {
                        //0 por pagar, 1 pagado, 2 anulado
                        const sql = "UPDATE tbl_registro_convenio SET estatus = 1 WHERE id_registro_convenio = '" +idRegistroConvenio+"'";
                let numFact;
                connection.query(sql, function (err, result, fields) {
                    if (err) {
                        console.log('ERROR en CheckTemplate', err);
                        res.send('3');
                    }
                    if(result){
                        resolve("1")
                    }
                });
        });
    }

    async function crearRecibo(numRecibo){
        return new Promise((resolve, reject) => {
                console.log('PASO A AGREGAR!!!!!!!', req.body)
                let time = new Date(new Date().toLocaleString("en-US", {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: true
                }));
                connection.query('INSERT INTO `tbl_recibo` SET?', {
                    numero_recibo: numRecibo,
                    fecha_creacion: time,
                    fecha_cancelacion: time,
                    monto_bolivares: req.body.monto_bolivares,
                    monto_dolares: req.body.monto_dolares,
                    monto_pesos: req.body.monto_pesos,
                    descuento_bolivares: req.body.descuento_bolivares,
                    descuento_pesos: req.body.descuento_pesos,
                    descuento_dolares: req.body.descuento_dolares,
                    IGTF_bolivares: req.body.IGTF_bolivares,
	                IGTF_pesos: req.body.IGTF_pesos,
	                IGTF_dolares: req.body.IGTF_dolares,
                    tasa_pesos_dia: req.body.tasa_pesos_dia,
                    tasa_bolivar_dia: req.body.tasa_bolivar_dia,
                    id_usuario: req.body.id_usuario
                }, (err, result) => {
                    if (err) {
                        console.log('no se pudo a agregar', err)
                        res.send('ERROR EN AGREGAR FACTURA!')
                    } else {
                        console.log('agrego!!', result)
                        resolve('1');
                    }
                });
        });
    }

    async function update(){
        return new Promise((resolve, reject) => {
            const sqlUpdate = "UPDATE `tbl_numero_recibo_tmp` SET numero_recibo = numero_recibo + 1 WHERE id_numero_recibo = 1"
            connection.query(sqlUpdate, function (err, result, fie) {
                if (err) {
                    console.log('error en la conexion intente de nuevo', err)
                    res.send('3')
                }else{
                    console.log('numero de recibo aumentado!')
                    resolve('1')
                }
            })
        });
    }

    async function extraerIdRecibo(numRecibo){
        return new Promise((resolve, reject) => {
            const sql = "SELECT id_recibo FROM `tbl_recibo` WHERE numero_recibo='" +numRecibo+"'";
            connection.query(sql, function (err, result, fields) {
                if (err) {
                    console.log('ERROR en CheckTemplate', err);
                    res.send('3');
                }
                if(result){
                    //console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', result[0].id_factura);
                    idRecibo = result[0].id_recibo
                    resolve(idRecibo)
                }
            });
        });
    }

    async function detallesFiscales(idRecibo, id_registro_divisa, id_tipo_pago, id_banco, numero_referencia, monto, igtf_pago, tipo_registro){
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
            connection.query('INSERT INTO `tbl_registro_pago` SET?', {
                id_recibo: idRecibo,
                id_registro_divisa: id_registro_divisa,
                id_tipo_pago: id_tipo_pago,
                id_banco: id_banco,
                numero_referencia: numero_referencia,
                igtf_pago: igtf_pago,
                tipo_registro: tipo_registro,
                monto: monto,
                id_usuario: req.body.id_usuario,
                fecha_creacion: time
            }, (err, result) => {
                if (err) {
                    console.log('no se pudo a agregar', err)
                    res.send('ERROR EN AGREGAR FACTURA!')
                } else {
                    console.log('agrego!!', result)
                    //res.send('AGREGO FACTURA!')
                    resolve('1');
                }
            });
        });
    }

    async function guardarDetallesReciboRegistroConvenio(idRecibo, idRegistroConvenio){
        return new Promise((resolve, reject) => {
            connection.query('INSERT INTO `tbl_detalle_recibo_registro_convenio` SET?', {
                id_registro_convenio: idRegistroConvenio,
                id_recibo: idRecibo
            }, (err, result) => {
                if (err) {
                    console.log('no se pudo a agregar', err)
                    res.send('ERROR EN AGREGAR FACTURA!')
                } else {
                    console.log('agrego!!', result)
                    //res.send('AGREGO FACTURA!')
                    resolve('1');
                }
            });
        })
    }
    
}

module.exports = recibosCtrl;