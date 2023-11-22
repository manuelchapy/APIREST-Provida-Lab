const usuarioCtrl = {};
const session = require('express-session');
const connection = require('../src/database');
const uniqid = require('uniqid');
const e = require('express');
const keygen = require("keygenerator");
const { response } = require('express');
const { resolve } = require('path');
session.let = [];
const dbFunctionsUsuario = require("../public/functions/db_functions_usuarios");
const plantilla_sesion_usuario = require("../models/plantillas_sesiones_usuario");
const random = require("random-integer");


usuarioCtrl.login = async(req, res) =>{

    //session.let = {}
    /*let login;
    let usuarioResp = {};
    let token;

    login = await logeo();
    token = keygen.session_id();*/

    /*session.let = {
        usuario_username: login[0].usuario_username,
        id_usuario: login[0].id_usuario,
        id_rol: login[0].id_rol,
        token: keygen.session_id()
    }*/

    /*usuarioResp = {

    }
    
    session.let.push({
        usuario_username: login[0].usuario_username,
        id_usuario: login[0].id_usuario,
        id_rol: login[0].id_rol,
        token: token
    });

    usuarioResp = {
        usuario_username: login[0].usuario_username,
        id_usuario: login[0].id_usuario,
        id_rol: login[0].id_rol,
        token: token
    }
    
    console.log("!!!!!!!!!!!!!!!!!!!!!!", session, usuarioResp)
    res.send(usuarioResp);

        async function logeo(){
            return new Promise((resolve, reject) => {
                const sql = "SELECT * FROM tbl_usuario WHERE usuario_username = '"+req.body.usuario_username+"' AND usuario_password = '"+req.body.usuario_password+"'";
                connection.query(sql, function (err, result, fie) {
                    if (err) {
                        console.log('error en la conexion intente de nuevo', err)
                        res.send('3')
                    }else{
                        console.log(result)
                        if(result.length == 0){
                            res.send("0")
                        }else if(result.length > 0){
                            resolve(result);
                        }
                    }
                    //console.log('el result examen: ', result)

                })
            })
        }*/

        const { usuario_username, usuario_password } = req.body;
        //console.log(usuario_username)
        let usuario = await dbFunctionsUsuario.checkUsuario(req.body.usuario_username, 2)
        //console.log(usuario, req.body)
        if(usuario == '0'){
            res.send("0")
        }else {
            if(usuario.usuario_password == usuario_password){
    
                /*plantilla_sesion_usuario.sesiones.forEach(function(sesion, index){
                    if(sesion.id_usuario == usuario.id_usuario){
                        plantilla_sesion_usuario.sesiones.splice(index);
                    }
                })*/
    
                let usuario_obj = {
                    id: random(1, 10000),
                    id_usuario: usuario.id_usuario,
                    token: uniqid(),
                    usuario_nombre: usuario.usuario_nombre,
                    usuario_apellido: usuario.usuario_apellido,
                    usuario_cedula: usuario.usuario_cedula,
                    usuario_telefono: usuario.usuario_telefono,
                    usuario_username: usuario.usuario_username,
                    id_rol: usuario.id_rol
                }
                plantilla_sesion_usuario.sesion_usuario = {...usuario_obj};
                plantilla_sesion_usuario.sesiones.push(plantilla_sesion_usuario.sesion_usuario);
                console.log("!!!!!!", plantilla_sesion_usuario.sesiones)
                res.send(plantilla_sesion_usuario.sesion_usuario)
            }else{
               console.log("!!!!!! en 0", plantilla_sesion_usuario.sesiones)
                res.send("0")
            }
        }

}

usuarioCtrl.logout = async(req, res) =>{
    /*console.log(session.let)
        //session.let = null;
    console.log(session.let)
    res.send("1")*/
    //console.log("------------------", req.body, plantilla_sesion_usuario.sesiones)
    plantilla_sesion_usuario.sesiones.forEach(function(sesion, index){
        if((sesion.id_usuario == req.body.id_usuario) && (sesion.token == req.body.token)){
            //console.log("!!!!!!!!!!!!!!!!!!!!", sesion)
            plantilla_sesion_usuario.sesiones.splice(index, 1);
        }
    })
    console.log("*****", plantilla_sesion_usuario.sesiones)
    res.send("1")
}

