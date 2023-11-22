const { Router } = require('express');
const Ctrlindex	= require('../controllers/index.controllers');
const router = Router();

router.route('/')
		.get(Ctrlindex.home)

//router.route('/login')
		//.post(Ctrlindex.login)

router.route('/menu')
		.get(Ctrlindex.menu)




module.exports = router;