const { Router } = require('express');
const ctrlPerfExamPrueCult	= require('../controllers/perfExamPrueCult.controllers');
const router = Router();

router.route('/examenes')
		.get(ctrlPerfExamPrueCult.examenes)

router.route('/examenesAnulados')
		.get(ctrlPerfExamPrueCult.examenesAnulados)

router.route('/buscarExamen')
		.post(ctrlPerfExamPrueCult.buscarExamen)

router.route('/buscarPerfil')
		.post(ctrlPerfExamPrueCult.buscarPerfil)

router.route('/perfiles')
		.get(ctrlPerfExamPrueCult.perfiles)

router.route('/perfilesAnulados')
		.get(ctrlPerfExamPrueCult.perfilesAnulados)

router.route('/perfilExamenes')
		.post(ctrlPerfExamPrueCult.perfilExamenes)

router.route('/configExamenes')
		.post(ctrlPerfExamPrueCult.configExamenes)

router.route('/configPerfiles')
		.post(ctrlPerfExamPrueCult.configPerfiles)

router.route('/configPerfilExamenes')
		.post(ctrlPerfExamPrueCult.configPerfilExamenes)

router.route('/configExamenPruebas')
		.post(ctrlPerfExamPrueCult.configExamenPruebas)

router.route('/examenPruebas')
		.post(ctrlPerfExamPrueCult.examenPruebas)

router.route('/departamentosCategoriasTubos')
		.get(ctrlPerfExamPrueCult.departamentosCategoriasTubos)



module.exports = router;