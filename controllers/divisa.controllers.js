const divisaCtrl = {};
const session = require('express-session');
const connection = require('../src/database');


divisaCtrl.divisas = async(req, res) =>{
    const sql = "SELECT * FROM `tbl_divisa`";
    connection.query(sql, function (err, result, fie) {
		if (err) {
			console.log('error en la conexion intente de nuevo', err)
			res.send('3')
		}
        //console.log('el result examen: ', result)
		res.send(result);
	})
};

divisaCtrl.historialDivisas = async(req, res) =>{
    const sql = "SELECT tbl_registro_divisa.id_registro_divisa, tbl_registro_divisa.id_divisa, tbl_registro_divisa.tasa_actual, DATE_FORMAT(tbl_registro_divisa.fecha, '%Y-%m-%d') AS fecha, tbl_divisa.divisa_nombre FROM `tbl_registro_divisa` INNER JOIN tbl_divisa ON tbl_divisa.id_divisa = tbl_registro_divisa.id_divisa WHERE tbl_registro_divisa.id_divisa='"+req.body.id_divisa+"'";
    connection.query(sql, function (err, result, fie) {
		if (err) {
			console.log('error en la conexion intente de nuevo', err)
			res.send('3')
		}
        //console.log('el result examen: ', result)
		res.send(result);
	})
};

divisaCtrl.agregarDivisa = async(req, res) =>{

	await agregar();
	res.send("1");

	async function agregar(){
		return new Promise((resolve, reject) => {
				connection.query('INSERT INTO `tbl_divisa` SET?', {
					divisa_nombre: req.body.divisa_nombre,
					estatus: 1
				}, (err, result) => {
					if (err) {
						console.log('no se pudo a agregar', err)
						res.send('ERROR EN AGREGAR FACTURA!')
					} else {
						console.log('agrego nota a credito!!')
						//res.send('AGREGO FACTURA!')
						resolve("1")
					}
				});
		})
	}
};


divisaCtrl.registroDivisas = async(req, res) =>{
	const sql = "SELECT a.tasa_actual, a.id_registro_divisa, a.id_divisa, c.divisa_nombre FROM tbl_registro_divisa a INNER JOIN tbl_divisa c ON c.id_divisa = a.id_divisa WHERE id_registro_divisa = (SELECT MAX(id_registro_divisa) FROM `tbl_registro_divisa` b WHERE a.id_divisa = b.id_divisa)"
	connection.query(sql, function (err, result, fie) {
		if (err) {
			console.log('error en la conexion intente de nuevo', err)
			res.send('3')
		}
        //console.log('el result examen: ', result)
		let divisas = {};
		divisas.registroDivisas = result;
		res.send(divisas);
	})
};

divisaCtrl.agregarTasaDivisa= async(req, res) =>{
	connection.query('INSERT INTO `tbl_registro_divisa` SET?', {
		id_divisa: req.body.id_divisa,
		tasa_actual: req.body.tasa_actual,
	}, (err, result) => {
		if (err) {
			console.log('no se pudo a agregar', err)
			res.send('ERROR EN AGREGAR DIVISA!')
		} else {
			console.log('agrego!!', result)
			res.send('1')
		}
	});
}

divisaCtrl.configDivisas = async(req, res) =>{
	 if(req.body.num == 2){
		///////////////// MODIFICAR DIVISA//////////////////
		const sql = "UPDATE tbl_divisa SET divisa_nombre = '" + req.body.divisa_nombre + "' WHERE id_divisa = '"+req.body.id_divisa+"'";
		connection.query(sql, function (err, result, fie) {
			if (err) {
				console.log('error en la conexion intente de nuevo', err)
				res.send('3')
			}else{
				console.log('divisa Modificada')
				res.send('1')
			}
		})
		////////////////////////////////////////////////////
	}else if(req.body.num == 3){
		///////////////// ANULAR DIVISA//////////////////
		const sql = "UPDATE tbl_divisa SET estatus = 0 WHERE id_divisa = '"+req.body.id_divisa+"'";
		connection.query(sql, function (err, result, fie) {
			if (err) {
				console.log('error en la conexion intente de nuevo', err)
				res.send('3')
			}else{
				console.log('divisa anulada')
				res.send('1')
			}
		})
		//////////////////////////////////////////////////
	}else if(req.body.num == 4){
		///////////////// ACTIVAR DIVISA//////////////////
		const sql = "UPDATE tbl_divisa SET estatus = 1 WHERE id_divisa = '"+req.body.id_divisa+"'";
		connection.query(sql, function (err, result, fie) {
			if (err) {
				console.log('error en la conexion intente de nuevo', err)
				res.send('3')
			}else{
				console.log('divisa anulada')
				res.send('1')
			}
		})
		//////////////////////////////////////////////////
	}
}

module.exports = divisaCtrl;