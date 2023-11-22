const app = require('./app');
require('./database');
require('./database_mongo');
const connection = require('../src/database');
const cron = require('node-cron');

async function main(){ 
//funcion encargada de iniciar el programa
	await app.listen(app.get('port')); //desde app se obtiene el valer de port que es 3000
	console.log('server on port', app.get('port'));
	cron.schedule('0 0 1 * *', () => {
		const sqlUpdate = "UPDATE `tbl_numero_orden_tmp` SET numero_orden = 1 WHERE id_numero_orden = 1"
            connection.query(sqlUpdate, function (err, result, fie) {
                if (err) {
                    console.log('error en la conexion intente de nuevo', err)
                    res.send('3')
                }else{
					console.log("Numero de orden a 1") 
                }
            })
		
	})
}



main();