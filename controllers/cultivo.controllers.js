const cultivoCtrl = {};
const session = require('express-session');
const connection = require('../src/database');


cultivoCtrl.cultivos = async(req, res) =>{
    //console.log('sesion por login', session.user)
    const sql = "SELECT tbl_cultivo.id_cultivo, tbl_cultivo.cultivo_nombre, tbl_cultivo.cultivo_precio, tbl_cultivo.cultivo_codigo, tbl_departamento.departamento_nombre, tbl_categoria.categoria_nombre FROM `tbl_cultivo` INNER JOIN tbl_departamento ON tbl_departamento.id_departamento = tbl_cultivo.id_departamento INNER JOIN tbl_categoria ON tbl_categoria.id_categoria = tbl_cultivo.id_categoria WHERE estatus = 1";
    //const sql = "SELECT * FROM tbl_cultivo WHERE estatus = 1";
    connection.query(sql, function (err, result, fie) {
		if (err) {
			console.log('error en la conexion intente de nuevo', err)
			res.send('3')
		}
        //console.log('el result examen: ', result)
		res.send(result);
	})
};

cultivoCtrl.cultivosAnulados = async(req, res) =>{
    //console.log('sesion por login', session.user)
    const sql = "SELECT tbl_cultivo.id_cultivo, tbl_cultivo.cultivo_nombre, tbl_cultivo.cultivo_precio, tbl_cultivo.cultivo_codigo, tbl_departamento.departamento_nombre, tbl_categoria.categoria_nombre FROM `tbl_cultivo` INNER JOIN tbl_departamento ON tbl_departamento.id_departamento = tbl_cultivo.id_departamento INNER JOIN tbl_categoria ON tbl_categoria.id_categoria = tbl_cultivo.id_categoria WHERE estatus = 0";
    //const sql = "SELECT * FROM tbl_cultivo WHERE estatus = 1";
    connection.query(sql, function (err, result, fie) {
		if (err) {
			console.log('error en la conexion intente de nuevo', err)
			res.send('3')
		}
        //console.log('el result examen: ', result)
		res.send(result);
	})
};

