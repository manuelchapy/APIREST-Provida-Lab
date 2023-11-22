const conveniosCtrl = {};
const session = require('express-session');
const { updateLocale } = require('moment');
const connection = require('../src/database');
const dbFunctionsConvenios = require('../public/functions/db_functions_convenios');

conveniosCtrl.convenios = async(req, res) =>{
    const sql = "SELECT * FROM tbl_cliente WHERE id_tipo_cliente = 2 AND estatus = 1"
    connection.query(sql, function (err, result, fields) {
        if (err) {
            console.log('ERROR en CheckTemplate', err);
            res.send('3');
        }
        if(result){
            res.send(result)
        }});
        
}

conveniosCtrl.buscarConvenio = async(req, res) =>{
    const sql = "SELECT * FROM tbl_cliente WHERE cedula_RIF= '" +req.body.cedula_RIF+"' AND id_tipo_cliente = 2 AND estatus = 1"
    connection.query(sql, function (err, result, fields) {
        if (err) {
            console.log('ERROR en CheckTemplate', err);
            res.send('3');
        }
        if(result){
            if(result.length <= 0){
                res.send("0");
            }else{
                res.send(result);
            }
            
        }});
        
}

conveniosCtrl.registrosConveniosCliente = async(req, res) =>{
    let registrosConvenio
    let agrupaciones;

    registrosConvenio = await buscarRegistrosConvenios()
    agrupaciones = await agruparRegistroConvenios(registrosConvenio)
    //res.send(registrosConvenio)
    //console.log("PPPPPPPPPPPPPPPPPPPPPPPPPPPP", agrupaciones.ordenes)
    res.send(agrupaciones)
    
     async function buscarRegistrosConvenios() {
            return new Promise((resolve, reject) => {
                const sql = "SELECT tbl_registro_convenio.id_registro_convenio, tbl_registro_convenio.total_bolivares, tbl_registro_convenio.total_pesos, tbl_registro_convenio.id_usuario, tbl_usuario.usuario_nombre, tbl_usuario.usuario_apellido, tbl_registro_convenio.total_dolares, tbl_registro_convenio.numero_registro_convenio, tbl_registro_convenio.id_factura, date_format(tbl_registro_convenio.fecha,'%d-%m-%Y') AS fecha, tbl_registro_convenio.estatus, tbl_factura.numero_factura, tbl_detalle_factura_paciente.id_detalle_factura_paciente, tbl_detalle_orden.id_detalle_orden, tbl_orden.id_orden, tbl_orden.numero_orden, tbl_paciente.paciente_nombre, tbl_paciente.paciente_apellido, tbl_paciente.paciente_cedula, tbl_paciente.id_paciente FROM tbl_registro_convenio LEFT JOIN tbl_factura ON tbl_factura.id_factura = tbl_registro_convenio.id_factura LEFT JOIN tbl_detalle_factura_paciente ON tbl_registro_convenio.id_registro_convenio = tbl_detalle_factura_paciente.id_registro_convenio LEFT JOIN tbl_detalle_orden ON tbl_detalle_orden.id_detalle_factura_paciente = tbl_detalle_factura_paciente.id_detalle_factura_paciente LEFT JOIN tbl_orden ON tbl_orden.id_orden = tbl_detalle_orden.id_orden LEFT JOIN tbl_paciente ON tbl_detalle_factura_paciente.id_paciente = tbl_paciente.id_paciente LEFT JOIN tbl_usuario ON tbl_registro_convenio.id_usuario = tbl_usuario.id_usuario WHERE tbl_registro_convenio.id_cliente = '" +req.body.id_cliente+"'";
                connection.query(sql, function (err, result, fields) {
                    if (err) {
                        console.log('ERROR en CheckTemplate', err);
                        res.send('3');
                    }
                    if(result){
                        resolve(result)
                    }});
            })
     }

     async function agruparRegistroConvenios(registrosConvenio) {
        return new Promise((resolve, reject) => {
            let agrupados = [];
            let i = 0;
            console.log(registrosConvenio.length)
            registrosConvenio.forEach(item => {
                //console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!", item)
                //Si la ciudad no existe en nuevoObjeto entonces
                //la creamos e inicializamos el arreglo de profesionales. 
                if(!agrupados.hasOwnProperty(item.id_orden)){
                    agrupados[item.id_registro_convenio] = {
                        id_registro_convenio: item.id_registro_convenio,
                        total_bolivares: item.total_bolivares,
                        total_pesos: item.total_pesos,
                        total_dolares: item.total_dolares,
                        numero_registro_convenio: item.numero_registro_convenio,
                        id_factura: item.id_factura,
                        fecha: item.fecha,
                        estatus: item.estatus,
                        numero_factura: item.numero_factura,
                        id_detalle_factura_paciente: item.id_detalle_factura_paciente,
                        usuario_nombre: item.usuario_nombre,
                        usuario_apellido: item.usuario_apellido,
                        ordenes: []
                    }
                }
                agrupados[item.id_registro_convenio].ordenes.push({
                        id_detalle_orden: item.id_detalle_orden,
                        id_orden: item.id_orden,
                        numero_orden: item.numero_orden,
                        id_paciente: item.id_paciente,
                        paciente_nombre: item.paciente_nombre,
                        paciente_apellido: item.paciente_apellido,
                        paciente_cedula: item.paciente_cedula
                })
            })
            let agrupadosFiltrado = agrupados.filter(item => item != null);
            for(const item of agrupadosFiltrado){
                if(item.ordenes.length == 1){
                    item.numero_de_ordenes = "1"
                }else{
                    item.numero_de_ordenes = "+"
                }
            }
            resolve(agrupadosFiltrado);
        })
     }


    
}

