const mongoose = require('mongoose')

let requiredValidationMessage = '{PATH} is required.'

let carSchema = mongoose.Schema({
  make: { type: String, required: requiredValidationMessage },
  model: { type: String, required: requiredValidationMessage },
  price: { type: Number, required: requiredValidationMessage },
  image: { type: String, requred: false },
  date: { type: Date, default: Date.now },
  views: { type: Number, default: 0 },
  deleteMarker: { type: Boolean, default: false },
  totalComments: { type: Number, default: 0 },
  comments: [{
    commentText: { type: String, requiredValidationMessage },
    username: { type: String, requiredValidationMessage },
    commentDate: { type: Date, default: Date.now }
  }]
})

let Car = mongoose.model('Car', carSchema)
