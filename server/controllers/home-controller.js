let Car = require('mongoose').model('Car')

module.exports = {
  index: (req, res) => {
    Car
      .find()
      .where('deleteMarker').equals(false)
      .limit(6)
      .sort({ price: 'desc' })
      .exec((err, cars) => {
        if (err) console.log(err)
        Car.count().exec((err, count) => {
          if (err) console.log(err)
          res.render('home/index', {
            cars: cars
          })
        })
      })
  }
}
