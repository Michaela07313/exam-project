const express = require('express')

let app = express()

// set the environment and the port
let env = process.env.NODE_ENV || 'developement'

// set the information from config.js file, based on the current environment - developemnt or production
let config = require('./server/config/config')[env]

// call the database connection
require('./server/config/database')(config)

// call the settings for express
require('./server/config/express')(config, app)

// call all routes
require('./server/config/routes')(app)

// call passport to authenticate the user
require('./server/config/passport')()

app.listen(config.port)
console.log('Express is ready!')
