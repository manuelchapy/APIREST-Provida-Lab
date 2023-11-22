const clienteCtrl = {};
const session = require('express-session');
const connection = require('../src/database');

clienteCtrl.clientes = async(req, res) =>{
    console.log('EN CLIENTES!!!!!!!!!!!!!!!!')
    const sql = "SELECT * FROM `tbl_cliente` WHERE estatus = 1";
    connection.query(sql, function (err, result, fie) {
		if (err) {
			console.log('error en la conexion intente de nuevo', err)
			res.send('3')
		}
        //console.log('el result clientes: ', result)
		res.send(result);
	})
};

clienteCtrl.clientesAnulados = async(req, res) =>{
    console.log('EN CLIENTES!!!!!!!!!!!!!!!!')
    const sql = "SELECT * FROM `tbl_cliente` WHERE estatus = 0";
    connection.query(sql, function (err, result, fie) {
		if (err) {
			console.log('error en la conexion intente de nuevo', err)
			res.send('3')
		}
        //console.log('el result clientes: ', result)
		res.send(result);
	})
};

clienteCtrl.clientesConvenios = async(req, res) =>{
    console.log('EN CLIENTES CONVENIOS!!!!!!!!!!!!!!!!')
    const sql = "SELECT * FROM `tbl_cliente` WHERE id_tipo_cliente = 2";
    connection.query(sql, function (err, result, fie) {
		if (err) {
			console.log('error en la conexion intente de nuevo', err)
			res.send('3')
		}
        //onsole.log('el result clientes: ', result)
		res.send(result);
	})
};

clienteCtrl.tipoCliente = async(req, res) =>{
    console.log('EN CLIENTES!!!!!!!!!!!!!!!!')
    const sql = "SELECT * FROM `tbl_tipo_cliente`";
    connection.query(sql, function (err, result, fie) {
		if (err) {
			console.log('error en la conexion intente de nuevo', err)
			res.send('3')
		}
        //console.log('el result clientes: ', result)
		res.send(result);
	})
};

clienteCtrl.buscarCliente = async(req, res) =>{
    console.log('sesion por login', session.user)
    //console.log('ERRRR REQUEJM', req.body)
    const sql = "SELECT * FROM `tbl_cliente` WHERE id_cliente = '" + req.body.id_cliente+"'";
   // const sql = "SELECT * FROM `tbl_examen` WHERE id_examen = '" + req.body.id_examen + "'";
    
    connection.query(sql, function (err, result, fie) {
		if (err) {
			console.log('error en la conexion intente de nuevo', err)
			res.send('3')
		}
        //console.log('el result examen: ', result)
		res.send(result);
	})
};

clienteCtrl.buscarClientePorCedula = async(req, res) =>{
    console.log('sesion por login', session.user)
    console.log('ERRRR REQUEJM', req.body)
    const sql = "SELECT * FROM `tbl_cliente` WHERE cedula_RIF = '" + req.body.cedula_RIF+"'";
   // const sql = "SELECT * FROM `tbl_examen` WHERE id_examen = '" + req.body.id_examen + "'";
    
    connection.query(sql, function (err, result, fie) {
		if (err) {
			console.log('error en la conexion intente de nuevo', err)
			res.send('3')
		}
        console.log('el result examen: ', result)
        if(result.length <= 0){
            console.log('PASO A 0')
            res.send('0')
        }else{
            res.send(result);
        }
		
	})
};

clienteCtrl.crearYEnviarCliente = async(req, res) =>{
                    ///////////////AGREGAR CLIENTE///////////////////
                    console.log('PASO A AGREGAR')
                    connection.query('INSERT INTO `tbl_cliente` SET?', {
                        cliente_nombre: req.body.cliente_nombre,
                        cliente_apellido: req.body.cliente_apellido,
                        cedula_RIF: req.body.cedula_RIF,
                        correo: req.body.correo,
                        telefono: req.body.telefono,
                        descuento_fijo: req.body.descuento_fijo,
                        id_tipo_cliente: req.body.id_tipo_cliente,
                        estatus: 1
                    }, (err, result) => {
                        if (err) {
                            console.log('no se pudo a agregar', err)
                            res.send('ERROR EN AGREGAR USUARIO!')
                        } else {
                            //console.log('agrego!!', result)
                            const sql = "SELECT * FROM `tbl_cliente` WHERE cedula_RIF = '" + req.body.cedula_RIF+"'";
                            // const sql = "SELECT * FROM `tbl_examen` WHERE id_examen = '" + req.body.id_examen + "'";
                             
                             connection.query(sql, function (err, result, fie) {
                                 if (err) {
                                     console.log('error en la conexion intente de nuevo', err)
                                     res.send('3')
                                 }
                                 //console.log('el result examen: ', result)
                                 res.send(result);
                             })
                        }
                    });
                    ////////////////////////////////////////////////
}