usuarioCtrl.accesoAControladores = async(req, res) =>{
    /*session.let = {
        nombre: "Manuel",
        id_usuario: 1,
        id_rol: 1,
        token: "KVY111"
    }*/
    //console.log(session.let.token);
    let check = 0;
    plantilla_sesion_usuario.sesiones.forEach(function(sesion, index){
        //console.log("9999999999999999", req.body, sesion)
        if((sesion.id_usuario == req.body.id_usuario) && (sesion.token == req.body.token)){
            //console.log(">>>>>>>>>>>>>>>>", sesion)
           check = 1;
        }
    })
    //console.log("!!!!!!!!!!", req.body)
    //console.log("EN ACCESO A CONTROLADORES", session)
    if(check == 0){
        res.send("x")
    }else{
        //console.log(session.let)
        let tarea;
        let idRol = req.body.id_rol;
        let permiso;
        let usuario;
       // usuario = await buscarUsuario()
       // console.log("................................", usuario)
        tarea = await buscarTarea(tarea)
        //console.log("=+++++++", tarea)
        if(tarea == 0){
            res.send("0")
        }else {
            permiso = await confirmarTarea(tarea.id_tarea, idRol, permiso)
            //console.log("!!!!!!!!!!!!!!!!!!!!!!",permiso)
            if(permiso == "0"){
                await registrarMovimientoUsuario("NO TIENE PERMITIDO INGRESAR")
                res.send("0")
            }else{
                await registrarMovimientoUsuario("TIENE PERMITIDO INGRESAR")
                res.send("1")
            }
        }
    
        async function registrarMovimientoUsuario(descripcion){
            return new Promise((resolve, reject) => {
                let time = new Date(new Date().toLocaleString("en-US", {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: true
                }))
                connection.query('INSERT INTO `tbl_registro_usuario` SET?', {
    
                    //id_usuario: session.let.id_usuario,
                    id_usuario: req.body.id_usuario,
                    id_tarea: req.body.id_tarea,
                    descripcion: descripcion,
                    fecha: time 
                }, (err, result) => {
                    if (err) {
                        console.log('no se pudo a agregar', err)
                        res.send('3');
                    } else {
                        console.log('agrego!!', result)
                        resolve("1");
                    }
                });
            });
        }
    
        async function buscarTarea(tarea){
            return new Promise((resolve, reject) => {
                const sql = "SELECT * FROM `tbl_tarea` WHERE id_tarea = '"+req.body.id_tarea+"'";
                connection.query(sql, function (err, result, fie) {
                    if (err) {
                        console.log('error en la conexion intente de nuevo', err)
                        res.send('3')
                    }
                    //console.log('el result examen: ', result)
                    if(result.length == 0){
                        tarea = 0;
                    }else if(result.length > 0){
                        tarea = result[0];
                    }
                    resolve(tarea);
                })
            })
        }
    
        async function confirmarTarea(idTarea, idRol, permiso){
            return new Promise((resolve, reject) => {
                const sql = "SELECT id_tarea FROM `tbl_rol_tarea` WHERE id_rol = '"+idRol+"'";
                connection.query(sql, function (err, result, fie) {
                    if (err) {
                        console.log('error en la conexion intente de nuevo', err)
                        res.send('3')
                    }
                    //console.log('el result examen: ', result)
                    if(result.length == 0){
                        permiso = "0";
                        resolve(permiso)
                    }else{
                        for(const item of result){
                            if(idTarea == item.id_tarea){
                                permiso = "1";
                            }
                        }
                        if(permiso == "1"){
                            resolve(permiso);
                        }else {
                            permiso = "0";
                            resolve(permiso);
                        }
                    }
                })
            })
        }

        async function buscarUsuario(){
            return new Promise((resolve, reject) => {
                let respuesta = "0";
                for(const usuario of session.let){
                    if(usuario.token == req.body.token){
                        console.log("que carajo?", usuario)
                        respuesta = "1";
                    }
                }
                if(respuesta == "0"){
                    res.send("x")
                }else{
                    resolve(respuesta)
                }
            })
        }
        //res.send(tarea);
    }
    
}

usuarioCtrl.verificarToken = async(req, res) =>{
    //console.log("mmmmmmmmmmmmmmmmmmm", req.body.token, plantilla_sesion_usuario)
    if(req.body.token === undefined || req.body.token == 'undefined'){
        res.send("0")
    }else{
        console.log("PASO!!!!!!")
        let usuarioResp = "x"
    
        for(let sesion of plantilla_sesion_usuario.sesiones){
            if(sesion.token == req.body.token){
                usuarioResp = "1";
            }
        }
        if(usuarioResp == "1"){
            console.log(usuarioResp)
            res.send(usuarioResp);
         }else{
            console.log(usuarioResp)
            res.send(usuarioResp);
         } 
    }
}

