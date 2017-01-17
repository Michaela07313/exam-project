let mongoose = require('mongoose')
mongoose.Promise = global.Promise

module.exports = (config) => {
  mongoose.connect(config.db)

  let dbConnect = mongoose.connection

  dbConnect.once('open', (err) => {
    if (err) {
      console.log(err)
    }

    console.log('MongoDB is running!')
  })

  dbConnect.on('error', err => {
    console.log(err)
  })

  require('../data/Car')
}