clienteCtrl.configCliente = async(req, res) =>{
    if(req.body.num == 1){
                ///////////////AGREGAR CLIENTE///////////////////
                console.log('PASO A AGREGAR!!!!!!!!!!!!!!!!!!!!!!!!', req.body)
                connection.query('INSERT INTO `tbl_cliente` SET?', {
                    cliente_nombre: req.body.cliente_nombre,
                    cliente_apellido: req.body.cliente_apellido,
                    cedula_Rif: req.body.cedula_RIF,
                    correo: req.body.correo,
                    telefono: req.body.telefono,
                    descuento_fijo: req.body.descuento_fijo,
                    id_tipo_cliente: req.body.id_tipo_cliente,
                    estatus: 1
                }, (err, result) => {
                    if (err) {
                        console.log('no se pudo a agregar', err)
                        res.send('ERROR EN AGREGAR USUARIO!')
                    } else {
                        //console.log('agrego!!', result)
                        res.send('1')
                    }
                });
                ////////////////////////////////////////////////
    }else if(req.body.num == 2){
        /////////////////////////MODIFICAR CLIENTE////////////////////////////
            console.log('EL REQUEST DESDE CLIENTE', req.body)
            const sql = "SELECT id_cliente FROM `tbl_cliente` WHERE id_cliente='"+req.body.id_cliente+"'";
            connection.query(sql, function (err, result, fields) {
                if (err) {
                    console.log('ERROR en CheckTemplate', err);
                    res.send('3');
                }
                if(result){
                    console.log('EL RESULT DESDE CLIENTE', result)
                    let query=result[0].id_cliente;
                    console.log('el result!!!!!!!!!!!!!!!!!!!!!!!!', query);
                    modificar(query)
                }
            });

            function modificar(query){
                console.log('nomnbre!!!', req.body.cliente_nombre)
                const sql = "UPDATE tbl_cliente SET cliente_nombre = '" + req.body.cliente_nombre + "', cliente_apellido = '" + req.body.cliente_apellido + "', cedula_Rif = '" + req.body.cedula_RIF + "', correo = '" + req.body.correo + "', telefono = '" + req.body.telefono + "', descuento_fijo = '" + req.body.descuento_fijo + "', id_tipo_cliente = '" + req.body.id_tipo_cliente + "' WHERE id_cliente= '"+query+"'";
                connection.query(sql, function (err, result, fie) {
                    if (err) {
                        console.log('error en la conexion intente de nuevo', err)
                        res.send('3')
                    }else{
                        console.log('Usuario Modificado')
                        res.send('1')
                    }
                })
            }
        //////////////////////////////////////////////////////////////////////
    }else if(req.body.num == 3){
        ///////////////ANULAR CLIENTE///////////////////
        //const sql = "DELETE FROM tbl_cliente WHERE cedula_Rif = '" + req.body.cedula_Rif + "'";
        //console.log('EL CLIENTE ANULADO', req.body)
        const sql = "UPDATE tbl_cliente SET estatus = 0 WHERE id_cliente= '"+req.body.id_cliente+"'";
        connection.query(sql, function (err, result, fie) {
            if (err) {
                console.log('error en la conexion intente de nuevo', err)
                res.send('3')
            }else{
                console.log('CLIENTE ANULADO')
                res.send('ANULADO!')
            }
        })
        //////////////////////////////////////////////////
    }else if(req.body.num == 4){
        ///////////////ACTIVAR CLIENTE///////////////////
        const sql = "UPDATE tbl_cliente SET estatus = 1 WHERE id_cliente= '"+req.body.id_cliente+"'";
        connection.query(sql, function (err, result, fie) {
            if (err) {
                console.log('error en la conexion intente de nuevo', err)
                res.send('3')
            }else{
                console.log('CLIENTE ANULADO')
                res.send('ACTIVADO!')
            }
        })
        //////////////////////////////////////////////////
    }
}

clienteCtrl.buscarFacturaPorCliente = async(req, res) =>{
    
}

