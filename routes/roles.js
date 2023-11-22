const { Router } = require('express');
const ctrlRoles	= require('../controllers/roles.controllers');
const router = Router();

router.route('/roles')
		.get(ctrlRoles.roles)

router.route('/tareas')
		.get(ctrlRoles.tareas)

router.route('/crearRol')
		.post(ctrlRoles.crearRol)


module.exports = router;