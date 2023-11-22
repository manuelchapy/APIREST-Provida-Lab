const bancosCtrl = {};
const session = require('express-session');
const { updateLocale } = require('moment');
const connection = require('../src/database');

bancosCtrl.bancos = async(req, res) =>{
    const sql = "SELECT * FROM `tbl_banco`";
    let numFact;
    connection.query(sql, function (err, result, fields) {
        if (err) {
            console.log('ERROR', err);
            res.send('3');
        }
        if(result){
            res.send(result)
        }
    });
}

bancosCtrl.agregarBanco = async(req, res) =>{
    connection.query('INSERT INTO `tbl_banco` SET?', {
        banco_nombre: req.body.banco_nombre
    }, (err, result) => {
        if (err) {
            console.log('no se pudo a agregar', err)
            res.send('ERROR EN AGREGAR FACTURA!')
        } else {
            console.log('agrego!!', result)
            res.send("1");
        }
    });
}

bancosCtrl.modificarBanco = async(req, res) =>{
    const sql = "UPDATE tbl_banco SET banco_nombre = '" + req.body.banco_nombre+ "' WHERE id_banco = '" + req.body.id_banco + "'";
	connection.query(sql, function (error, result, fields) {
        if (result) {
            res.send('1')
        }else if(error){
            console.log('Error en la modificacion:', error)
            res.send('1')
        }
    });
}

module.exports = bancosCtrl;