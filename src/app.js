// Express init and config
const bodyParser = require('body-parser')
const express = require('express')
const errorHandler = require('./utils/errorHandler');
const app = express()
const port = 4000
require('dotenv').config()

//body-parser with error handler
app.use((req,res,next)=>{
    errorHandler(bodyParser.json(), req,res,next);
})

// Database init and config
const path = require('path')
const dbHelper = require('framework');
dbHelper.init(path.resolve(__dirname, "../data/users.sqlite"))

// Routes
const auth = require('./controller/auth')
app.use('/auth/', auth);

// Server init
app.listen(port, () => console.log(`Server listening on port ${port}!`))