const { Router } = require('express');
const ctrlUsuario	= require('../controllers/usuario.controllers');
const router = Router();

router.route('/configUsuario')
		.post(ctrlUsuario.configUsuario)

router.route('/login')
		.post(ctrlUsuario.login)

router.route('/logout')
		.post(ctrlUsuario.logout)

router.route('/accesoAControladores')
		.post(ctrlUsuario.accesoAControladores)

router.route('/verificarToken')
		.post(ctrlUsuario.verificarToken)

router.route('/buscarUsuario')
		.post(ctrlUsuario.buscarUsuario)

router.route('/usuarios')
		.get(ctrlUsuario.usuarios)

router.route('/usuariosAnulados')
		.get(ctrlUsuario.usuariosAnulados)

router.route('/getTareasRolUsuario')
		.post(ctrlUsuario.getTareasRolUsuario)



module.exports = router;