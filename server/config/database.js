let mongoose = require('mongoose')
mongoose.Promise = global.Promise

// if we want just to call the model
// require('../data//User')

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
  // cal seedAdminUser function from data folder where is the model Users
  require('../data/User').seedAdminUser()
  require('../data/Article')
}
