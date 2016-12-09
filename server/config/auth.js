module.exports = {
  isAuthenticated: (req, res, next) => {
    if (req.isAuthenticated()) {
      next()
    } else {
      res.redirect('/users/login')
    }
  },
  isInRole: (role) => {
    return (req, res, next) => {
      if (req.user && req.user.roles.indexOf(role) > -1) {
        next()
      } else {
        res.redirect('/users/login')
      }
    }
  },
  isAdmin: (req, res) => {
    if (req.user && req.user.roles.indexOf('Admin') > -1) {
      return true
    } else {
      return false
    }
  }
}
