// server/validators/postValidators.js
const { body } = require('express-validator');

exports.createPostValidator = [
  body('title').notEmpty().withMessage('Title is required').isLength({ max: 100 }),
  body('content').notEmpty().withMessage('Content is required'),
  body('category').notEmpty().withMessage('Category is required'),
];
