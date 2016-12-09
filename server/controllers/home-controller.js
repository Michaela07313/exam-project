let Article = require('mongoose').model('Article')

module.exports = {
  index: (req, res) => {
    Article
      .find()
      .limit(6)
      .sort({ views: 'desc' })
      .exec((err, articles) => {
        if (err) console.log(err)
        Article.count().exec((err, count) => {
          if (err) console.log(err)
          res.render('home/index', {
            articles: articles
          })
        })
      })
  },
  about: (req, res) => {
    res.render('home/about')
  }
}
