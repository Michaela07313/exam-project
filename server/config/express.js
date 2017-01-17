const express = require('express')
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')


module.exports = (config, app) => {
  // enable pug
  app.set('view engine', 'pug')
  app.set('views', config.rootPath + 'server/views')

  // enable static files from folder public
  app.use(express.static(config.rootPath + 'public'))

  app.use(bodyParser.urlencoded({ extended: true }))

  app.use(fileUpload())
  app.locals.moment = require('moment')
}
