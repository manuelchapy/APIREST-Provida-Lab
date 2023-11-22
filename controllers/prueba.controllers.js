const pruebaCtrl = {};
const session = require('express-session');
const connection = require('../src/database');

pruebaCtrl.pruebas = async(req, res) =>{
    console.log('sesion por login', session.user)
    const sql = "SELECT * FROM tbl_prueba WHERE estatus = 1";
    connection.query(sql, function (err, result, fie) {
		if (err) {
			console.log('error en la conexion intente de nuevo', err)
			res.send('3')
		}
        //console.log('el result examen: ', result)
		res.send(result);
	})
};

pruebaCtrl.pruebasAnuladas = async(req, res) =>{
    console.log('sesion por login', session.user)
    const sql = "SELECT * FROM tbl_prueba WHERE estatus = 0";
    connection.query(sql, function (err, result, fie) {
		if (err) {
			console.log('error en la conexion intente de nuevo', err)
			res.send('3')
		}
        //console.log('el result examen: ', result)
		res.send(result);
	})
};

pruebaCtrl.buscarPrueba = async(req, res) =>{
    console.log('sesion por login', session.user)
    console.log('ERRRR REQUEJM', req.body)
    const sql = "SELECT * FROM `tbl_prueba` WHERE id_prueba = '" + req.body.id_prueba+"'";
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

pruebaCtrl.configPruebas = async(req, res)=>{ 
    console.log(req.body);
    if(req.body.num == '1'){
        //////////AGREGAR/////////
        const sql = "SELECT prueba_nombre FROM `tbl_prueba` WHERE prueba_nombre = '" + req.body.prueba_nombre + "'";
        connection.query(sql, function (err, result, fie) {
            if (err) {
                console.log('error en la conexion intente de nuevo', err)
                res.send('3')
            }
            //console.log('pa ve el result', result);
            if (result.length <= 0) { agregar()}
            if (result.length > 0)  { res.send('PRUEBA DUPLICADA!')}
        })
        function agregar() {
            console.log('PASO A AGREGAR')
            connection.query('INSERT INTO `tbl_prueba` SET?', {
                prueba_nombre: req.body.prueba_nombre,
				valor_de_referencia: req.body.valor_de_referencia,
                tipo_de_campo: req.body.tipo_de_campo,
                prueba_unidad: req.body.prueba_unidad,
				estatus: 1
            }, (err, result) => {
                if (err) {
                    console.log('no se pudo a agregar', err)
                    res.send('ERROR en PERFIL!')
                } else {
                    console.log('agrego!!', result)
                    res.send('AGREGO PERFIL!')
                }
            });
        }
        //////////////////////////  

    }else if(req.body.num == '2'){
        
        ////////VERIFICAR NOMBRE DE LA PRUEBA/////////
        //console.log("JUANESJUANESJUANESJUANESJUANESJUANESJUANESJUANRSJUANRSJUANES", req.body)
        const sql = "SELECT prueba_nombre, id_prueba FROM `tbl_prueba` WHERE prueba_nombre = '" + req.body.prueba_nombre + "'";
        connection.query(sql, function (err, result, fie) {
            if (err) {
                console.log('error en la conexion intente de nuevo', err)
                res.send('3')
            }
            //console.log('pa ve el result', result);
			if (result.length <= 0) { modificar()}
			if (result.length > 0) { 
				if(result[0].id_prueba == req.body.id_prueba){
					modificar()
				}else{
					res.send('Ya existe otra prueba con el mismo nombre')
				}
			}
        })
        //////////////////////////////////////////
        /////////MODIFICAR/////////
        function modificar(){
            const sql = "UPDATE tbl_prueba SET prueba_nombre = '" + req.body.prueba_nombre + "', valor_de_referencia = '" + req.body.valor_de_referencia + "', tipo_de_campo = '" + req.body.tipo_de_campo + "', prueba_unidad = '" + req.body.prueba_unidad + "' WHERE id_prueba = '" + req.body.id_prueba + "'";
           // const sql = "UPDATE tbl_examen SET examen_codigo = '" + req.body.examen_codigo + "', examen_nombre = '" + req.body.examen_nombre + "', examen_precio = '" + req.body.examen_precio + "', id_departamento = '" + req.body.id_departamento + "', id_categoria = '" + req.body.id_categoria + "', id_color_tubo = '" + req.body.id_color_tubo + "' WHERE id_examen = '" + req.body.id_examen + "'";
			
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
		const sql = "UPDATE tbl_prueba SET estatus = 0 WHERE id_prueba = '" + req.body.id_prueba + "'";
        connection.query(sql, function (error, result, fields) {
            if (result) {
                res.send('1')
            }else if(error){
                console.log('Error en anulacion de la prueba:', error)
                res.send('0')
            }
        });
        //////////////////////////

    }else if(req.body.num == '4'){
                ////////ACTIVAR////////
		const sql = "UPDATE tbl_prueba SET estatus = 1 WHERE id_prueba = '" + req.body.id_prueba + "'";
        connection.query(sql, function (error, result, fields) {
            if (result) {
                res.send('1')
            }else if(error){
                console.log('Error en anulacion de la prueba:', error)
                res.send('0')
            }
        });
        //////////////////////////
    }
};

module.exports = pruebaCtrl;