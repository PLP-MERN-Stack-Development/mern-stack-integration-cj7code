// server/models/Category.js
// Mongoose model for blog categories

const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a category name'],
    unique: true,
    trim: true,
    maxlength: [50, 'Category name too long'],
  },
  description: {
    type: String,
    maxlength: [200, 'Description too long'],
  },
}, { timestamps: true });

module.exports = mongoose.model('Category', CategorySchema);
