const mongoose = require('mongoose')

let requiredValidationMessage = '{PATH} is required.'

let articleSchema = mongoose.Schema({
  title: { type: String, required: requiredValidationMessage },
  description: { type: String, required: requiredValidationMessage },
  content: { type: String, required: requiredValidationMessage },
  date: { type: Date, default: Date.now },
  updatedDate: { type: Date },
  image: { type: String, requred: false },
  author: { type: String, required: requiredValidationMessage },
  views: { type: Number, default: 0 },
  deleteMarker: { type: Boolean, defailt: false },
  comments: [{
    username: { type: String, required: requiredValidationMessage },
    text: { type: String, required: requiredValidationMessage },
    commentDate: { type: Date, default: Date.now }
  }]
})

let Article = mongoose.model('Article', articleSchema)


