//require('dotenv').config();
const {connect} = require('mongoose');
//import connect from "mongoose";

//funcion anonima
(async () => {
    try {
        const db = await connect("mongodb://127.0.0.1/providaQR")
        console.log('DB connected', db.connection.name)
    } catch (error) {
        console.error(error)
    }
})()
    
