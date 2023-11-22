const mysql = require('mysql');

//local host

const connection = mysql.createConnection({
	host: 'localhost',
	database: 'providadb',
	user: 'root',
	password: ''
});
	
///////////////////////////////////
//CLOUD

/*
const connection = mysql.createConnection({
	host: '74.208.147.248',
	database: 'bd_proyecto_chapy',
	user: 'adminchapy',
	password: '1s#lGi03'
});
*/
/////////////////////////////////////////////
/////////////////////////////////////////////

////////

connection.connect(function (error) {
	if (error) {
		throw error;
	} else {
		console.log('DB Connected')
	}
}),

module.exports = connection;