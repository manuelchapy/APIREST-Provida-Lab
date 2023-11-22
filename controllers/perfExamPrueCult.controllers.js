const perfExamPrueCultCtrl = {};
const session = require('express-session');
const connection = require('../src/database');

perfExamPrueCultCtrl.examenes = async(req, res) =>{
    console.log('sesion por login', session.user)
    const sql = "SELECT tbl_examen.id_examen, tbl_examen.examen_codigo, tbl_examen.examen_nombre, tbl_examen.examen_precio, tbl_examen.examen_referencia, tbl_departamento.departamento_nombre, tbl_categoria.categoria_nombre FROM `tbl_examen` INNER JOIN tbl_departamento ON tbl_departamento.id_departamento = tbl_examen.id_departamento INNER JOIN tbl_categoria ON tbl_categoria.id_categoria = tbl_examen.id_categoria WHERE estatus = 1 AND tbl_examen.examen_precio > 0";
    connection.query(sql, function (err, result, fie) {
		if (err) {
			console.log('error en la conexion intente de nuevo', err)
			res.send('3')
		}
        //console.log('el result examen: ', result)
		res.send(result);
	})
};

perfExamPrueCultCtrl.examenesAnulados = async(req, res) =>{
    console.log('sesion por login', session.user)
    const sql = "SELECT tbl_examen.id_examen, tbl_examen.examen_codigo, tbl_examen.examen_nombre, tbl_examen.examen_precio, tbl_departamento.departamento_nombre, tbl_categoria.categoria_nombre FROM `tbl_examen` INNER JOIN tbl_departamento ON tbl_departamento.id_departamento = tbl_examen.id_departamento INNER JOIN tbl_categoria ON tbl_categoria.id_categoria = tbl_examen.id_categoria WHERE (estatus = 0 OR examen_precio = 0)";
    connection.query(sql, function (err, result, fie) {
		if (err) {
			console.log('error en la conexion intente de nuevo', err)
			res.send('3')
		}
        //console.log('el result examen: ', result)
		res.send(result);
	})
};

perfExamPrueCultCtrl.departamentosCategoriasTubos = async(req, res) =>{
    console.log('sesion por login', session.user)
    console.log('ERRRR REQUEJM', req.body)
    //const sql = "SELECT * FROM `tbl_examen`+ WHERE id_examen = '" + req.body.id_examen+"'";
    const sql = "SELECT * FROM `tbl_departamento`";
    connection.query(sql, function (err, result, fie) {
		if (err) {
			console.log('error en la conexion intente de nuevo', err)
			res.send('3')
		}
        //console.log('el result examen: ', result)
        let departamentos = result;
		//res.send(result);
        categorias(departamentos)
	})

    function categorias(departamentos){
        const sql = "SELECT * FROM `tbl_categoria`";
        connection.query(sql, function (err, result, fie) {
            if (err) {
                console.log('error en la conexion intente de nuevo', err)
                res.send('3')
            }
            //console.log('el result examen: ', result)
            let categorias = result;
            /*let catDep = [];
            catDep.push({
                departamentos: departamentos,
                categorias: categorias
            })
            res.send(catDep);*/
            tubos(departamentos, categorias);
        })
    }

    function tubos(departamentos, categorias){
        const sql = "SELECT * FROM `tbl_tubo`";
        connection.query(sql, function (err, result, fie) {
            if (err) {
                console.log('error en la conexion intente de nuevo', err)
                res.send('3')
            }
            //console.log('el result examen: ', result)
            let tubos = result;
            let catDepTub = [];
            catDepTub.push({
                departamentos: departamentos,
                categorias: categorias,
                tubos: tubos
            })
            res.send(catDepTub);

        })
    }
}

perfExamPrueCultCtrl.buscarExamen = async(req, res) =>{
    console.log('sesion por login', session.user)
    console.log('ERRRR REQUEJM', req.body)
   
    const sql = "SELECT tbl_examen.id_examen, tbl_examen.examen_codigo, tbl_examen.examen_nombre, tbl_examen.examen_precio, tbl_examen.examen_referencia, tbl_examen.id_color_tubo, tbl_departamento.departamento_nombre, tbl_departamento.id_departamento, tbl_categoria.categoria_nombre, tbl_categoria.id_categoria FROM `tbl_examen` INNER JOIN tbl_departamento ON tbl_departamento.id_departamento = tbl_examen.id_departamento INNER JOIN tbl_categoria ON tbl_categoria.id_categoria = tbl_examen.id_categoria WHERE id_examen = '" + req.body.id_examen + "'";

    
    connection.query(sql, function (err, result, fie) {
		if (err) {
			console.log('error en la conexion intente de nuevo', err)
			res.send('3')
		}
        //console.log('el result examen: ', result)
		res.send(result);
	})
};