conveniosCtrl.buscarRegistroConvenio = async(req, res) =>{

    //console.log(req.body.registros_convenio);
    let items = [];
    let item;
    let registro;
    let i=0;
    let dolares = 0;
    let total = [];
    for (const reg of req.body.registros_convenio){
        //console.log(registro.id_registro_convenio)
        registro = reg.id_registro_convenio;
        await getExamenesCultivos(registro);
        items.push({
            item: item
        })
        //console.log('xxx',items)
        //i++;
    }   
    console.log('!!!!!!',items[0].item)
    

    for(let i=0; i<items.length; i++){
        console.log('EN I', i)
        for(let j=0; j<items[i].item.length; j++){
            //console.log(j);
            if(items[i].item[j].id_examen == null){
                dolares = dolares + items[i].item[j].cultivo_precio
                console.log(dolares)
            }else if(items[i].item[j].id_cultivo == null){
                dolares = dolares + items[i].item[j].examen_precio
                console.log(dolares)
            }
        }
    }
    /*items.push({
        dolares: dolares
    })*/
    total.push({
        dolares: dolares
    })
    console.log('TOTAL DOLARES', total)

    res.send(total)

    async function getExamenesCultivos(registro){
        const sql = "SELECT tbl_detalle_factura_paciente.id_registro_convenio, tbl_detalle_factura_paciente.id_paciente, tbl_detalle_factura_paciente.id_examen, tbl_detalle_factura_paciente.id_cultivo, tbl_examen.examen_nombre, tbl_examen.examen_precio, tbl_cultivo.cultivo_nombre, tbl_cultivo.cultivo_precio FROM `tbl_detalle_factura_paciente` LEFT JOIN `tbl_examen` ON tbl_examen.id_examen = tbl_detalle_factura_paciente.id_examen LEFT JOIN `tbl_cultivo` ON tbl_cultivo.id_cultivo = tbl_detalle_factura_paciente.id_cultivo WHERE tbl_detalle_factura_paciente.id_registro_convenio='" +registro+"'";
        return new Promise((resolve, reject) => {
            connection.query(sql, function (err, result, fields) {
                if (err) {
                    console.log('ERROR en CheckTemplate', err);
                    res.send('3');
                }
                if(result){

                    item = result;
                    resolve(item)
                    //console.log(result);
                }});
        })
    }
}