cultivoCtrl.buscarCultivo = async(req, res) =>{
    //console.log('sesion por login', session.user)
    //console.log('ERRRR REQUEJM', req.body)

    let cultivo, detalleCultivoBacteriaAntibiotico, response = {};

    cultivo = await getCultivo(cultivo);
    detalleCultivoBacteriaAntibiotico = await getDetalleBacteriaAntibioticoByCultivo(req.body.id_cultivo, detalleCultivoBacteriaAntibiotico);
    //console.log("000000000", detalleCultivoBacteriaAntibiotico);
    response.cultivo = cultivo;
    response.cultivo.bacterias = detalleCultivoBacteriaAntibiotico;

    res.send(response)
    async function getCultivo(cultivo) {
        return new Promise((resolve, reject) => {
            const sql = "SELECT tbl_cultivo.id_cultivo, tbl_cultivo.cultivo_nombre, tbl_cultivo.cultivo_nombre, tbl_cultivo.cultivo_precio, tbl_cultivo.cultivo_codigo, tbl_cultivo.id_color_tubo, tbl_departamento.departamento_nombre, tbl_departamento.id_departamento, tbl_categoria.categoria_nombre, tbl_categoria.id_categoria FROM `tbl_cultivo` INNER JOIN tbl_departamento ON tbl_departamento.id_departamento = tbl_cultivo.id_departamento INNER JOIN tbl_categoria ON tbl_categoria.id_categoria = tbl_cultivo.id_categoria WHERE id_cultivo = '" + req.body.id_cultivo + "'";
            connection.query(sql, function (err, result, fie) {
                if (err) {
                    console.log('error en la conexion intente de nuevo', err)
                    res.send('3')
                }else{
                    cultivo = result[0];
                    resolve(cultivo);
                }
                //console.log('el result del CULTIVO: ', result)
                //res.send(result);
            })
        })
    }

    async function getDetalleBacteriaAntibioticoByCultivo(idCultivo, detalleCultivoBacteriaAntibiotico) {
        return new Promise((resolve, reject) => {
            const sql = "SELECT tbl_detalle_cultivo_bacteria_antibiotico.id_detalle_cultivo_bacteria_antibiotico, tbl_detalle_cultivo_bacteria_antibiotico.id_cultivo, tbl_detalle_cultivo_bacteria_antibiotico.id_bacteria, tbl_detalle_cultivo_bacteria_antibiotico.id_antibiotico, tbl_cultivo.id_departamento, tbl_cultivo.id_categoria, tbl_cultivo.id_color_tubo, tbl_cultivo.cultivo_codigo, tbl_cultivo.cultivo_nombre, tbl_cultivo.cultivo_precio, tbl_bacteria.bacteria_nombre, tbl_antibiotico.antibiotico_nombre, tbl_departamento.departamento_nombre, tbl_categoria.categoria_nombre, tbl_tubo.tubo_color FROM tbl_detalle_cultivo_bacteria_antibiotico LEFT JOIN tbl_cultivo ON tbl_cultivo.id_cultivo = tbl_detalle_cultivo_bacteria_antibiotico.id_cultivo LEFT JOIN tbl_bacteria ON tbl_bacteria.id_bacteria = tbl_detalle_cultivo_bacteria_antibiotico.id_bacteria LEFT JOIN tbl_antibiotico ON tbl_antibiotico.id_antibiotico = tbl_detalle_cultivo_bacteria_antibiotico.id_antibiotico LEFT JOIN tbl_categoria ON tbl_categoria.id_categoria = tbl_cultivo.id_categoria LEFT JOIN tbl_departamento ON tbl_departamento.id_departamento = tbl_cultivo.id_departamento LEFT JOIN tbl_tubo ON tbl_tubo.id_tubo = tbl_cultivo.id_color_tubo WHERE tbl_detalle_cultivo_bacteria_antibiotico.estatus = 1 AND tbl_detalle_cultivo_bacteria_antibiotico.id_cultivo = '" + idCultivo + "'";
            connection.query(sql, function (err, result, fie) {
                if (err) {
                    //console.log('error en la conexion intente de nuevo', err)
                    res.send('3')
                }else{
                    let bactertiasFormato = [];
                let bacterias = [];
                let antibioticos = [];
                let auxBacteria;
                let idCultivo;
                let i=0,j=0;
                //console.log('el result bacteriaAntibiotico: ', result)
                //res.send(result);
                if(result.length == 0){
                    detalleCultivoBacteriaAntibiotico = [];
                    resolve(detalleCultivoBacteriaAntibiotico)
                }else{
                        idCultivo = result[0].id_cultivo;
                    for(const item of result){
                        item.status = 1;
                    }
                    for(let i=0; i<result.length;i++){
                        //console.log("RESULT EN i", result)
                            if(result[i].status == 1){
                                auxBacteria = result[i].id_bacteria
                            }else{
                                auxBacteria = -1;
                            }
                            //console.log("EL AXUBACTERIA", auxBacteria)
                            for(let j=0; j<result.length;j++){
                                //console.log(auxBacteria, result[j].id_bacteria)
                                if(auxBacteria == result[j].id_bacteria && result[j].status == 1){
                                    //console.log("PASO!", auxBacteria, result[j].id_bacteria)
                                    antibioticos.push({id_antibiotico: result[j].id_antibiotico, antibiotico_nombre: result[j].antibiotico_nombre, id_detalle_cultivo_bacteria_antibiotico: result[j].id_detalle_cultivo_bacteria_antibiotico})
                                    result[j].status = 0;
                                }else{
                                    //console.log("NO PASO!", auxBacteria, result[j].id_bacteria)
                                }
                            }
                            //console.log("ANTIBIOTICOS ANTES", antibioticos)
                            if(auxBacteria != -1){
                                bacterias.push({
                                    id_bacteria: auxBacteria,
                                    nombre_bacteria: result[i].bacteria_nombre,
                                    antibioticos: antibioticos
                                })
                            }
                            antibioticos = []
                    }

                    /*bactertiasFormato.push({
                        bacterias,
                    })*/
                    //resolve(bactertiasFormato)
                        detalleCultivoBacteriaAntibiotico = bacterias
                        resolve(detalleCultivoBacteriaAntibiotico);
                    }
                    //console.log('el result del CULTIVO: ', result)
                    //res.send(result);
                }
                
            })
        })
    }

};

