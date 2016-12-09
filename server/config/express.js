const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const passport = require('passport')
const fileUpload = require('express-fileupload')


module.exports = (config, app) => {
  // enable pug
  app.set('view engine', 'pug')
  app.set('views', config.rootPath + 'server/views')

  // enable static files from folder public
  app.use(express.static(config.rootPath + 'public'))

  // enable body,cookie parsers and passport
  app.use(cookieParser())
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(session({
    secret: 'neshto-taino!@#$%',
    resave: true,
    saveUninitialized: true
  }))
  app.use(passport.initialize())
  app.use(passport.session())

  app.use((req, res, next) => {
    if (req.user) {
      res.locals.currentUser = req.user
      // current ID session: console.log('current session:', req.sessionID)
    }
    next()
  })
  app.use(fileUpload())
  app.locals.moment = require('moment')
}