usuarioCtrl.usuarios = async(req, res) =>{
    const sql = "SELECT tbl_usuario.id_usuario, tbl_usuario.usuario_nombre, tbl_usuario.usuario_apellido, tbl_usuario.usuario_cedula, tbl_usuario.usuario_username, tbl_usuario.usuario_telefono, tbl_usuario.usuario_correo FROM `tbl_usuario` WHERE estatus = 1";
    connection.query(sql, function (err, result, fie) {
		if (err) {
			console.log('error en la conexion intente de nuevo', err)
			res.send('3')
		}
        //console.log('el result examen: ', result)
		res.send(result);
	})
};

usuarioCtrl.usuariosAnulados = async(req, res) =>{
    const sql = "SELECT tbl_usuario.id_usuario, tbl_usuario.usuario_nombre, tbl_usuario.usuario_apellido, tbl_usuario.usuario_cedula, tbl_usuario.usuario_username, tbl_usuario.usuario_telefono, tbl_usuario.usuario_correo FROM `tbl_usuario` WHERE estatus = 0";
    connection.query(sql, function (err, result, fie) {
		if (err) {
			console.log('error en la conexion intente de nuevo', err)
			res.send('3')
		}
        //console.log('el result examen: ', result)
		res.send(result);
	})
};

usuarioCtrl.buscarUsuario = async(req, res) =>{
    console.log('ola', req.body, session.let)
    let usuario;
    let roles;
    usuario = await buscar(usuario);
    //console.log("LOS ROLES", roles)
    res.send(usuario);

    async function buscar(usuario){
        return new Promise((resolve, reject) => {
            const sql = "SELECT tbl_usuario.id_usuario, tbl_usuario.usuario_nombre, tbl_usuario.usuario_apellido, tbl_usuario.usuario_cedula, tbl_usuario.usuario_username, tbl_usuario.usuario_telefono, tbl_usuario.usuario_password, tbl_usuario.usuario_correo, tbl_usuario.usuario_qr, tbl_usuario.id_rol, tbl_rol.nombre_rol FROM `tbl_usuario` LEFT JOIN tbl_rol ON tbl_rol.id_rol = tbl_usuario.id_rol WHERE id_usuario='"+req.body.id_usuario+"'";
            connection.query(sql, function (err, result, fie) {
                if (err) {
                    console.log('error en la conexion intente de nuevo', err)
                    res.send('3')
                }
                //console.log('el result examen: ', result)
                usuario = result;
                resolve(usuario)
            })
        })
    }
};

