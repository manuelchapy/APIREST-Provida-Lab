const dbFunctionsAdminFiscal = {};
const connection = require('../../src/database');

dbFunctionsAdminFiscal.buscarFacturas = async(idConvenios) =>{
    return new Promise((resolve, reject) => {
        //query mas exacto
        //let sql = "SELECT tbl_factura.id_factura, tbl_factura.numero_factura, tbl_factura.id_estado_factura, tbl_factura.debe_dolares, tbl_factura.orden_trabajo, tbl_factura.total_bolivares, tbl_factura.total_dolares, tbl_factura.total_pesos, tbl_factura.id_usuario, tbl_factura.id_cliente, tbl_factura.id_tipo_factura, tbl_factura.id_estado_factura, DATE_FORMAT(tbl_factura.fecha_creacion_factura, '%d-%m-%Y %T') AS fecha_creacion_factura, DATE_FORMAT(tbl_factura.fecha_cancelacion, '%d-%m-%Y %T') AS fecha_cencelacion_factura, tbl_factura.id_estado_factura, tbl_factura.descuento_bolivares, tbl_factura.descuento_dolares, tbl_factura.descuento_pesos, tbl_factura.anulacion_motivo, tbl_tipo_factura.tipo_factura_nombre, tbl_cliente.cliente_nombre, tbl_cliente.cliente_apellido, tbl_cliente.id_tipo_cliente FROM `tbl_factura` LEFT JOIN tbl_tipo_factura ON tbl_tipo_factura.id_tipo_factura = tbl_factura.id_tipo_factura LEFT JOIN tbl_cliente ON tbl_cliente.id_cliente = tbl_factura.id_cliente WHERE tbl_factura.debe_dolares > 0 AND tbl_factura.id_estado_factura != 3 AND (tbl_factura.id_tipo_factura = 2 OR tbl_factura.id_tipo_factura = 5) ORDER BY tbl_factura.id_factura ASC"
        
        //query mas general
        let sql = "SELECT tbl_factura.id_factura, tbl_factura.numero_factura, tbl_factura.id_estado_factura, tbl_factura.debe_dolares, tbl_factura.orden_trabajo, tbl_factura.total_bolivares, tbl_factura.total_dolares, tbl_factura.total_pesos, tbl_factura.id_usuario, tbl_factura.id_cliente, tbl_factura.id_tipo_factura, tbl_factura.id_estado_factura, DATE_FORMAT(tbl_factura.fecha_creacion_factura, '%d-%m-%Y %T') AS fecha_creacion_factura, DATE_FORMAT(tbl_factura.fecha_creacion_orden_trabajo, '%d-%m-%Y %T') AS fecha_creacion_orden_trabajo, DATE_FORMAT(tbl_factura.fecha_cancelacion, '%d-%m-%Y %T') AS fecha_cencelacion_factura, tbl_factura.id_estado_factura, tbl_factura.descuento_bolivares, tbl_factura.descuento_dolares, tbl_factura.descuento_pesos, tbl_factura.anulacion_motivo, tbl_tipo_factura.tipo_factura_nombre, tbl_cliente.cliente_nombre, tbl_cliente.cliente_apellido, tbl_cliente.id_tipo_cliente, tbl_cliente.cedula_RIF FROM `tbl_factura` LEFT JOIN tbl_tipo_factura ON tbl_tipo_factura.id_tipo_factura = tbl_factura.id_tipo_factura LEFT JOIN tbl_cliente ON tbl_cliente.id_cliente = tbl_factura.id_cliente WHERE tbl_factura.debe_dolares > 0 AND tbl_factura.id_estado_factura = 2 ORDER BY tbl_factura.id_factura ASC"
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

dbFunctionsAdminFiscal.buscarRegistrosPagos = async(idFacturas) =>{
    return new Promise((resolve, reject) => {
        let sql = `SELECT tbl_registro_pago.id_registro_pago, tbl_registro_pago.id_factura, tbl_registro_pago.id_registro_divisa, tbl_registro_pago.id_tipo_pago, tbl_registro_pago.id_banco, tbl_registro_pago.numero_referencia, tbl_registro_pago.monto, tbl_banco.banco_nombre, tbl_divisa.divisa_nombre, tbl_tipo_pago.tipo_pago_nombre FROM tbl_registro_pago LEFT JOIN tbl_banco ON tbl_banco.id_banco = tbl_registro_pago.id_banco LEFT JOIN tbl_registro_divisa ON tbl_registro_divisa.id_registro_divisa = tbl_registro_pago.id_registro_divisa LEFT JOIN tbl_divisa ON tbl_divisa.id_divisa = tbl_registro_divisa.id_divisa LEFT JOIN tbl_tipo_pago ON tbl_tipo_pago.id_tipo_pago = tbl_registro_pago.id_tipo_pago WHERE tbl_registro_pago.id_factura IN (${idFacturas})`
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

dbFunctionsAdminFiscal.buscarRegistrosConvenios = async() =>{
    return new Promise((resolve, reject) => {
        let sql = `SELECT tbl_registro_convenio.id_registro_convenio, tbl_registro_convenio.numero_registro_convenio, tbl_registro_convenio.id_cliente, tbl_registro_convenio.id_factura, tbl_registro_convenio.total_bolivares, tbl_registro_convenio.total_pesos, tbl_registro_convenio.total_dolares, DATE_FORMAT(tbl_registro_convenio.fecha, '%d-%m-%Y %T') fecha, tbl_cliente.cliente_apellido, tbl_cliente.cliente_nombre, tbl_cliente.cedula_RIF FROM tbl_registro_convenio LEFT JOIN tbl_cliente ON tbl_cliente.id_cliente = tbl_registro_convenio.id_cliente WHERE tbl_registro_convenio.estatus = 0`;
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
    });
}

dbFunctionsAdminFiscal.buscarRegistroDivisas = async() =>{
    return new Promise((resolve, reject) => {
        const sql = "SELECT a.tasa_actual, a.id_registro_divisa, a.id_divisa, c.divisa_nombre FROM tbl_registro_divisa a LEFT JOIN tbl_divisa c ON c.id_divisa = a.id_divisa WHERE id_registro_divisa = (SELECT MAX(id_registro_divisa) FROM `tbl_registro_divisa` b WHERE a.id_divisa = b.id_divisa)"
        connection.query(sql, function (err, result, fie) {
            if (err) {
                console.log('error en la conexion intente de nuevo', err)
                res.send('3')
            }else{
                //console.log("EL RESULT!!!!!!!", result)
                let registros = result;
                resolve(registros);
            }
        })
    })
}

module.exports = dbFunctionsAdminFiscal;