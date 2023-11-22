const pacienteCtrl = {};
const session = require('express-session');
const connection = require('../src/database');
const dbFunctionsPacientes = require('../public/functions/db_functions_pacientes')


pacienteCtrl.pacientes = async(req, res) =>{
    const sql = "SELECT * FROM `tbl_paciente` WHERE estatus = 1";
    connection.query(sql, function (err, result, fie) {
		if (err) {
			console.log('error en la conexion intente de nuevo', err)
			res.send('3')
		}
        //console.log('el result examen: ', result)
		res.send(result);
	})
};

pacienteCtrl.pacientesAnulados = async(req, res) =>{
    const sql = "SELECT * FROM `tbl_paciente` WHERE estatus = 0";
    connection.query(sql, function (err, result, fie) {
		if (err) {
			console.log('error en la conexion intente de nuevo', err)
			res.send('3')
		}
        //console.log('el result examen: ', result)
		res.send(result);
	})
};

pacienteCtrl.buscarPacientePorId = async(req, res) =>{
    console.log(req.body)
    const sql = "SELECT * FROM `tbl_paciente` WHERE id_paciente='"+req.body.id_paciente+"'";
    connection.query(sql, function (err, result, fie) {
		if (err) {
			console.log('error en la conexion intente de nuevo', err)
			res.send('3')
		}
        //console.log('el result examen: ', result)
        else{
            res.send(result);
        }
		
	})
};

pacienteCtrl.generos = async(req, res) =>{
    const sql = "SELECT * FROM `tbl_genero`";
    connection.query(sql, function (err, result, fie) {
		if (err) {
			console.log('error en la conexion intente de nuevo', err)
			res.send('3')
		}
        //console.log('el result examen: ', result)
		res.send(result);
	})
}

pacienteCtrl.buscarPacientePorCedula = async(req, res) =>{
    const sql = "SELECT * FROM `tbl_paciente` WHERE paciente_cedula='"+req.body.paciente_cedula+"'";
    connection.query(sql, function (err, result, fie) {
		if (err) {
			console.log('error en la conexion intente de nuevo', err)
			res.send('3')
		}
        //console.log('el result examen: ', result)
        if(result <= 0){
            res.send('0');
        }else{
            res.send(result);
        }
		
	})
};

pacienteCtrl.crearYEnviarPaciente = async(req, res) =>{
                        ///////////////AGREGAR CLIENTE///////////////////
                        console.log('PASO A AGREGARXXXXXXXXXXXXXXXXXXXXXX', req.body)
                        connection.query('INSERT INTO `tbl_paciente` SET?', {
                            paciente_nombre: req.body.paciente_nombre,
                            paciente_apellido: req.body.paciente_apellido,
                            paciente_cedula: req.body.paciente_cedula,
                            edad: req.body.edad,
                            genero: req.body.genero,
                            peso: req.body.peso,
                            medicamentos: req.body.medicamentos,
                            patologias: req.body.patologias,
                            paciente_telefono: req.body.paciente_telefono,
                            estatus: 1
                        }, (err, result) => {
                            if (err) {
                                //console.log('no se pudo a agregar', err)
                                res.send('ERROR EN AGREGAR PACIENTE!')
                            } else {
                                console.log('agrego!!', result)
                                const sql = "SELECT * FROM `tbl_paciente` WHERE paciente_cedula = '" + req.body.paciente_cedula+"'";
                                // const sql = "SELECT * FROM `tbl_examen` WHERE id_examen = '" + req.body.id_examen + "'";
                                 
                                 connection.query(sql, function (err, result, fie) {
                                     if (err) {
                                         console.log('error en la conexion intente de nuevo', err)
                                         res.send('3')
                                     }
                                     console.log('el result examen: ', result)
                                     res.send(result[0]);
                                 })
                            }
                        });
                        ////////////////////////////////////////////////
}