usuarioCtrl.configUsuario = async(req, res) =>{
    console.log('usuario', req.body)
    if(req.body.num == 1){
        ///////////////AGREGAR USUARIO///////////////////
        let idUsuario;
        idUsuario = await extraerIdUsuario()
        console.log("!!!!!", idUsuario)
        if(idUsuario == "0")
        {
            res.send("0")
        }else if(idUsuario == "1"){
            console.log('PASO A AGREGAR')
            await agregarUsuario();
        }
        ////////////////////////////////////////////////
    }else if(req.body.num == '2'){
        ///////////////MODIFICAR USUARIO///////////////////
        let conteo;
        console.log("!!!!!", req.body.usuario_telefono)
        const sql = "UPDATE tbl_usuario SET usuario_nombre = '"+req.body.usuario_nombre+"', usuario_apellido = '"+req.body.usuario_apellido+"', usuario_cedula = '"+req.body.usuario_cedula+"', usuario_username = '"+req.body.usuario_username+"', usuario_telefono = '"+req.body.usuario_telefono+"', id_rol = '"+req.body.id_rol+"', usuario_password = '"+req.body.usuario_password+"'  WHERE id_usuario= '"+req.body.id_usuario+"'";
        connection.query(sql, function (err, result, fie) {
            if (err) {
                console.log('error en la conexion intente de nuevo', err)
                res.send('3')
            }else{
                console.log('Usuario eliminado')
                res.send("1");
            }
        })
        //////////////////////////////////////////////////
    }else if(req.body.num == '3'){
        ///////////////ANULAR USUARIO///////////////////
        const sql = "UPDATE tbl_usuario SET estatus = 0 WHERE id_usuario= '"+req.body.id_usuario+"'";
        connection.query(sql, function (err, result, fie) {
            if (err) {
                console.log('error en la conexion intente de nuevo', err)
                res.send('3')
            }else{
                console.log('Usuario eliminado')
                res.send('ANULADO!')
            }
        })
        //////////////////////////////////////////////////
    }else if(req.body.num == '4'){
        ///////////////ACTIVAR USUARIO///////////////////
        const sql = "UPDATE tbl_usuario SET estatus = 1 WHERE id_usuario= '"+req.body.id_usuario+"'";
        connection.query(sql, function (err, result, fie) {
            if (err) {
                console.log('error en la conexion intente de nuevo', err)
                res.send('3')
            }else{
                console.log('Usuario eliminado')
                res.send('ACTIVADO!')
            }
        })
        //////////////////////////////////////////////////
    }
    
    ///////////////////////////////////////////////FUNCIONES AGREGAR USUARIO///////////////////////////////////////////////////
    async function agregarUsuario(){
        return new Promise((resolve, reject) => {
            connection.query('INSERT INTO `tbl_usuario` SET?', {
                usuario_nombre: req.body.usuario_nombre,
                usuario_apellido: req.body.usuario_apellido,
                usuario_cedula: req.body.usuario_cedula,
                usuario_username: req.body.usuario_username,
                usuario_password: req.body.usuario_password,
                usuario_correo: req.body.usuario_correo,
                id_rol: req.body.id_rol,
                usuario_qr: uniqid(),
                estatus: 1
            }, (err, result) => {
                if (err) {
                    console.log('no se pudo a agregar', err)
                    res.send('11')
                } else {
                    console.log('agrego!!', result)
                    res.send("1")
                }
            });
        });
    }

    async function extraerIdUsuario(){
        return new Promise((resolve, reject) => {
            const sql = "SELECT id_usuario FROM `tbl_usuario` WHERE usuario_cedula='"+req.body.usuario_cedula+"'";
            connection.query(sql, function (err, result, fields) {
            if (err) {
                    console.log('ERROR en CheckTemplate', err);
                    res.send('3');
                }
                if(result){
                    console.log("JOJOJOJOJOJOJO", result.length)
                    if(result.length == 0){
                        resolve("1")
                    }else if(result.length > 0){
                        resolve("0")
                    }
                }
            });
        })
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    //////////////////////////////////////////////////////////FUNCIONES MODIFICAR USUARIO//////////////////////////////////////////////////////

    async function modificarUsuario(){
        return new Promise((resolve, reject) => {
            const sql = "UPDATE tbl_usuario SET usuario_nombre = '" + req.body.usuario_nombre + "', usuario_apellido = '" + req.body.usuario_apellido + "', usuario_correo = '" + req.body.usuario_correo + "' WHERE id_usuario= '"+req.body.id_usuario+"'";
            connection.query(sql, function (err, result, fie) {
                if (err) {
                    console.log('error en la conexion intente de nuevo', err)
                    res.send('3')
                }else{
                    console.log('Usuario Modificado')
                    //res.send('Usuario modificado!')
                    resolve("1");
                }
            })
        })
    }

    async function buscarRol(idRol, idUsuario, conteo){
        return new Promise((resolve, reject) => {
            const sql = "SELECT id_rol_usuario FROM `tbl_rol_usuario` WHERE id_opcion_rol='"+idRol+"' AND id_usuario='"+idUsuario+"'";
            connection.query(sql, function (err, result, fie) {
                if (err) {
                    console.log('error en la conexion intente de nuevo', err)
                    res.send('3')
                }
                console.log('el result examen!!!!!!!!!!!!!!!!!!!: ', result.length);
                conteo = result.length;
                resolve(conteo)
                //roles = result;
                //resolve(roles)
            })
        })
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
}

usuarioCtrl.getTareasRolUsuario = async(req, res) =>{
    console.log('sesion por login', session.user)
    const sql = "SELECT tbl_rol_tarea.id_tarea, tbl_tarea.tarea_nombre FROM `tbl_rol_tarea` LEFT JOIN tbl_rol ON tbl_rol.id_rol = tbl_rol_tarea.id_rol LEFT JOIN tbl_tarea ON tbl_tarea.id_tarea = tbl_rol_tarea.id_tarea WHERE tbl_rol_tarea.id_rol = '"+req.body.id_rol+"'";
    connection.query(sql, function (err, result, fie) {
		if (err) {
			console.log('error en la conexion intente de nuevo', err)
			res.send('3')
		}else{
			res.send(result);
		}
		
	})
};

module.exports = usuarioCtrl;