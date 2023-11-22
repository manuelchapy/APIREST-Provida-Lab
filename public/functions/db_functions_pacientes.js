const connection = require('../../src/database')
const dbFunctionsPacientes = {};

dbFunctionsPacientes.extraerDetallesFacturas = async(idPaciente) =>{
    return new Promise((resolve, reject) => {
        let sql = `SELECT tbl_detalle_factura_paciente.id_detalle_factura_paciente, tbl_detalle_factura_paciente.id_factura, tbl_detalle_factura_paciente.id_registro_convenio, tbl_detalle_factura_paciente.id_paciente, tbl_detalle_factura_paciente.id_examen, tbl_detalle_factura_paciente.id_cultivo, tbl_detalle_factura_paciente.nombre_especifico, tbl_detalle_factura_paciente.devolucion, tbl_examen.examen_nombre, tbl_cultivo.cultivo_nombre, tbl_factura.numero_factura, date_format(tbl_factura.fecha_creacion_factura, '%Y-%m-%d') AS fecha_creacion_factura, date_format(tbl_factura.fecha_creacion_orden_trabajo, '%Y-%m-%d') AS fecha_creacion_orden_trabajo, tbl_factura.orden_trabajo, tbl_paciente.paciente_nombre, tbl_paciente.paciente_apellido, tbl_paciente.paciente_cedula, tbl_detalle_orden.id_detalle_orden, tbl_registro_convenio.numero_registro_convenio, date_format(tbl_registro_convenio.fecha, '%Y-%m-%d') AS fecha_creacion_registro_convenio FROM tbl_detalle_factura_paciente LEFT JOIN tbl_factura ON tbl_factura.id_factura = tbl_detalle_factura_paciente.id_factura LEFT JOIN tbl_cliente ON tbl_cliente.id_cliente = tbl_factura.id_cliente LEFT JOIN tbl_paciente ON tbl_paciente.id_paciente = tbl_detalle_factura_paciente.id_paciente LEFT JOIN tbl_examen ON tbl_examen.id_examen = tbl_detalle_factura_paciente.id_examen LEFT JOIN tbl_cultivo ON tbl_cultivo.id_cultivo = tbl_detalle_factura_paciente.id_cultivo LEFT JOIN tbl_detalle_orden ON tbl_detalle_orden.id_detalle_factura_paciente = tbl_detalle_factura_paciente.id_detalle_factura_paciente LEFT JOIN tbl_registro_convenio ON tbl_registro_convenio.id_registro_convenio = tbl_detalle_factura_paciente.id_registro_convenio WHERE tbl_detalle_factura_paciente.id_paciente = ${idPaciente}` 
        console.log(sql)
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

dbFunctionsPacientes.extraerDetallesOrdenes = async(idsDetalleFacturaPaciente) =>{
    return new Promise((resolve, reject) => {
        let sql = `SELECT * FROM tbl_detalle_orden WHERE id_detalle_factura_paciente in (${idsDetalleFacturaPaciente})`
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

dbFunctionsPacientes.extraerResultados = async(idsDetalleOrden) =>{
    return new Promise((resolve, reject) => {
        let sql = `SELECT tbl_resultado.id_resultado, tbl_resultado.id_detalle_orden, tbl_resultado.id_detalle_cultivo_bacteria_antibiotico, tbl_resultado.id_detalle_orden, tbl_detalle_orden.id_detalle_factura_paciente, tbl_resultado.id_detalle_examen_prueba, tbl_resultado.resultado, tbl_detalle_examen_prueba.id_examen, tbl_detalle_examen_prueba.id_prueba, tbl_prueba.prueba_nombre, tbl_prueba.valor_de_referencia, tbl_prueba.prueba_unidad, tbl_prueba.prueba_leyenda, tbl_detalle_cultivo_bacteria_antibiotico.id_cultivo, tbl_detalle_cultivo_bacteria_antibiotico.id_bacteria, tbl_detalle_cultivo_bacteria_antibiotico.id_antibiotico, tbl_bacteria.bacteria_nombre, tbl_antibiotico.antibiotico_nombre FROM tbl_resultado LEFT JOIN tbl_detalle_examen_prueba ON tbl_detalle_examen_prueba.id_detalle_examen_prueba = tbl_resultado.id_detalle_examen_prueba LEFT JOIN tbl_detalle_cultivo_bacteria_antibiotico ON tbl_detalle_cultivo_bacteria_antibiotico.id_detalle_cultivo_bacteria_antibiotico = tbl_resultado.id_detalle_cultivo_bacteria_antibiotico LEFT JOIN tbl_prueba ON tbl_prueba.id_prueba = tbl_detalle_examen_prueba.id_prueba LEFT JOIN tbl_bacteria ON tbl_bacteria.id_bacteria = tbl_detalle_cultivo_bacteria_antibiotico.id_bacteria LEFT JOIN tbl_antibiotico ON tbl_antibiotico.id_antibiotico = tbl_detalle_cultivo_bacteria_antibiotico.id_antibiotico LEFT JOIN tbl_detalle_orden ON tbl_resultado.id_detalle_orden = tbl_detalle_orden.id_detalle_orden WHERE tbl_resultado.id_detalle_orden in (${idsDetalleOrden})`
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

module.exports = dbFunctionsPacientes;

