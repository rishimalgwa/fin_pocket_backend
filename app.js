const express = require('express')
require('./db/mongoose')
const userRouter = require("./routes/user")
const assetRouter = require("./routes/assets")
const app = express();

 
app.use(express.json());
app.use(userRouter)
app.use(assetRouter)

module.exports = app;
