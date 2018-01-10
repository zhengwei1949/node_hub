const express = require('express')
const app = express()
app.use('/node_modules',express.static('../node_modules'))
app.use(express.static('./views'))
app.listen(4000,()=>{
    console.log('web server running at http://127.0.0.1:4000')
})