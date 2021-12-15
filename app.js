const express = require('express')
require('./db/mongoose')
const testRouter = require("./routes/test")
const app = express();

 
app.use(express.json());
 app.use(testRouter)

module.exports = app;
