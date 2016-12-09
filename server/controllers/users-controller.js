let encryption = require('../utilities/encryption')
let User = require('mongoose').model('User')

module.exports = {
  register: (req, res) => {
    res.render('users/register')
  },
  create: (req, res) => {
    let user = req.body
    if (user.username && user.firstName && user.lastName && user.password && user.confirmPassword) {
      if (user.password !== user.confirmPassword) {
        user.globalError = 'Your passwords do not match.'
        res.render('users/register', user)
      } else {
        user.salt = encryption.generateSalt()
        user.hashedPassword = encryption.generateHashedPassword(user.salt, user.password)

        User
          .create(user)
          .then(user => {
            req.logIn(user, (err, user) => {
              if (err) {
                res.render('users/register', { globalError: 'Ooops 500' })
                return
              }

              res.redirect('/')
            })
          })
          .catch(console.log)
      }
    } else {
      user.globalError = 'Enter all fields'
      res.render('users/register', user)
    }
  },
  login: (req, res) => {
    res.render('users/login')
  },
  authenticate: (req, res) => {
    let inputUser = req.body

    User.findOne({ username: inputUser.username })
      .then(user => {
        if (!user || !user.authenticate(inputUser.password)) {
          res.render('users/login', { globalError: 'Invalid username or password' })
        } else {
          req.logIn(user, (err, user) => {
            if (err) {
              res.render('users/login', { globalError: 'Ooops 500' })
              return
            }

            res.redirect('/')
          })
        }
      })
  },
  logout: (req, res) => {
    req.logout()
    res.redirect('/')
  }
}
