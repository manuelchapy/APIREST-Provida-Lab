const indexCtrl = {};
const session = require('express-session');
const jwt = require('jsonwebtoken');
const connection = require('../src/database');

indexCtrl.home = async(req, res) =>{
    console.log('OLA K ASE');
    res.send('OLA K ASE');
};

/*indexCtrl.login = async(req, res) =>{
    const { user, passw } = req.body;
	const sql = "SELECT * FROM `tbl_usuario` WHERE usuario_username = '" + user + "'AND usuario_password = '"+passw+"'";
	connection.query(sql, function (err, result, fie) {
		if (err) {
			//throw err; 
			const response = {
				check: "3" //error de conexion con la DB
			};
			console.log(err);
			res.send(response)
		};

		const query = result[0]
		if (result.length <= 0) { res.send('no hay usuario') }
		if (result.length > 0) {
			process(query)
        }
	})

    function process(query){
        let response ={
            check:'8374920183'
        }
        let config = {
            sitio: 'provida-concordia',
            llave: '4325346576787897808906847364',
        };
        const token = jwt.sign(response, config.llave, {});
        session.user = {
            sesion: token,
            id: query.id_usuario,
            nombre: query.usuario_nombre,
            cedula: query.usuario_cedula,
            username: query.usuario_username,
            rol: query.usuario_rol,
            correo: query.usuario_correo
        }
        res.send('logeado!')
    }
};*/

indexCtrl.menu = async(req, res) =>{
    console.log('session desde menu', session.user)
    res.send('en menu!');
};

module.exports = indexCtrl;