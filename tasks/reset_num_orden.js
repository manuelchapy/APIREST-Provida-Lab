const { Router } = require('express');
const cron = require('node-cron');

cron.schedule('* * * * * *', () => {
    console.log("PUTO")
})

module.exports = Router;