/* conveniosCtrl.facturarRegistroConvenio = async(req, res) =>{

    let numFact;
    let idFactura;
    let idRegistroConvenio;

    await extraerNumFactura();
    await crearFactura(numFact);
    await update();
    await extraerFactura(numFact);
    console.log("LOS CONVENIOS REGISTROS", req.body)
    //registrosConvenio = req.body.registros_convenio;
    for (const reg of req.body.registros_convenios){
        idRegistroConvenio = reg.id_registro_convenio;
        //console.log(idRegistroConvenio)
        await idFacturaDetalleFactura(idFactura, idRegistroConvenio)
        await agregarIdFactura(idFactura, idRegistroConvenio);
    }
    for (const pago of req.body.pagos){
        //console.log('PAGO', pago)
        await detallesFiscales(idFactura, pago.id_registro_divisa, pago.id_tipo_pago, pago.id_banco, pago.numero_referencia, pago.monto)
    }
    //res.send('1')
    res.redirect('/imprimirFactura/'+idFactura+'/'+1);
    //console.log(registrosConvenio)

    //console.log('NUMERO DE FACTURA', numFact);
    //console.log('ID FACTURA', idFactura);

    async function extraerNumFactura(){
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM `tbl_numero_factura_tmp`";
                connection.query(sql, function (err, result, fields) {
                    if (err) {
                        console.log('ERROR en CheckTemplate', err);
                        res.send('3');
                    }
                    if(result){
                        numFact=result[0].numero_factura;
                        //console.log('NUMERO DE FACTURA', numFact);
                        resolve(numFact)
                    }
                });
        });
    }

        async function crearFactura(numFact){
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
            return new Promise((resolve, reject) => {
                connection.query('INSERT INTO `tbl_factura` SET?', {
                    numero_factura: numFact,
                    id_cliente: req.body.id_cliente,
                    total_bolivares: req.body.total_bolivares,
                    total_dolares: req.body.total_dolares,
                    total_pesos: req.body.total_pesos,
                    id_tipo_factura: req.body.id_tipo_factura,
                    id_usuario: 2,
                    id_tipo_factura: 1,
                    id_estado_factura: 1,
                    fecha_creacion_factura: time,
                    fecha_cancelacion: time,
                    impreso: 1
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

        async function update(){
            return new Promise((resolve, reject) => {
                const sqlUpdate = "UPDATE `tbl_numero_factura_tmp` SET numero_factura = numero_factura + 1 WHERE id_numero_factura = 1"
                connection.query(sqlUpdate, function (err, result, fie) {
                    if (err) {
                        console.log('error en la conexion intente de nuevo', err)
                        res.send('3')
                    }else{
                        console.log('numero de factura aumentado!')
                        //res.send('sea agrego factura y numero de factura aumentado!')
                        //detallesDeFactura(numFact);
                        resolve('1')
                    }
                })
            });
        }

        async function extraerFactura(numFact){
            return new Promise((resolve, reject) => {
                let sql = "SELECT id_factura FROM `tbl_factura` WHERE numero_factura='" +numFact+"'";
                connection.query(sql, function (err, result, fields) {
                    if (err) {
                        console.log('ERROR en CheckTemplate', err);
                        res.send('3');
                    }
                    if(result){
                        //console.log(result);
                        idFactura = result[0].id_factura
                        resolve(idFactura)
                    }});
                
            })
        }

    async function idFacturaDetalleFactura(idFactura, idRegistroConvenio){
        return new Promise((resolve, reject) => {
            //const sql = "SELECT tbl_detalle_factura_paciente.id_registro_convenio, tbl_detalle_factura_paciente.id_paciente, tbl_detalle_factura_paciente.id_examen, tbl_detalle_factura_paciente.id_cultivo, tbl_examen.examen_nombre, tbl_examen.examen_precio, tbl_cultivo.cultivo_nombre, tbl_cultivo.cultivo_precio FROM `tbl_detalle_factura_paciente` LEFT JOIN `tbl_examen` ON tbl_examen.id_examen = tbl_detalle_factura_paciente.id_examen LEFT JOIN `tbl_cultivo` ON tbl_cultivo.id_cultivo = tbl_detalle_factura_paciente.id_cultivo WHERE tbl_detalle_factura_paciente.id_registro_convenio='" +registro+"'";
            const sql = "UPDATE `tbl_detalle_factura_paciente` SET id_factura = '" +idFactura+"' WHERE id_registro_convenio = '" +idRegistroConvenio+"'"
            connection.query(sql, function (err, result, fields) {
                if (err) {
                    console.log('ERROR en CheckTemplate', err);
                    res.send('3');
                }
                if(result){
                    resolve('1')
                    //console.log(result);
                }});
        })
    }

    async function agregarIdFactura(idFactura, idRegistroConvenio){
        return new Promise((resolve, reject) => {
            console.log("///////////////////////////AGREGANDO 0/////////////////////////////////")
            //const sql = "SELECT tbl_detalle_factura_paciente.id_registro_convenio, tbl_detalle_factura_paciente.id_paciente, tbl_detalle_factura_paciente.id_examen, tbl_detalle_factura_paciente.id_cultivo, tbl_examen.examen_nombre, tbl_examen.examen_precio, tbl_cultivo.cultivo_nombre, tbl_cultivo.cultivo_precio FROM `tbl_detalle_factura_paciente` LEFT JOIN `tbl_examen` ON tbl_examen.id_examen = tbl_detalle_factura_paciente.id_examen LEFT JOIN `tbl_cultivo` ON tbl_cultivo.id_cultivo = tbl_detalle_factura_paciente.id_cultivo WHERE tbl_detalle_factura_paciente.id_registro_convenio='" +registro+"'";
            const sql = "UPDATE `tbl_registro_convenio` SET id_factura = '" +idFactura+"', estatus = 0 WHERE id_registro_convenio = '" +idRegistroConvenio+"'"
            connection.query(sql, function (err, result, fields) {
                if (err) {
                    console.log('ERROR en CheckTemplate', err);
                    res.send('3');
                }
                if(result){
                    resolve('1')
                    //console.log(result);
                }});
        })
    }

    async function detallesFiscales(idFactura, id_registro_divisa, id_tipo_pago, id_banco, numero_referencia, monto){
        return new Promise((resolve, reject) => {
            connection.query('INSERT INTO `tbl_registro_pago` SET?', {
                id_factura: idFactura,
                id_registro_divisa: id_registro_divisa,
                id_tipo_pago: id_tipo_pago,
                id_banco: id_banco,
                numero_referencia: numero_referencia,
                monto: monto,
            }, (err, result) => {
                if (err) {
                    console.log('no se pudo a agregar', err)
                    res.send('ERROR EN AGREGAR FACTURA!')
                } else {
                    console.log('agrego!!', result)
                    //res.send('AGREGO FACTURA!')
                    req.body.id_factura = idFactura;
                    //console.log("EL REQUEST BODY", req.body)
                    resolve('1');
                }
            });
        });
    }
} */

