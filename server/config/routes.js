const controllers = require('../controllers')
const auth = require('../config/auth')
let Article = require('mongoose').model('Article')

module.exports = (app) => {
  // get request
  /* app.get('/', (req, res) => {
    // render pug template
    res.render('index')
  })*/

  app.get('/', controllers.home.index)

  app.get('/about', controllers.home.about)

  app.get('/users/register', controllers.users.register)

  app.post('/users/create', controllers.users.create)

  app.get('/users/login', controllers.users.login)

  app.post('/users/authenticate', controllers.users.authenticate)

  app.post('/users/logout', controllers.users.logout)

  app.get('/articles/create', auth.isAuthenticated, controllers.articles.create)

  // app.post('/articles/upload', controllers.articles.upload)

  app.post('/articles/imgupload', controllers.articles.imgupload)

  app.get('/articles/review', controllers.articles.review)

  app.get('/articles/details/:id', auth.isAuthenticated, controllers.articles.details)

  app.get('/articles/restore/:id', auth.isAuthenticated, controllers.articles.restore)

  app.get('/articles/edit/:id', auth.isAuthenticated, controllers.articles.edit)

  app.get('/articles/remove/:id', auth.isAuthenticated, controllers.articles.remove)

  app.post('/articles/update', auth.isAuthenticated, controllers.articles.update)

  app.post('/articles/details/:id/uplaodComment', auth.isAuthenticated, controllers.articles.uplaodComment)

// app.get('/articles/comment', auth.isAuthenticated, controllers.articles.comment)




  app.all('*', (req, res) => {
    res.status(404)
    res.send('NOT FOUND')
    res.end()
  })
}