clienteCtrl.deudasConvenios = async(req, res) =>{

    let clientesConvenio = await buscarClientesConvenio();
    clientesConvenio = clientesConvenio.filter(cliente => cliente.id_cliente != 50 && cliente.id_cliente != 259)
    
    let idsClientesConveio = clientesConvenio.map(({id_cliente}) => id_cliente)
    let facturasConDeudasVar = await facturasConDeudas(idsClientesConveio);
    let idRegistroConvenioNoValidos = await buscarDetallesReciboRegistroConvenio();
    idRegistroConvenioNoValidos = idRegistroConvenioNoValidos.map(({id_registro_convenio}) => id_registro_convenio)
    
    let registrosConvenio = await registroConvenioConDeudas(idRegistroConvenioNoValidos)
    registrosConvenio = registrosConvenio.filter(registro => registro.id_cliente != 50 && registro.id_cliente != 259 && registro.id_cliente != 97)
    let deudas = [];
    for(const item of facturasConDeudasVar){
        deudas.push(item)
    }
    for(const item of registrosConvenio){
        deudas.push(item)
    }
    res.send(deudas);


    async function buscarClientesConvenio(){
        return new Promise((resolve, reject) => {
            let sql = `SELECT * FROM tbl_cliente WHERE id_tipo_cliente = 2`;
            connection.query(sql, function (err, result, fields) {
                if (err) {
                    console.log('ERROR en CheckTemplate', err);
                    res.send('3');
                }
                if (result.length > 0) {
                    //console.log(result)
                    resolve(result)
                }else{
                    res.send([])
                }
            });
        })
    }

    async function buscarDetallesReciboRegistroConvenio(){
        return new Promise((resolve, reject) => {
            let sql = `SELECT id_registro_convenio FROM tbl_detalle_recibo_registro_convenio`;
            connection.query(sql, function (err, result, fields) {
                if (err) {
                    console.log('ERROR en CheckTemplate', err);
                    res.send('3');
                }
                if (result.length > 0) {
                    //console.log(result)
                    resolve(result)
                }else{
                    res.send([])
                }
            });
        })
    }


    async function facturasConDeudas(idClientesConvenio){
        return new Promise((resolve, reject) => {
            //console.log(idClientesConvenio)
            connection.query(`SELECT tbl_factura.id_factura, tbl_factura.numero_factura, tbl_factura.orden_trabajo, date_format(fecha_creacion_factura, '%Y-%m-%d') AS fecha_creacion_factura, date_format(fecha_creacion_orden_trabajo, '%Y-%m-%d') AS fecha_creacion_orden_trabajo, tbl_factura.total_bolivares, tbl_factura.total_dolares, tbl_factura.total_pesos, tbl_factura.debe_dolares, tbl_factura.id_cliente, tbl_cliente.cliente_nombre, tbl_cliente.cliente_apellido, tbl_cliente.cedula_RIF, tbl_cliente.telefono FROM tbl_factura LEFT JOIN tbl_cliente ON tbl_cliente.id_cliente = tbl_factura.id_cliente WHERE debe_dolares > 0 AND (tbl_factura.id_usuario_anulacion IS NULL AND tbl_factura.id_cliente in (${idClientesConvenio}))`, function (err, result, fields) {
                if (err) {
                    console.log('ERROR en CheckTemplate', err);
                    res.send('3');
                }
                if (result.length > 0) {
                    //console.log(result)
                    resolve(result)
                }else{
                    res.send([])
                }
            });

        });
    }

    async function registroConvenioConDeudas(idRegistroConvenios){
        return new Promise((resolve, reject) => {
            //console.log(idClientesConvenio)
            connection.query(`SELECT tbl_registro_convenio.id_registro_convenio, tbl_registro_convenio.numero_registro_convenio, tbl_registro_convenio.id_cliente, tbl_registro_convenio.total_bolivares, tbl_registro_convenio.total_pesos, tbl_registro_convenio.total_dolares, date_format(tbl_registro_convenio.fecha, '%Y-%m-%d') AS fecha, tbl_cliente.cliente_nombre, tbl_cliente.cliente_apellido, tbl_cliente.cedula_RIF, tbl_cliente.telefono FROM tbl_registro_convenio LEFT JOIN tbl_cliente ON tbl_cliente.id_cliente = tbl_registro_convenio.id_cliente WHERE id_usuario_anulacion IS NULL AND (id_factura IS NULL AND tbl_registro_convenio.id_registro_convenio not in (${idRegistroConvenios}) AND (tbl_registro_convenio.id_cliente <> 50 OR tbl_registro_convenio.id_cliente <> 259 OR tbl_registro_convenio.id_cliente <> 97))`, function (err, result, fields) {
                if (err) {
                    console.log('ERROR en CheckTemplate', err);
                    res.send('3');
                }
                if (result.length > 0) {
                    //console.log(result)
                    resolve(result)
                }else{
                    res.send([])
                }
            });

        });
    }
}


module.exports = clienteCtrl;