conveniosCtrl.facturarRegistroConvenio = async(req, res) =>{
    
}

conveniosCtrl.reporteGeneralConvenios = async(req, res) =>{
    let idRegistrosConvenios = req.body.registros_convenios.map(({id_registro_convenio}) => id_registro_convenio)
    let registrosConvenios = await dbFunctionsConvenios.extraerRegistrosConvenios(idRegistrosConvenios)
    registrosConvenios = registrosConvenios.map(registro => ({
        ...registro,
        pacientes: []
    }))
    let detallesFacturaPacientes = await dbFunctionsConvenios.extraerDetallesFacturaPacientes(idRegistrosConvenios);
    const data = detallesFacturaPacientes;
    // Objeto para almacenar las agrupaciones
    const groupedData = {};
    // Recorre el array original
    for (const item of data) {
      const convenioId = item.id_registro_convenio;
      
      // Si el grupo del convenio no existe, créalo
      if (!groupedData[convenioId]) {
        groupedData[convenioId] = {
          id_registro_convenio: convenioId,
          pacientes: [],
        };
      }
      
      const pacienteId = item.id_paciente;
      const existingPaciente = groupedData[convenioId].pacientes.find(p => p.id_paciente === pacienteId);
      // Si el paciente no existe en el grupo, agrégalo
      if (!existingPaciente) {
        groupedData[convenioId].pacientes.push({
          id_paciente: item.id_paciente,
          paciente_nombre: item.paciente_nombre,
          paciente_apellido: item.paciente_apellido,
          paciente_cedula: item.paciente_cedula,
          paciente_telefono: item.paciente_telefono,
          detalles_factura: [],
        });
      }
      // Agrega el detalle de factura al paciente
      groupedData[convenioId].pacientes.find(p => p.id_paciente === pacienteId).detalles_factura.push({
        id_detalle_factura_paciente: item.id_detalle_factura_paciente,
        id_factura: item.id_factura,
        id_examen: item.id_examen,
        examen_nombre: item.examen_nombre,
        id_cultivo: item.id_cultivo,
        cultivo_nombre: item.cultivo_nombre
      });
    }
    // Convierte el objeto de agrupación en un array de resultados
    const result = Object.values(groupedData);
    for(const registro of registrosConvenios){
        for(const detalle of result){
            if(registro.id_registro_convenio == detalle.id_registro_convenio){
                registro.pacientes.push(
                    detalle.pacientes
                )
            }
            registro.pacientes = registro.pacientes.flatMap(pacientesInternos => pacientesInternos)
        }
    }
    res.send(registrosConvenios);
}
//////////////////////////////////////////////////EN DESUSO?////////////////////////////////////////////////////////////
conveniosCtrl.imprimirFacturaRegistroConvenio = async(req, res) =>{
    const sql = "SELECT tbl_detalle_factura_paciente.id_detalle_factura_paciente, tbl_detalle_factura_paciente.id_paciente, tbl_detalle_factura_paciente.id_examen, tbl_detalle_factura_paciente.id_cultivo, tbl_detalle_orden.id_orden FROM `tbl_detalle_factura_paciente`  INNER JOIN `tbl_detalle_orden` ON tbl_detalle_orden.id_detalle_factura_paciente = tbl_detalle_factura_paciente.id_detalle_factura_paciente WHERE tbl_detalle_factura_paciente.id_factura='" +req.params.id_factura+"'";
    connection.query(sql, function (err, result, fields) {
        if (err) {
            console.log('ERROR en CheckTemplate', err);
            res.send('3');
        }
        if(result){
            console.log('PASO A RESULT!')
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
            let cultivo = [];
            let orden = [];

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
                ordenPos = result[i].id_orden;
                //console.log('VALOR DE ordenPos', ordenPos)
                for(let j=0; j<result.length;j++){
                    if(ordenPos==result[j].id_orden ){
                        //console.log('SUMA');
                        result[j].id_orden = null;
                        //console.log(result[j].id_ex)
                        contador++;
                    }
                }
                orden.push({
                    id_orden: ordenPos,
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
        console.log('DESDE BUSCAR PRECIOS NOMBRES', examenes, cultivos)

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
                    item.precio = result[0].examen_precio;
                    item.subtotal = item.contador * result[0].examen_precio;
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
                        item.precio = result[0].cultivo_precio;
                        item.subtotal = item.contador * result[0].cultivo_precio;
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
            console.log("LA CONSOLEASDA!!!", req.params.id_tipo_factura)
            return new Promise((resolve, reject) => {
                console.log("LA FACTURA!!!!", req.params.id_factura)
                if(req.params.id_tipo_factura == 1 || req.params.id_tipo_factura == 4){
                    sqlNumFactura = "SELECT numero_factura, orden_trabajo, date_format(fecha_creacion_factura,'%d-%m-%Y') AS fecha_creacion FROM tbl_factura WHERE id_factura='" +req.params.id_factura+"'";
                }else if(req.params.id_tipo_factura == 2){
                    sqlNumFactura = "SELECT numero_factura, orden_trabajo, date_format(fecha_creacion_orden_trabajo,'%d-%m-%Y') AS fecha_creacion FROM tbl_factura WHERE id_factura='" +req.params.id_factura+"'";
                }
                
                connection.query(sqlNumFactura, function (err, result, fields) {
                if (err) {
                    console.log('ERROR en CheckTemplate', err);
                    res.send('3');
                }
                if(result){
                    console.log('EN RESULT!!!!!!', result)
                    impresion.push({
                        numero_factura: result[0].numero_factura,
                        orden_trabajo: result[0].orden_trabajo,
                        fecha_creacion: result[0].fecha_creacion,
                        id_factura: req.params.id_factura
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
                    console.log('LOS NOMBRES DE LOS PAGOS', nombre_pago)
                    console.log('TIPO PAGO!!!!!!', result)
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
            console.log('LUEGO: ',cultivos);
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

//conveniosCtrl.imprimirFacturaRegistroConvenio = async(req, res) =>{}





module.exports = conveniosCtrl;