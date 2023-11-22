const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();
const session = require('express-session');


app.set('port', process.env.PORT || 3000);


// middlewares
app.use(express.urlencoded({extended: false}));	
app.use(cors()); //cada vez que llegue una petición a mi servidor va permitir poder enviar y recibir datos
app.use(express.json()); //desde mi servidor se puede ver info en formato json y string
app.use(session({
	secret: '24781279_provida',
	resave: true,
	sevenUninitialized: true
}));
app.use(require('../routes'));
//app.use(require('../tasks'));
//app.use(require('../tasks/reset_num_orden'));
app.use(require('../routes/index'));
app.use(require('../routes/bancos'));
app.use(require('../routes/tiposDePago'));
app.use(require('../routes/ctrlPerfExamPrueCult'));
app.use(require('../routes/usuario'));
app.use(require('../routes/facturacion'));
app.use(require('../routes/cliente'));
app.use(require('../routes/paciente'));
app.use(require('../routes/divisa'));
app.use(require('../routes/prueba'));
app.use(require('../routes/cultivo'));
app.use(require('../routes/bacteria'));
app.use(require('../routes/antibiotico'));
app.use(require('../routes/administracionFiscal'));
app.use(require('../routes/resultados'));
app.use(require('../routes/ordenes'));
app.use(require('../routes/convenios'));
app.use(require('../routes/documentos'));
app.use(require('../routes/recibo'));
app.use(require('../routes/roles'));

//static files
app.use('/public',express.static(path.join(__dirname, '../public')));

module.exports = app;