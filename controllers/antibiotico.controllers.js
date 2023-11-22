const antibioticoCtrl = {};
const session = require('express-session');
const connection = require('../src/database');


antibioticoCtrl.antibioticos = async(req, res) =>{
    console.log('sesion por login', session.user)
    const sql = "SELECT * FROM tbl_antibiotico WHERE estatus = 1 ORDER BY antibiotico_nombre ASC";
    connection.query(sql, function (err, result, fie) {
		if (err) {
			console.log('error en la conexion intente de nuevo', err)
			res.send('3')
		}
        //console.log('el result examen: ', result)
		res.send(result);
	})
};

antibioticoCtrl.antibioticosAnulados = async(req, res) =>{
    console.log('sesion por login', session.user)
    const sql = "SELECT * FROM tbl_antibiotico WHERE estatus = 0 ORDER BY antibiotico_nombre ASC";
    connection.query(sql, function (err, result, fie) {
		if (err) {
			console.log('error en la conexion intente de nuevo', err)
			res.send('3')
		}
        //console.log('el result examen: ', result)
		res.send(result);
	})
};

antibioticoCtrl.buscarAntibiotico = async(req, res) =>{
    console.log('sesion por login', session.user)
    console.log('ERRRR REQUEJM', req.body)
    const sql = "SELECT * FROM `tbl_antibiotico` WHERE id_antibiotico = '" + req.body.id_antibiotico+"'";
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

antibioticoCtrl.configAntibioticos = async(req, res)=>{ 
    console.log(req.body);
    if(req.body.num == '1'){
        //////////AGREGAR/////////
        const sql = "SELECT antibiotico_nombre FROM `tbl_antibiotico` WHERE antibiotico_nombre = '" + req.body.antibiotico_nombre + "'";
        connection.query(sql, function (err, result, fie) {
            if (err) {
                console.log('error en la conexion intente de nuevo', err)
                res.send('3')
            }
            //console.log('pa ve el result', result);
            if (result.length <= 0) { agregar()}
            if (result.length > 0)  { res.send('2')}
        })
        function agregar() {
            console.log('PASO A AGREGAR')
            connection.query('INSERT INTO `tbl_antibiotico` SET?', {
                antibiotico_nombre: req.body.antibiotico_nombre,
				estatus: 1
            }, (err, result) => {
                if (err) {
                    console.log('no se pudo a agregar', err)
                    res.send('ERROR en BACTERIA!')
                } else {
                    console.log('agrego!!', result)
                    res.send('1')
                }
            });
        }
        //////////////////////////  

    }else if(req.body.num == '2'){
        
        ////////VERIFICAR NOMBRE DE LA PRUEBA/////////
        const sql = "SELECT antibiotico_nombre, id_antibiotico FROM `tbl_antibiotico` WHERE antibiotico_nombre = '" + req.body.antibiotico_nombre + "'";
        connection.query(sql, function (err, result, fie) {
            if (err) {
                console.log('error en la conexion intente de nuevo', err)
                res.send('3')
            }
            //console.log('pa ve el result', result);
			if (result.length <= 0) { modificar()}
			if (result.length > 0) { 
				if(result[0].id_antibiotico == req.body.id_antibiotico){
					modificar()
				}else{
					res.send('2')
				}
			}
        })
        //////////////////////////////////////////
        /////////MODIFICAR/////////
        function modificar(){
            const sql = "UPDATE tbl_antibiotico SET antibiotico_nombre = '" + req.body.antibiotico_nombre+ "' WHERE id_antibiotico = '" + req.body.id_antibiotico + "'";
			
			connection.query(sql, function (error, result, fields) {
                if (result) {
                    res.send('1')
                }else if(error){
                    console.log('Error en la modificacion:', error)
                    res.send('3')
                }
            });
        }
        //////////////////////////

    }else if(req.body.num == '3'){

        ////////ANULAR////////
		const sql = "UPDATE tbl_antibiotico SET estatus = 0 WHERE id_antibiotico = '" + req.body.id_antibiotico + "'";
        connection.query(sql, function (error, result, fields) {
            if (result) {
                res.send('1')
            }else if(error){
                console.log('Error en anulacion de la prueba:', error)
                res.send('3')
            }
        });
        //////////////////////////
    }else if(req.body.num == '4'){
        ////////ACTIVAR////////
		const sql = "UPDATE tbl_antibiotico SET estatus = 1 WHERE id_antibiotico = '" + req.body.id_antibiotico + "'";
        connection.query(sql, function (error, result, fields) {
            if (result) {
                res.send('1')
            }else if(error){
                console.log('Error en activacion del antibiotico:', error)
                res.send('3')
            }
        });
        //////////////////////////
    }
};

module.exports = antibioticoCtrl;