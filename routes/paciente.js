const { Router } = require('express');
const ctrlPaciente	= require('../controllers/paciente.controllers');
const router = Router();

router.route('/pacientes')
		.get(ctrlPaciente.pacientes)

router.route('/pacientesAnulados')
		.get(ctrlPaciente.pacientesAnulados)		

router.route('/configPaciente')
		.post(ctrlPaciente.configPaciente)

router.route('/buscarPacientePorId')
		.post(ctrlPaciente.buscarPacientePorId)
		
router.route('/buscarPacientePorCedula')
		.post(ctrlPaciente.buscarPacientePorCedula)	

router.route('/crearYEnviarPaciente')
		.post(ctrlPaciente.crearYEnviarPaciente)
		
router.route('/generos')
		.get(ctrlPaciente.generos)	

router.route('/historialPaciente/:id_paciente')
		.get(ctrlPaciente.historialPaciente)	

module.exports = router;