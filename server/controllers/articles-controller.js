let Article = require('mongoose').model('Article')
const auth = require('../config/auth')

module.exports = {
  create: (req, res) => {
    res.render('articles/create')
  },
  // upload: (req, res, next) => {
  //   let createdArticle = req.body

  //   Article
  //     .create(createdArticle)
  //     .then(createdArticle => {
  //       res.redirect('articles/create')
  //     })
  // },
  imgupload: (req, res, next) => {
    let image
    let createdArticle = req.body
    if (!req.files) {
      res.render('articles/create')
      return
    }
    console.log('createdArticle: ', createdArticle)
    console.log('req.files', req.files)
    image = req.files.image
    console.log('image: ', image)
    createdArticle.image = req.files.image.name
    console.log('newcreatedArticle: ', createdArticle)

    if (createdArticle.title && createdArticle.description && createdArticle.content && createdArticle.author) {
      if (createdArticle.image !== '') {
        image.mv('./public/images/' + req.files.image.name, (err) => {
          if (err) {
            res.status(500).send(err)
          } else {
            Article
            .create(createdArticle)
            .then(createdArticle => {
              res.redirect('/')
            })
          }
        })
      } else {
        Article
        .create(createdArticle)
        .then(createdArticle => {
          res.redirect('/')
        })
      }
    } else {
      createdArticle.globalError = 'Please enter all fields.'
      res.render('articles/create', createdArticle)
    }
  },
  review: (req, res) => {
    // Article.find({}).then(articles => {
    //   res.render('articles/review', {data: articles})
    // })
    let perPage = 5
    let page = req.query.page > 0 ? req.query.page : 0

    Article
      .find()
      // .select('title')
      .limit(perPage)
      .skip(perPage * page)
      .sort({ date: 'asc' })
      .exec((err, articles) => {
        if (err) console.log(err)
        Article.count().exec((err, count) => {
          if (err) console.log(err)
          res.render('articles/review', {
            articles: articles,
            page: page,
            pages: count / perPage
          })
        })
      })
  },
  details: (req, res, next) => {
    let articleID = req.params.id
    let query = Article.findById(articleID)
    Article.findByIdAndUpdate({ _id: articleID }, { $inc: { views: 1 }, new: true })
    .exec()

    Article.find(query, function (err, article) {
      if (err) return next(err)
      query.exec(function (err, get) {
        if (err) return next(err)
        if (!get) return next()
        res.render('articles/details', { get: get, article: article })
      })
    })
  },
  edit: (req, res, next) => {
    let articleID = req.params.id
    let query = Article.findById(articleID)

    Article.find(query, function (err, articleSelected) {
      if (err) return next(err)
      query.exec(function (err, get) {
        if (err) return next(err)
        if (!get) return next()
        if (articleSelected[0].author === res.locals.currentUser.username || auth.isAdmin(req, res)) {
          res.render('articles/edit', { get: get, articles: articleSelected })
        } else {
          res.redirect('/articles/review')
          return
        }
      })
    })
  },
  update: (req, res, next) => {
    let image
    let updatedArticle = req.body
    let articleID = req.query.id
    if (!req.files) {
      res.render('articles/edit')
      return
    }

    image = req.files.image
    updatedArticle.image = req.files.image.name
    if (updatedArticle.image !== '') {
      image.mv('./public/images/' + req.files.image.name, (err) => {
        if (err) {
          res.status(500).send(err)
        } else {
          Article.findByIdAndUpdate(articleID, {
            $set: {
              title: updatedArticle.title,
              description: updatedArticle.description,
              content: updatedArticle.content,
              updatedDate: new Date().toISOString(),
              image: updatedArticle.image
            },
            new: true
          })
          .exec()
          .then(updatedArticle => {
            res.redirect('/')
          })
        }
      })
    } else {
      Article.findByIdAndUpdate(articleID, {
        $set: {
          title: updatedArticle.title,
          description: updatedArticle.description,
          content: updatedArticle.content,
          updatedDate: new Date().toISOString()
        },
        new: true
      })
      .exec()
      .then(updatedArticle => {
        res.redirect('/')
      })
    }
  },
  remove: (req, res) => {
    let articleID = req.params.id

    Article.findByIdAndUpdate(
      { _id: articleID },
      { $set: { deleteMarker: true },
      new: true }
    )
    .exec()
    .then(
      res.redirect('/articles/review')
    )
  },
  restore: (req, res) => {
    let articleID = req.params.id

    Article.findByIdAndUpdate(
      { _id: articleID },
      { $set: { deleteMarker: false },
      new: true }
    )
    .exec()
    .then(
      res.redirect('/articles/review')
    )
  },
  uplaodComment: (req, res, next) => {
    let insertedComment = req.body
    let articleID = req.params.id
    console.log(articleID)

    if (insertedComment.commentText && insertedComment.commentUsername) {
      let comment = {text: insertedComment.commentText, username: insertedComment.commentUsername, commentDate: new Date().toISOString()}
      Article.findByIdAndUpdate(articleID, {
        $push: {
          comments: comment
        },
        new: true
      })
      .exec(function (err) {
        if (err) return next(err)
        res.redirect('/articles/details/' + articleID)
      })
    }
  }
}
Article.find({ deleteMarker: true }).exec().then(art => { console.log(art) })
/* Article.remove()
.exec() */

