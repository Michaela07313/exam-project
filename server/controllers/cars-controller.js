let Car = require('mongoose').model('Car')

module.exports = {
  create: (req, res) => {
    res.render('cars/create')
  },
  imgupload: (req, res, next) => {
    let image
    let createdCar = req.body
    if (!req.files) {
      res.render('cars/create')
      return
    }
    console.log('createdCar: ', createdCar)
    console.log('req.files', req.files)
    image = req.files.image
    console.log('image: ', image)
    createdCar.image = req.files.image.name
    console.log('newcreatedCar: ', createdCar)

    if (createdCar.make && createdCar.model && createdCar.price) {
      if (createdCar.image !== '') {
        image.mv('./public/images/' + req.files.image.name, (err) => {
          if (err) {
            res.status(500).send(err)
          } else {
            Car
            .create(createdCar)
            .then(createdCar => {
              res.redirect('/')
            })
          }
        })
      } else {
        Car
        .create(createdCar)
        .then(createdCar => {
          res.redirect('/')
        })
      }
    } else {
      createdCar.globalError = 'Please enter all fields.'
      res.render('cars/create', createdCar)
    }
  },
  review: (req, res) => {
    // Car.find({}).then(cars => {
    //   res.render('cars/review', {data: cars})
    // })
    Car
      .find()
      .where('deleteMarker').equals(false)
      .sort({ date: 'asc' })
      .exec((err, cars) => {
        if (err) console.log(err)
        Car.count().exec((err, count) => {
          if (err) console.log(err)
          res.render('cars/review', {
            cars: cars
          })
        })
      })
  },
  details: (req, res, next) => {
    let carId = req.params.id
    let query = Car.findById(carId)
    Car.findByIdAndUpdate({ _id: carId }, { $inc: { views: 1 }, new: true })
    .exec()

    Car.find(query, function (err, cars) {
      if (err) return next(err)
      query.exec(function (err, get) {
        if (err) return next(err)
        if (!get) return next()
        res.render('cars/details', { get: get, cars: cars })
      })
    })
  },
  remove: (req, res) => {
    let carId = req.params.id
    Car.findByIdAndUpdate({ _id: carId },
      {
        $set: { deleteMarker: true },
        new: true
      }
    )
    .exec()
    .then(
      res.redirect('/cars/details/' + carId)
    )
  },
  removed: (req, res) => {
    Car
      .find()
      .where('deleteMarker').equals(true)
      .sort({ date: 'asc' })
      .exec((err, cars) => {
        if (err) console.log(err)
        Car.count().exec((err, count) => {
          if (err) console.log(err)
          res.render('cars/removed', {
            cars: cars
          })
        })
      })
  },
  restore: (req, res) => {
    let carId = req.params.id

    Car.findByIdAndUpdate({ _id: carId },
      {
        $set: { deleteMarker: false },
        new: true
      }
    )
    .exec()
    .then(
      res.redirect('/cars/details/' + carId)
    )
  },
  comment: (req, res) => {
    let carId = req.params.id
    let insertedComment = req.body

    if (insertedComment.commentText && insertedComment.username) {
      Car.findByIdAndUpdate({ _id: carId }, { $inc: { totalComments: 1 }, new: true })
      .exec()

      Car.findByIdAndUpdate({ _id: carId },
        {
          $push: { 'comments':
          { commentText: insertedComment.commentText,
            username: insertedComment.username,
            commentDate: new Date().toISOString()
          }
        },
          new: true
        })
      .exec()
      .then(
        res.redirect('/cars/details/' + carId)
      )
    } else {
      insertedComment.globalError = 'Please enter data for all fields.'
      res.send(insertedComment)
    }
  },
  stats: (req, res) => {
    Car.find({}).then(cars => {
      res.render('cars/stats', {allData: cars})
    })
  }
}