cultivoCtrl.cultivoBacteriasAntibioticos = async(req, res) =>{
    ///////////////////////AGREGAR CULTIVO CON BACTERIAS Y ANTIBIOTICOS///////////////////////////////////
        //console.log(req.body)
        //console.log(req.body.cultivo_nombre);
        let idCultivo;
        await agregarCultivo();
        idCultivo = await extraerIdCultivo(idCultivo);
        for(const itemBacteria of req.body.bacteria){
            //console.log(itemBacteria);
            for(const itemAntibiotico of itemBacteria.antibioticos){
                //console.log("se hace",itemAntibiotico)
                agregarRelacionCultivoBacteriaAntibiotico(idCultivo, itemBacteria.id_bacteria, itemAntibiotico.id_antibiotico)
            }
        }
        res.send("1");

        async function agregarCultivo() {
            return new Promise((resolve, reject) => {
                //console.log('PASO A AGREGAR')
                connection.query('INSERT INTO `tbl_cultivo` SET?', {
                    cultivo_codigo: req.body.cultivo_codigo,
                    cultivo_nombre: req.body.cultivo_nombre,
                    cultivo_precio: req.body.cultivo_precio,
                    id_departamento: req.body.id_departamento,
                    id_categoria: req.body.id_categoria,
                    id_color_tubo: req.body.id_color_tubo,
                    estatus: 1
                }, (err, result) => {
                    if (err) {
                        console.log('no se pudo a agregar', err)
                        res.send('ERROR en CULTIVO!')
                    } else {
                        //console.log('agrego!!', result)
                        //res.send('AGREGO CULTIVO!')
                        resolve("1");
                    }
                });
            });
        }
    
        async function extraerIdCultivo(idCultivo) {
            return new Promise((resolve, reject) => {
                const sql = "SELECT id_cultivo FROM `tbl_cultivo` WHERE cultivo_codigo = '" + req.body.cultivo_codigo + "'";
                connection.query(sql, function (err, result, fie) {
                    if (err) {
                        console.log('error en la conexion intente de nuevo', err)
                        res.send('3')
                    }else{
                        idCultivo = result[0].id_cultivo;
                        resolve(idCultivo)
                    }
                })
                })
        };
    
        async function agregarRelacionCultivoBacteriaAntibiotico(id_cultivo, id_bacteria, id_antibiotico) {
            return new Promise((resolve, reject) => {
                //console.log('PASO A AGREGAR')
                connection.query('INSERT INTO `tbl_detalle_cultivo_bacteria_antibiotico` SET?', {
                    id_cultivo: id_cultivo,
                    id_bacteria: id_bacteria,
                    id_antibiotico: id_antibiotico,
                    estatus: 1
                }, (err, result) => {
                    if (err) {
                        //console.log('no se pudo a agregar', err)
                        res.send('ERROR en CULTIVO!')
                    } else {
                        //console.log('agrego!!', result)
                        //res.send('AGREGO CULTIVO!')
                        resolve("1");
                    }
                });
            });
        }

};
///////////////////////////ESTE ES EL QUE SE ESTA UTILIZANDO ACTUALMENTE PARA AGREGAR CULTIVOS//////////////////////////////
cultivoCtrl.configCultivos = async(req, res)=>{ 
        //console.log(req.body);
        if(req.body.num == 1){
            //console.log(req.body)
            //console.log(req.body.cultivo_nombre);
            let idCultivo;
            await agregarCultivo();
            idCultivo = await extraerIdCultivo();
            for(const itemBacteria of req.body.bacteria){
                //console.log(itemBacteria);
                for(const itemAntibiotico of itemBacteria.antibioticos){
                    //console.log("se hace",itemAntibiotico)
                    await agregarRelacionCultivoBacteriaAntibiotico(idCultivo, itemBacteria.id_bacteria, itemAntibiotico.id_antibiotico)
                }
            }
            res.send("1");
    
            async function agregarCultivo() {
                return new Promise((resolve, reject) => {
                    //console.log('PASO A AGREGAR')
                    connection.query('INSERT INTO `tbl_cultivo` SET?', {
                        cultivo_codigo: req.body.cultivo_codigo,
                        cultivo_nombre: req.body.cultivo_nombre,
                        cultivo_precio: req.body.cultivo_precio,
                        id_departamento: req.body.id_departamento,
                        id_categoria: req.body.id_categoria,
                        id_color_tubo: req.body.id_color_tubo,
                        estatus: 1
                    }, (err, result) => {
                        if (err) {
                            console.log('no se pudo a agregar', err)
                            res.send('ERROR en CULTIVO!')
                        } else {
                            //console.log('agrego!!', result)
                            //res.send('AGREGO CULTIVO!')
                            resolve("1");
                        }
                    });
                });
            }
        
            async function extraerIdCultivo() {
                return new Promise((resolve, reject) => {
                    const sql = "SELECT id_cultivo FROM `tbl_cultivo` WHERE cultivo_codigo = '" + req.body.cultivo_codigo + "'";
                    connection.query(sql, function (err, result, fie) {
                        if (err) {
                            console.log('error en la conexion intente de nuevo', err)
                            res.send('3')
                        }else{
                            idCultivo = result[0].id_cultivo;
                            resolve(idCultivo)
                        }
                    })
                    })
            };
        
            async function agregarRelacionCultivoBacteriaAntibiotico(id_cultivo, id_bacteria, id_antibiotico) {
                return new Promise((resolve, reject) => {
                    //console.log('PASO A AGREGAR', id_cultivo, id_bacteria, id_antibiotico)
                    connection.query('INSERT INTO `tbl_detalle_cultivo_bacteria_antibiotico` SET?', {
                        id_cultivo: id_cultivo,
                        id_bacteria: id_bacteria,
                        id_antibiotico: id_antibiotico,
                        estatus: 1
                    }, (err, result) => {
                        if (err) {
                            console.log('no se pudo a agregar', err)
                            res.send('ERROR en CULTIVO!')
                        } else {
                            //console.log('agrego!!', result)
                            //res.send('AGREGO CULTIVO!')
                            resolve("1");
                        }
                    });
                });
            }
        }else if(req.body.num == '2'){
        
        ////////VERIFICAR NOMBRE DEL CULTIVO/////////
        const sql = "SELECT cultivo_nombre, id_cultivo FROM `tbl_cultivo` WHERE cultivo_nombre = '" + req.body.cultivo_nombre + "'";
        connection.query(sql, function (err, result, fie) {
            if (err) {
                console.log('error en la conexion intente de nuevo', err)
                res.send('3')
            }
            //console.log('pa ve el result', result);
			if (result.length <= 0) { modificar()}
			if (result.length > 0) { 
				if(result[0].id_cultivo == req.body.id_cultivo){
					modificar()
				}else{
					res.send('Ya existe otro cultivo con el mismo nombre')
				}
			}
        })
        //////////////////////////////////////////
        /////////MODIFICAR/////////
        function modificar(){
            const sql = "UPDATE tbl_cultivo SET cultivo_nombre = '" + req.body.cultivo_nombre + "', cultivo_codigo = '" + req.body.cultivo_codigo + "', cultivo_precio = '" + req.body.cultivo_precio + "', id_departamento = '" + req.body.id_departamento + "', id_categoria = '" + req.body.id_categoria + "', id_color_tubo = '" + req.body.id_color_tubo + "' WHERE id_cultivo = '" + req.body.id_cultivo + "'";
			
			connection.query(sql, function (error, result, fields) {
                if (result) {
                    res.send('MODIFICO!')
                }else if(error){
                    console.log('Error en la modificacion:', error)
                    res.send('ERROR EN LA MODIFICACION!')
                }
            });
        }
        //////////////////////////

    }else if(req.body.num == '3'){

        ////////ANULAR////////
		const sql = "UPDATE tbl_cultivo SET estatus = 0 WHERE id_cultivo = '" + req.body.id_cultivo + "'";
        connection.query(sql, function (error, result, fields) {
            if (result) {
                //res.send('1')
                anularRelaciones()
            }else if(error){
                console.log('Error en anulacion de la prueba:', error)
               // res.send('0')
               
            }
        });
        //////////////////////////

        function anularRelaciones(){
            const sql = "UPDATE `tbl_detalle_cultivo_bacteria_antibiotico` SET estatus = 0 WHERE id_cultivo = '" + req.body.id_cultivo + "'";
                connection.query(sql, function (error, result, fields) {
                    if (result) {
                        //console.log('ANULO')
                        res.send("1")
                    }else if(error){
                        console.log('Error en la anulacion de las ralciones:', error)
                        res.send("0")
                    }
                });
        }

    }else if(req.body.num == '4'){

        ////////ACTIVAR////////
		const sql = "UPDATE tbl_cultivo SET estatus = 1 WHERE id_cultivo = '" + req.body.id_cultivo + "'";
        connection.query(sql, function (error, result, fields) {
            if (result) {
                //res.send('1')
                activarRelaciones()
            }else if(error){
                console.log('Error en anulacion de la prueba:', error)
               // res.send('0')
               
            }
        });
        //////////////////////////

        function activarRelaciones(){
            const sql = "UPDATE `tbl_detalle_cultivo_bacteria_antibiotico` SET estatus = 1 WHERE id_cultivo = '" + req.body.id_cultivo + "'";
                connection.query(sql, function (error, result, fields) {
                    if (result) {
                        //console.log('ANULO')
                        res.send("1")
                    }else if(error){
                        console.log('Error en la anulacion de las ralciones:', error)
                        res.send("0")
                    }
                });
        }

    }
};

