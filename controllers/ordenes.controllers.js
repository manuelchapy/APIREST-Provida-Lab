const ordenesCtrl = {};
const session = require('express-session');
const { updateLocale } = require('moment');
const moment = require('moment');
const { resolve, format } = require('path');
const connection = require('../src/database');
const { examenes } = require('./perfExamPrueCult.controllers');
const axios = require('axios').default;

ordenesCtrl.impresionDeOrdenes = async (req, res) => {
    //console.log("error?")
    let ipSocket, ipNormal, ip, ipDef, ordenes;
    //ipSocket = req.socket.remoteAddress;
    ipNormal = req.ip;
    ipNormal = ipNormal.split(":");
    ipDef = ipNormal[3];
    ordenes = await configOrdenesImpresion();
    //console.log("UUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU", req.body, ordenes[0])
    //'http://'+ipDef+':5000/impresionesOrden'
    //axios.post('http://'+ipDef+':5000/impresionesOrden', {
        axios.post('http://'+ipDef+':5000/impresionesOrden', {
            id_orden: req.body.id_orden, 
            id_factura: req.body.id_factura,
            id_registro_convenio: req.body.id_registro_convenio,
            orden_numero: req.body.orden_numero, 
            paciente_nombre: req.body.paciente_nombre, 
            paciente_cedula: req.body.paciente_cedula, 
            paciente_edad: req.body.paciente_edad, 
            departamentos: ordenes[0].departamentos,
            copias: req.body.copias
           }).then(function (response) {
             //console.log(response.data);
             res.send("1")
           }).catch(function (error) {
            // handle error
            //console.log(error);
            res.send("0")
          })

          async function configOrdenesImpresion(){
            return new Promise((resolve, reject) => {
                let sql;
                if(req.body.id_factura != null){
                   sql = "SELECT tbl_detalle_factura_paciente.id_detalle_factura_paciente, tbl_detalle_factura_paciente.id_paciente, tbl_detalle_factura_paciente.id_examen, tbl_detalle_factura_paciente.id_cultivo, tbl_detalle_orden.id_orden, tbl_orden.numero_orden, tbl_paciente.paciente_nombre, tbl_paciente.paciente_apellido, tbl_paciente.paciente_cedula, tbl_paciente.edad, tbl_examen.id_departamento, tbl_departamento.departamento_nombre FROM `tbl_detalle_factura_paciente`  LEFT JOIN `tbl_detalle_orden` ON tbl_detalle_orden.id_detalle_factura_paciente = tbl_detalle_factura_paciente.id_detalle_factura_paciente LEFT JOIN tbl_orden ON tbl_detalle_orden.id_orden = tbl_orden.id_orden LEFT JOIN tbl_paciente ON tbl_detalle_factura_paciente.id_paciente = tbl_paciente.id_paciente LEFT JOIN tbl_examen ON tbl_examen.id_examen = tbl_detalle_factura_paciente.id_examen LEFT JOIN tbl_departamento ON tbl_departamento.id_departamento = tbl_examen.id_departamento LEFT JOIN tbl_cultivo ON tbl_cultivo.id_cultivo = tbl_detalle_factura_paciente.id_cultivo WHERE tbl_detalle_factura_paciente.id_factura='" +req.body.id_factura+"'";
                }else{
                   sql = "SELECT tbl_detalle_factura_paciente.id_detalle_factura_paciente, tbl_detalle_factura_paciente.id_paciente, tbl_detalle_factura_paciente.id_examen, tbl_detalle_factura_paciente.id_cultivo, tbl_detalle_orden.id_orden, tbl_orden.numero_orden, tbl_paciente.paciente_nombre, tbl_paciente.paciente_apellido, tbl_paciente.paciente_cedula, tbl_paciente.edad, tbl_examen.id_departamento, tbl_departamento.departamento_nombre FROM `tbl_detalle_factura_paciente`  LEFT JOIN `tbl_detalle_orden` ON tbl_detalle_orden.id_detalle_factura_paciente = tbl_detalle_factura_paciente.id_detalle_factura_paciente LEFT JOIN tbl_orden ON tbl_detalle_orden.id_orden = tbl_orden.id_orden LEFT JOIN tbl_paciente ON tbl_detalle_factura_paciente.id_paciente = tbl_paciente.id_paciente LEFT JOIN tbl_examen ON tbl_examen.id_examen = tbl_detalle_factura_paciente.id_examen LEFT JOIN tbl_departamento ON tbl_departamento.id_departamento = tbl_examen.id_departamento LEFT JOIN tbl_cultivo ON tbl_cultivo.id_cultivo = tbl_detalle_factura_paciente.id_cultivo WHERE tbl_detalle_factura_paciente.id_registro_convenio='" +req.body.id_registro_convenio+"'";
                }
                
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

ordenesCtrl.ordenes = async (req, res) => {
    /////////TIPO DE BUSQUEDA (1 para orden, 2 para nombre, 3 para factura, 4 para cedula, 5 para fecha)
    /////////EL ID FECHA(1 PARA DOS FECHAS, 0 SI SON 2)
    //console.log('EL REQ', req.body)
    let sql;
    let detallesFactura = [];
    let facturaCliente = [];
    let idFactura;
    let idFacturaPaciente = [];
    let facturaOrdenes = [];
    if (req.body.tipoBusqueda == 1) {
        ///////##############################################POR NUMERO DE ORDEN#####################################//////////////
            //console.log("busqueda orden")
            //console.log('una fecha');
            let busqueda = parseInt(req.body.busqueda);
            let ordenes;
            let idDetalleFacturaPaciente = [];
            let detalleFacturaPaciente = [];
            //console.log(busqueda);
            ordenes = await buscarOrdenes(ordenes)

           for(const item of ordenes){
               //console.log("ITEM", item)
                idDetalleFacturaPaciente = await buscarIdDetalleFacturaPaciente(item, idDetalleFacturaPaciente)
            }
            for(const detalle of idDetalleFacturaPaciente){
                detalleFacturaPaciente = await buscarFacturaYPaciente(detalle, detalleFacturaPaciente);
            }
            //console.log("((((((((((((((((((((((((((((((", detalleFacturaPaciente)
            res.send(detalleFacturaPaciente)


            async function buscarOrdenes(ordenes){
                //console.log("uuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu", ordenes, req.body, busqueda)
                return new Promise((resolve, reject) => {
                    sql = "SELECT id_orden, numero_orden, orden_qr, DATE_FORMAT(fecha, '%Y-%m-%d %T') AS fecha, anulado FROM `tbl_orden` WHERE numero_orden = '" + busqueda + "' AND (fecha >='" + req.body.from+" "+"00:00:00" + "' AND fecha <= '"+req.body.to+""+" "+ "23:59:59')";
                    //console.log("JOLDAN", sql)
                    connection.query(sql, function (err, result, fields) {
                    if (err) {
                        console.log('ERROR en CheckTemplate', err);
                        res.send('3');
                    }
                    if (result) {
                        //res.send(result)
                        //detallesFacturaPaciente(result)
                        //console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!", result)
                        ordenes = result;
                        resolve(ordenes);
                    }
                });
                })
            }

            async function buscarIdDetalleFacturaPaciente(orden, idDetalleFacturaPaciente){
               // console.log("!!!!!!!!!!!!!!!!!!!!!!!", orden)
                return new Promise((resolve, reject) => {
                //    console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1", orden)
                    sql = "SELECT DISTINCT (id_detalle_factura_paciente) FROM tbl_detalle_orden WHERE id_orden = '" + orden.id_orden + "' LIMIT 1";
                    //console.log("===============", sql)
                    connection.query(sql, function (err, result, fields) {
                        if (err) {
                            console.log('ERROR en CheckTemplate', err);
                            res.send('3');
                        }
                        if (result) {
                            //res.send(result)
                            //detallesFacturaPaciente(result)
                            //console.log("111111111111111111111111111", result, orden)
                            idDetalleFacturaPaciente.push({
                                id_detalle_factura_paciente: result[0].id_detalle_factura_paciente,
                                id_orden: orden.id_orden,
                                numero_orden:  orden.numero_orden,
                                orden_qr:  orden.orden_qr,
                                fecha:  orden.fecha,
                                anulado: orden.anulado
                            })
                            resolve(idDetalleFacturaPaciente);
                        }
                    });
                })
            }
            
            async function buscarFacturaYPaciente(idDetalleFacturaPaciente, detalleFacturaPaciente){
                return new Promise((resolve, reject) => {
                    //console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX", idDetalleFacturaPaciente.id_detalle_factura_paciente)
                    sql = "SELECT tbl_detalle_factura_paciente.id_factura, tbl_detalle_factura_paciente.id_registro_convenio, tbl_detalle_factura_paciente.id_paciente, tbl_registro_convenio.id_cliente, tbl_detalle_factura_paciente.id_registro_convenio, tbl_factura.numero_factura, tbl_factura.orden_trabajo, date_format(fecha_creacion_factura,'%d-%m-%Y T%') AS fecha_creacion_factura, date_format(fecha_creacion_orden_trabajo,'%d-%m-%Y T%') AS fecha_creacion_orden_trabajo, date_format(fecha_cancelacion,'%d-%m-%Y T%') AS fecha_cancelacion, tbl_factura.total_bolivares, tbl_factura.total_pesos, tbl_factura.total_dolares, tbl_factura.debe_dolares, tbl_cliente.cliente_nombre, tbl_cliente.cliente_apellido, tbl_cliente.cedula_RIF, tbl_cliente.telefono, tbl_paciente.paciente_nombre, tbl_paciente.paciente_apellido, tbl_paciente.paciente_cedula, tbl_paciente.edad, tbl_registro_convenio.numero_registro_convenio FROM tbl_detalle_factura_paciente LEFT JOIN tbl_factura ON tbl_factura.id_factura = tbl_detalle_factura_paciente.id_factura LEFT JOIN tbl_cliente ON tbl_cliente.id_cliente = tbl_factura.id_cliente LEFT JOIN tbl_paciente ON tbl_paciente.id_paciente = tbl_detalle_factura_paciente.id_paciente LEFT JOIN tbl_registro_convenio ON tbl_registro_convenio.id_registro_convenio = tbl_detalle_factura_paciente.id_registro_convenio WHERE tbl_detalle_factura_paciente.id_detalle_factura_paciente = '" + idDetalleFacturaPaciente.id_detalle_factura_paciente + "'";
                    connection.query(sql, async function (err, result, fields) {
                        if (err) {
                            console.log('ERROR en CheckTemplate', err);
                            res.send('3');
                        }
                        if (result) {
                            //res.send(result)
                            //console.log("OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO", result)
                            //detallesFacturaPaciente(result)
                            if(result[0].id_factura === 'undefined' || result[0].id_factura == null){
                                let detallesRegistroConvenio = await buscarRegistroConvenioYPaciente(idDetalleFacturaPaciente)
                                //console.log("JEJE", detallesRegistroConvenio)
                                detalleFacturaPaciente.push({
                                    //id_factura: result[0].id_factura,
                                    id_registro_convenio: detallesRegistroConvenio.id_registro_convenio,
                                    numero_registro_convenio: detallesRegistroConvenio.numero_registro_convenio,
                                    id_paciente: detallesRegistroConvenio.id_paciente,
                                    id_orden: idDetalleFacturaPaciente.id_orden,
                                    numero_factura: null,
                                    fecha_creacion_factura: null,
                                    fecha_creacion_orden_trabajo: null,
                                    total_bolivares: detallesRegistroConvenio.total_bolivares,
                                    total_pesos: detallesRegistroConvenio.total_pesos,
                                    total_dolares:  detallesRegistroConvenio.total_dolares,
                                    debe_dolares: detallesRegistroConvenio.debe_dolares,
                                    cliente_nombre: detallesRegistroConvenio.cliente_nombre, 
                                    cliente_apellido: detallesRegistroConvenio.cliente_apellido, 
                                    cedula_RIF: detallesRegistroConvenio.cedula_RIF, 
                                    telefono: detallesRegistroConvenio.telefono,
                                    paciente_nombre: detallesRegistroConvenio.paciente_nombre, 
                                    paciente_apellido: detallesRegistroConvenio.paciente_apellido, 
                                    paciente_cedula: detallesRegistroConvenio.paciente_cedula, 
                                    paciente_edad: detallesRegistroConvenio.edad,
                                    numero_orden: idDetalleFacturaPaciente.numero_orden,
                                    orden_qr: idDetalleFacturaPaciente.orden_qr,
                                    fecha_orden: idDetalleFacturaPaciente.fecha
                                })
                            }else{
                                detalleFacturaPaciente.push({
                                    id_factura: result[0].id_factura,
                                    id_paciente: result[0].id_paciente,
                                    id_orden: idDetalleFacturaPaciente.id_orden,
                                    numero_factura: result[0].numero_factura,
                                    orden_trabajo: result[0].orden_trabajo,
                                    fecha_creacion_factura: result[0].fecha_creacion_factura,
                                    fecha_creacion_orden_trabajo: result[0].fecha_creacion_orden_trabajo,
                                    total_bolivares: result[0].total_bolivares,
                                    total_pesos:  result[0].total_pesos,
                                    total_dolares:  result[0].total_dolares,
                                    debe_dolares: result[0].debe_dolares,
                                    cliente_nombre: result[0].cliente_nombre, 
                                    cliente_apellido: result[0].cliente_apellido, 
                                    cedula_RIF: result[0].cedula_RIF, 
                                    telefono: result[0].telefono,
                                    paciente_nombre: result[0].paciente_nombre, 
                                    paciente_apellido: result[0].paciente_apellido, 
                                    paciente_cedula: result[0].paciente_cedula, 
                                    paciente_edad: result[0].edad,
                                    numero_orden: idDetalleFacturaPaciente.numero_orden,
                                    anulado: idDetalleFacturaPaciente.anulado,
                                    orden_qr: idDetalleFacturaPaciente.orden_qr,
                                    fecha_orden: idDetalleFacturaPaciente.fecha
                                })
                            }
                            
                            resolve(detalleFacturaPaciente);
                        }
                    });
                })
            }

            async function buscarRegistroConvenioYPaciente(idDetalleFacturaPaciente){
                return new Promise((resolve, reject) => {
                    //console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX", idDetalleFacturaPaciente.id_detalle_factura_paciente)
                    sql = "SELECT tbl_detalle_factura_paciente.id_registro_convenio, tbl_registro_convenio.numero_registro_convenio, tbl_detalle_factura_paciente.id_paciente, tbl_registro_convenio.id_cliente, tbl_cliente.cliente_nombre, tbl_cliente.cliente_apellido, tbl_cliente.cedula_RIF, tbl_cliente.telefono, tbl_paciente.paciente_nombre, tbl_paciente.paciente_apellido, tbl_paciente.paciente_cedula, tbl_paciente.edad, tbl_registro_convenio.numero_registro_convenio, tbl_registro_convenio.total_bolivares, tbl_registro_convenio.total_pesos, tbl_registro_convenio.total_dolares  FROM tbl_detalle_factura_paciente LEFT JOIN tbl_registro_convenio ON tbl_registro_convenio.id_registro_convenio = tbl_detalle_factura_paciente.id_registro_convenio LEFT JOIN tbl_cliente ON tbl_cliente.id_cliente = tbl_registro_convenio.id_cliente LEFT JOIN tbl_paciente ON tbl_paciente.id_paciente = tbl_detalle_factura_paciente.id_paciente  WHERE tbl_detalle_factura_paciente.id_detalle_factura_paciente = '" + idDetalleFacturaPaciente.id_detalle_factura_paciente + "'";
                    connection.query(sql, function (err, result, fields) {
                        if (err) {
                            console.log('ERROR en CheckTemplate', err);
                            res.send('3');
                        }
                        if (result) {
                            resolve(result[0]);
                        }
                    })
                })
            }
            
    } else if (req.body.tipoBusqueda == 2) {
        ///////##############################################POR NOMBRE PACIENTE#####################################//////////////
        //sql = "SELECT id_orden, numero_orden, orden_qr, DATE_FORMAT(fecha, '%d-%m-%Y') AS fecha FROM `tbl_orden` WHERE numero_orden = '" + busqueda + "' AND (fecha BETWEEN '" + req.body.to + "' AND '"+req.body.from+"')";
        //console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')
        let pacientes;
        let nombreApellidoId = [];
        let coincidencias = [];
        let detalleFacturaPaciente = [];
        let facturasRegistroConvenios = [];
        let facturasRegistroConveniosOrdenes = [];
        let facturasRegistroConveniosOrdenesFiltrado = [];
        //const r = /^[a-z0-9_-]{3,16}$/;
        
        //const busqueda = "CARMEN";
        let regex;
        let fechaOrden;
        //req.body.busqueda = 'Duran';
        let to = moment(req.body.to).format("DD-MM-YYYY")
        let from = moment(req.body.from).format("DD-MM-YYYY")
        //console.log("!!!!!!!!!!!!!!!!!!!!!!!!", to, from)
        pacientes = await pacientesF(pacientes);

        for(let item of pacientes){
            nombreApellidoId.push({
                nombreApellido: item.paciente_nombre+" "+item.paciente_apellido,
                id_paciente: item.id_paciente
            })
        }
        for(let item of nombreApellidoId){
            let re = new RegExp(req.body.busqueda, 'i');
            let result = re.test(item.nombreApellido);
            //console.log(result);
            if (result == true) {
                //console.log("coincidencia!", req.body.busqueda, item.nombreApellido)
                coincidencias.push({
                    nombreApellido: item.nombreApellido,
                    id_paciente: item.id_paciente
                })
            }
        }
        for(const coincidencia of coincidencias){
            //console.log("LA COINCIDENCIA", coincidencia)
            detalleFacturaPaciente = await idDetallesFacturasPacienteGroup(coincidencia, detalleFacturaPaciente);
        }

        for(const items of detalleFacturaPaciente){
            for(const item of items.item){
                //console.log("JOLOLOLOLOLOLLOLOLOLOLOLOLO",item)
                if(item.id_factura == null){
                    //console.log("registro convenio!")
                    facturasRegistroConvenios = await datosRegistroConvenio(item, facturasRegistroConvenios);
                }else if(item.id_factura != null){
                    //console.log("factura")
                    facturasRegistroConvenios = await datosFactura(item, facturasRegistroConvenios);
                }
            }
        }
        for(const item of facturasRegistroConvenios){
                //console.log(item)
                if(item.id_factura == null){
                    //console.log("registro convenio!")
                    facturasRegistroConveniosOrdenes = await datosOrdenesRegistroConvenio(item, facturasRegistroConveniosOrdenes);
                }else if(item.id_factura != null){
                    //console.log("factura")
                    facturasRegistroConveniosOrdenes = await datosOrdenesFactura(item, facturasRegistroConveniosOrdenes)
                }
        }   
        //console.log(nombreApellidoId)
        let bool;
        for(const item of facturasRegistroConveniosOrdenes){
           bool = moment(item.fecha_orden).isBetween(req.body.from+" "+"00:00:00", req.body.to+" "+"23:59:59", 'days', '[]')
           if(bool == true){
               /* facturasRegistroConveniosOrdenesFiltrado.push({
                    numero_registro_convenio: item.numero_registro_convenio,
                    id_cliente: item.id_cliente,
                    total_bolivares: item.total_bolivares,
                    total_dolares: item.total_dolares,
                    fecha_registro_convenio: item.fecha_registro_convenio,
                    cliente_nombre: item.cliente_nombre,
                    cliente_apellido: item.cliente_apellido,
                    cedula_RIF: item.cedula_RIF,
                    id_detalle_factura_paciente: item.id_detalle_factura_paciente,
                    id_factura: item.id_factura,
                    id_registro_convenio: item.id_registro_convenio,
                    id_paciente: item.id_paciente,
                    paciente_nombre: item.paciente_nombre,
                    paciente_apellido: item.paciente_apellido,
                    paciente_cedula: item.paciente_cedula,
                    id_orden: item.id_orden,
                    numero_orden: item.numero_orden,
                    orden_qr: item.orden_qr,
                    fecha_orden: item.fecha_orden
                })*/
                facturasRegistroConveniosOrdenesFiltrado.push(
                    item
                )
           }
        }
        //console.log("O.O", facturasRegistroConveniosOrdenesFiltrado)
        let facturasRegistroConveniosOrdenesFiltradoAgrupado = [];
        ///////////////////////////////QUITAR ORDENES REPETIDAS/////////////////////////////
        for(let k=0; k<facturasRegistroConveniosOrdenesFiltrado.length; k++){
            facturasRegistroConveniosOrdenesFiltrado[k].activo = 1;
            //console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX", facturasRegistroConveniosOrdenesFiltrado[k].activo)
        }
        for(let i=0; i<facturasRegistroConveniosOrdenesFiltrado.length; i++){
            let ordenI = facturasRegistroConveniosOrdenesFiltrado[i].id_orden;
            if(facturasRegistroConveniosOrdenesFiltrado[i].activo == 1){
                facturasRegistroConveniosOrdenesFiltradoAgrupado.push(
                    facturasRegistroConveniosOrdenesFiltrado[i]
                )
            }
            for(let j=0; j<facturasRegistroConveniosOrdenesFiltrado.length; j++){
                if(ordenI == facturasRegistroConveniosOrdenesFiltrado[j].id_orden){
                    facturasRegistroConveniosOrdenesFiltrado[j].activo = 0;
                }
            }
        }
        //console.log("XXX", facturasRegistroConveniosOrdenesFiltradoAgrupado)
        ////////////////////////////////////////////////////////////////////////////////////
        res.send(facturasRegistroConveniosOrdenesFiltradoAgrupado)
        
        async function pacientesF(pacientes){
            return new Promise((resolve, reject) => {    
            sql = "SELECT * FROM tbl_paciente"
                connection.query(sql, function (err, result, fields) {
                    if (err) {
                        console.log('ERROR en CheckTemplate', err);
                        res.send('3');
                    }
                    if (result) {
                        //console.log("PASO!")
                        pacientes = result;
                        resolve(pacientes)
                        //res.send(result)
                    }
                });
            })
        }

        async function idDetallesFacturasPacienteGroup(coincidencia, detalleFacturaPaciente){
            return new Promise((resolve, reject) => {
                //sql = "SELECT * FROM (SELECT  *, ROW_NUMBER() OVER (PARTITION BY tbl_detalle_factura_paciente.id_fctura) rn FROM `tbl_detalle_factura_paciente`) tbl_detalle_factura_paciente WHERE tbl_detalle_factura_paciente.id_paciente ='" + coincidencia.id_paciente + "'";
                //let sql = "SELECT * FROM tbl_detalle_factura_paciente WHERE id_detalle_factura_paciente IN (SELECT MAX(id_detalle_factura_paciente) FROM tbl_detalle_factura_paciente GROUP BY id_factura) AND id_paciente='" + coincidencia.id_paciente + "'";
                let sql = "SELECT tbl_detalle_factura_paciente.id_detalle_factura_paciente, tbl_detalle_factura_paciente.id_factura, tbl_detalle_factura_paciente.id_registro_convenio, tbl_detalle_factura_paciente.id_paciente, tbl_paciente.paciente_nombre, tbl_paciente.paciente_apellido, tbl_paciente.paciente_cedula, tbl_registro_convenio.numero_registro_convenio FROM tbl_detalle_factura_paciente LEFT JOIN tbl_paciente ON tbl_paciente.id_paciente = tbl_detalle_factura_paciente.id_paciente LEFT JOIN tbl_registro_convenio ON tbl_registro_convenio.id_registro_convenio = tbl_detalle_factura_paciente.id_registro_convenio WHERE tbl_detalle_factura_paciente.id_paciente='" + coincidencia.id_paciente +"'";
                connection.query(sql, function (err, result, fields) {
                    if (err) {
                        console.log('ERROR en CheckTemplate', err);
                        res.send('3');
                    }   
                    if (result) {
                        //console.log("PASO!")
                        detalleFacturaPaciente.push({
                            item: result
                        })
                        resolve(detalleFacturaPaciente)
                        //res.send(result)
                    }
                });
            })   
        }

        async function datosFactura(item, facturasRegistroConvenios){
            return new Promise((resolve, reject) => {
                let sql = "SELECT tbl_factura.numero_factura, tbl_factura.orden_trabajo, tbl_factura.id_cliente, DATE_FORMAT(tbl_factura.fecha_creacion_factura, '%d-%m-%Y') AS fecha_creacion_factura, DATE_FORMAT(tbl_factura.fecha_creacion_orden_trabajo, '%d-%m-%Y') AS fecha_creacion_orden_trabajo, DATE_FORMAT(tbl_factura.fecha_cancelacion, '%d-%m-%Y') AS fecha_cancelacion, tbl_factura.total_bolivares, tbl_factura.total_dolares, tbl_factura.total_pesos, tbl_cliente.cliente_nombre, tbl_cliente.cliente_apellido, tbl_cliente.cedula_RIF FROM tbl_factura INNER JOIN tbl_cliente ON tbl_factura.id_cliente = tbl_cliente.id_cliente WHERE id_factura='" + item.id_factura +"'";
                connection.query(sql, function (err, result, fields) {
                    if (err) {
                        console.log('ERROR en CheckTemplate', err);
                        res.send('3');
                    }   
                    if (result) {
                        //console.log("PASO!")
                        facturasRegistroConvenios.push({
                            numero_factura: result[0].numero_factura,
                            orden_trabajo: result[0].orden_trabajo,
                            id_cliente: result[0].id_cliente,
                            fecha_creacion_factura: result[0].fecha_creacion_factura,
                            fecha_creacion_orden_trabajo: result[0].fecha_creacion_orden_trabajo,
                            fecha_cancelacion: result[0].fecha_cancelacion,
                            total_bolivares: result[0].total_bolivares,
                            total_dolares: result[0].total_dolares,
                            total_pesos: result[0].total_pesos,
                            cliente_nombre: result[0].cliente_nombre,
                            cliente_apellido: result[0].cliente_apellido,
                            cedula_RIF: result[0].cedula_RIF,
                            id_detalle_factura_paciente: item.id_detalle_factura_paciente,
                            id_factura: item.id_factura,
                            id_registro_convenio: item.id_registro_convenio,
                            id_paciente: item.id_paciente,
                            paciente_nombre: item.paciente_nombre,
                            paciente_apellido: item.paciente_apellido,
                            paciente_cedula: item.paciente_cedula
                        })
                        resolve(facturasRegistroConvenios)
                        //res.send(result)
                    }
                });
            })
        }

        async function datosRegistroConvenio(item, facturasRegistroConvenios){
            return new Promise((resolve, reject) => {
                let sql = "SELECT tbl_registro_convenio.numero_registro_convenio, tbl_registro_convenio.id_cliente, tbl_registro_convenio.total_bolivares, tbl_registro_convenio.total_pesos, tbl_registro_convenio.total_dolares, DATE_FORMAT(tbl_registro_convenio.fecha, '%d-%m-%Y') AS fecha_registro_convenio, tbl_cliente.cliente_nombre, tbl_cliente.cliente_apellido, tbl_cliente.cedula_RIF FROM tbl_registro_convenio INNER JOIN tbl_cliente ON tbl_cliente.id_cliente = tbl_registro_convenio.id_cliente WHERE id_registro_convenio ='" + item.id_registro_convenio +"'";
                connection.query(sql, function (err, result, fields) {
                    if (err) {
                        console.log('ERROR en CheckTemplate', err);
                        res.send('3');
                    }   
                    if (result) {
                        //console.log("PASO!")
                        facturasRegistroConvenios.push({
                            numero_registro_convenio: result[0].numero_registro_convenio,
                            id_cliente: result[0].id_cliente,
                            total_bolivares: result[0].total_bolivares,
                            total_dolares: result[0].total_dolares,
                            total_pesos: result[0].total_pesos,
                            fecha_registro_convenio: result[0].fecha_registro_convenio,
                            cliente_nombre: result[0].cliente_nombre,
                            cliente_apellido: result[0].cliente_apellido,
                            cedula_RIF: result[0].cedula_RIF,
                            id_detalle_factura_paciente: item.id_detalle_factura_paciente,
                            id_factura: item.id_factura,
                            id_registro_convenio: item.id_registro_convenio,
                            id_paciente: item.id_paciente,
                            paciente_nombre: item.paciente_nombre,
                            paciente_apellido: item.paciente_apellido,
                            paciente_cedula: item.paciente_cedula
                        })
                        resolve(facturasRegistroConvenios)
                        //res.send(result)
                    }
                });
            })
        }
        async function datosOrdenesFactura(item, facturasRegistroConveniosOrdenes){
            return new Promise((resolve, reject) => {
                let sql = "SELECT tbl_detalle_orden.id_orden, tbl_orden.numero_orden, tbl_orden.anulado, tbl_orden.orden_qr, DATE_FORMAT(tbl_orden.fecha, '%Y-%m-%d') AS fecha_orden FROM tbl_detalle_orden INNER JOIN tbl_orden ON tbl_orden.id_orden = tbl_detalle_orden.id_orden WHERE id_detalle_factura_paciente ='" + item.id_detalle_factura_paciente +"'";
                connection.query(sql, function (err, result, fields) {
                    if (err) {
                        console.log('ERROR en CheckTemplate', err);
                        res.send('3');
                    }   
                    if (result) {
                        if(result.length == 0){
                            res.send(result)
                        }else{
                                //console.log("PASO!")
                                //console.log("EL RESULT!!!!!!!", item.id_detalle_factura_paciente, result)
                                facturasRegistroConveniosOrdenes.push({
                                numero_factura: item.numero_factura,
                                orden_trabajo: item.orden_trabajo,
                                id_cliente: item.id_cliente,
                                fecha_creacion_factura: item.fecha_creacion_factura,
                                fecha_creacion_orden_trabajo: item.fecha_creacion_orden_trabajo,
                                fecha_cancelacion: item.fecha_cancelacion,
                                total_bolivares: item.total_bolivares,
                                total_dolares: item.total_dolares,
                                total_pesos: item.total_pesos,
                                cliente_nombre: item.cliente_nombre,
                                cliente_apellido: item.cliente_apellido,
                                cedula_RIF: item.cedula_RIF,
                                id_detalle_factura_paciente: item.id_detalle_factura_paciente,
                                id_factura: item.id_factura,
                                id_registro_convenio: item.id_registro_convenio,
                                id_paciente: item.id_paciente,
                                paciente_nombre: item.paciente_nombre,
                                paciente_apellido: item.paciente_apellido,
                                paciente_cedula: item.paciente_cedula,
                                id_orden: result[0].id_orden,
                                numero_orden: result[0].numero_orden,
                                orden_qr: result[0].orden_qr,
                                fecha_orden: result[0].fecha_orden,
                                anulado: result[0].anulado
                            })

                            resolve(facturasRegistroConveniosOrdenes)
                            //res.send(result)
                        }
                    }
                });
            })
        }

        async function datosOrdenesRegistroConvenio(item, facturasRegistroConveniosOrdenes){
            return new Promise((resolve, reject) => {
                let sql = `SELECT tbl_detalle_orden.id_orden, tbl_orden.numero_orden, tbl_orden.orden_qr, DATE_FORMAT(tbl_orden.fecha, '%Y-%m-%d') AS fecha_orden FROM tbl_detalle_orden INNER JOIN tbl_orden ON tbl_orden.id_orden = tbl_detalle_orden.id_orden WHERE id_detalle_factura_paciente = ${item.id_detalle_factura_paciente}`;
                //console.log("vvvvvvvvvvvvvvvvvvvvvvvvv", "SELECT tbl_detalle_orden.id_orden, tbl_orden.numero_orden, tbl_orden.orden_qr, DATE_FORMAT(tbl_orden.fecha, '%Y-%m-%d') AS fecha_orden FROM tbl_detalle_orden INNER JOIN tbl_orden ON tbl_orden.id_orden = tbl_detalle_orden.id_orden WHERE id_detalle_factura_paciente ='" + item.id_detalle_factura_paciente +"'")
                connection.query(sql, function (err, result, fields) {
                    if (err) {
                        console.log('ERROR en CheckTemplate', err);
                        res.send('3');
                    }   
                    if (result) {                      
                        facturasRegistroConveniosOrdenes.push({
                            numero_registro_convenio: item.numero_registro_convenio,
                            id_cliente: item.id_cliente,
                            total_bolivares: item.total_bolivares,
                            total_dolares: item.total_dolares,
                            total_pesos: item.total_pesos,
                            fecha_registro_convenio: item.fecha_registro_convenio,
                            cliente_nombre: item.cliente_nombre,
                            cliente_apellido: item.cliente_apellido,
                            cedula_RIF: item.cedula_RIF,
                            id_detalle_factura_paciente: item.id_detalle_factura_paciente,
                            id_factura: item.id_factura,
                            id_registro_convenio: item.id_registro_convenio,
                            id_paciente: item.id_paciente,
                            paciente_nombre: item.paciente_nombre,
                            paciente_apellido: item.paciente_apellido,
                            paciente_cedula: item.paciente_cedula,
                            id_orden: result[0].id_orden,
                            numero_orden: result[0].numero_orden,
                            orden_qr: result[0].orden_qr,
                            fecha_orden: result[0].fecha_orden
                        })
                        resolve(facturasRegistroConveniosOrdenes)
                        //res.send(result)
                    }
                });
            })
        }
    } else if (req.body.tipoBusqueda == 3) {
        //console.log("busqueda factura", req.body.busqueda)
        let facturaData;
        let idDetalleFacturaPaciente;
        let detalleOrden = [];



        facturaData = await buscarFactura(buscarFactura);
        idDetalleFacturaPaciente = await buscarDetalleFactura(facturaData, idDetalleFacturaPaciente)
        for(const item of idDetalleFacturaPaciente){
            detalleOrden = await OrdenGroup(item, detalleOrden, facturaData)
        }
        
        res.send(detalleOrden);

        async function buscarFactura(datosPaciente){
            return new Promise((resolve, reject) => {
                let sql = "SELECT tbl_factura.numero_factura, tbl_factura.id_factura, tbl_factura.orden_trabajo, tbl_factura.id_cliente, DATE_FORMAT(tbl_factura.fecha_creacion_factura, '%d-%m-%Y') AS fecha_creacion_factura, DATE_FORMAT(tbl_factura.fecha_creacion_orden_trabajo, '%d-%m-%Y') AS fecha_creacion_orden_trabajo, DATE_FORMAT(tbl_factura.fecha_cancelacion, '%d-%m-%Y') AS fecha_cancelacion, tbl_factura.total_bolivares, tbl_factura.total_dolares, tbl_factura.total_pesos, tbl_cliente.cliente_nombre, tbl_cliente.cliente_apellido, tbl_cliente.cedula_RIF FROM tbl_factura INNER JOIN tbl_cliente ON tbl_factura.id_cliente = tbl_cliente.id_cliente WHERE tbl_factura.numero_factura='" + req.body.busqueda +"'";
                connection.query(sql, function (err, result, fields) {
                    if (err) {
                        console.log('ERROR en CheckTemplate', err);
                        res.send('3');
                    }
                    if (result.length == 0) {
                        res.send(result)
                    }else{
                        facturaData = result
                        resolve(facturaData)
                    }
                });
            })
        }

        async function buscarDetalleFactura(facturaData, idDetalleFacturaPaciente){
            return new Promise((resolve, reject) => {
                //console.log(facturaData)
                const sql = "SELECT tbl_detalle_factura_paciente.id_detalle_factura_paciente, tbl_detalle_factura_paciente.id_factura, tbl_detalle_factura_paciente.id_registro_convenio, tbl_detalle_factura_paciente.id_paciente, tbl_paciente.paciente_nombre, tbl_paciente.paciente_apellido, tbl_paciente.paciente_cedula FROM tbl_detalle_factura_paciente INNER JOIN tbl_paciente ON tbl_paciente.id_paciente = tbl_detalle_factura_paciente.id_paciente WHERE tbl_detalle_factura_paciente.id_factura = '"+facturaData[0].id_factura+"' GROUP BY id_paciente"
                connection.query(sql, function (err, result, fields) {
                    if (err) {
                        console.log('ERROR en CheckTemplate', err);
                        res.send('3');
                    }
                    if (result) {
                        idDetalleFacturaPaciente = result
                        resolve(idDetalleFacturaPaciente)
                    }
                });
            })  
        }


        async function OrdenGroup(item, detalleOrden, facturaData){
            return new Promise((resolve, reject) => {
                //console.log(facturaData[0])
                let sql = "SELECT tbl_detalle_orden.id_detalle_orden, tbl_detalle_orden.id_orden, tbl_orden.numero_orden, tbl_orden.orden_qr, tbl_orden.anulado, DATE_FORMAT(tbl_orden.fecha, '%d-%m-%Y') AS fecha_orden FROM tbl_detalle_orden INNER JOIN tbl_orden ON tbl_orden.id_orden = tbl_detalle_orden.id_orden WHERE tbl_detalle_orden.id_detalle_factura_paciente='" + item.id_detalle_factura_paciente +"' GROUP BY id_orden";
                connection.query(sql, function (err, result, fields) {
                    if (err) {
                        console.log('ERROR en CheckTemplate', err);
                        res.send('3');
                    }   
                    if (result) {
                        //console.log("!!!!!!!!!!!!!!!!!!!", result[0])
                        //console.log("XXXXXXXXXXXXXXXX", item)
                        detalleOrden.push({
                           numero_factura: facturaData[0].numero_factura,
                           orden_trabajo: facturaData[0].orden_trabajo,
                           id_cliente: facturaData[0].id_cliente,
                           fecha_creacion_factura: facturaData[0].fecha_creacion_factura,
                           fecha_creacion_orden_trabajo: facturaData[0].fecha_creacion_orden_trabajo,
                           fecha_cancelacion: facturaData[0].fecha_cancelacion,
                           total_bolivares: facturaData[0].total_bolivares,
                           total_dolares: facturaData[0].total_dolares,
                           total_pesos: facturaData[0].total_pesos,
                           cliente_nombre: facturaData[0].cliente_nombre,
                           cliente_apellido: facturaData[0].cliente_apellido,
                           cedula_RIF: facturaData[0].cedula_RIF,
                           id_detalle_factura_paciente: item.id_detalle_factura_paciente,
                           id_factura: item.id_factura,
                           id_paciente: item.id_paciente,
                           paciente_nombre: item.paciente_nombre,
                           paciente_apellido: item.paciente_apellido,
                           paciente_cedula: item.paciente_cedula,
                           id_orden: result[0].id_orden,
                           numero_orden: result[0].numero_orden,
                           orden_qr: result[0].orden_qr,
                           fecha_orden: result[0].fecha_orden,
                           anulado: result[0].anulado   
                           
                        })
                        resolve(detalleOrden)
                    }
                });
            })   
        }


    } else if (req.body.tipoBusqueda == 4) {
        //////////////////////////////////////////////////////////////////POR CEDULA PAIENTE/////////////////////////////////////////////////////////////////
        //console.log("busqueda cedula paciente")
        //console.log(req.body.busqueda)
        let datosPaciente;
        let idDetallesFacturasPacienteGroup;
        let detallesFacturaOrden = [];
        let facturasRegistroConveniosClientePacienteOrdenes = [];


        datosPaciente = await buscarPaciente(datosPaciente);
        idDetallesFacturasPacienteGroup = await idDetallesFacturasPaciente(datosPaciente, idDetallesFacturasPacienteGroup);

        for(const item of idDetallesFacturasPacienteGroup){
                detallesFacturaOrden = await buscarOrdenYFiltrar(item, detallesFacturaOrden);
        }
        for(const item of detallesFacturaOrden){
            if(item.id_factura != null){
                facturasRegistroConveniosClientePacienteOrdenes = await buscarFacturasClientesOrdenes(item, facturasRegistroConveniosClientePacienteOrdenes)
            }else{
                facturasRegistroConveniosClientePacienteOrdenes = await buscarRegistroConvenioClientesOrdenes(item, facturasRegistroConveniosClientePacienteOrdenes)
            }
        }
        
        console.log("!!!!!!!!!!!!!!!!!!!!!!!1", facturasRegistroConveniosClientePacienteOrdenes)
        res.send(facturasRegistroConveniosClientePacienteOrdenes);

        async function buscarPaciente(datosPaciente){
            return new Promise((resolve, reject) => {
                let sql = "SELECT * FROM tbl_paciente WHERE paciente_cedula = '" + req.body.busqueda +"'";
                connection.query(sql, function (err, result, fields) {
                    if (err) {
                        console.log('ERROR en CheckTemplate', err);
                        res.send('3');
                    }   
                    if (result) {
                        //console.log("PASO!")
                        if(result.length == 0){
                            res.send(result);
                        }else{
                            datosPaciente = result[0];
                            resolve(datosPaciente)
                        }
                        
                        //res.send(result)
                    }
                });
            })
        }
        
        async function idDetallesFacturasPaciente(datosPaciente, idDetallesFacturasPacienteGroup){
            return new Promise((resolve, reject) => {
                let sql = "SELECT tbl_detalle_factura_paciente.id_detalle_factura_paciente, tbl_detalle_factura_paciente.id_factura, tbl_detalle_factura_paciente.id_registro_convenio, tbl_detalle_factura_paciente.id_paciente, tbl_paciente.paciente_nombre, tbl_paciente.paciente_apellido, tbl_paciente.paciente_cedula FROM tbl_detalle_factura_paciente INNER JOIN tbl_paciente ON tbl_paciente.id_paciente = tbl_detalle_factura_paciente.id_paciente WHERE tbl_detalle_factura_paciente.id_paciente='" + datosPaciente.id_paciente +"' GROUP BY id_factura";
                connection.query(sql, function (err, result, fields) {
                    if (err) {
                        console.log('ERROR en CheckTemplate', err);
                        res.send('3');
                    }   
                    if (result) {
                        //console.log("PASO!")
                        idDetallesFacturasPacienteGroup = result;
                        resolve(idDetallesFacturasPacienteGroup)
                        //res.send(result)
                    }
                });
            })   
        }

        async function buscarOrdenYFiltrar(detalleFacturaPaciente, detallesFacturaOrden){
            console.log(detalleFacturaPaciente, detallesFacturaOrden)
            return new Promise((resolve, reject) => {
                let sql = "SELECT tbl_detalle_orden.id_orden, tbl_orden.anulado, tbl_orden.numero_orden, tbl_orden.orden_qr, DATE_FORMAT(tbl_orden.fecha, '%Y-%m-%d') AS fecha_orden, tbl_detalle_factura_paciente.id_factura, tbl_factura.id_estado_factura FROM tbl_detalle_orden INNER JOIN tbl_orden ON tbl_orden.id_orden = tbl_detalle_orden.id_orden LEFT JOIN tbl_detalle_factura_paciente ON tbl_detalle_factura_paciente.id_detalle_factura_paciente = tbl_detalle_orden.id_detalle_factura_paciente LEFT JOIN tbl_factura ON tbl_factura.id_factura = tbl_detalle_factura_paciente.id_factura WHERE tbl_detalle_orden.id_detalle_factura_paciente = '" +detalleFacturaPaciente.id_detalle_factura_paciente +"'AND tbl_factura.id_estado_factura = 1";
                //console.log("Xxxxxxxxxx", sql)
                connection.query(sql, function (err, result, fields) {
                    if (err) {
                        console.log('ERROR en CheckTemplate', err);
                        res.send('3');
                    }   
                    if (result.length > 0) {
                        let bool = moment(result[0].fecha_orden).isBetween(req.body.from+" "+"00:00:00", req.body.to+" "+"23:59:59", 'days', '[]')
                        if(bool == true){
                           //console.log("PASO!", detalleFacturaPaciente)
                            detallesFacturaOrden.push({
                                id_detalle_factura_paciente: detalleFacturaPaciente.id_detalle_factura_paciente,
                                id_factura: detalleFacturaPaciente.id_factura,
                                id_registro_convenio: detalleFacturaPaciente.id_registro_convenio,
                                id_paciente: detalleFacturaPaciente.id_paciente,
                                paciente_nombre: detalleFacturaPaciente.paciente_nombre,
                                paciente_apellido: detalleFacturaPaciente.paciente_apellido,
                                paciente_cedula: detalleFacturaPaciente.paciente_cedula,
                                id_orden: result[0].id_orden,
                                orden_qr: result[0].orden_qr,
                                fecha_orden: result[0].fecha_orden,
                                numero_orden: result[0].numero_orden,
                                anulado: result[0].anulado
                            })
                        }
                        resolve(detallesFacturaOrden)
                        //res.send(result)
                    }else{
                        resolve(detallesFacturaOrden)
                    }
                });
            })
        }

        async function buscarFacturasClientesOrdenes(detallesFacturaOrden, facturasRegistroConveniosClientePacienteOrdenes){
            return new Promise((resolve, reject) => {
                //console.log("JOJOJO", detallesFacturaOrden)
                let sql = "SELECT tbl_factura.numero_factura, tbl_factura.orden_trabajo, tbl_factura.id_cliente, DATE_FORMAT(tbl_factura.fecha_creacion_factura, '%Y-%m-%d') AS fecha_creacion_factura, DATE_FORMAT(tbl_factura.fecha_creacion_orden_trabajo, '%Y-%m-%d') AS fecha_creacion_orden_trabajo, DATE_FORMAT(tbl_factura.fecha_cancelacion, '%Y-%m-%d') AS fecha_cancelacion, tbl_factura.total_bolivares, tbl_factura.total_dolares, tbl_factura.total_pesos, tbl_cliente.id_cliente, tbl_cliente.cliente_nombre, tbl_cliente.cliente_apellido, tbl_cliente.cedula_RIF FROM tbl_factura INNER JOIN tbl_cliente ON tbl_cliente.id_cliente = tbl_factura.id_cliente WHERE id_factura = '" +detallesFacturaOrden.id_factura+"'";
                connection.query(sql, function (err, result, fields) {
                    if (err) {
                        console.log('ERROR en CheckTemplate', err);
                        res.send('3');
                    }   
                    if (result) {
                           //console.log("PASO!", result)
                           facturasRegistroConveniosClientePacienteOrdenes.push({
                                numero_factura: result[0].numero_factura,
                                orden_trabajo: result[0].orden_trabajo,
                                id_cliente: result[0].id_cliente,
                                fecha_creacion_factura:  result[0].fecha_creacion_factura, 
                                fecha_creacion_orden_trabajo: result[0].fecha_creacion_orden_trabajo,
                                fecha_cancelacion: result[0].fecha_cancelacion,
                                total_bolivares: result[0].total_bolivares,
                                total_dolares: result[0].total_dolares,
                                total_pesos: result[0].total_pesos,
                                cliente_nombre: result[0].cliente_nombre, 
                                cliente_apellido: result[0].cliente_apellido, 
                                cedula_RIF: result[0].cedula_RIF,
                                id_detalle_factura_paciente: detallesFacturaOrden.id_detalle_factura_paciente,
                                id_factura: detallesFacturaOrden.id_factura,
                                id_registro_convenio: detallesFacturaOrden.id_registro_convenio,
                                id_paciente: detallesFacturaOrden.id_paciente,
                                paciente_nombre: detallesFacturaOrden.paciente_nombre,
                                paciente_apellido: detallesFacturaOrden.paciente_apellido,
                                paciente_cedula: detallesFacturaOrden.paciente_cedula,
                                id_orden: detallesFacturaOrden.id_orden,
                                numero_orden: detallesFacturaOrden.numero_orden,
                                orden_qr: detallesFacturaOrden.orden_qr,
                                fecha_orden: detallesFacturaOrden.fecha_orden,
                                anulado: detallesFacturaOrden.anulado
                            })
                        resolve(facturasRegistroConveniosClientePacienteOrdenes)
                        //res.send(result)
                    }
                });
            })
        }

        async function buscarRegistroConvenioClientesOrdenes(detallesFacturaOrden, facturasRegistroConveniosClientePacienteOrdenes){
            return new Promise((resolve, reject) => {
                let sql = "SELECT tbl_registro_convenio.numero_registro_convenio, tbl_registro_convenio.total_bolivares, DATE_FORMAT(tbl_registro_convenio.fecha, '%Y-%m-%d') AS fecha_registro_convenio, tbl_registro_convenio.total_pesos, tbl_registro_convenio.total_dolares, tbl_registro_convenio.fecha , tbl_cliente.id_cliente, tbl_cliente.cliente_nombre, tbl_cliente.cliente_apellido, tbl_cliente.cedula_RIF FROM tbl_registro_convenio INNER JOIN tbl_cliente ON tbl_cliente.id_cliente = tbl_registro_convenio.id_cliente WHERE id_registro_convenio = '" +detallesFacturaOrden.id_registro_convenio+"'";
                connection.query(sql, function (err, result, fields) {
                    if (err) {
                        console.log('ERROR en CheckTemplate', err);
                        res.send('3');
                    }   
                    if (result) {
                        //console.log("REGISTRO CONVENIO", result)
                        facturasRegistroConveniosClientePacienteOrdenes.push({
                            numero_registro_convenio: result[0].numero_registro_convenio,
                            id_cliente: result[0].id_cliente,
                            total_bolivares: result[0].total_bolivares,
                            total_dolares: result[0].total_dolares,
                            total_pesos: result[0].total_pesos,
                            fecha_registro_convenio: result[0].fecha_registro_convenio,
                            cliente_nombre: result[0].cliente_nombre,
                            cliente_apellido: result[0].cliente_apellido,
                            cedula_RIF: result[0].cedula_RIF,
                            id_detalle_factura_paciente: detallesFacturaOrden.id_detalle_factura_paciente,
                            id_factura: detallesFacturaOrden.id_factura,
                            id_registro_convenio: detallesFacturaOrden.id_registro_convenio,
                            id_paciente: detallesFacturaOrden.id_paciente,
                            paciente_nombre: detallesFacturaOrden.paciente_nombre,
                            paciente_apellido: detallesFacturaOrden.paciente_apellido,
                            paciente_cedula: detallesFacturaOrden.paciente_cedula,
                            id_orden: detallesFacturaOrden.id_orden,
                            numero_orden: detallesFacturaOrden.numero_orden,
                            orden_qr: detallesFacturaOrden.orden_qr,
                            fecha_orden: detallesFacturaOrden.fecha_orden
                        })
                        resolve(facturasRegistroConveniosClientePacienteOrdenes)
                    }
                })
            })
        }
    } else if (req.body.tipoBusqueda == 5) {
            //console.log("busqueda fecha")
            let busqueda = parseInt(req.body.busqueda);
            let ordenes;
            let idDetalleFacturaPaciente = [];
            let detalleFacturaPaciente = [];
            //console.log(busqueda);
            ordenes = await buscarOrdenes(ordenes)
            //console.log("LAS ORDENES?", ordenes)
            for(const item of ordenes){
                //console.log("ITEM", item)
                 idDetalleFacturaPaciente = await buscarIdDetalleFacturaPaciente(item, idDetalleFacturaPaciente)
             }
             for(const detalle of idDetalleFacturaPaciente){
                //console.log("DETALLE!", detalle)
                 if(detalle.id_factura != null){
                     
                    detalleFacturaPaciente = await buscarFacturaYPaciente(detalle, detalleFacturaPaciente);
                 }else if(detalle.id_factura == null){
                    detalleFacturaPaciente = await buscarRegistroConvenioYPaciente(detalle, detalleFacturaPaciente);
                 }  
             }
            res.send(detalleFacturaPaciente)

        async function buscarOrdenes(ordenes){
            return new Promise((resolve, reject) => {
                sql = "SELECT id_orden, numero_orden, orden_qr, anulado, DATE_FORMAT(fecha, '%Y-%m-%d') AS fecha FROM `tbl_orden` WHERE fecha >='" + req.body.from+" "+"00:00:00" + "' AND fecha <= '"+req.body.to+""+" "+ "23:59:59'";
                connection.query(sql, function (err, result, fields) {
                    if (err) {
                        console.log('ERROR en CheckTemplate', err);
                        res.send('3');
                    }
                    if (result) {
                        //res.send(result)
                        //detallesFacturaPaciente(result)
                        ordenes = result;
                        resolve(ordenes);
                    }
                });
            })
        }
        async function buscarIdDetalleFacturaPaciente(orden, idDetalleFacturaPaciente){
            // console.log("!!!!!!!!!!!!!!!!!!!!!!!", orden)
             return new Promise((resolve, reject) => {
             //    console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1", orden)
                 sql = "SELECT tbl_detalle_orden.id_detalle_factura_paciente, tbl_detalle_factura_paciente.id_factura, tbl_detalle_factura_paciente.id_registro_convenio, tbl_registro_convenio.numero_registro_convenio FROM tbl_detalle_orden LEFT JOIN tbl_detalle_factura_paciente ON tbl_detalle_orden.id_detalle_factura_paciente = tbl_detalle_factura_paciente.id_detalle_factura_paciente LEFT JOIN tbl_registro_convenio ON tbl_registro_convenio.id_registro_convenio = tbl_detalle_factura_paciente.id_registro_convenio WHERE tbl_detalle_orden.id_orden = '" + orden.id_orden + "' GROUP BY id_orden";
                 
                 connection.query(sql, function (err, result, fields) {
                     if (err) {
                         console.log('ERROR en CheckTemplate', err);
                         res.send('3');
                     }
                     if (result) {
                         //res.send(result)
                         //detallesFacturaPaciente(result)
                         idDetalleFacturaPaciente.push({
                             id_detalle_factura_paciente: result[0].id_detalle_factura_paciente,
                             id_registro_convenio: result[0].id_registro_convenio,
                             numero_registro_convenio: result[0].numero_registro_convenio,
                             id_factura: result[0].id_factura,
                             id_orden: orden.id_orden,
                             numero_orden:  orden.numero_orden,
                             orden_qr:  orden.orden_qr,
                             anulado: orden.anulado,
                             fecha:  orden.fecha
                         })
                         resolve(idDetalleFacturaPaciente);
                     }
                 });
             })
         }
         
         async function buscarFacturaYPaciente(idDetalleFacturaPaciente, detalleFacturaPaciente){
             return new Promise((resolve, reject) => {
                 //console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!", idDetalleFacturaPaciente.id_detalle_factura_paciente)
                 sql = "SELECT tbl_detalle_factura_paciente.id_factura, tbl_detalle_factura_paciente.id_paciente, tbl_factura.numero_factura, tbl_factura.orden_trabajo, tbl_factura.fecha_creacion_factura, tbl_factura.fecha_creacion_orden_trabajo, tbl_factura.fecha_cancelacion, tbl_factura.total_bolivares, tbl_factura.total_pesos, tbl_factura.total_dolares, tbl_factura.debe_dolares, tbl_cliente.cliente_nombre, tbl_cliente.cliente_apellido, tbl_cliente.cedula_RIF, tbl_cliente.telefono, tbl_paciente.paciente_nombre, tbl_paciente.paciente_apellido, tbl_paciente.paciente_cedula, tbl_paciente.edad FROM tbl_detalle_factura_paciente LEFT JOIN tbl_factura ON tbl_factura.id_factura = tbl_detalle_factura_paciente.id_factura LEFT JOIN tbl_cliente ON tbl_cliente.id_cliente = tbl_factura.id_cliente LEFT JOIN tbl_paciente ON tbl_paciente.id_paciente = tbl_detalle_factura_paciente.id_paciente WHERE tbl_detalle_factura_paciente.id_detalle_factura_paciente = '" + idDetalleFacturaPaciente.id_detalle_factura_paciente + "' GROUP BY tbl_detalle_factura_paciente.id_paciente";
                 connection.query(sql, function (err, result, fields) {
                     if (err) {
                         console.log('ERROR en CheckTemplate', err);
                         res.send('3');
                     }
                     if (result) {
                         //console.log("EL RESULT!", result)
                         //res.send(result)
                         //detallesFacturaPaciente(result)
                         detalleFacturaPaciente.push({
                             id_factura: result[0].id_factura,
                             id_paciente: result[0].id_paciente,
                             id_orden: idDetalleFacturaPaciente.id_orden,
                             numero_factura: result[0].numero_factura,
                             orden_trabajo: result[0].orden_trabajo,
                             fecha_creacion_factura: result[0].fecha_creacion_factura,
                             fecha_creacion_orden_trabajo: result[0].fecha_creacion_orden_trabajo,
                             total_bolivares: result[0].total_bolivares,
                             total_pesos:  result[0].total_pesos,
                             total_dolares:  result[0].total_dolares,
                             debe_dolares: result[0].debe_dolares,
                             cliente_nombre: result[0].cliente_nombre, 
                             cliente_apellido: result[0].cliente_apellido, 
                             cedula_RIF: result[0].cedula_RIF, 
                             telefono: result[0].telefono,
                             paciente_nombre: result[0].paciente_nombre, 
                             paciente_apellido: result[0].paciente_apellido, 
                             paciente_cedula: result[0].paciente_cedula, 
                             paciente_edad: result[0].edad,
                             id_detalle_factura_paciente: idDetalleFacturaPaciente.id_detalle_factura_paciente,
                             numero_orden: idDetalleFacturaPaciente.numero_orden,
                             orden_qr: idDetalleFacturaPaciente.orden_qr,
                             fecha_orden: idDetalleFacturaPaciente.fecha,
                             anulado: idDetalleFacturaPaciente.anulado
                         })
                         resolve(detalleFacturaPaciente);
                     }
                 });
             })
         }

         async function buscarRegistroConvenioYPaciente(idDetalleFacturaPaciente, detalleFacturaPaciente){
            return new Promise((resolve, reject) => {
                
                  let sql = "SELECT tbl_detalle_factura_paciente.id_registro_convenio, tbl_detalle_factura_paciente.id_detalle_factura_paciente, tbl_paciente.id_paciente, tbl_detalle_factura_paciente.id_paciente, tbl_registro_convenio.numero_registro_convenio, tbl_registro_convenio.id_cliente, tbl_registro_convenio.total_bolivares, tbl_registro_convenio.total_pesos, tbl_registro_convenio.total_dolares, DATE_FORMAT(tbl_registro_convenio.fecha, '%d-%m-%Y') AS fecha_registro_convenio, tbl_cliente.cliente_nombre, tbl_cliente.cliente_apellido, tbl_cliente.cedula_RIF, tbl_paciente.paciente_nombre, tbl_paciente.paciente_apellido, tbl_paciente.paciente_cedula FROM tbl_detalle_factura_paciente LEFT JOIN tbl_registro_convenio ON tbl_registro_convenio.id_registro_convenio = tbl_detalle_factura_paciente.id_registro_convenio LEFT JOIN tbl_paciente ON tbl_detalle_factura_paciente.id_paciente = tbl_paciente.id_paciente LEFT JOIN tbl_cliente ON tbl_registro_convenio.id_cliente = tbl_cliente.id_cliente WHERE tbl_detalle_factura_paciente.id_detalle_factura_paciente = '" + idDetalleFacturaPaciente.id_detalle_factura_paciente + "'";
            
                  connection.query(sql, function (err, result, fields) {
                    if (err) {
                        console.log('ERROR en CheckTemplate', err);
                        res.send('3');
                    }   
                    if (result) {
                        //console.log("PASO!", result[0])
                        detalleFacturaPaciente.push({
                            numero_registro_convenio: result[0].numero_registro_convenio,
                            id_cliente: result[0].id_cliente,
                            total_bolivares: result[0].total_bolivares,
                            total_dolares: result[0].total_dolares,
                            total_pesos: result[0].total_pesos,
                            fecha_registro_convenio: result[0].fecha_registro_convenio,
                            cliente_nombre: result[0].cliente_nombre,
                            cliente_apellido: result[0].cliente_apellido,
                            cedula_RIF: result[0].cedula_RIF,
                            id_detalle_factura_paciente: result[0].id_detalle_factura_paciente,
                            //id_factura: result[0].id_factura,
                            id_registro_convenio: result[0].id_registro_convenio,
                            id_paciente: result[0].id_paciente,
                            paciente_nombre: result[0].paciente_nombre,
                            paciente_apellido: result[0].paciente_apellido,
                            paciente_cedula: result[0].paciente_cedula,
                            id_detalle_factura_paciente: idDetalleFacturaPaciente.id_detalle_factura_paciente,
                            id_orden: idDetalleFacturaPaciente.id_orden,
                            numero_orden: idDetalleFacturaPaciente.numero_orden,
                            orden_qr: idDetalleFacturaPaciente.orden_qr,
                            fecha_orden: idDetalleFacturaPaciente.fecha,
                            anulado: idDetalleFacturaPaciente.anulado
                        })
                        resolve(detalleFacturaPaciente)
                        //res.send(result)
                    }
                });
            })
        }
    } else if (req.body.tipoBusqueda == 6) {
        //console.log("busqueda orden de trabajo", req.body.busqueda)
        let facturaData;
        let idDetalleFacturaPaciente;
        let detalleOrden = [];

        facturaData = await buscarFactura(buscarFactura);
        idDetalleFacturaPaciente = await buscarDetalleFactura(facturaData, idDetalleFacturaPaciente)
        for(const item of idDetalleFacturaPaciente){
            detalleOrden = await OrdenGroup(item, detalleOrden, facturaData)
        }
        
        res.send(detalleOrden);

        async function buscarFactura(datosPaciente){
            return new Promise((resolve, reject) => {
                let sql = "SELECT tbl_factura.numero_factura, tbl_factura.id_factura, tbl_factura.orden_trabajo, tbl_factura.id_cliente, DATE_FORMAT(tbl_factura.fecha_creacion_factura, '%d-%m-%Y') AS fecha_creacion_factura, DATE_FORMAT(tbl_factura.fecha_creacion_orden_trabajo, '%d-%m-%Y') AS fecha_creacion_orden_trabajo, DATE_FORMAT(tbl_factura.fecha_cancelacion, '%d-%m-%Y') AS fecha_cancelacion, tbl_factura.total_bolivares, tbl_factura.total_dolares, tbl_factura.total_pesos, tbl_cliente.cliente_nombre, tbl_cliente.cliente_apellido, tbl_cliente.cedula_RIF FROM tbl_factura INNER JOIN tbl_cliente ON tbl_factura.id_cliente = tbl_cliente.id_cliente WHERE tbl_factura.orden_trabajo='" + req.body.busqueda +"'";
                connection.query(sql, function (err, result, fields) {
                    if (err) {
                        console.log('ERROR en CheckTemplate', err);
                        res.send('3');
                    }
                    if (result.length == 0) {
                        res.send(result)
                    }else{
                        facturaData = result
                        resolve(facturaData)
                    }
                });
            })
        }

        async function buscarDetalleFactura(facturaData, idDetalleFacturaPaciente){
            return new Promise((resolve, reject) => {
                //console.log(facturaData)
                const sql = "SELECT tbl_detalle_factura_paciente.id_detalle_factura_paciente, tbl_detalle_factura_paciente.id_factura, tbl_detalle_factura_paciente.id_registro_convenio, tbl_detalle_factura_paciente.id_paciente, tbl_paciente.paciente_nombre, tbl_paciente.paciente_apellido, tbl_paciente.paciente_cedula FROM tbl_detalle_factura_paciente INNER JOIN tbl_paciente ON tbl_paciente.id_paciente = tbl_detalle_factura_paciente.id_paciente WHERE tbl_detalle_factura_paciente.id_factura = '"+facturaData[0].id_factura+"' GROUP BY id_paciente"
                connection.query(sql, function (err, result, fields) {
                    if (err) {
                        console.log('ERROR en CheckTemplate', err);
                        res.send('3');
                    }
                    if (result) {
                        idDetalleFacturaPaciente = result
                        resolve(idDetalleFacturaPaciente)
                    }
                });
            })  
        }


        async function OrdenGroup(item, detalleOrden, facturaData){
            return new Promise((resolve, reject) => {
                //console.log(facturaData[0])
                let sql = "SELECT tbl_detalle_orden.id_detalle_orden, tbl_detalle_orden.id_orden, tbl_orden.numero_orden, tbl_orden.orden_qr, tbl_orden.anulado, DATE_FORMAT(tbl_orden.fecha, '%d-%m-%Y') AS fecha_orden FROM tbl_detalle_orden INNER JOIN tbl_orden ON tbl_orden.id_orden = tbl_detalle_orden.id_orden WHERE tbl_detalle_orden.id_detalle_factura_paciente='" + item.id_detalle_factura_paciente +"' GROUP BY id_orden";
                connection.query(sql, function (err, result, fields) {
                    if (err) {
                        console.log('ERROR en CheckTemplate', err);
                        res.send('3');
                    }   
                    if (result) {
                        //console.log("!!!!!!!!!!!!!!!!!!!", result[0])
                        //console.log("XXXXXXXXXXXXXXXX", item)
                        detalleOrden.push({
                           numero_factura: facturaData[0].numero_factura,
                           orden_trabajo: facturaData[0].orden_trabajo,
                           id_cliente: facturaData[0].id_cliente,
                           fecha_creacion_factura: facturaData[0].fecha_creacion_factura,
                           fecha_creacion_orden_trabajo: facturaData[0].fecha_creacion_orden_trabajo,
                           fecha_cancelacion: facturaData[0].fecha_cancelacion,
                           total_bolivares: facturaData[0].total_bolivares,
                           total_dolares: facturaData[0].total_dolares,
                           total_pesos: facturaData[0].total_pesos,
                           cliente_nombre: facturaData[0].cliente_nombre,
                           cliente_apellido: facturaData[0].cliente_apellido,
                           cedula_RIF: facturaData[0].cedula_RIF,
                           id_detalle_factura_paciente: item.id_detalle_factura_paciente,
                           id_factura: item.id_factura,
                           id_paciente: item.id_paciente,
                           paciente_nombre: item.paciente_nombre,
                           paciente_apellido: item.paciente_apellido,
                           paciente_cedula: item.paciente_cedula,
                           id_orden: result[0].id_orden,
                           numero_orden: result[0].numero_orden,
                           orden_qr: result[0].orden_qr,
                           fecha_orden: result[0].fecha_orden,
                           anulado: result[0].anulado
                           
                        })
                        resolve(detalleOrden)
                    }
                });
            })   
        }
    } else if (req.body.tipoBusqueda == 7) {
        //console.log("busqueda registro convenio", req.body.busqueda)
        let registroConvenioData;
        let idDetalleFacturaPaciente;
        let detalleOrden = [];

        registroConvenioData = await buscarRegistroConvenio(registroConvenioData);
        idDetalleFacturaPaciente = await buscarDetalleFactura(registroConvenioData, idDetalleFacturaPaciente)
        for(const item of idDetalleFacturaPaciente){
            detalleOrden = await OrdenGroup(item, detalleOrden, registroConvenioData)
        }
        res.send(detalleOrden);

        async function buscarRegistroConvenio(registroConvenioData){
            return new Promise((resolve, reject) => {
                let sql = "SELECT tbl_registro_convenio.numero_registro_convenio, tbl_registro_convenio.id_registro_convenio, tbl_registro_convenio.id_cliente, DATE_FORMAT(tbl_registro_convenio.fecha, '%d-%m-%Y') AS fecha_creacion, tbl_registro_convenio.total_bolivares, tbl_registro_convenio.total_dolares, tbl_registro_convenio.total_pesos, tbl_cliente.cliente_nombre, tbl_cliente.cliente_apellido, tbl_cliente.cedula_RIF FROM tbl_registro_convenio INNER JOIN tbl_cliente ON tbl_registro_convenio.id_cliente = tbl_cliente.id_cliente WHERE tbl_registro_convenio.numero_registro_convenio='" + req.body.busqueda +"'";
                connection.query(sql, function (err, result, fields) {
                    if (err) {
                        console.log('ERROR en CheckTemplate', err);
                        res.send('3');
                    }
                    console.log("=========================", result)
                    if (result.length > 0) {
                        //console.log(result)
                        registroConvenioData = result[0];
                        resolve(registroConvenioData)
                    }else{
                        res.send([])
                    }
                });
            })
        }

        async function buscarDetalleFactura(registroConvenioData, idDetalleFacturaPaciente){
            return new Promise((resolve, reject) => {
                //console.log(registroConvenioData)
                const sql = "SELECT tbl_detalle_factura_paciente.id_detalle_factura_paciente, tbl_detalle_factura_paciente.id_factura, tbl_detalle_factura_paciente.id_registro_convenio, tbl_detalle_factura_paciente.id_paciente, tbl_paciente.paciente_nombre, tbl_paciente.paciente_apellido, tbl_paciente.paciente_cedula FROM tbl_detalle_factura_paciente INNER JOIN tbl_paciente ON tbl_paciente.id_paciente = tbl_detalle_factura_paciente.id_paciente WHERE tbl_detalle_factura_paciente.id_registro_convenio = '"+registroConvenioData.id_registro_convenio+"' GROUP BY id_paciente"
                connection.query(sql, function (err, result, fields) {
                    if (err) {
                        console.log('ERROR en CheckTemplate', err);
                        res.send('3');
                    }
                    console.log("999999999999999", result)
                    if (result.length > 0) {
                        idDetalleFacturaPaciente = result
                        resolve(idDetalleFacturaPaciente)
                    }else{
                        res.send([])
                    }
                });
            })  
        }

        async function OrdenGroup(item, detalleOrden, registroConvenioData){
            return new Promise((resolve, reject) => {
                //console.log(facturaData[0])
                let sql = "SELECT tbl_detalle_orden.id_detalle_orden, tbl_detalle_orden.id_orden, tbl_orden.numero_orden, tbl_orden.orden_qr, tbl_orden.anulado, DATE_FORMAT(tbl_orden.fecha, '%d-%m-%Y') AS fecha_orden FROM tbl_detalle_orden INNER JOIN tbl_orden ON tbl_orden.id_orden = tbl_detalle_orden.id_orden WHERE tbl_detalle_orden.id_detalle_factura_paciente='" + item.id_detalle_factura_paciente +"' GROUP BY id_orden";
                connection.query(sql, function (err, result, fields) {
                    if (err) {
                        console.log('ERROR en CheckTemplate', err);
                        res.send('3');
                    }   
                    if (result) {
                        //console.log("!!!!!!!!!!!!!!!!!!!", result[0])
                        //console.log("XXXXXXXXXXXXXXXX", item)
                        detalleOrden.push({
                           numero_registro_convenio: registroConvenioData.numero_registro_convenio,
                           id_cliente: registroConvenioData.id_cliente,
                           fecha_creacion: registroConvenioData.fecha_creacion,
                           total_bolivares: registroConvenioData.total_bolivares,
                           total_dolares: registroConvenioData.total_dolares,
                           total_pesos: registroConvenioData.total_pesos,
                           cliente_nombre: registroConvenioData.cliente_nombre,
                           cliente_apellido: registroConvenioData.cliente_apellido,
                           cedula_RIF: registroConvenioData.cedula_RIF,
                           id_detalle_factura_paciente: item.id_detalle_factura_paciente,
                           id_factura: item.id_factura,
                           id_paciente: item.id_paciente,
                           paciente_nombre: item.paciente_nombre,
                           paciente_apellido: item.paciente_apellido,
                           paciente_cedula: item.paciente_cedula,
                           id_orden: result[0].id_orden,
                           numero_orden: result[0].numero_orden,
                           orden_qr: result[0].orden_qr,
                           fecha_orden: result[0].fecha_orden,
                           anulado: result[0].anulado
                           
                        })
                        resolve(detalleOrden)
                    }
                });
            })   
        }
    } else if (req.body.tipoBusqueda == 8) {
        ///////##############################################POR NOMBRE CLIENTE#####################################//////////////
        
        let ids = await extraerIds();
        if(ids.length > 0){
            //console.log("KKKKKKKKK", ids)
            let idsPacientes = ids.map(({id_paciente}) => id_paciente)
            let idsPacientesFiltrado, clientesFactura, clientesConvenio, clientesFacturaFiltrado, clientesConvenioFiltrado;
            idsPacientesFiltrado = idsPacientes.filter((item,index)=>{
                return idsPacientes.indexOf(item) === index;
              })
    
            clientesFactura = ids.map(({id_cliente_factura}) => id_cliente_factura)
            clientesConvenio = ids.map(({id_cliente_convenio}) => id_cliente_convenio)
    
            clientesFactura = clientesFactura.filter(item => item != null);
            clientesConvenio = clientesConvenio.filter(item => item != null);
    
            clientesFacturaFiltrado = clientesFactura.filter((item,index)=>{
                return clientesFactura.indexOf(item) === index;
            })
    
            clientesConvenioFiltrado = clientesConvenio.filter((item,index)=>{
                return clientesConvenio.indexOf(item) === index;
            })
    
            //console.log("AY YAAAAAA", clientesFacturaFiltrado, clientesConvenioFiltrado)
    
            //console.log("!!!!!!!!!!!!!!!!", ids)
            let pacientes = await buscarPacientes(idsPacientesFiltrado);
    
    
                console.log("POR FACTURA")
                if(clientesFactura.length > 0){
                    clientesFactura = await buscarCliente(clientesFacturaFiltrado)
                }
    
                console.log("POR CONVENIO")
                if(clientesConvenio.length > 0){
                    clientesConvenio = await buscarCliente(clientesConvenioFiltrado)
                }
    
                //console.log("lllllllllllllllllll", clientesFactura);
                //console.log("yyyyyyyyyyyyyyyyyyyyyyy", clientesConvenio)
              
    
            for(const id of ids){
                if(id.id_cliente_factura != null){
                    //////////////////////POR FACTURA//////////////////
                    for(const cliente of clientesFactura){
                        if(id.id_cliente_factura == cliente.id_cliente){
                            id.cliente_nombre = cliente.cliente_nombre,
                            id.cliente_apellido = cliente.cliente_apellido,
                            id.cedula_RIF = cliente.cedula_RIF
                        }
                    }
                }else{
                    //////////////////////POR CONVENIO//////////////////
                    for(const cliente of clientesConvenio){
                        if(id.id_cliente_convenio == cliente.id_cliente){
                            id.cliente_nombre = cliente.cliente_nombre,
                            id.cliente_apellido = cliente.cliente_apellido,
                            id.cedula_RIF = cliente.cedula_RIF
                        }
                    }
                }
    
                for(const paciente of pacientes){
                    if(paciente.id_paciente == id.id_paciente){
                        id.paciente_nombre = paciente.paciente_nombre,
                        id.paciente_apellido = paciente.paciente_apellido,
                        id.paciente_cedula = paciente.paciente_cedula
                    }
                }
            }

            let ordenesPorFecha = [];
            for(const item of ids){
                //console.log(item.fecha_orden_formato)
                //console.log(req.body.from, req.body.to)
                bool = moment(item.fecha_orden_formato).isBetween(req.body.from+" "+"00:00:00", req.body.to+" "+"23:59:59", 'days', '[]') 
                //moment(new Date(item.fecha_orden_formato)).isBetween(req.body.from, req.body.to)
                console.log("HHHHHHHHHHHHHHHHHHH", bool)
                if(bool == true){
                    console.log(req.body.from, req.body.to)
                    ordenesPorFecha.push(
                         item
                     )
                }
             }
             //console.log("")
            res.send(ordenesPorFecha);
        }else{
            console.log("OOOOOOOOOOOOOO", ids.length)
            res.send("8")
        }

        async function extraerIds(){
            let sql = `SELECT tbl_orden.id_orden, tbl_orden.numero_orden, date_format(tbl_orden.fecha,'%d-%m-%Y') AS fecha_orden, tbl_orden.fecha AS fecha_orden_formato, tbl_detalle_orden.id_detalle_factura_paciente, tbl_detalle_factura_paciente.id_registro_convenio, tbl_detalle_factura_paciente.id_paciente, tbl_factura.id_cliente AS id_cliente_factura, tbl_factura.numero_factura, tbl_factura.orden_trabajo, tbl_registro_convenio.id_cliente AS id_cliente_convenio, tbl_registro_convenio.numero_registro_convenio FROM tbl_orden LEFT JOIN tbl_detalle_orden ON tbl_detalle_orden.id_orden = tbl_orden.id_orden LEFT JOIN tbl_detalle_factura_paciente ON tbl_detalle_factura_paciente.id_detalle_factura_paciente = tbl_detalle_orden.id_detalle_factura_paciente LEFT JOIN tbl_registro_convenio ON tbl_registro_convenio.id_registro_convenio = tbl_detalle_factura_paciente.id_registro_convenio LEFT JOIN tbl_factura ON tbl_factura.id_factura = tbl_detalle_factura_paciente.id_factura LEFT JOIN tbl_cliente AS cliente_factura ON cliente_factura.id_cliente = tbl_factura.id_cliente LEFT JOIN tbl_cliente AS cliente_convenio ON cliente_convenio.id_cliente = tbl_registro_convenio.id_cliente WHERE (CONCAT(cliente_factura.cliente_nombre, ' ', cliente_factura.cliente_apellido) REGEXP '${req.body.busqueda}') OR (cliente_factura.cliente_nombre REGEXP '${req.body.busqueda}') OR (cliente_factura.cliente_apellido REGEXP '${req.body.busqueda}') OR (CONCAT(cliente_convenio.cliente_nombre, ' ', cliente_convenio.cliente_apellido) REGEXP '${req.body.busqueda}') OR (cliente_convenio.cliente_nombre REGEXP '${req.body.busqueda}') OR (cliente_convenio.cliente_apellido REGEXP '${req.body.busqueda}') GROUP BY tbl_orden.numero_orden;`
            console.log("!!!!!!", sql);
            return new Promise((resolve, reject) => {
                connection.query(sql, function (err, result, fields) {
                    if (err) {
                        console.log('ERROR en CheckTemplate', err);
                        res.send('3');
                    }
                    if (result) {
                        //console.log("====================", result)
                        //resolve(result);
                        resolve(result)
                    }
                });
            })
        }

        async function buscarPacientes(idsPacientesFiltrado){
            return new Promise((resolve, reject) => {
                    const sql = `SELECT * FROM tbl_paciente WHERE id_paciente in (${idsPacientesFiltrado})`;
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

        async function buscarCliente(idsCliente){
            return new Promise((resolve, reject) => {
                    const sql = `SELECT * FROM tbl_cliente WHERE id_cliente in (${idsCliente})`;
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
}

ordenesCtrl.ordenesTomaMuestra = async (req, res) => {

    let ordenes;
    let idDetalleFacturaPaciente = {};
    let infoPaciente;
    let ordenesFiltadras = [];
    i = 0;
    ordenes = await extraerOrdenes(ordenes);
    //console.log("!!!!!!!!!!!!!!!!!!JOJOJO", ordenes.length)
    for(const item of ordenes){
        //console.log(i);
        idDetalleFacturaPaciente = await extraerIdDetalleFacturaPaciente(item.id_orden, idDetalleFacturaPaciente);
        //console.log("ERROR QUE HA PASADO YA DEL SENOR GERARDO, ", idDetalleFacturaPaciente)
        //console.log("88888888888888888888888888888", idDetalleFacturaPaciente)
        if(idDetalleFacturaPaciente.activo == 0){
            item.id_detalle_factura_paciente = idDetalleFacturaPaciente.id_detalle_factura_paciente;
            item.id_factura = idDetalleFacturaPaciente.id_factura;
            //console.log(".........................", item)
            ordenesFiltadras.push({
                id_orden: item.id_orden,
                numero_orden: item.numero_orden,
                orden_qr: item.orden_qr,
                fecha: item.fecha,
                id_detalle_factura_paciente: item.id_detalle_factura_paciente,
                id_factura: item.id_factura
            });
        }
    }
    i = 0;
    console.log("!!!!!!!!!!!!1", ordenesFiltadras.length)
    for(const item of ordenesFiltadras){
        if(item.id_detalle_factura_paciente != 0){
            //console.log("LA DEL PEO???????", item)
            infoPaciente = await extraerInfoPaciente(item.id_detalle_factura_paciente, infoPaciente);
            ///console.log("??????????????????????", infoPaciente, item);
            item.paciente_nombre = infoPaciente.paciente_nombre
            item.paciente_apellido = infoPaciente.paciente_apellido
            item.paciente_cedula = infoPaciente.paciente_cedula
        }else{
            item.paciente_nombre = "no data"
            item.paciente_apellido = "no data"
            item.paciente_cedula = "no data"
        }
        i++;
    }
    //console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!", ordenes[0])
    res.send(ordenesFiltadras);

    async function extraerOrdenes(ordenes){
        return new Promise((resolve, reject) => {
            const sql = "SELECT id_orden, numero_orden, orden_qr, date_format(fecha, '%d-%m-%Y %T') AS fecha FROM `tbl_orden` WHERE check_toma_muestra = 0 AND check_sueros = 0 AND check_laboratorios = 0";
            connection.query(sql, function (err, result, fields) {
                if (err) {
                    console.log('ERROR en CheckTemplate', err);
                    res.send('3');
                }
                if (result) {
                    //res.send(result)
                    ordenes = result;
                    //console.log("OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO", ordenes)
                    resolve(result);
                }
            });
        })
    }

    async function extraerIdDetalleFacturaPaciente(idOrden, idDetalleFacturaPaciente){
        return new Promise((resolve, reject) => {
            const sql = "SELECT tbl_detalle_orden.id_detalle_factura_paciente, tbl_detalle_orden.id_orden, tbl_detalle_factura_paciente.id_factura, tbl_detalle_factura_paciente.id_examen, tbl_detalle_factura_paciente.id_cultivo FROM tbl_detalle_orden LEFT JOIN tbl_detalle_factura_paciente ON tbl_detalle_factura_paciente.id_detalle_factura_paciente = tbl_detalle_orden.id_detalle_factura_paciente WHERE id_orden = '" + idOrden + "' LIMIT 1";
            connection.query(sql, function (err, result, fields) {
                if (err) {
                    console.log('ERROR en CheckTemplate', err);
                    res.send('3');
                }
                if (result) {
                    //res.send(result)
                    if(result.length == 0){
                        idDetalleFacturaPaciente.id_detalle_factura_paciente = 0;
                        idDetalleFacturaPaciente.id_factura = 0;
                        resolve(idDetalleFacturaPaciente);
                    }else{
                        if(result.length == 1 && result[0].id_cultivo != null){
                            //console.log(result)
                            modificarOrdenCultivo(result[0].id_orden)
                            idDetalleFacturaPaciente.id_detalle_factura_paciente = result[0].id_detalle_factura_paciente;
                            idDetalleFacturaPaciente.id_factura = result[0].id_factura
                            idDetalleFacturaPaciente.activo = 1;
                            resolve(idDetalleFacturaPaciente);
                        }else{
                            idDetalleFacturaPaciente.id_detalle_factura_paciente = result[0].id_detalle_factura_paciente;
                            idDetalleFacturaPaciente.id_factura = result[0].id_factura
                            idDetalleFacturaPaciente.activo = 0;
                            resolve(idDetalleFacturaPaciente);
                        }

                    }
                }
            });
        })
    }

    async function modificarOrdenCultivo(idOrden){
        return new Promise((resolve, reject) => {
            const sql = "UPDATE `tbl_orden` SET check_toma_muestra = 1, check_sueros = 1, check_laboratorios = 0 WHERE id_orden ="+idOrden;
            connection.query(sql, function (err, result, fields) {
                if (err) {
                    console.log('ERROR en CheckTemplate', err);
                    res.send('3');
                }
                if (result) {
                    resolve("1")
                }
            });
        })
    }

    async function extraerInfoPaciente(idDetalleFacturaPaciente, infoPaciente){
        return new Promise((resolve, reject) => {
            const sql = "SELECT tbl_detalle_factura_paciente.id_paciente, tbl_paciente.paciente_nombre, tbl_paciente.paciente_apellido, tbl_paciente.paciente_cedula FROM `tbl_detalle_factura_paciente` INNER JOIN tbl_paciente ON tbl_paciente.id_paciente = tbl_detalle_factura_paciente.id_paciente WHERE id_detalle_factura_paciente = '" + idDetalleFacturaPaciente + "'";
            connection.query(sql, function (err, result, fields) {
                if (err) {
                    console.log('ERROR en CheckTemplate', err);
                    res.send('3');
                }
                if (result) {
                    //res.send(result)
                    //console.log("DEL IDDETALLEFACTURAPACIENTE!!!!!!!!!!!!!!!!!!!!", idDetalleFacturaPaciente)
                    //console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!", result, idDetalleFacturaPaciente, infoPaciente)
                    infoPaciente = result[0];
                    resolve(infoPaciente);
                }
            });
        })
    }
}

ordenesCtrl.verificarTomaMuestra = async (req, res) => {
    const sql = "UPDATE `tbl_orden` SET check_toma_muestra = 1 WHERE id_orden ="+req.body.id_orden;
    connection.query(sql, function (err, result, fields) {
        if (err) {
            console.log('ERROR en CheckTemplate', err);
            res.send('3');
        }
        if (result) {
            res.send("1")
        }
    });
}

ordenesCtrl.ordenesSueros = async (req, res) => {

    let ordenes;
    let idDetalleFacturaPaciente = {};
    let infoPaciente;
    i = 0;
    ordenes = await extraerOrdenes(ordenes);
    for(const item of ordenes){
        idDetalleFacturaPaciente = await extraerIdDetalleFacturaPaciente(item.id_orden, idDetalleFacturaPaciente);
        item.id_detalle_factura_paciente = idDetalleFacturaPaciente.id_detalle_factura_paciente;
        item.id_factura = idDetalleFacturaPaciente.id_factura;
        i++
    }
    i = 0;

    for(const item of ordenes){
        if(item.id_detalle_factura_paciente != 0){
            infoPaciente = await extraerInfoPaciente(item.id_detalle_factura_paciente, infoPaciente);
            //console.log("??????????????????????", infoPaciente, item);
            item.paciente_nombre = infoPaciente.paciente_nombre
            item.paciente_apellido = infoPaciente.paciente_apellido
            item.paciente_cedula = infoPaciente.paciente_cedula
        }else{
            item.paciente_nombre = "no data"
            item.paciente_apellido = "no data"
            item.paciente_cedula = "no data"
        }
        i++;
    }
    res.send(ordenes);

    async function extraerOrdenes(ordenes){
        return new Promise((resolve, reject) => {
            const sql = "SELECT id_orden, numero_orden, orden_qr, date_format(fecha, '%d-%m-%Y %T') AS fecha FROM `tbl_orden` WHERE check_toma_muestra = 1 AND check_sueros = 0 AND check_laboratorios = 0";
            connection.query(sql, function (err, result, fields) {
                if (err) {
                    console.log('ERROR en CheckTemplate', err);
                    res.send('3');
                }
                if (result) {
                    //res.send(result)
                    ordenes = result;
                    resolve(result);
                }
            });
        })
    }

    async function extraerIdDetalleFacturaPaciente(idOrden, idDetalleFacturaPaciente){
        return new Promise((resolve, reject) => {
            const sql = "SELECT tbl_detalle_orden.id_detalle_factura_paciente, tbl_detalle_factura_paciente.id_factura FROM tbl_detalle_orden LEFT JOIN tbl_detalle_factura_paciente ON tbl_detalle_factura_paciente.id_detalle_factura_paciente = tbl_detalle_orden.id_detalle_factura_paciente WHERE id_orden = '" + idOrden + "' LIMIT 1";
            connection.query(sql, function (err, result, fields) {
                if (err) {
                    console.log('ERROR en CheckTemplate', err);
                    res.send('3');
                }
                if (result) {
                    //res.send(result)
                    if(result.length == 0){
                        idDetalleFacturaPaciente.id_detalle_factura_paciente = 0;
                        idDetalleFacturaPaciente.id_factura = 0;
                        resolve(idDetalleFacturaPaciente);
                    }else{
                        idDetalleFacturaPaciente.id_detalle_factura_paciente = result[0].id_detalle_factura_paciente;
                        idDetalleFacturaPaciente.id_factura = result[0].id_factura
                        resolve(idDetalleFacturaPaciente);
                    }
                }
            });
        })
    }

    async function extraerInfoPaciente(idDetalleFacturaPaciente, infoPaciente){
        return new Promise((resolve, reject) => {
            //console.log("ALGO DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD", idDetalleFacturaPaciente)
            const sql = "SELECT tbl_detalle_factura_paciente.id_paciente, tbl_paciente.paciente_nombre, tbl_paciente.paciente_apellido, tbl_paciente.paciente_cedula FROM `tbl_detalle_factura_paciente` INNER JOIN tbl_paciente ON tbl_paciente.id_paciente = tbl_detalle_factura_paciente.id_paciente WHERE id_detalle_factura_paciente = '" + idDetalleFacturaPaciente + "'";
            connection.query(sql, function (err, result, fields) {
                if (err) {
                    console.log('ERROR en CheckTemplate', err);
                    res.send('3');
                }
                if (result) {
                    //res.send(result)
                    //console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!", result)
                    infoPaciente = result[0];
                    resolve(infoPaciente);
                }
            });
        })
    }
}

ordenesCtrl.verificarSueros = async (req, res) => {

    const sql = "UPDATE `tbl_orden` SET check_sueros = 1 WHERE id_orden ="+req.body.id_orden;
    connection.query(sql, function (err, result, fields) {
        if (err) {
            console.log('ERROR en CheckTemplate', err);
            res.send('3');
        }
        if (result) {
            res.send("1")
        }
    });
}

ordenesCtrl.ordenesLaboratorios = async (req, res) => {

    let ordenes;
    let idDetalleFacturaPaciente = {};
    let infoPaciente;
    i = 0;
    ordenes = await extraerOrdenes(ordenes);
    for(const item of ordenes){
        idDetalleFacturaPaciente = await extraerIdDetalleFacturaPaciente(item.id_orden, idDetalleFacturaPaciente);
        item.id_detalle_factura_paciente = idDetalleFacturaPaciente.id_detalle_factura_paciente;
        item.id_factura = idDetalleFacturaPaciente.id_factura;
        i++
    }
    i = 0;
    for(const item of ordenes){
        if(item.id_detalle_factura_paciente != 0){
            infoPaciente = await extraerInfoPaciente(item.id_detalle_factura_paciente, infoPaciente);
            //console.log("??????????????????????", infoPaciente, item);
            item.paciente_nombre = infoPaciente.paciente_nombre
            item.paciente_apellido = infoPaciente.paciente_apellido
            item.paciente_cedula = infoPaciente.paciente_cedula
        }else{
            item.paciente_nombre = "no data"
            item.paciente_apellido = "no data"
            item.paciente_cedula = "no data"
        }
        i++;
    }
    res.send(ordenes);

    async function extraerOrdenes(ordenes){
        return new Promise((resolve, reject) => {
            const sql = "SELECT id_orden, numero_orden, orden_qr, date_format(fecha, '%d-%m-%Y %T') AS fecha FROM `tbl_orden` WHERE check_toma_muestra = 1 AND check_sueros = 1 AND check_laboratorios = 0";
            connection.query(sql, function (err, result, fields) {
                if (err) {
                    console.log('ERROR en CheckTemplate', err);
                    res.send('3');
                }
                if (result) {
                    //res.send(result)
                    ordenes = result;
                    resolve(result);
                }
            });
        })
    }

    async function extraerIdDetalleFacturaPaciente(idOrden, idDetalleFacturaPaciente){
        return new Promise((resolve, reject) => {
            const sql = "SELECT tbl_detalle_orden.id_detalle_factura_paciente, tbl_detalle_factura_paciente.id_factura FROM tbl_detalle_orden LEFT JOIN tbl_detalle_factura_paciente ON tbl_detalle_factura_paciente.id_detalle_factura_paciente = tbl_detalle_orden.id_detalle_factura_paciente WHERE id_orden = '" + idOrden + "' LIMIT 1";
            connection.query(sql, function (err, result, fields) {
                if (err) {
                    console.log('ERROR en CheckTemplate', err);
                    res.send('3');
                }
                if (result) {
                    //res.send(result)
                    if(result.length == 0){
                        idDetalleFacturaPaciente.id_detalle_factura_paciente = 0;
                        idDetalleFacturaPaciente.id_factura = 0;
                        resolve(idDetalleFacturaPaciente);
                    }else{
                        idDetalleFacturaPaciente.id_detalle_factura_paciente = result[0].id_detalle_factura_paciente;
                        idDetalleFacturaPaciente.id_factura = result[0].id_factura
                        resolve(idDetalleFacturaPaciente);
                    }
                }
            });
        })
    }

    async function extraerInfoPaciente(idDetalleFacturaPaciente, infoPaciente){
        return new Promise((resolve, reject) => {
            const sql = "SELECT tbl_detalle_factura_paciente.id_paciente, tbl_paciente.paciente_nombre, tbl_paciente.paciente_apellido, tbl_paciente.paciente_cedula FROM `tbl_detalle_factura_paciente` INNER JOIN tbl_paciente ON tbl_paciente.id_paciente = tbl_detalle_factura_paciente.id_paciente WHERE id_detalle_factura_paciente = '" + idDetalleFacturaPaciente + "'";
            connection.query(sql, function (err, result, fields) {
                if (err) {
                    console.log('ERROR en CheckTemplate', err);
                    res.send('3');
                }
                if (result) {
                    //res.send(result)
                    infoPaciente = result[0];
                    resolve(infoPaciente);
                }
            });
        })
    }
}

ordenesCtrl.verificarLaboratorios = async (req, res) => {

    const sql = "UPDATE `tbl_orden` SET check_laboratorios = 1 WHERE id_orden ="+req.body.id_orden;
    connection.query(sql, function (err, result, fields) {
        if (err) {
            console.log('ERROR en CheckTemplate', err);
            res.send('3');
        }
        if (result) {
            res.send("1")
        }
    });
}

ordenesCtrl.ordenesVerificadas = async (req, res) => {

    let ordenes;
    let idDetalleFacturaPaciente;
    let infoPaciente;
    i = 0;
    ordenes = await extraerOrdenes(ordenes);
    for(const item of ordenes){
        idDetalleFacturaPaciente = await extraerIdDetalleFacturaPaciente(item.id_orden, idDetalleFacturaPaciente);
        item.id_detalle_factura_paciente = idDetalleFacturaPaciente;
        i++
    }
    i = 0;
    for(const item of ordenes){
        if(item.id_detalle_factura_paciente != 0){
            infoPaciente = await extraerInfoPaciente(item.id_detalle_factura_paciente, infoPaciente);
            //console.log("??????????????????????", infoPaciente, item);
            item.paciente_nombre = infoPaciente.paciente_nombre
            item.paciente_apellido = infoPaciente.paciente_apellido
            item.paciente_cedula = infoPaciente.paciente_cedula
        }else{
            item.paciente_nombre = "no data"
            item.paciente_apellido = "no data"
            item.paciente_cedula = "no data"
        }
        i++;
    }
    res.send(ordenes);

    async function extraerOrdenes(ordenes){
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM `tbl_orden` WHERE check_toma_muestra = 1 AND check_sueros = 1 AND check_laboratorios = 1";
            connection.query(sql, function (err, result, fields) {
                if (err) {
                    console.log('ERROR en CheckTemplate', err);
                    res.send('3');
                }
                if (result) {
                    //res.send(result)
                    ordenes = result;
                    resolve(result);
                }
            });
        })
    }

    async function extraerIdDetalleFacturaPaciente(idOrden, idDetalleFacturaPaciente){
        return new Promise((resolve, reject) => {
            const sql = "SELECT id_detalle_factura_paciente FROM tbl_detalle_orden WHERE id_orden = '" + idOrden + "' LIMIT 1";
            connection.query(sql, function (err, result, fields) {
                if (err) {
                    console.log('ERROR en CheckTemplate', err);
                    res.send('3');
                }
                if (result) {
                    //res.send(result)
                    if(result.length == 0){
                        idDetalleFacturaPaciente = 0;
                        resolve(idDetalleFacturaPaciente);
                    }else{
                        idDetalleFacturaPaciente = result[0].id_detalle_factura_paciente;
                        resolve(idDetalleFacturaPaciente);
                    }
                }
            });
        })
    }

    async function extraerInfoPaciente(idDetalleFacturaPaciente, infoPaciente){
        return new Promise((resolve, reject) => {
            const sql = "SELECT tbl_detalle_factura_paciente.id_paciente, tbl_paciente.paciente_nombre, tbl_paciente.paciente_apellido, tbl_paciente.paciente_cedula FROM `tbl_detalle_factura_paciente` INNER JOIN tbl_paciente ON tbl_paciente.id_paciente = tbl_detalle_factura_paciente.id_paciente WHERE id_detalle_factura_paciente = '" + idDetalleFacturaPaciente + "'";
            connection.query(sql, function (err, result, fields) {
                if (err) {
                    console.log('ERROR en CheckTemplate', err);
                    res.send('3');
                }
                if (result) {
                    //res.send(result)
                    infoPaciente = result[0];
                    resolve(infoPaciente);
                }
            });
        })
    }
}

ordenesCtrl.enviarTipoBusquedaOrdenes = async (req, res) => {
    //console.log('EL REQ', req.body)
    const sql = "SELECT * FROM `tbl_tipo_busqueda_ordenes`";
    connection.query(sql, function (err, result, fields) {
        if (err) {
            console.log('ERROR en CheckTemplate', err);
            res.send('3');
        }
        if (result) {
            res.send(result)
        }
    });
}

ordenesCtrl.buscarOrden = async (req, res) => {
    //console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!', req.body, '!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
    const sql = "SELECT id_orden, numero_orden, orden_qr_nube, date_format(fecha,'%d-%m-%Y %T') AS fecha FROM `tbl_orden` WHERE id_orden='" + req.body.id_orden + "' OR orden_qr='" + req.body.orden_qr + "'";
    //console.log("@@@@@@@@@@@@@@@@@@@@@2", sql)
    console.log("DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD", req.body.id_orden)
    let idPaciente;
    //console.log(sql)
    connection.query(sql, function (err, result, fields) {
        if (err) {
            console.log('ERROR en CheckTemplate', err);
            res.send('3');
        }
        if (result) {
            if(result.length == 0){
                res.send('3');
            }else{
                console.log("RESULT", result)
                let idOrden = result[0].id_orden;
                let arrayAux = result[0].fecha.split(" ")
                fechaSinT = arrayAux[0];
                req.body.numero_orden = result[0].numero_orden;
                req.body.orden_qr_nube = result[0].orden_qr_nube
                req.body.fecha = result[0].fecha;
                req.body.fechaSinT = fechaSinT;
                req.body.id_orden = result[0].id_orden;
                detallesOrden(idOrden)
                //res.send(result)
            }
        }
    });

    async function detallesOrden(idOrden, numero_orden, fecha) {
        const sql = "SELECT tbl_detalle_orden.id_detalle_factura_paciente, tbl_detalle_orden.id_detalle_orden, tbl_detalle_orden.id_usuario, tbl_detalle_orden.id_usuario_modificado, tbl_detalle_orden.comentario, tbl_detalle_orden.cultivo_montado, tbl_detalle_factura_paciente.nombre_especifico FROM `tbl_detalle_orden` LEFT JOIN tbl_detalle_factura_paciente ON tbl_detalle_factura_paciente.id_detalle_factura_paciente = tbl_detalle_orden.id_detalle_factura_paciente WHERE id_orden='" + idOrden + "'";
        connection.query(sql, function (err, result, fields) {
            if (err) {
                //console.log('ERROR en CheckTemplate', err);
                res.send('3');
            }
            if (result) {
                let idDetalleFacturaPaciente = result;
                let i = 0;
                let maximo = result.length;
                let cultivosExamenesId = [];
                //console.log('LOL', idDetalleFacturaPaciente)

                //res.send(result)
                examenesCultivos(idDetalleFacturaPaciente, i, maximo, cultivosExamenesId)
            }
        });
    }

    async function examenesCultivos(idDetalleFacturaPaciente, i, maximo, cultivosExamenesId) {
        //console.log('ZZZZZZZZZZZZZZZZZZZZ', idDetalleFacturaPaciente, i, maximo)
        const sql = "SELECT id_examen, id_cultivo, id_paciente, nombre_especifico FROM `tbl_detalle_factura_paciente` WHERE id_detalle_factura_paciente='" + idDetalleFacturaPaciente[i].id_detalle_factura_paciente + "'";
        connection.query(sql, function (err, result, fields) {
            if (err) {
                //console.log('ERROR en CheckTemplate', err);
                res.send('3');
            }
            if (result) {
                //console.log('NUMERO', i)
                //console.log('!!!!!!!!!!!!!!!!!!!!', result)
                //res.send(result)
                idPaciente = result[0].id_paciente;
                if (result[0].id_examen == null) {
                    //console.log('EN A:',result[0].id_cultivo)
                    cultivosExamenesId.push({
                        id_cultivo: result[0].id_cultivo,
                        //id_paciente: result[0].id_paciente
                    })
                    //console.log('CULTIVO:',cultivosExamenesId[i])
                } else {
                    //console.log('EN B:',result[0].id_examen)
                    cultivosExamenesId.push({
                        id_examen: result[0].id_examen,
                        //id_paciente: result[0].id_paciente
                        //id_detalle_orden: idDetalleFacturaPaciente[i].id_detalle_orden
                    })
                    //console.log('EXAMENNNNNNNNNNNNN:',cultivosExamenesId, idDetalleFacturaPaciente[i].id_detalle_orden)
                    //console.log('EXAMENNNNNNNNNNNNN:',cultivosExamenesId)
                }
                if (i == maximo - 1) {
                    let i = 0;
                    let maximo = cultivosExamenesId.length;
                    let pruebas = [];
                    let cultivos = [];
                    let cultivosRes = [];
                    pruebasYBacterias(cultivosExamenesId, i, maximo, pruebas, cultivos, cultivosRes, idDetalleFacturaPaciente);

                } else {
                    i++;
                    //console.log(i) 
                    examenesCultivos(idDetalleFacturaPaciente, i, maximo, cultivosExamenesId);
                }
            }
        });
    }

    async function pruebasYBacterias(cultivosExamenesId, i, maximo, pruebas, cultivos, cultivosRes, idDetalleFacturaPaciente) {
        //console.log('cuanto es i?', i, maximo -1)
        //console.log('EJEMMMMM', cultivos)
        if (i == maximo) {
            let departamentos = [];
            let departamentosFiltadros = [];
            let departamento = '';
            let aux = [];
            let depJson = [];
            let auxNUM = 0;
            let numPruebas = 0;
            //console.log('UTVHHHHHHHHHHHHHHHHH', cultivos)
            for (let i = 0; i < pruebas.length; i++) {
                //console.log(pruebas[i].departamento_nombre)
                departamentos[i] = pruebas[i].departamento_nombre;
            }
            //console.log('sin filtrar', departamentos);
            for (let i = 0; i < departamentos.length; i++) {
                //console.log('POSICION i', departamentosFiltadros[i])
                if (departamentos[i] != null) {
                    departamento = departamentos[i];
                    //console.log('DEPARTAMENTO', departamento)
                    departamentosFiltadros[auxNUM] = departamento;
                    auxNUM++;
                }
                for (let j = 0; j < departamentos.length; j++) {
                    if (departamentos[j] == departamento) {
                        departamentos[j] = null;
                    }
                }
            }
            //console.log('filtrado', departamentosFiltadros)
            for (let i = 0; i < departamentosFiltadros.length; i++) {
                //console.log(departamentosFiltadros[i])
                departamento = departamentosFiltadros[i]
                for (let j = 0; j < pruebas.length; j++) {
                    if (departamento == pruebas[j].departamento_nombre) {
                        aux.push({
                            examen: pruebas[j]
                        })
                    }
                }
                //console.log('EL AUX!!', aux)
                if (departamento == 'PRUEBAS ESPECIALES') {
                    departamento = 'PRUEBAS_ESPECIALES'
                }
                //depJson[departamento] = aux;
                depJson.push({
                    departamento_nombre: departamento,
                    examenes: aux
                })
                aux = [];
            }

            for (let i = 0; i < pruebas.length; i++) {
                numPruebas = numPruebas + pruebas[i].pruebas.length
            }

            //console.log('EL LENGTH', numPruebas)


            //console.log('EL DEPJSON', depJson)

            //console.log('EL ID PACIENTE', idPaciente)
            const sql = "SELECT * FROM tbl_paciente WHERE id_paciente='" + idPaciente + "'";
            let resultF;
            connection.query(sql, function (err, result, fields) {
                if (err) {
                    console.log('ERROR en CheckTemplate', err);
                    res.send('3');
                }
                if (result) {
                    //console.log('AAAAAAAAAAAAAAAAAA', result)
                    resultF = result;
                    ////////////////////////////////////////////////
                    const sql = "SELECT tbl_factura.id_cliente, tbl_cliente.id_tipo_cliente, tbl_tipo_cliente.tipo_nombre FROM tbl_factura INNER JOIN tbl_cliente ON tbl_factura.id_cliente = tbl_cliente.id_cliente INNER JOIN tbl_tipo_cliente ON tbl_tipo_cliente.id_tipo_cliente = tbl_cliente.id_tipo_cliente WHERE tbl_factura.id_factura='" + req.body.id_factura + "'";
                    connection.query(sql, function (err, result, fields) {
                        if (err) {
                            console.log('ERROR en CheckTemplate', err);
                            res.send('3');
                        }
                        if (result) {
                            let detalle_orden = {
                                numero_orden: req.body.numero_orden,
                                orden_qr_nube: req.body.orden_qr_nube,
                                fecha: req.body.fecha,
                                fechaSinT: req.body.fechaSinT,
                                id_orden: req.body.id_orden
                            }
                            let examenesCultivosVar = {
                                //numero_de_pruebas: numPruebas,
                                detalle_orden: detalle_orden,
                                cliente: result[0],
                                paciente: resultF,
                                departamentos: depJson,
                                cultivos: cultivos,
                                cultivosRes: cultivosRes
                            }
                            for(const departamentos of examenesCultivosVar.departamentos){
                                for(const examen of departamentos.examenes){
                                    //console.log("!!!!!!!!!!!!!!", examen.examen.id_examen)
                                    if(examen.examen.id_examen == 232){
                                        //console.log("????????????", examen.examen.pruebas.id_prueba)
                                        for(const prueba of examen.examen.pruebas){
                                            //console.log("????????????", prueba.id_prueba)
                                        }
                                    }
                                }
                            }
                            res.send(examenesCultivosVar)
                        }
                    })
                }
            });
        } else {

            let key = Object.keys(cultivosExamenesId[i]).toString();
            //console.log("!!!!!!!!!!!!!!!!!!!!!!", key)
            //cultivosExamenesId[i].id_examen
            //console.log('LOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOL',cultivosExamenesId[i])
            if (key == "id_examen") {
                //console.log('EN CUAL SE TRANCA?', cultivosExamenesId[i].id_examen);
                //console.log('PINGA', i, idDetalleFacturaPaciente[i], idDetalleFacturaPaciente.length)
                const sql = "SELECT tbl_detalle_examen_prueba.id_prueba, tbl_detalle_examen_prueba.id_detalle_examen_prueba, tbl_prueba.prueba_nombre, tbl_prueba.tipo_de_campo, tbl_prueba.valor_de_referencia, tbl_prueba.prueba_unidad, tbl_examen.examen_nombre, tbl_examen.examen_referencia, tbl_examen.id_examen, tbl_departamento.departamento_nombre FROM `tbl_detalle_examen_prueba` INNER JOIN `tbl_prueba` ON tbl_prueba.id_prueba = tbl_detalle_examen_prueba.id_prueba INNER JOIN `tbl_examen` ON tbl_examen.id_examen = tbl_detalle_examen_prueba.id_examen INNER JOIN `tbl_departamento` ON tbl_examen.id_departamento = tbl_departamento.id_departamento WHERE tbl_detalle_examen_prueba.id_examen='" + cultivosExamenesId[i].id_examen + "' AND tbl_detalle_examen_prueba.estatus = 1";
                let resultadoExamen;
                //console.log('cuanto es maximo?', maximo)
                connection.query(sql, async function (err, result, fields) {
                    if (err) {
                        console.log('ERROR en CheckTemplate', err);
                        res.send('3');
                    }
                    if (result) {
                        //console.log('AAAAAAAAAAAAAAAAAA', result)
                        let pruebasAux = [];

                        //console.log('ANTES!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!', result)
                        for (let x = 0; x < result.length; x++) {
                            //console.log('ooooo');
                            resultadoExamen = await buscarResultadoExamen(result[x].id_detalle_examen_prueba, idDetalleFacturaPaciente[i].id_detalle_orden, resultadoExamen)
                            //console.log('/////////////////////////////////////////////////////RESULTADO EXAMEN', resultadoExamen, result[x].id_examen)
                            if(resultadoExamen == null || resultadoExamen == 'null'){
                                pruebasAux.push({
                                    id_examen: result[x].id_examen,
                                    id_prueba: result[x].id_prueba,
                                    id_detalle_examen_prueba: result[x].id_detalle_examen_prueba,
                                    prueba_nombre: result[x].prueba_nombre,
                                    valor_de_referencia: result[x].valor_de_referencia,
                                    unidad: result[x].prueba_unidad,
                                    tipo_de_campo: result[x].tipo_de_campo,
                                    resultado: resultadoExamen
                                })
                            }else{
                                if(resultadoExamen.valor_referencia == null || resultadoExamen.valor_referencia == 'null'){
                                    pruebasAux.push({
                                        id_examen: result[x].id_examen,
                                        id_prueba: result[x].id_prueba,
                                        id_detalle_examen_prueba: result[x].id_detalle_examen_prueba,
                                        prueba_nombre: result[x].prueba_nombre,
                                        valor_de_referencia: result[x].valor_de_referencia,
                                        unidad: result[x].prueba_unidad,
                                        tipo_de_campo: result[x].tipo_de_campo,
                                        resultado: resultadoExamen.resultado
                                    })
                                }else{
                                    pruebasAux.push({
                                        id_examen: result[x].id_examen,
                                        id_prueba: result[x].id_prueba,
                                        id_detalle_examen_prueba: result[x].id_detalle_examen_prueba,
                                        prueba_nombre: result[x].prueba_nombre,
                                        valor_de_referencia: resultadoExamen.valor_referencia,
                                        unidad: result[x].prueba_unidad,
                                        tipo_de_campo: result[x].tipo_de_campo,
                                        resultado: resultadoExamen.resultado
                                    })
                                }
                            }
                        }
                        //console.log('/////////////////////////////////////////////////////', resultadoExamen, result)
                        if(result.length == 0){
                            pruebas.push({
                                id_examen: "no data",
                            examen_nombre: "no data",
                            examen_referencia: "no data",
                            comentario: "no data",
                            departamento_nombre: "no data",
                            id_detalle_orden: "no data",
                            id_usuario: "no data",
                            id_usuario_modificado: "no data",
                            pruebas: "no data"
                            });
                        }else{
                            pruebas.push({
                                id_examen: result[0].id_examen,
                                examen_nombre: result[0].examen_nombre,
                                examen_nombre_especifico: idDetalleFacturaPaciente[i].nombre_especifico,
                                examen_referencia: result[0].examen_referencia,
                                comentario: idDetalleFacturaPaciente[i].comentario,
                                departamento_nombre: result[0].departamento_nombre,
                                id_detalle_orden: idDetalleFacturaPaciente[i].id_detalle_orden,
                                id_usuario: idDetalleFacturaPaciente[i].id_usuario,
                                id_usuario_modificado: idDetalleFacturaPaciente[i].id_usuario_modificado,
                                cultivo_montado: idDetalleFacturaPaciente[i].cultivo_montado,
                                pruebas: pruebasAux
                            });
                        }
                        //console.log('X', pruebas)
                        //examenesCultivos(idDetalleFacturaPaciente, i, maximo, cultivosExamenesId)
                        //console.log('!x1!!!!!!!!!!!Zzzzzzz!!!!!!!!!', i++)
                        i++
                        pruebasYBacterias(cultivosExamenesId, i, maximo, pruebas, cultivos, cultivosRes, idDetalleFacturaPaciente)
                    }
                });
            } else if (key == "id_cultivo") {
                //console.log('PINGA', i, idDetalleFacturaPaciente[i], idDetalleFacturaPaciente.length)
                //console.log('PINGA', i, idDetalleFacturaPaciente[0].id_detalle_orden, idDetalleFacturaPaciente.length)
                //console.log('ENTROOOOOOOO', i)
                //const sql = "SELECT id_cultivo, cultivo_codigo, cultivo_nombre FROM `tbl_cultivo` WHERE id_cultivo='"+cultivosExamenesId[i].id_cultivo+"'";
                //console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX", cultivosExamenesId[i].id_cultivo, "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
                const sql = "SELECT tbl_detalle_cultivo_bacteria_antibiotico.id_cultivo, tbl_detalle_cultivo_bacteria_antibiotico.id_detalle_cultivo_bacteria_antibiotico, tbl_cultivo.cultivo_codigo, tbl_cultivo.cultivo_nombre, tbl_bacteria.id_bacteria, tbl_bacteria.bacteria_nombre, tbl_antibiotico.id_antibiotico, tbl_antibiotico.antibiotico_nombre FROM `tbl_detalle_cultivo_bacteria_antibiotico` INNER JOIN tbl_bacteria ON tbl_bacteria.id_bacteria = tbl_detalle_cultivo_bacteria_antibiotico.id_bacteria INNER JOIN tbl_antibiotico ON tbl_antibiotico.id_antibiotico = tbl_detalle_cultivo_bacteria_antibiotico.id_antibiotico INNER JOIN tbl_cultivo ON tbl_cultivo.id_cultivo = tbl_detalle_cultivo_bacteria_antibiotico.id_cultivo WHERE tbl_detalle_cultivo_bacteria_antibiotico.id_cultivo='" + cultivosExamenesId[i].id_cultivo + "' AND tbl_detalle_cultivo_bacteria_antibiotico.estatus = 1 ORDER BY tbl_bacteria.bacteria_nombre ASC";
                //console.log('ENVEVIIIIDOOOOOOOOO', cultivosExamenesId[i].id_cultivo)
                //console.log('cuanto es maximo?', maximo)
                let bacterias = [];
                let bacteriasRes = [];
                let antibioticos = [];
                let idCultivo = 0;
                let idBacteria = 0;
                let idAntibiotico = 0;
                let resultadoCultivo;
                connection.query(sql, async function (err, result, fields) {
                    if (err) {
                        console.log('ERROR en CheckTemplate', err);
                        res.send('3');
                    }
                    if (result) {
                        //console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!", result)
                        //console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX", cultivos)
                        //for(let x=0; x<result.length; x++){
                        //console.log('ooooo');
                        let bandera = 0;
                        for (let a = 0; a < result.length; a++) {
                            if (result[a].id_bacteria != null) {
                                idBacteria = result[a].id_bacteria;
                                //console.log("LA BACTERIA EN A", result[a].id_bacteria)
                                //cultivos.bacterias = bacterias;

                                for (let b = 0; b < result.length; b++) {
                                    
                                    if (result[b].id_bacteria == idBacteria) {
                                       // console.log("LA BACTERIA EN a", result[a].id_bacteria)
                                       // console.log("LA BACTERIA EN b", result[b].id_bacteria)
                                        resultadoCultivo = await buscarResultadoCultivo(result[b].id_detalle_cultivo_bacteria_antibiotico, idDetalleFacturaPaciente[i].id_detalle_orden, resultadoCultivo);
                                        //console.log("////////////////////////////////////////////RESULTADO CULTIVO", resultadoCultivo)
                                        if(resultadoCultivo != null){
                                            bandera = 1;
                                        }
                                        if(resultadoCultivo == null)
                                        {
                                            resultadoCultivo = {
                                                id_resultado: null,
                                                resultado: null
                                            }
                                        }
                                        
                                        antibioticos.push({
                                            id_antibiotico: result[b].id_antibiotico,
                                            antibiotico_nombre: result[b].antibiotico_nombre,
                                            id_detalle_cultivo_bacteria_antibiotico: result[b].id_detalle_cultivo_bacteria_antibiotico,
                                            resultado: resultadoCultivo.resultado,
                                            id_resultado: resultadoCultivo.id_resultado
                                        })
                                        //console.log("PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP", resultadoCultivo)
                                        result[b].id_bacteria = null;
                                    }
                                    //console.log('RESULT!!!!!!!!!!!!!!!!', result);
                                }
                                //console.log("EL RESULTADOCULTIVO1111111111111111111111111111111111111", resultadoCultivo)
                                if (bandera == 1) {
                                    console.log("PASO?????", resultadoCultivo)
                                    //console.log("00000000000000000000000000000000000000000000000000000000000000000000")
                                    bacteriasRes.push({
                                        id_bacteria: idBacteria,
                                        bacteria_nombre: result[a].bacteria_nombre,
                                        id_detalle_bacteria_antibiotico: result[a].id_detalle_bacteria_antibiotico,
                                        antibioticos: antibioticos
                                    })
                                    //console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!bacteriares", bacteriasRes)
                                } else {
                                    bacteriasRes.push({
                                        nulo: null
                                    });
                                }
                                bacterias.push({
                                    id_bacteria: idBacteria,
                                    bacteria_nombre: result[a].bacteria_nombre,
                                    id_detalle_bacteria_antibiotico: result[a].id_detalle_bacteria_antibiotico,
                                    antibioticos: antibioticos
                                })
                                
                                //console.log("LA BACTERIA EN A", result[a].id_bacteria)
                                //console.log("LOS ANTIBIOTICOS", antibioticos);
                                antibioticos = []
                                bandera = 0
                            }
                        }
                        //console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX", result)
                        //}

                        cultivos.push({
                            id_cultivo: result[0].id_cultivo,
                            cultivo_nombre: result[0].cultivo_nombre,
                            cultivo_nombre_especifico: idDetalleFacturaPaciente[i].nombre_especifico,
                            id_detalle_orden: idDetalleFacturaPaciente[i].id_detalle_orden,
                            comentario: idDetalleFacturaPaciente[i].comentario,
                            cultivo_montado: idDetalleFacturaPaciente[i].cultivo_montado,
                            bacterias: bacterias,
                            bacteriasRes: bacteriasRes,
                            id_usuario: idDetalleFacturaPaciente[i].id_usuario,
                            id_usuario_modificado: idDetalleFacturaPaciente[i].id_usuario_modificado,
                        })
                        /*if(resultadoCultivo != null){
                            
                            cultivosRes.push({
                                id_cultivo: result[0].id_cultivo,
                                cultivo_nombre: result[0].cultivo_nombre,
                                id_detalle_orden: idDetalleFacturaPaciente[i].id_detalle_orden,
                                comentario: idDetalleFacturaPaciente[i].comentario,
                                bacterias: bacterias,
                                id_usuario: idDetalleFacturaPaciente[i].id_usuario,
                                id_usuario_modificado: idDetalleFacturaPaciente[i].id_usuario_modificado,
                            })
                        }*/
                        i++

                        pruebasYBacterias(cultivosExamenesId, i, maximo, pruebas, cultivos, cultivosRes, idDetalleFacturaPaciente)
                    }
                });
            }
        }
    }
    

    async function buscarResultadoExamen(idDetalleExamenPrueba, idDetalleOrden, resultadoExamen) {
        return new Promise((resolve, reject) => {
            //console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX", idDetalleOrden, resultadoExamen)
            const sql = "SELECT resultado, valor_referencia FROM tbl_resultado WHERE id_detalle_orden= '" + idDetalleOrden + "' AND id_detalle_examen_prueba ='" + idDetalleExamenPrueba + "'"
            connection.query(sql, function (err, result, fields) {
                if (err) {
                    console.log('ERROR en CheckTemplate', err);
                    res.send('3');
                }
                if (result) {
                    if (result.length == 0 || result[0].resultado == 'null') {
                        resultadoExamen = null;
                    } else {
                        resultadoExamen = result[0]
                    }
                    //console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX", idDetalleOrden, resultadoExamen)
                    resolve(resultadoExamen)
                }
            });
        });
    }

    async function buscarResultadoCultivo(idDetalleCultivoBacteriaAntibiotico, idDetalleOrden, resultadoCultivo) {
        return new Promise((resolve, reject) => {
            const sql = "SELECT id_resultado, resultado FROM tbl_resultado WHERE id_detalle_orden= '" + idDetalleOrden + "' AND id_detalle_cultivo_bacteria_antibiotico ='" + idDetalleCultivoBacteriaAntibiotico + "'"
            connection.query(sql, function (err, result, fields) {
                if (err) {
                    console.log('ERROR en CheckTemplate', err);
                    res.send('3');
                }
                if (result) {
                    if (result.length == 0 || result[0].resultado == 'null') {
                        resultadoCultivo = null;
                    } else {
                        resultadoCultivo = result[0]
                    }
                    //console.log("EL RESULTADOCULTIVO!!!!!!!!!!!", resultadoCultivo, idDetalleCultivoBacteriaAntibiotico, idDetalleOrden)
                    resolve(resultadoCultivo)
                }
            });
        });
    }

}

ordenesCtrl.buscarOrdenDepHematologia = async (req, res) => {
    let detallesFacturaPaciente;
    detallesFacturaPaciente = await buscarDetallesFactura();
    res.send(detallesFacturaPaciente)

    async function buscarDetallesFactura() {
        return new Promise((resolve, reject) => {
            sql = "SELECT tbl_orden.id_orden, tbl_orden.numero_orden, tbl_orden.check_toma_muestra, tbl_orden.check_sueros, tbl_orden.check_laboratorios, date_format(fecha,'%Y-%m-%d') AS fecha, tbl_detalle_orden.id_detalle_factura_paciente, tbl_detalle_orden.id_usuario, tbl_examen.id_examen, tbl_examen.id_departamento AS departamento_examen, tbl_cultivo.id_cultivo, tbl_cultivo.id_departamento AS departamento_cultivo, tbl_paciente.id_paciente, tbl_paciente.paciente_nombre, tbl_paciente.paciente_apellido, tbl_paciente.paciente_cedula FROM tbl_orden LEFT JOIN tbl_detalle_orden ON tbl_detalle_orden.id_orden = tbl_orden.id_orden LEFT JOIN tbl_detalle_factura_paciente ON tbl_detalle_orden.id_detalle_factura_paciente = tbl_detalle_factura_paciente.id_detalle_factura_paciente LEFT JOIN tbl_examen ON tbl_examen.id_examen = tbl_detalle_factura_paciente.id_examen LEFT JOIN tbl_cultivo ON tbl_cultivo.id_cultivo = tbl_detalle_factura_paciente.id_cultivo LEFT JOIN tbl_paciente ON tbl_paciente.id_paciente = tbl_detalle_factura_paciente.id_paciente WHERE ((tbl_orden.check_toma_muestra = 1 AND tbl_orden.check_sueros = 1 AND tbl_orden.check_laboratorios = 0) AND (tbl_detalle_orden.id_usuario IS NULL) AND (tbl_examen.id_departamento = 5 OR tbl_examen.id_departamento = 1 OR tbl_cultivo.id_departamento = 5 OR tbl_cultivo.id_departamento = 1)) GROUP BY id_orden"
            connection.query(sql, function (err, result, fields) {
                if (err) {
                    console.log('ERROR en CheckTemplate', err);
                    res.send('3');
                }
                if (result) {
                    resolve(result);
                }
            });
        })
    }
}

ordenesCtrl.buscarOrdenDepBioquimica = async (req, res) => {

    let detallesFacturaPaciente;
    detallesFacturaPaciente = await buscarDetallesFactura();
    res.send(detallesFacturaPaciente)

    async function buscarDetallesFactura() {
        return new Promise((resolve, reject) => {
            sql = "SELECT tbl_orden.id_orden, tbl_orden.numero_orden, tbl_orden.check_toma_muestra, tbl_orden.check_sueros, tbl_orden.check_laboratorios, date_format(fecha,'%Y-%m-%d') AS fecha, tbl_detalle_orden.id_detalle_factura_paciente, tbl_detalle_orden.id_usuario, tbl_examen.id_examen, tbl_examen.id_departamento AS departamento_examen, tbl_cultivo.id_cultivo, tbl_cultivo.id_departamento AS departamento_cultivo, tbl_paciente.id_paciente, tbl_paciente.paciente_nombre, tbl_paciente.paciente_apellido, tbl_paciente.paciente_cedula FROM tbl_orden LEFT JOIN tbl_detalle_orden ON tbl_detalle_orden.id_orden = tbl_orden.id_orden LEFT JOIN tbl_detalle_factura_paciente ON tbl_detalle_orden.id_detalle_factura_paciente = tbl_detalle_factura_paciente.id_detalle_factura_paciente LEFT JOIN tbl_examen ON tbl_examen.id_examen = tbl_detalle_factura_paciente.id_examen LEFT JOIN tbl_cultivo ON tbl_cultivo.id_cultivo = tbl_detalle_factura_paciente.id_cultivo LEFT JOIN tbl_paciente ON tbl_paciente.id_paciente = tbl_detalle_factura_paciente.id_paciente WHERE ((tbl_orden.check_toma_muestra = 1 AND tbl_orden.check_sueros = 1 AND tbl_orden.check_laboratorios = 0) AND (tbl_detalle_orden.id_usuario IS NULL) AND (tbl_examen.id_departamento = 3 OR tbl_examen.id_departamento = 7 OR tbl_examen.id_departamento = 8 OR tbl_examen.id_departamento = 6 OR tbl_cultivo.id_departamento = 3 OR tbl_cultivo.id_departamento = 7 OR tbl_cultivo.id_departamento = 8 OR tbl_cultivo.id_departamento = 6)) GROUP BY id_orden"
            connection.query(sql, function (err, result, fields) {
                if (err) {
                    console.log('ERROR en CheckTemplate', err);
                    res.send('3');
                }
                if (result) {
                    resolve(result);
                }
            });
        })
    }
}

ordenesCtrl.buscarOrdenDepEspeciales = async (req, res) => {

    let detallesFacturaPaciente;
    detallesFacturaPaciente = await buscarDetallesFactura();
    res.send(detallesFacturaPaciente)

    async function buscarDetallesFactura() {
        return new Promise((resolve, reject) => {
            sql = "SELECT tbl_orden.id_orden, tbl_orden.numero_orden, tbl_orden.check_toma_muestra, tbl_orden.check_sueros, tbl_orden.check_laboratorios, date_format(fecha,'%Y-%m-%d') AS fecha, tbl_detalle_orden.id_detalle_factura_paciente, tbl_detalle_orden.id_usuario, tbl_examen.id_examen, tbl_examen.id_departamento AS departamento_examen, tbl_cultivo.id_cultivo, tbl_cultivo.id_departamento AS departamento_cultivo, tbl_paciente.id_paciente, tbl_paciente.paciente_nombre, tbl_paciente.paciente_apellido, tbl_paciente.paciente_cedula FROM tbl_orden LEFT JOIN tbl_detalle_orden ON tbl_detalle_orden.id_orden = tbl_orden.id_orden LEFT JOIN tbl_detalle_factura_paciente ON tbl_detalle_orden.id_detalle_factura_paciente = tbl_detalle_factura_paciente.id_detalle_factura_paciente LEFT JOIN tbl_examen ON tbl_examen.id_examen = tbl_detalle_factura_paciente.id_examen LEFT JOIN tbl_cultivo ON tbl_cultivo.id_cultivo = tbl_detalle_factura_paciente.id_cultivo LEFT JOIN tbl_paciente ON tbl_paciente.id_paciente = tbl_detalle_factura_paciente.id_paciente WHERE ((tbl_orden.check_toma_muestra = 1 AND tbl_orden.check_sueros = 1 AND tbl_orden.check_laboratorios = 0) AND (tbl_detalle_orden.id_usuario IS NULL) AND (tbl_examen.id_departamento = 9 OR tbl_examen.id_departamento = 2 OR tbl_cultivo.id_departamento = 9 OR tbl_cultivo.id_departamento = 2)) GROUP BY id_orden"
            connection.query(sql, function (err, result, fields) {
                if (err) {
                    console.log('ERROR en CheckTemplate', err);
                    res.send('3');
                }
                if (result) {
                    resolve(result);
                }
            });
        })
    }
}

ordenesCtrl.buscarOrdenDepBacteriologia = async (req, res) => {

    let detallesFacturaPaciente;
    detallesFacturaPaciente = await buscarDetallesFactura();
    res.send(detallesFacturaPaciente)

    async function buscarDetallesFactura() {
        return new Promise((resolve, reject) => {
            //sql = "SELECT tbl_orden.id_orden, tbl_orden.numero_orden, tbl_orden.check_toma_muestra, tbl_orden.check_sueros, tbl_orden.cultivos_montados, tbl_orden.check_laboratorios, date_format(fecha,'%Y-%m-%d') AS fecha, tbl_detalle_orden.id_detalle_factura_paciente, tbl_detalle_orden.cultivo_montado, tbl_detalle_orden.id_usuario, tbl_examen.id_examen, tbl_examen.id_departamento AS departamento_examen, tbl_cultivo.id_cultivo, tbl_cultivo.id_departamento AS departamento_cultivo, tbl_paciente.id_paciente, tbl_paciente.paciente_nombre, tbl_paciente.paciente_apellido, tbl_paciente.paciente_cedula FROM tbl_orden LEFT JOIN tbl_detalle_orden ON tbl_detalle_orden.id_orden = tbl_orden.id_orden LEFT JOIN tbl_detalle_factura_paciente ON tbl_detalle_orden.id_detalle_factura_paciente = tbl_detalle_factura_paciente.id_detalle_factura_paciente LEFT JOIN tbl_examen ON tbl_examen.id_examen = tbl_detalle_factura_paciente.id_examen LEFT JOIN tbl_cultivo ON tbl_cultivo.id_cultivo = tbl_detalle_factura_paciente.id_cultivo LEFT JOIN tbl_paciente ON tbl_paciente.id_paciente = tbl_detalle_factura_paciente.id_paciente WHERE ((tbl_orden.check_toma_muestra = 1 AND tbl_orden.check_sueros = 1 AND tbl_orden.check_laboratorios = 0) AND (tbl_detalle_orden.id_usuario IS NULL) AND (tbl_examen.id_departamento = 4 OR tbl_cultivo.id_departamento = 4)) GROUP BY id_orden"
            sql = "SELECT tbl_orden.id_orden, tbl_orden.numero_orden, tbl_orden.check_toma_muestra, tbl_orden.check_sueros, tbl_orden.cultivos_montados, tbl_orden.check_laboratorios, date_format(fecha,'%Y-%m-%d') AS fecha, tbl_detalle_orden.id_detalle_factura_paciente, tbl_detalle_orden.cultivo_montado, tbl_detalle_orden.id_usuario, tbl_examen.id_examen, tbl_examen.id_departamento AS departamento_examen, tbl_cultivo.id_cultivo, tbl_cultivo.id_departamento AS departamento_cultivo, tbl_paciente.id_paciente, tbl_paciente.paciente_nombre, tbl_paciente.paciente_apellido, tbl_paciente.paciente_cedula FROM tbl_orden LEFT JOIN tbl_detalle_orden ON tbl_detalle_orden.id_orden = tbl_orden.id_orden LEFT JOIN tbl_detalle_factura_paciente ON tbl_detalle_orden.id_detalle_factura_paciente = tbl_detalle_factura_paciente.id_detalle_factura_paciente LEFT JOIN tbl_examen ON tbl_examen.id_examen = tbl_detalle_factura_paciente.id_examen LEFT JOIN tbl_cultivo ON tbl_cultivo.id_cultivo = tbl_detalle_factura_paciente.id_cultivo LEFT JOIN tbl_paciente ON tbl_paciente.id_paciente = tbl_detalle_factura_paciente.id_paciente WHERE (tbl_detalle_orden.id_usuario IS NULL) AND (tbl_examen.id_departamento = 4 OR tbl_cultivo.id_departamento = 4) GROUP BY id_orden"
            connection.query(sql, function (err, result, fields) {
                if (err) {
                    console.log('ERROR en CheckTemplate', err);
                    res.send('3');
                }
                if (result) {
                    resolve(result);
                }
            });
        })
    }
}

ordenesCtrl.buscarOrdenDepCoproUro = async (req, res) => {

    let detallesFacturaPaciente;
    detallesFacturaPaciente = await buscarDetallesFactura();
    res.send(detallesFacturaPaciente)

    async function buscarDetallesFactura() {
        return new Promise((resolve, reject) => {
            sql = "SELECT tbl_orden.id_orden, tbl_orden.numero_orden, tbl_orden.check_toma_muestra, tbl_orden.check_sueros, tbl_orden.check_laboratorios, date_format(fecha,'%Y-%m-%d') AS fecha, tbl_detalle_orden.id_detalle_factura_paciente, tbl_detalle_orden.id_usuario, tbl_examen.id_examen, tbl_examen.id_departamento AS departamento_examen, tbl_cultivo.id_cultivo, tbl_cultivo.id_departamento AS departamento_cultivo, tbl_paciente.id_paciente, tbl_paciente.paciente_nombre, tbl_paciente.paciente_apellido, tbl_paciente.paciente_cedula FROM tbl_orden LEFT JOIN tbl_detalle_orden ON tbl_detalle_orden.id_orden = tbl_orden.id_orden LEFT JOIN tbl_detalle_factura_paciente ON tbl_detalle_orden.id_detalle_factura_paciente = tbl_detalle_factura_paciente.id_detalle_factura_paciente LEFT JOIN tbl_examen ON tbl_examen.id_examen = tbl_detalle_factura_paciente.id_examen LEFT JOIN tbl_cultivo ON tbl_cultivo.id_cultivo = tbl_detalle_factura_paciente.id_cultivo LEFT JOIN tbl_paciente ON tbl_paciente.id_paciente = tbl_detalle_factura_paciente.id_paciente WHERE (tbl_detalle_orden.id_usuario IS NULL) AND (tbl_examen.id_departamento = 5 OR tbl_cultivo.id_departamento = 5) GROUP BY id_orden"
            connection.query(sql, function (err, result, fields) {
                if (err) {
                    console.log('ERROR en CheckTemplate', err);
                    res.send('3');
                }
                if (result) {
                    resolve(result);
                }
            });
        })
    }
}



module.exports = ordenesCtrl;