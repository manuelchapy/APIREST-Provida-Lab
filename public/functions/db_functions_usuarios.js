const dbFunctionsUsuario = {};
const connection = require('../../src/database');

dbFunctionsUsuario.checkUsuario = async(username, numero) => {
    let sql;
    if(numero == 1){
        sql = `SELECT usuario_username FROM tbl_usuario WHERE usuario_username = '${username}'`
    }else if(numero == 2){
        sql = `SELECT * FROM tbl_usuario WHERE usuario_username = '${username}'`
    }
    return new Promise((resolve, reject) => {
        connection.query(sql, function (err, result, fields) {
                if (err) {
                    console.log('ERROR en SELECT USUARIOS', err);
                    resolve('3')
                }
                if(result){
                    if(result.length > 0){
                        resolve(result[0])
                    }else{
                        resolve("0")
                    }   
                }
            });
        })
}

module.exports = dbFunctionsUsuario;