cultivoCtrl.configCultivoBacteriasAntibioticos = async(req, res)=>{

   //console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!', req.body)
   /////////////////////////////////////////////FALTA MODIFICAR LOS DATOS DEL CULTIVO//////////////////////////////////////
    if(req.body.num == 1){
        ////////MODIFICAR CULTIVOS////////
        let bacteriasREQ = req.body.bacteria;
        let bacteriasREQAUX;
        let idCultivoREQ = req.body.id_cultivo;
        //res.send(bacteriasREQ);

        let aviso = 0;
        let facturaM;
        facturaM = await modificarCultivo(req.body.id_cultivo);
        for(const item of bacteriasREQ){
            aviso = await checkBacteria(item.id_bacteria, idCultivoREQ);
            //console.log("AVISO!!!!", aviso)
            if(aviso == 0){
                //console.log("ENTRO EN AVISO!!!")
                await agregarDetalleBacteriaAntibiotico(item, idCultivoREQ);
            }else if(aviso == 1){
                await moduladorDeBacterias(item, idCultivoREQ);
            }
        }
        res.send("1")

        async function modificarCultivo(id_cultivo){
            return new Promise((resolve, reject) => {
                const sql = "UPDATE tbl_cultivo SET cultivo_nombre = '" + req.body.cultivo_nombre + "', cultivo_precio = '" + req.body.cultivo_precio + "', cultivo_codigo = '" + req.body.cultivo_codigo +"', id_departamento = '" + req.body.id_departamento + "', id_categoria = '" + req.body.id_categoria + "' WHERE id_cultivo = '" + req.body.id_cultivo + "'";
                connection.query(sql, function (err, result, fie) {
                    if (err) {
                        console.log('ERROR en CheckTemplate', err);
                        res.send('3');
                    }
                    if(result){
                        let aviso;
                        if(result.length == 0){
                            aviso = 0;
                            resolve(aviso)
                        }else{
                            aviso = 1;
                            resolve(aviso);
                        }
                    }
                })
            })
        }

        async function checkBacteria(idBacteria){
            return new Promise((resolve, reject) => {
                let sql = "SELECT id_bacteria FROM `tbl_detalle_cultivo_bacteria_antibiotico` WHERE id_bacteria ='" +idBacteria+"' AND id_cultivo ='" +idCultivoREQ+"'";
                connection.query(sql, function (err, result, fie) {
                    if (err) {
                        console.log('ERROR en CheckTemplate', err);
                        res.send('3');
                    }
                    if(result){
                        let aviso;
                        if(result.length == 0){
                            aviso = 0;
                            resolve(aviso)
                        }else{
                            aviso = 1;
                            resolve(aviso);
                        }
                    }
                })
            })
        }

        async function agregarDetalleBacteriaAntibiotico(item, idCultivoREQ){
            return new Promise((resolve, reject) => {
                let idBacteria = item.id_bacteria;
                for(const itemAntibiotico of item.antibioticos){
                    connection.query('INSERT INTO `tbl_detalle_cultivo_bacteria_antibiotico` SET?', {
                        id_cultivo: idCultivoREQ,
                        id_bacteria: idBacteria,
                        id_antibiotico: itemAntibiotico.id_antibiotico,
                        estatus: 1
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
                }
            })
        }

        async function moduladorDeBacterias(item, idCultivoREQ){
            return new Promise((resolve, reject) => {
                let idBacteria = item.id_bacteria;
                for(const itemAntibiotico of item.antibioticos){
                    let sql = "SELECT id_detalle_cultivo_bacteria_antibiotico FROM `tbl_detalle_cultivo_bacteria_antibiotico` WHERE id_bacteria ='" +idBacteria+"' AND id_cultivo ='" +idCultivoREQ+"' AND id_antibiotico ='" +itemAntibiotico.id_antibiotico+"'";
                    connection.query(sql, function (err, result, fie) {
                        if (err) {
                            console.log('ERROR en CheckTemplate', err);
                            res.send('3');
                        }
                        if(result){
                            let aviso;
                            //console.log("/88888888888888888888888888", result.length)
                            if(result.length == 0){
                                //console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
                                agregarEnlaceBacteriaAntibiotico(itemAntibiotico.id_antibiotico, idCultivoREQ, idBacteria)
                            }else if(result.length >= 1){
                                //console.log("000000000000000000000000000000000000000000000000000000000000")
                                activarEnlaceBacteriaAntibiotico(itemAntibiotico.id_antibiotico, idCultivoREQ, idBacteria)
                            }
                        }
                    })
                }
                resolve("1");
            })
        }

        async function agregarEnlaceBacteriaAntibiotico(id_antibiotico, idCultivoREQ, idBacteria){
            return new Promise((resolve, reject) => {
                    connection.query('INSERT INTO `tbl_detalle_cultivo_bacteria_antibiotico` SET?', {
                        id_cultivo: idCultivoREQ,
                        id_bacteria: idBacteria,
                        id_antibiotico: id_antibiotico,
                        estatus: 1
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

        async function activarEnlaceBacteriaAntibiotico(id_antibiotico, idCultivoREQ, idBacteria){
            return new Promise((resolve, reject) => {
                //const sql = "UPDATE tbl_cultivo SET estatus = 1 cultivo_nombre = '" + req.body.cultivo_nombre + "', cultivo_precio = '" + req.body.cultivo_precio + "', cultivo_codigo = '" + req.body.cultivo_codigo +"', id_departamento = '" + req.body.id_departamento + "', id_categoria = '" + req.body.id_categoria + "'";
                const sql = `UPDATE tbl_detalle_cultivo_bacteria_antibiotico SET estatus = 1 WHERE id_cultivo = ${idCultivoREQ} AND id_bacteria = ${idBacteria} AND id_antibiotico = ${id_antibiotico}`
                connection.query(sql, function (err, result, fie) {
                    if (err) {
                        console.log('ERROR en CheckTemplate', err);
                        res.send('3');
                    }
                    if(result){
                        resolve("1");
                    }
                })
            })
        }


        //////////////////////////
    }else if(req.body.num == 2){
        ///////////////////////////////ANULAR UNA RELACION CULTIVO BACTERIA ANTIBIOTICO///////////////////////////////////////////
        let items = Object.keys(req.body);
        let sql;
            sql = "UPDATE `tbl_detalle_cultivo_bacteria_antibiotico` SET estatus = 0 WHERE id_cultivo = " + req.body.id_cultivo + " AND id_detalle_cultivo_bacteria_antibiotico = " + req.body.id_detalle_cultivo_bacteria_antibiotico+'';
        
        connection.query(sql, (err, result) => {
            if (err) {
                console.log('no se pudo anular', err)
                res.send('ERROR!')
            } else {
                //console.log('anulo!!', result)
                res.send('1')
            }
        });
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    }else if(req.body.num == 3){
        ///////////////////////////////ACTIVAR UNA RELACION CULTIVO BACTERIA ANTIBIOTICO///////////////////////////////////////////
        let items = Object.keys(req.body);
        let sql;
        sql = "UPDATE `tbl_detalle_cultivo_bacteria_antibiotico` SET estatus = 1 WHERE id_cultivo = " + req.body.id_cultivo + " AND id_detalle_cultivo_bacteria_antibiotico = " + req.body.id_detalle_cultivo_bacteria_antibiotico+'';
        
        connection.query(sql, (err, result) => {
            if (err) {
                console.log('no se pudo anular', err)
                res.send('ERROR!')
            } else {
                //console.log('anulo!!', result)
                res.send('1')
            }
        });
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    }
    else if(req.body.num == 4){
        /////////////////////////////////////////ANULAR UNA BACTERIA Y TODAS SUS RELACIONES////////////////////////////////////////////////////
        let sql;
        sql = "UPDATE `tbl_detalle_cultivo_bacteria_antibiotico` SET estatus = 0 WHERE id_cultivo = " + req.body.id_cultivo + " AND id_bacteria = " + req.body.id_bacteria+'';
        
        connection.query(sql, (err, result) => {
            if (err) {
                console.log('no se pudo anular', err)
                res.send('ERROR!')
            } else {
                //console.log('anulo!!', result)
                res.send('1')
            }
        });
    } else if(req.body.num == 5){
        /////////////////////////////////////////ACTIVAR UNA BACTERIA Y TODAS SUS RELACIONES////////////////////////////////////////////////////
        let sql;
        sql = "UPDATE `tbl_detalle_cultivo_bacteria_antibiotico` SET estatus = 1 WHERE id_cultivo = " + req.body.id_cultivo + " AND id_bacteria = " + req.body.id_bacteria+'';
        
        connection.query(sql, (err, result) => {
            if (err) {
                console.log('no se pudo anular', err)
                res.send('ERROR!')
            } else {
                //console.log('anulo!!', result)
                res.send('1')
            }
        });
    }
}



module.exports = cultivoCtrl;