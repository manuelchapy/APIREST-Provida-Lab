const rolesCtrl = {};
const session = require('express-session');
const { rawListeners } = require('../src/database');
const connection = require('../src/database');

rolesCtrl.roles = async(req, res) =>{
    console.log('sesion por login', session.user)
    const sql = "SELECT * FROM `tbl_rol`";
    connection.query(sql, function (err, result, fie) {
		if (err) {
			console.log('error en la conexion intente de nuevo', err)
			res.send('3')
		}else{
			res.send(result);
		}
		
	})
};

rolesCtrl.tareas = async(req, res) =>{
    console.log('sesion por login', session.user)
    const sql = "SELECT * FROM `tbl_tarea`";
    connection.query(sql, function (err, result, fie) {
		if (err) {
			console.log('error en la conexion intente de nuevo', err)
			res.send('3')
		}else{
			res.send(result);
		}
		
	})
};

rolesCtrl.verificarPeticion = async(req, res) =>{
    //console.log('sesion por login', session.user)
    const sql = "SELECT * FROM `tbl_rol`";
    connection.query(sql, function (err, result, fie) {
		if (err) {
			console.log('error en la conexion intente de nuevo', err)
			res.send('3')
		}
        //console.log('el result examen: ', result)
		res.send(result);
	})
};

rolesCtrl.crearRol = async(req, res) =>{
    let idRol;
	await agregarRol(req.body.nombre_rol)
	idRol = await extraderIdRol()
    //res.send(idRol)
    for(const item of req.body.tareas){
		await agregarTareas(idRol.id_rol, item.id_tarea)
	}
    res.send("1");

	async function agregarRol(nombreRol){
        return new Promise((resolve, reject) => {
            connection.query('INSERT INTO `tbl_rol` SET?', {
				nombre_rol: nombreRol
            }, (err, result) => {
                if (err) {
                    console.log('no se pudo a agregar', err)
                    res.send('3')
                } else {
                    console.log('agrego!!', result)
                    resolve("1");
                }
            });
        });
    }

    
	async function agregarTareas(idRol, idTarea){
        return new Promise((resolve, reject) => {
            connection.query('INSERT INTO `tbl_rol_tarea` SET?', {
				id_rol: idRol,
				id_tarea: idTarea
            }, (err, result) => {
                if (err) {
                    console.log('no se pudo a agregar', err)
                    res.send('3')
                } else {
                    console.log('agrego!!', result)
                    resolve("1");
                }
            });
        });
    }
    
    async function extraderIdRol(){
        return new Promise((resolve, reject) => {
            let sql = "SELECT id_rol FROM tbl_rol WHERE nombre_rol = '" +req.body.nombre_rol+"'";
            connection.query(sql, function (err, result, fie) {
                if (err) {
                    console.log('error en la conexion intente de nuevo', err)
                    res.send('3')
                }else {
                    resolve(result[0]);
                }
            })
        })
    }
}



module.exports = rolesCtrl;