perfExamPrueCultCtrl.examenPruebas = async(req, res) =>{
    console.log('sesion por login', session.user)
    console.log('ERRRR REQUEJM', req.body)
   
   
   //const sql = "SELECT tbl_examen.id_examen, tbl_examen.examen_codigo, tbl_examen.examen_nombre, tbl_examen.examen_precio, tbl_examen.id_color_tubo, tbl_departamento.departamento_nombre, tbl_departamento.id_departamento, tbl_categoria.categoria_nombre, tbl_categoria.id_categoria FROM `tbl_examen` INNER JOIN tbl_departamento ON tbl_departamento.id_departamento = tbl_examen.id_departamento INNER JOIN tbl_categoria ON tbl_categoria.id_categoria = tbl_examen.id_categoria WHERE id_examen = '" + req.body.id_examen + "'";
   const sql = "SELECT tbl_detalle_examen_prueba.id_prueba, tbl_prueba.prueba_nombre FROM `tbl_detalle_examen_prueba` INNER JOIN `tbl_prueba` ON tbl_prueba.id_prueba = tbl_detalle_examen_prueba.id_prueba WHERE tbl_detalle_examen_prueba.id_examen='" + req.body.id_examen + "' AND tbl_detalle_examen_prueba.estatus = 1"; 


    connection.query(sql, function (err, result, fie) {
		if (err) {
			console.log('error en la conexion intente de nuevo', err)
			res.send('3')
		}
        //console.log('el result examen: ', result)
		res.send(result);
	})
};

