const bacteriaCtrl = {};
const session = require('express-session');
const connection = require('../src/database');


bacteriaCtrl.bacterias = async(req, res) =>{
    console.log('sesion por login', session.user)
    const sql = "SELECT * FROM tbl_bacteria WHERE estatus = 1 ORDER BY bacteria_nombre ASC";
    connection.query(sql, function (err, result, fie) {
		if (err) {
			console.log('error en la conexion intente de nuevo', err)
			res.send('3')
		}
        //console.log('el result examen: ', result)
		res.send(result);
	})
};

bacteriaCtrl.bacteriasAnuladas = async(req, res) =>{
    console.log('sesion por login', session.user)
    const sql = "SELECT * FROM tbl_bacteria WHERE estatus = 0 ORDER BY bacteria_nombre ASC";
    connection.query(sql, function (err, result, fie) {
		if (err) {
			console.log('error en la conexion intente de nuevo', err)
			res.send('3')
		}
        //console.log('el result examen: ', result)
		res.send(result);
	})
};

bacteriaCtrl.buscarBacteria = async(req, res) =>{
    console.log('sesion por login', session.user)
    console.log('ERRRR REQUEJM', req.body)
    const sql = "SELECT * FROM `tbl_bacteria` WHERE id_bacteria = '" + req.body.id_bacteria+"'";
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

bacteriaCtrl.configBacterias = async(req, res)=>{ 
    console.log(req.body);
    if(req.body.num == '1'){
        //////////AGREGAR/////////
        const sql = "SELECT bacteria_nombre FROM `tbl_bacteria` WHERE bacteria_nombre = '" + req.body.bacteria_nombre + "'";
        connection.query(sql, function (err, result, fie) {
            if (err) {
                console.log('error en la conexion intente de nuevo', err)
                res.send('3')
            }
            //console.log('pa ve el result', result);
            if (result.length <= 0) { agregar()}
            if (result.length > 0)  { res.send('2')} //DUPLICADO
        })
        function agregar() {
            console.log('PASO A AGREGAR')
            connection.query('INSERT INTO `tbl_bacteria` SET?', {
                bacteria_nombre: req.body.bacteria_nombre,
				estatus: 1
            }, (err, result) => {
                if (err) {
                    console.log('no se pudo a agregar', err)
                    res.send('3')
                } else {
                    console.log('agrego!!', result)
                    res.send('1')
                    //buscarAntibiotico();
                }
            });
        }
        /*
        function buscarAntibiotico(){
            const sql = "SELECT id_bacteria FROM `tbl_bacteria` WHERE bacteria_nombre = '" + req.body.bacteria_nombre + "'";
            connection.query(sql, function (err, result, fie) {
                if (err) {
                    console.log('error en la conexion intente de nuevo', err)
                    res.send('3')
                }else {
                    conteoDeAntibioticos(result)
                }
            })
        }

        function conteoDeAntibioticos(resultCA){
            const sql = "SELECT id_antibiotico FROM `tbl_detalle_bacteria_antibiotico` WHERE id_bacteria = '" + resultCA[0].id_bacteria + "'";
            connection.query(sql, function (err, result, fie) {
                if (err) {
                    console.log('error en la conexion intente de nuevo', err)
                    res.send('3')
                }
                console.log('el result de los antibioticos: ', result)
                //res.send(result);
                filtrar(result, resultCA);
            })
        }

        function filtrar(result, resultCA){
            console.log('!!!!!!!!!!!!!!!!!!!!!!!!', result)
            let antibioticosDB = result.filter(item => item.id_antibiotico != null);
            let antibioticosREQ = req.body.antibioticos;
            let arrayFiltrado = [];
            //let noCoinci = 0;
            console.log('!!!!!!!!!!!!!!!!!!!!!!!!', antibioticosDB)
            for(let i=0; i<antibioticosREQ.length; i++){
                for(let j=0; j<antibioticosDB.length; j++){
                    //console.log('AAAAAAAAAA', req.body.antibioticos[j].idAntibiotico)
                    //console.log('bbbbbbbbbb', antibioticosDB[j].id_antibiotico)
                        if(antibioticosREQ[i].idAntibiotico == antibioticosDB[j].id_antibiotico){
                            antibioticosREQ[i].idAntibiotico = null;
                        }
                }
            }
            arrayFiltrado = antibioticosREQ.filter(item => item.idAntibiotico != null);
            let myValues = new Array(arrayFiltrado.length);
            for(let i=0;i<arrayFiltrado.length;i++){
                myValues[i] = new Array(3);
            }
            console.log('el array filtrado', arrayFiltrado)
            for(let i=0; i<arrayFiltrado.length; i++){
                    myValues[i][0]=resultCA[0].id_bacteria;
                    myValues[i][1]=arrayFiltrado[i].idAntibiotico;
                    myValues[i][2]=1;

            }
            const sql = 'INSERT INTO tbl_detalle_bacteria_antibiotico (id_bacteria, id_antibiotico, estatus) VALUES?';
                connection.query(sql, [myValues], (err, result) => {
                    if (err) {
                        console.log('no se pudo a agregar', err)
                        res.send('ERROR!')
                    } else {
                        console.log('agrego!!', result)
                        res.send('AGREGO!');
                    }
                });
            
            
        }
        */
        //////////////////////////  

    }else if(req.body.num == '2'){
        
        ////////VERIFICAR NOMBRE DE LA PRUEBA/////////
        const sql = "SELECT bacteria_nombre, id_bacteria FROM `tbl_bacteria` WHERE bacteria_nombre = '" + req.body.bacteria_nombre + "'";
        connection.query(sql, function (err, result, fie) {
            if (err) {
                console.log('error en la conexion intente de nuevo', err)
                res.send('3')
            }
            //console.log('pa ve el result', result);
			if (result.length <= 0) { modificar()}
			if (result.length > 0) { 
				if(result[0].id_bacteria == req.body.id_bacteria){
					modificar()
				}else{
					res.send('2')
				}
			}
        })
        //////////////////////////////////////////
        /////////MODIFICAR/////////
        function modificar(){
            const sql = "UPDATE tbl_bacteria SET bacteria_nombre = '" + req.body.bacteria_nombre+ "' WHERE id_bacteria = '" + req.body.id_bacteria + "'";
			
			connection.query(sql, function (error, result, fields) {
                if (result) {
                    res.send('1')
                }else if(error){
                    console.log('Error en la modificacion:', error)
                    res.send('2')
                }
            });
        }
        //////////////////////////

    }else if(req.body.num == '3'){

        ////////ANULAR////////
		const sql = "UPDATE tbl_bacteria SET estatus = 0 WHERE id_bacteria = '" + req.body.id_bacteria + "'";
        connection.query(sql, function (error, result, fields) {
            if (result) {
                //res.send('1')
                anularBacteriaAntibioticos();
            }else if(error){
                console.log('Error en anulacion de la prueba:', error)
                res.send('3')
                
            }
        });

        function anularBacteriaAntibioticos(){
            let sql = "UPDATE tbl_detalle_bacteria_antibiotico SET estatus = 0 WHERE id_bacteria = '" + req.body.id_bacteria + "'";
            connection.query(sql, (err, result) => {
            if (err) {
                console.log('no se pudo anular', err)
                res.send('3')
            } else {
                console.log('Se anularon las relaciones bacteria antibioticos!!', result)
                res.send('1')
            }
        });
        }
        //////////////////////////

    }else if(req.body.num == '4'){

        ////////ACTIVAR////////
		const sql = "UPDATE tbl_bacteria SET estatus = 1 WHERE id_bacteria = '" + req.body.id_bacteria + "'";
        connection.query(sql, function (error, result, fields) {
            if (result) {
                //res.send('1')
                anularBacteriaAntibioticos();
            }else if(error){
                console.log('Error en anulacion de la prueba:', error)
                //res.send('0')
                
            }
        });

        function anularBacteriaAntibioticos(){
            let sql = "UPDATE tbl_detalle_bacteria_antibiotico SET estatus = 1 WHERE id_bacteria = '" + req.body.id_bacteria + "'";
            connection.query(sql, (err, result) => {
            if (err) {
                console.log('no se pudo anular', err)
                res.send('ERROR!')
            } else {
                console.log('Se activaron las relaciones bacteria antibioticos!!', result)
                res.send('1')
            }
        });
        }
        //////////////////////////

    }
};


//////////////////////////////////////////NO SE USA AUN///////////////////////////////////////////////////////////////////
bacteriaCtrl.relacionesBacteriasAntibioticos = async(req, res) =>{
    console.log('sesion por login', session.user)
    console.log('ERRRR REQUEJM', req.body)
   
   const sql = "SELECT tbl_detalle_bacteria_antibiotico.id_antibiotico, tbl_detalle_bacteria_antibiotico.id_detalle_bacteria_antibiotico, tbl_detalle_bacteria_antibiotico.id_bacteria, tbl_detalle_bacteria_antibiotico.id_antibiotico, tbl_bacteria.bacteria_nombre, tbl_antibiotico.antibiotico_nombre FROM `tbl_detalle_bacteria_antibiotico` INNER JOIN `tbl_antibiotico` ON tbl_antibiotico.id_antibiotico = tbl_detalle_bacteria_antibiotico.id_antibiotico INNER JOIN `tbl_bacteria` ON tbl_bacteria.id_bacteria = tbl_detalle_bacteria_antibiotico.id_bacteria WHERE tbl_detalle_bacteria_antibiotico.estatus = 1 ORDER BY bacteria_nombre"; 


    connection.query(sql, function (err, result, fie) {
		if (err) {
			console.log('error en la conexion intente de nuevo', err)
			res.send('3')
		}
        //console.log('el result examen: ', result)
		//res.send(result);
        crearRelacion(result)
	})

    function crearRelacion(result){
        let antibioticosDB = result.filter(item => item.antibiotico_nombre != null);
        let bacteriasDB    = result.filter(item => item.bacteria_nombre != null);
        let idBacteriaAntibiotico = result.filter(item => item.id_detalle_bacteria_antibiotico != null);
        let myJsons = [];

        for(let i=0; i<bacteriasDB.length; i++){
            myJsons.push({
                id_detalle_bacteria_antibiotico: idBacteriaAntibiotico[i].id_detalle_bacteria_antibiotico,
                relacion_bacteria_antibiotico: bacteriasDB[i].bacteria_nombre+' - '+antibioticosDB[i].antibiotico_nombre 
            })
        }

        console.log(myJsons)
        res.send(myJsons)
    }
};
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////NO SE USA AUN///////////////////////////////////////////////////////////////
bacteriaCtrl.bacteriaAntibioticos = async(req, res) =>{
    console.log('sesion por login', session.user)
    console.log('ERRRR REQUEJM', req.body)
   
   const sql = "SELECT tbl_detalle_bacteria_antibiotico.id_antibiotico, tbl_antibiotico.antibiotico_nombre FROM `tbl_detalle_bacteria_antibiotico` INNER JOIN `tbl_antibiotico` ON tbl_antibiotico.id_antibiotico = tbl_detalle_bacteria_antibiotico.id_antibiotico WHERE tbl_detalle_bacteria_antibiotico.id_bacteria='" + req.body.id_bacteria + "' AND tbl_detalle_bacteria_antibiotico.estatus = 1"; 


    connection.query(sql, function (err, result, fie) {
		if (err) {
			console.log('error en la conexion intente de nuevo', err)
			res.send('3')
		}
        //console.log('el result examen: ', result)
		res.send(result);
	})
};
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////NO SE USA AUN///////////////////////////////////////////////////////////////
bacteriaCtrl.configBacteriaAntibioticos = async(req, res)=>{
    console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!', req.body)
    ////////////////////////////////////////////NORMALIZACION ANTIGUA DE LA DB/////////////////////////////////////////
    if(req.body.num == 1){
        ////////AGREGAR ANTIBIOTICOS A BACTERIAS////////
        const sql = "SELECT id_antibiotico FROM `tbl_detalle_bacteria_antibiotico` WHERE id_bacteria = '" + req.body.id_bacteria + "'";
        connection.query(sql, function (err, result, fie) {
            if (err) {
                console.log('error en la conexion intente de nuevo', err)
                res.send('3')
            }
            console.log('el result de los antibioticos: ', result)
            //res.send(result);
            filtrar(result);
        })

        function modificarBacteria(){
            const sql = "UPDATE tbl_bacteria SET bacteria_nombre = '" + req.body.bacteria_nombre + "'WHERE id_bacteria = '" + req.body.id_bacteria + "'";
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
            console.log('!!!!!!!!!!!!!!!!!!!!!!!!', result)
            let antibioticosDB = result.filter(item => item.id_antibiotico != null);
            let antibioticosREQ = req.body.antibioticos;
            let arrayFiltrado = [];
            let noCoinci = 0;
            //console.log('!!!!!!!!!!!!!!!!!!!!!!!!', antibioticosDB)
            for(let i=0; i<antibioticosREQ.length; i++){
                for(let j=0; j<antibioticosDB.length; j++){
                    //console.log('AAAAAAAAAA', req.body.antibioticos[j].idAntibiotico)
                    //console.log('bbbbbbbbbb', antibioticosDB[j].id_antibiotico)
                        if(antibioticosREQ[i].idAntibiotico == antibioticosDB[j].id_antibiotico){
                            antibioticosREQ[i].idAntibiotico = null;
                        }
                }
            }
            arrayFiltrado = antibioticosREQ.filter(item => item.idAntibiotico != null);
            let myValues = new Array(arrayFiltrado.length);
            for(let i=0;i<arrayFiltrado.length;i++){
                myValues[i] = new Array(3);
            }
            console.log('el array filtrado', arrayFiltrado)
            for(let i=0; i<arrayFiltrado.length; i++){
                    myValues[i][0]=req.body.id_bacteria;
                    myValues[i][1]=arrayFiltrado[i].idAntibiotico;
                    myValues[i][2]=1;

            }
            console.log('los values del insert', myValues)
            if(myValues.length == 0){
                modificarBacteria()
            }else{
                const sql = 'INSERT INTO tbl_detalle_bacteria_antibiotico (id_bacteria, id_antibiotico, estatus) VALUES?';
                connection.query(sql, [myValues], (err, result) => {
                    if (err) {
                        console.log('no se pudo a agregar', err)
                        res.send('ERROR!')
                    } else {
                        console.log('agrego!!', result)
                        modificarBacteria()
                    }
                });
            }
            
        }

        //////////////////////////
    }else if(req.body.num == 2){
        ///////////////////////////////ANULAR UNA RELACION BACTERIA ANTIBIOTICO///////////////////////////////////////////
        let sql = "UPDATE `tbl_detalle_bacteria_antibiotico` SET estatus = 0 WHERE id_bacteria = " + req.body.id_bacteria + " AND id_antibiotico = " + req.body.id_antibiotico;
        
        connection.query(sql, (err, result) => {
            if (err) {
                console.log('no se pudo anular', err)
                res.send('ERROR!')
            } else {
                console.log('anulo!!', result)
                res.send('1')
            }
        });
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    }
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

module.exports = bacteriaCtrl;