pacienteCtrl.configPaciente = async(req, res) =>{
    if(req.body.num == 1){
                ///////////////AGREGAR CLIENTE///////////////////
                console.log('PASO A AGREGAR!!!!!!!', req.body)
                connection.query('INSERT INTO `tbl_paciente` SET?', {
                    paciente_nombre: req.body.paciente_nombre,
                    paciente_apellido: req.body.paciente_apellido,
                    paciente_cedula: req.body.paciente_cedula,
                    edad: req.body.edad,
                    genero: req.body.genero,
                    peso: req.body.peso,
                    paciente_telefono: req.body.paciente_telefono,
                    medicamentos: req.body.medicamentos,
                    patologias: req.body.patologias
                }, (err, result) => {
                    if (err) {
                        console.log('no se pudo a agregar', err)
                        res.send('ERROR EN AGREGAR PACIENTE!')
                    } else {
                        console.log('agrego!!', result)
                        res.send('AGREGO PACIENTE!')
                    }
                });
                ////////////////////////////////////////////////
    }else if(req.body.num == 2){
        /////////////////////////MODIFICAR CLIENTE////////////////////////////
            const sql = "SELECT id_paciente FROM `tbl_paciente` WHERE id_paciente='"+req.body.id_paciente+"'";
            connection.query(sql, function (err, result, fields) {
                if (err) {
                    console.log('ERROR en CheckTemplate', err);
                    res.send('3');
                }
                if(result){
                    let query=result[0].id_paciente;
                    console.log('el result!!!!!!!!!!!!!!!!!!!!!!!!', query);
                    modificar(query)
                }
            });

            function modificar(query){
                console.log('nomnbre!!!', query)
                const sql = "UPDATE tbl_paciente SET paciente_nombre = '" + req.body.paciente_nombre + "', paciente_apellido = '" + req.body.paciente_apellido + "', paciente_cedula = '" + req.body.paciente_cedula + "', edad = '" + req.body.edad + "', genero = '" + req.body.genero + "', peso = '" + req.body.peso + "', paciente_telefono = '"+req.body.paciente_telefono+"', medicamentos = '"+req.body.medicamentos+"', patologias = '"+req.body.patologias+"' WHERE id_paciente= '"+query+"'";
                connection.query(sql, function (err, result, fie) {
                    if (err) {
                        console.log('error en la conexion intente de nuevo', err)
                        res.send('3')
                    }else{
                        console.log('paciente Modificado')
                        res.send('paciente modificado!')
                    }
                })
            }
        //////////////////////////////////////////////////////////////////////
    }else if(req.body.num == '3'){
        ///////////////ANULAR PACIENTE///////////////////
        const sql = "UPDATE tbl_paciente SET estatus = 0 WHERE id_paciente = '" + req.body.id_paciente + "'"
        
        connection.query(sql, function (err, result, fie) {
            if (err) {
                console.log('error en la conexion intente de nuevo', err)
                res.send('3')
            }else{
                console.log('paciente anulado')
                res.send('ANULADO!')
            }
        })
        //////////////////////////////////////////////////
    }else if(req.body.num == '4'){
        ///////////////ACTIVAR PACIENTE///////////////////
        const sql = "UPDATE tbl_paciente SET estatus = 1 WHERE id_paciente = '" + req.body.id_paciente + "'"
        
        connection.query(sql, function (err, result, fie) {
            if (err) {
                console.log('error en la conexion intente de nuevo', err)
                res.send('3')
            }else{
                console.log('paciente anulado')
                res.send('ACTIVADO!')
            }
        })
        //////////////////////////////////////////////////
    }
}

pacienteCtrl.historialPaciente = async(req, res) =>{
    //console.log(req)
    let detallesFacturaPaciente = await dbFunctionsPacientes.extraerDetallesFacturas(req.params.id_paciente);
    console.log(detallesFacturaPaciente.length)
    if(detallesFacturaPaciente.length > 0){
        console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
        let detallesFacturaPacienteExamenes = detallesFacturaPaciente.filter(detalle => detalle.id_examen != null);
        let detallesFacturaPacienteCultivos = detallesFacturaPaciente.filter(detalle => detalle.id_cultivo != null);
        detallesFacturaPacienteExamenes.map(detalle => detalle.pruebas = []);
        detallesFacturaPacienteCultivos.map(detalle => detalle.bacterias = []);
        let idDetallesFacturasPaciente = detallesFacturaPaciente.map(({id_detalle_factura_paciente}) => id_detalle_factura_paciente);
        let detallesOrdenes = await dbFunctionsPacientes.extraerDetallesOrdenes(idDetallesFacturasPaciente);
        let idDetallesOrdenes = detallesOrdenes.map(({id_detalle_orden}) => id_detalle_orden);
        let resultados = await dbFunctionsPacientes.extraerResultados(idDetallesOrdenes);
        let resultadoPruebas = resultados.filter(resultado => resultado.id_examen != null);
        let resultadoBacterias = resultados.filter(resultado => resultado.id_cultivo != null);

        detallesFacturaPacienteExamenes.forEach(detalle => {
            resultadoPruebas.forEach(resultado => {
                if(detalle.id_detalle_factura_paciente == resultado.id_detalle_factura_paciente){
                    //console.log(detalle.id_detalle_factura_paciente, resultado.id_detalle_factura_paciente)
                    detalle.pruebas.push(resultado)
                }
            })
        })
        detallesFacturaPacienteCultivos.forEach(detalle => {
            resultadoBacterias.forEach(resultadoi => {
                if(detalle.id_detalle_orden == resultadoi.id_detalle_orden){
                    let busqueda = 0;
                    detalle.bacterias.forEach(bacteria => {
                        if(bacteria.id_bacteria == resultadoi.id_bacteria){
                            busqueda = 1;
                        }
                    })
                    if(busqueda == 0){
                        let bacteria = {
                            id_bacteria: resultadoi.id_bacteria,
                            bacteria_nombre: resultadoi.bacteria_nombre,
                            antibioticos: []
                        }
                        resultadoBacterias.forEach(resultadoj => {
                            if(resultadoi.id_detalle_orden == resultadoj.id_detalle_orden){
                                bacteria.antibioticos.push({
                                    id_detalle_orden: resultadoj.id_detalle_orden,
                                    antibiotico_nombre: resultadoj.antibiotico_nombre,
                                    resultado: resultadoj.resultado
                                })
                            }
                        })
                        detalle.bacterias.push(bacteria)
                    }
                }
            })
        })

        //console.log("!!!!!!");
        let data = {
            examenes: detallesFacturaPacienteExamenes,
            cultivos: detallesFacturaPacienteCultivos
        }
        res.send(data);
    }else{
        res.send([])
    }
    
}