perfExamPrueCultCtrl.buscarPerfil = async(req, res) =>{
    console.log('sesion por login', session.user)
    console.log('ERRRR REQUEJM', req.body)
    const sql = "SELECT * FROM `tbl_perfil` WHERE id_perfil = '" + req.body.id_perfil+"'";
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

perfExamPrueCultCtrl.perfiles = async(req, res)=>{
    const sql = "SELECT * FROM `tbl_perfil` WHERE estatus = 1";
    connection.query(sql, function (err, result, fie) {
		if (err) {
			console.log('error en la conexion intente de nuevo', err)
			res.send('3')
		}
        console.log('el result perfil: ', result)
		res.send(result);
	})
};

perfExamPrueCultCtrl.perfilesAnulados = async(req, res)=>{
    const sql = "SELECT * FROM `tbl_perfil` WHERE estatus = 0";
    connection.query(sql, function (err, result, fie) {
		if (err) {
			console.log('error en la conexion intente de nuevo', err)
			res.send('3')
		}
        console.log('el result perfil: ', result)
		res.send(result);
	})
};

perfExamPrueCultCtrl.perfilExamenes = async(req, res)=>{
    const sql = "SELECT * FROM `tbl_examen` INNER JOIN `tbl_detalle_perfil_cultivo_examen` ON tbl_examen.id_examen = tbl_detalle_perfil_cultivo_examen.id_examen WHERE tbl_detalle_perfil_cultivo_examen.id_perfil='" + req.body.id_perfil + "'";
    connection.query(sql, function (err, result, fie) {
		if (err) {
			console.log('error en la conexion intente de nuevo', err)
			res.send('3')
		}
        console.log('el result perfil: ', result)
		res.send(result);
	})
};


////////////////////CONFIGURACION DE EXAMENES//////////////////////
perfExamPrueCultCtrl.configExamenes = async(req, res)=>{

    console.log(req.body);
    if(req.body.num == '1'){
        //////////AGREGAR/////////
        const sql = "SELECT examen_nombre FROM `tbl_examen` WHERE examen_codigo = '" + req.body.examen_codigo + "'";
        connection.query(sql, function (err, result, fie) {
            if (err) {
                console.log('error en la conexion intente de nuevo', err)
                res.send('3')
            }
            //console.log('pa ve el result', result);
            if (result.length <= 0) { agregar()}
            if (result.length > 0)  { res.send('DUPLICADO!')}
        })
        function agregar() {
            console.log('PASO A AGREGAR')
            connection.query('INSERT INTO `tbl_examen` SET?', {
                examen_codigo: req.body.examen_codigo,
                examen_nombre: req.body.examen_nombre,
                examen_precio: req.body.examen_precio,
                examen_referencia: req.body.examen_referencia,
                id_departamento: req.body.id_departamento,
                id_categoria: req.body.id_categoria,
                id_color_tubo: req.body.id_color_tubo,
                estatus: 1
            }, (err, result) => {
                if (err) {
                    console.log('no se pudo a agregar', err)
                    res.send('ERROR!')
                } else {
                    console.log('agrego!!', result)
                    //res.send('AGREGO!')
                    buscarExamen()
                }
            });
        }

        function buscarExamen(){
            const sql = "SELECT id_examen FROM `tbl_examen` WHERE examen_codigo = '" + req.body.examen_codigo + "'";
            connection.query(sql, function (err, result, fie) {
                if (err) {
                    console.log('error en la conexion intente de nuevo', err)
                    res.send('3')
                }else {
                    conteoPruebas(result)
                }
            })
        }

        function conteoPruebas(resultCP){
            
            console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!OAAAXSSSSSS',resultCP[0].id_examen);
            const sql = "SELECT id_prueba, id_examen FROM `tbl_detalle_examen_prueba` WHERE id_examen = '" + resultCP[0].id_examen + "' AND tbl_detalle_examen_prueba.estatus = 1";
                    connection.query(sql, function (err, result, fie) {
                        if (err) {
                            console.log('error en la conexion intente de nuevo', err)
                            res.send('3')
                        }
                        //console.log('el result perfilaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa: ', result)
                        //res.send(result);
                        filtrar(result, resultCP);
                        //res.send(result)
                    })
        }

        function filtrar(result, resultCP){
            let pruebasDB = result.filter(item => item.id_prueba != null);
            let pruebasREQ = req.body.pruebas;
            let arrayFiltrado = [];
            let noCoinci = 0;
            //console.log('!!!!!!!!!!!!!!!!!!!!!!!!', values, items)
            for(let i=0; i<pruebasREQ.length; i++){
                for(let j=0; j<pruebasDB.length; j++){
                    //console.log(req.body.examenes[j].idExamen)
                        if(pruebasREQ[i].idPrueba == pruebasDB[j].id_prueba){
                            pruebasREQ[i].idPrueba = null;
                        }
                }
            }
            arrayFiltrado = pruebasREQ.filter(item => item.idPrueba != null);
            let myValues = new Array(arrayFiltrado.length);
            for(let i=0;i<arrayFiltrado.length;i++){
                myValues[i] = new Array(4);
            }
            console.log('el array filtrado', arrayFiltrado)
            for(let i=0; i<arrayFiltrado.length; i++){
                    myValues[i][0]=null;
                    myValues[i][1]=resultCP[0].id_examen;
                    myValues[i][2]=arrayFiltrado[i].idPrueba;
                    myValues[i][3]=1;

            }
            console.log('los values del insert', myValues)
            if(myValues.length == 0){
                res.send('AGREGO!')
            }else{
                const sql = 'INSERT INTO tbl_detalle_examen_prueba (id_detalle_examen_prueba, id_examen, id_prueba, estatus) VALUES?';
                connection.query(sql, [myValues], (err, result) => {
                    if (err) {
                        console.log('no se pudo a agregar', err)
                        res.send('ERROR!')
                    } else {
                        console.log('agrego!!', result)
                        res.send('AGREGO!')
                    }
                });
            }
            
        }
        //////////////////////////  

    }else if(req.body.num == '2'){

        /////////MODIFICAR SIN CODIGO/////////
        const sql = "UPDATE tbl_cultivo SET cultivo_nombre = '" + req.body.cultivo_nombre + "', cultivo_precio = '" + req.body.cultivo_precio + "', id_departamento = '" + req.body.id_departamento + "', id_categoria = '" + req.body.id_categoria + "', id_color_tubo = '" + req.body.id_color_tubo + "' WHERE id_cultivo = '" + req.body.id_cultivo + "'";
        //const sql = "UPDATE tbl_examen SET examen_codigo = '" + req.body.examen_codigo + "', examen_nombre = '" + req.body.examen_nombre + "', id_departamento = '" + req.body.id_departamento + "', id_categoria = '" + req.body.id_categoria + "'WHERE id_examen = '" + req.body.id_examen + "'";
        connection.query(sql, function (error, result, fields) {
            if (result) {
                res.send('MODIFICO!')
            }else if(error){
                console.log('Error en la modificacion:', error)
                res.send('ERROR EN LA MODIFICACION!')
            }
        });
        //////////////////////////

    }else if(req.body.num == '3'){

        ////////ANULAR EXAMENES Y RELACIONES////////
        const sql = "UPDATE tbl_examen SET estatus = 0 WHERE id_examen = '" + req.body.id_examen + "'";
        connection.query(sql, function (error, result, fields) {
            if (result) {
                console.log('ANULO')
                //res.send("1")
                anularRelaciones();
            }else if(error){
                console.log('Error en la eliminacion de perfil:', error)
                res.send("0")
            }
        });
        //////////////////////////
        function anularRelaciones(){
            const sql = "UPDATE tbl_detalle_examen_prueba SET estatus = 0 WHERE id_examen = '" + req.body.id_examen + "'";
                connection.query(sql, function (error, result, fields) {
                    if (result) {
                        console.log('ANULO')
                        res.send("1")
                    }else if(error){
                        console.log('Error en la anulacion de las ralciones:', error)
                        res.send("0")
                    }
                });
        }

    }else if(req.body.num == '4'){

        ////////ACTIVAR EXAMENES Y RELACIONES////////
        const sql = "UPDATE tbl_examen SET estatus = 1 WHERE id_examen = '" + req.body.id_examen + "'";
        connection.query(sql, function (error, result, fields) {
            if (result) {
                console.log('ANULO')
                //res.send("1")
                activarRelaciones();
            }else if(error){
                console.log('Error en la eliminacion de perfil:', error)
                res.send("0")
            }
        });
        //////////////////////////
        function activarRelaciones(){
            const sql = "UPDATE tbl_detalle_examen_prueba SET estatus = 1 WHERE id_examen = '" + req.body.id_examen + "'";
                connection.query(sql, function (error, result, fields) {
                    if (result) {
                        console.log('ANULO')
                        res.send("1")
                    }else if(error){
                        console.log('Error en la anulacion de las ralciones:', error)
                        res.send("0")
                    }
                });
        }

    }
};

perfExamPrueCultCtrl.configPerfiles = async(req, res)=>{
    console.log(req.body);
    if(req.body.num == '1'){
        //////////AGREGAR/////////
        const sql = "SELECT perfil_nombre FROM `tbl_perfil` WHERE perfil_nombre = '" + req.body.perfil_nombre + "'";
        connection.query(sql, function (err, result, fie) {
            if (err) {
                console.log('error en la conexion intente de nuevo', err)
                res.send('3')
            }
            //console.log('pa ve el result', result);
            if (result.length <= 0) { agregar()}
            if (result.length > 0)  { res.send('DUPLICADO PERFIL!')}
        })
        function agregar() {
            console.log('PASO A AGREGAR')
            connection.query('INSERT INTO `tbl_perfil` SET?', {
                perfil_nombre: req.body.perfil_nombre
            }, (err, result) => {
                if (err) {
                    console.log('no se pudo a agregar', err)
                    res.send('ERROR en PERFIL!')
                } else {
                    console.log('agrego!!', result)
                    //res.send('AGREGO PERFIL!')
                    buscarPerfil();
                }
            });
        }

        function buscarPerfil(){
            const sql = "SELECT id_perfil FROM `tbl_perfil` WHERE perfil_nombre = '" + req.body.perfil_nombre + "'";
            connection.query(sql, function (err, result, fie) {
                if (err) {
                    console.log('error en la conexion intente de nuevo', err)
                    res.send('3')
                }else {
                    console.log('KOMTUGEDER',result);
                    conteoExamenes(result)
                }
            })
        }

        function conteoExamenes(resultCP){
            
            console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!OAAAXSSSSSS',resultCP[0].id_perfil);
            const sql = "SELECT id_examen FROM `tbl_detalle_perfil_cultivo_examen` WHERE id_perfil = '" + resultCP[0].id_perfil + "' AND tbl_detalle_perfil_cultivo_examen.estatus = 1";
                    connection.query(sql, function (err, result, fie) {
                        if (err) {
                            console.log('error en la conexion intente de nuevo', err)
                            res.send('3')
                        }
                        console.log('el result perfilaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa: ', result)
                        //res.send(result);
                        filtrar(result, resultCP);
                        //res.send(result)
                    })
        }

        function filtrar(result, resultCP){
            let examenesDB = result.filter(item => item.id_examen != null);
            let examenesREQ = req.body.examenes;
            let arrayFiltrado = [];
            let noCoinci = 0;
            //console.log('!!!!!!!!!!!!!!!!!!!!!!!!', values, items)
            for(let i=0; i<examenesREQ.length; i++){
                for(let j=0; j<examenesDB.length; j++){
                    //console.log(req.body.examenes[j].idExamen)
                        if(examenesREQ[i].idExamen == examenesDB[j].id_examen){
                            examenesREQ[i].idExamen = null;
                        }
                }
            }
            arrayFiltrado = examenesREQ.filter(item => item.idExamen != null);
            let myValues = new Array(arrayFiltrado.length);
            for(let i=0;i<arrayFiltrado.length;i++){
                myValues[i] = new Array(4);
            }
            console.log('el array filtrado', arrayFiltrado)
            for(let i=0; i<arrayFiltrado.length; i++){
                    myValues[i][0]=resultCP[0].id_perfil;
                    myValues[i][1]=arrayFiltrado[i].idExamen;
                    myValues[i][2]=null;
                    myValues[i][3]=1;
            }
            console.log('los values del insert', myValues)
            if(myValues.length == 0){
                res.send('AGREGO!')
            }else{
                const sql = 'INSERT INTO tbl_detalle_perfil_cultivo_examen (id_perfil, id_examen, id_cultivo, estatus) VALUES?';
                connection.query(sql, [myValues], (err, result) => {
                    if (err) {
                        console.log('no se pudo a agregar', err)
                        res.send('ERROR!')
                    } else {
                        console.log('agrego!!', result)
                        res.send('AGREGO!')
                    }
                });
            }
            
        }
        //////////////////////////  

    }else if(req.body.num == '2'){
        
        ////////VERIFICAR NOMBRE DEL PERFIL/////////
        const sql = "SELECT perfil_nombre FROM `tbl_perfil` WHERE perfil_nombre = '" + req.body.perfil_nombre + "'";
        connection.query(sql, function (err, result, fie) {
            if (err) {
                console.log('error en la conexion intente de nuevo', err)
                res.send('3')
            }
            //console.log('pa ve el result', result);
            if (result.length <= 0) { modificar()}
            if (result.length > 0)  { res.send('DUPLICADO PERFIL!')}
        })
        //////////////////////////////////////////
        /////////MODIFICAR/////////
        function modificar(){
            const sql = "UPDATE tbl_perfil SET perfil_nombre = '" + req.body.perfil_nombre + "'WHERE id_perfil = '" + req.body.id_perfil + "'";
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

        ////////ANULAR PERFIL Y RELACIONES////////
                const sql = "UPDATE tbl_perfil SET estatus = 0 WHERE id_perfil = '" + req.body.id_perfil + "'";
                connection.query(sql, function (error, result, fields) {
                    if (result) {
                        console.log('ANULO')
                        //res.send("1")
                        anularRelaciones();
                    }else if(error){
                        console.log('Error en la eliminacion de perfil:', error)
                        res.send("0")
                    }
                });
                //////////////////////////
                function anularRelaciones(){
                    const sql = "UPDATE tbl_detalle_perfil_cultivo_examen SET estatus = 0 WHERE id_perfil = '" + req.body.id_perfil + "'";
                        connection.query(sql, function (error, result, fields) {
                            if (result) {
                                console.log('ANULO')
                                res.send("1")
                            }else if(error){
                                console.log('Error en la anulacion de las ralciones:', error)
                                res.send("0")
                            }
                        });
                }
    }else if(req.body.num == '4'){

        ////////ACTIVAR PERFIL Y RELACIONES////////
                const sql = "UPDATE tbl_perfil SET estatus = 1 WHERE id_perfil = '" + req.body.id_perfil + "'";
                connection.query(sql, function (error, result, fields) {
                    if (result) {
                        console.log('ANULO')
                        //res.send("1")
                        activarRelaciones();
                    }else if(error){
                        console.log('Error en la eliminacion de perfil:', error)
                        res.send("0")
                    }
                });
                //////////////////////////
                function activarRelaciones(){
                    const sql = "UPDATE tbl_detalle_perfil_cultivo_examen SET estatus = 1 WHERE id_perfil = '" + req.body.id_perfil + "'";
                        connection.query(sql, function (error, result, fields) {
                            if (result) {
                                console.log('ANULO')
                                res.send("1")
                            }else if(error){
                                console.log('Error en la anulacion de las ralciones:', error)
                                res.send("0")
                            }
                        });
                }
    }
};

perfExamPrueCultCtrl.configPerfilExamenes = async(req, res)=>{
    //console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!', req.body)
    if(req.body.num == 1){
        ////////AGREGAR EXAMENES A PERFILES////////
        const sql = "SELECT id_examen FROM `tbl_detalle_perfil_cultivo_examen` WHERE id_perfil='" + req.body.id_perfil + "'";
        connection.query(sql, function (err, result, fie) {
            if (err) {
                console.log('error en la conexion intente de nuevo', err)
                res.send('3')
            }
            //console.log('el result perfil: ', result)
            //res.send(result);
            filtrar(result);
        })

        function modificarPerfil(){
            const sql = "UPDATE tbl_perfil SET perfil_nombre = '" + req.body.perfil_nombre + "'WHERE id_perfil = '" + req.body.id_perfil + "'";
            connection.query(sql, function (error, result, fields) {
                if (result) {
                    res.send('MODIFICO!')
                }else if(error){
                    console.log('Error en la modificacion:', error)
                    res.send('ERROR EN LA MODIFICACION!')
                }
            });
        }


        function filtrar(result){
            let examenesDB = result.filter(item => item.id_examen != null);
            let examenesREQ = req.body.examenes;
            let arrayFiltrado = [];
            let noCoinci = 0;
            //console.log('!!!!!!!!!!!!!!!!!!!!!!!!', values, items)
            for(let i=0; i<examenesREQ.length; i++){
                for(let j=0; j<examenesDB.length; j++){
                    //console.log(req.body.examenes[j].idExamen)
                        if(examenesREQ[i].idExamen == examenesDB[j].id_examen){
                            examenesREQ[i].idExamen = null;
                        }
                }
            }
            arrayFiltrado = examenesREQ.filter(item => item.idExamen != null);
            let myValues = new Array(arrayFiltrado.length);
            for(let i=0;i<arrayFiltrado.length;i++){
                myValues[i] = new Array(4);
            }
            console.log('el array filtrado', arrayFiltrado)
            for(let i=0; i<arrayFiltrado.length; i++){
                    myValues[i][0]=req.body.id_perfil;
                    myValues[i][1]=arrayFiltrado[i].idExamen;
                    myValues[i][2]=null;
                    myValues[i][3]=1;

            }
            console.log('los values del insert', myValues)
            if(myValues.length == 0){
                modificarPerfil()
            }else{
                const sql = 'INSERT INTO tbl_detalle_perfil_cultivo_examen (id_perfil, id_examen, id_cultivo, estatus) VALUES?';
                connection.query(sql, [myValues], (err, result) => {
                    if (err) {
                        console.log('no se pudo a agregar', err)
                        res.send('ERROR!')
                    } else {
                        console.log('agrego!!', result)
                        modificarPerfil()
                    }
                });
            }
            
        }

        //////////////////////////
    }else if(req.body.num == 2){
        ///////////////////////////////ELIMINAR 1 EXAMEN O CULTIVO DE PERFIL///////////////////////////////////////////
        let items = Object.keys(req.body);
        let sql;
        if(items[2] == 'id_examen'){
            sql = "DELETE FROM `tbl_detalle_perfil_cultivo_examen` WHERE id_examen = " + req.body.id_examen + " AND id_perfil = " + req.body.id_perfil;
        }else if(items[2]=='id_cultivo'){
            sql = "DELETE FROM `tbl_detalle_perfil_cultivo_examen` WHERE id_cultivo = " + req.body.id_cultivo + " AND id_perfil = " + req.body.id_perfil;
        }
        connection.query(sql, (err, result) => {
            if (err) {
                console.log('no se pudo eliminar', err)
                res.send('ERROR!')
            } else {
                console.log('agrego!!', result)
                res.send('1')
            }
        });
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    }
    
};

perfExamPrueCultCtrl.configExamenPruebas = async(req, res)=>{
    console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!', req.body)
    if(req.body.num == 1){
        ////////CREAR EXAMEN Y AGREGAR PRUEBAS A EXAMENES////////
        const sql = "SELECT id_prueba FROM `tbl_detalle_examen_prueba` WHERE id_examen = '" + req.body.id_examen + "' AND tbl_detalle_examen_prueba.estatus = 1";
        connection.query(sql, function (err, result, fie) {
            if (err) {
                console.log('error en la conexion intente de nuevo', err)
                res.send('3')
            }
            //console.log('el result perfil: ', result)
            //res.send(result);
            filtrar(result);
            //res.send(result)
        })

        function modificarExamen(){
            //const sql = "UPDATE tbl_perfil SET perfil_nombre = '" + req.body.perfil_nombre + "'WHERE id_perfil = '" + req.body.id_perfil + "'";
            const sql = "UPDATE tbl_examen SET examen_codigo = '" + req.body.examen_codigo + "', examen_nombre = '" + req.body.examen_nombre + "', examen_precio = '" + req.body.examen_precio + "', examen_referencia = '" + req.body.examen_referencia + "', id_departamento = '" + req.body.id_departamento + "', id_categoria = '" + req.body.id_categoria + "', id_color_tubo = '" + req.body.id_color_tubo + "' WHERE id_examen = '" + req.body.id_examen + "'";
            connection.query(sql, function (error, result, fields) {
                if (result) {
                    res.send('MODIFICO!')
                }else if(error){
                    console.log('Error en la modificacion:', error)
                    res.send('ERROR EN LA MODIFICACION!')
                }
            });
        }


        function filtrar(result){
            let pruebasDB = result.filter(item => item.id_prueba != null);
            let pruebasREQ = req.body.pruebas;
            let arrayFiltrado = [];
            let noCoinci = 0;
            //console.log('!!!!!!!!!!!!!!!!!!!!!!!!', values, items)
            for(let i=0; i<pruebasREQ.length; i++){
                for(let j=0; j<pruebasDB.length; j++){
                    //console.log(req.body.examenes[j].idExamen)
                        if(pruebasREQ[i].idPrueba == pruebasDB[j].id_prueba){
                            pruebasREQ[i].idPrueba = null;
                        }
                }
            }
            arrayFiltrado = pruebasREQ.filter(item => item.idPrueba != null);
            let myValues = new Array(arrayFiltrado.length);
            for(let i=0;i<arrayFiltrado.length;i++){
                myValues[i] = new Array(4);
            }
            console.log('el array filtrado', arrayFiltrado)
            for(let i=0; i<arrayFiltrado.length; i++){
                    myValues[i][0]=null;
                    myValues[i][1]=req.body.id_examen;
                    myValues[i][2]=arrayFiltrado[i].idPrueba;
                    myValues[i][3]=1;

            }
            console.log('los values del insert', myValues)
            if(myValues.length == 0){
                modificarExamen()
            }else{
                const sql = 'INSERT INTO tbl_detalle_examen_prueba (id_detalle_examen_prueba, id_examen, id_prueba, estatus) VALUES?';
                connection.query(sql, [myValues], (err, result) => {
                    if (err) {
                        console.log('no se pudo a agregar', err)
                        res.send('ERROR!')
                    } else {
                        console.log('agrego!!', result)
                        modificarExamen()
                    }
                });
            }
            
        }

        //////////////////////////
    }else if(req.body.num == 2){
        ///////////////////////////////ANULAR 1 PRUEBA DE EXAMEN///////////////////////////////////////////
        let items = Object.keys(req.body);
        let sql;
            sql = "UPDATE `tbl_detalle_examen_prueba` SET estatus = 0 WHERE id_examen = " + req.body.id_examen + " AND id_prueba = " + req.body.id_prueba;

        connection.query(sql, (err, result) => {
            if (err) {
                console.log('no se pudo ANULAR', err)
                res.send('ERROR!')
            } else {
                console.log('ANULO!!', result)
                res.send('1')
            }
        });
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    }
    
};


module.exports = perfExamPrueCultCtrl;