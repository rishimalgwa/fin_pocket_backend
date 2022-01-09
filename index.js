require('dotenv').config({ path: './config/dev.env' })
const app = require('./app')

const port = process.env.PORT || 4000;

app.listen(port,()=>{
    console.log('SERVER UP AT '+port);
})