pacienteCtrl.historialPaciente = async(req, res) =>{
    //console.log(req)
    let detallesFacturaPaciente = await dbFunctionsPacientes.extraerDetallesFacturas(req.params.id_paciente);
    console.log(detallesFacturaPaciente.length)
    if(detallesFacturaPaciente.length > 0){
        console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
        let detallesFacturaPacienteExamenes = detallesFacturaPaciente.filter(detalle => detalle.id_examen != null);
        let detallesFacturaPacienteCultivos = detallesFacturaPaciente.filter(detalle => detalle.id_cultivo != null);
        detallesFacturaPacienteExamenes.map(detalle => detalle.pruebas = []);
        detallesFacturaPacienteCultivos.map(detalle => detalle.bacterias = []);
        let idDetallesFacturasPaciente = detallesFacturaPaciente.map(({id_detalle_factura_paciente}) => id_detalle_factura_paciente);
        let detallesOrdenes = await dbFunctionsPacientes.extraerDetallesOrdenes(idDetallesFacturasPaciente);
        let idDetallesOrdenes = detallesOrdenes.map(({id_detalle_orden}) => id_detalle_orden);
        let resultados = await dbFunctionsPacientes.extraerResultados(idDetallesOrdenes);
        let resultadoPruebas = resultados.filter(resultado => resultado.id_examen != null);
        let resultadoBacterias = resultados.filter(resultado => resultado.id_cultivo != null);

        detallesFacturaPacienteExamenes.forEach(detalle => {
            resultadoPruebas.forEach(resultado => {
                if(detalle.id_detalle_factura_paciente == resultado.id_detalle_factura_paciente){
                    //console.log(detalle.id_detalle_factura_paciente, resultado.id_detalle_factura_paciente)
                    detalle.pruebas.push(resultado)
                }
            })
        })
        detallesFacturaPacienteCultivos.forEach(detalle => {
            resultadoBacterias.forEach(resultadoi => {
                if(detalle.id_detalle_orden == resultadoi.id_detalle_orden){
                    let busqueda = 0;
                    detalle.bacterias.forEach(bacteria => {
                        if(bacteria.id_bacteria == resultadoi.id_bacteria){
                            busqueda = 1;
                        }
                    })
                    if(busqueda == 0){
                        let bacteria = {
                            id_bacteria: resultadoi.id_bacteria,
                            bacteria_nombre: resultadoi.bacteria_nombre,
                            antibioticos: []
                        }
                        resultadoBacterias.forEach(resultadoj => {
                            if(resultadoi.id_detalle_orden == resultadoj.id_detalle_orden){
                                bacteria.antibioticos.push({
                                    id_detalle_orden: resultadoj.id_detalle_orden,
                                    antibiotico_nombre: resultadoj.antibiotico_nombre,
                                    resultado: resultadoj.resultado
                                })
                            }
                        })
                        detalle.bacterias.push(bacteria)
                    }
                }
            })
        })

        //console.log("!!!!!!");
        let data = {
            examenes: detallesFacturaPacienteExamenes,
            cultivos: detallesFacturaPacienteCultivos
        }
        res.send(data);
    }else{
        res.send([])
    }
    
}

module.exports = pacienteCtrl;

