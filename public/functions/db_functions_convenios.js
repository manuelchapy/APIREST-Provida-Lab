const dbFunctionsConvenios = {};
const connection = require('../../src/database');

dbFunctionsConvenios.extraerRegistrosConvenios = async(idConvenios) =>{
    return new Promise((resolve, reject) => {
        let sql = `SELECT tbl_registro_convenio.id_registro_convenio, tbl_registro_convenio.numero_registro_convenio, tbl_registro_convenio.id_cliente, tbl_registro_convenio.id_factura, tbl_registro_convenio.total_bolivares AS total_bolivares_registro_convenio, tbl_registro_convenio.total_pesos AS total_pesos_registro_convenio, tbl_registro_convenio.total_dolares AS total_dolares_registro_convenio, tbl_registro_convenio.descuento_bolivares, tbl_registro_convenio.descuento_pesos, tbl_registro_convenio.descuento_dolares, tbl_registro_convenio.id_usuario, date_format(tbl_registro_convenio.fecha,'%d-%m-%Y') AS fecha_creacion_registro_convenio, tbl_registro_convenio.id_usuario, tbl_factura.id_factura, tbl_factura.numero_factura, tbl_factura.orden_trabajo, date_format(tbl_factura.fecha_creacion_orden_trabajo,'%d-%m-%Y') AS fecha_creacion_orden_trabajo, date_format(tbl_factura.fecha_creacion_factura,'%d-%m-%Y') AS fecha_creacion_factura, date_format(tbl_factura.fecha_cancelacion,'%d-%m-%Y') AS fecha_cancelacion, tbl_factura.total_bolivares AS total_bolivares_factura, tbl_factura.total_dolares AS total_dolares_factura, tbl_factura.total_pesos AS total_pesos_factura, tbl_usuario.usuario_nombre, tbl_usuario.usuario_apellido, tbl_usuario.usuario_cedula FROM tbl_registro_convenio LEFT JOIN tbl_factura ON tbl_factura.id_factura = tbl_registro_convenio.id_factura LEFT JOIN tbl_usuario ON tbl_usuario.id_usuario = tbl_registro_convenio.id_usuario WHERE id_registro_convenio in (${idConvenios})` 
        connection.query(sql, function (err, result, fie) {
            if (err) {
                console.log('error en la conexion intente de nuevo', err)
                resolve('3')
            }
            //console.log('el result examen: ', result)
            resolve(result);
        })
    })
}

dbFunctionsConvenios.extraerDetallesFacturaPacientes = async(idConvenios) =>{
    return new Promise((resolve, reject) => {
        let sql = `SELECT tbl_detalle_factura_paciente.id_detalle_factura_paciente, tbl_detalle_factura_paciente.id_registro_convenio, tbl_detalle_factura_paciente.id_factura, tbl_detalle_factura_paciente.id_registro_convenio, tbl_detalle_factura_paciente.id_paciente, tbl_detalle_factura_paciente.id_examen, tbl_detalle_factura_paciente.id_cultivo, tbl_paciente.paciente_nombre, tbl_paciente.paciente_apellido, tbl_paciente.paciente_cedula, tbl_paciente.paciente_telefono, tbl_examen.examen_nombre, tbl_cultivo.cultivo_nombre FROM tbl_detalle_factura_paciente LEFT JOIN tbl_paciente ON tbl_paciente.id_paciente = tbl_detalle_factura_paciente.id_paciente LEFT JOIN tbl_examen ON tbl_examen.id_examen = tbl_detalle_factura_paciente.id_examen LEFT JOIN tbl_cultivo ON tbl_detalle_factura_paciente.id_cultivo WHERE id_registro_convenio in (${idConvenios})` 
        connection.query(sql, function (err, result, fie) {
            if (err) {
                console.log('error en la conexion intente de nuevo', err)
                resolve('3')
            }
            //console.log('el result examen: ', result)
            resolve(result);
        })
    })
}

module.exports = dbFunctionsConvenios;