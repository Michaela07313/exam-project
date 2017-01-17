const controllers = require('../controllers')
let addToHeader = (req, res, next) => {
  res.header('My-Authorization', 'Admin')
  if (!res.header('My-Authorization', 'Admin')) {
    res.status(404)
  }
  next()
}

module.exports = (app) => {
  app.get('/', controllers.home.index)

  app.get('/cars/create', controllers.cars.create)

  app.get('/cars/review', controllers.cars.review)

  app.post('/cars/imgupload', controllers.cars.imgupload)

  app.get('/cars/details/:id', controllers.cars.details)

  app.get('/cars/remove/:id', controllers.cars.remove)

  app.get('/cars/removed', controllers.cars.removed)

  app.get('/cars/restore/:id', controllers.cars.restore)

  app.post('/cars/details/:id/comment', controllers.cars.comment)

  app.get('/cars/stats', addToHeader, controllers.cars.stats)


  app.all('*', (req, res) => {
    res.status(404)
    res.send('NOT FOUND')
    res.end()
  })
}
