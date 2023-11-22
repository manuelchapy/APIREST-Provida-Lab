const mysql = require('mysql');

//local host

const connection = mysql.createConnection({
	host: '',
	database: '',
	user: '',
	password: ''
});
	


connection.connect(function (error) {
	if (error) {
		throw error;
	} else {
		console.log('DB Connected')
	}
}),

module.exports = connection;