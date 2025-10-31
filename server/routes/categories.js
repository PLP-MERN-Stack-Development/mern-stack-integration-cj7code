// server/routes/categories.js
const express = require('express');
const router = express.Router();
const { getCategories, createCategory } = require('../controllers/categoryController');
const { protect, authorize } = require('../middleware/auth');
const { body } = require('express-validator');

// public: get categories
router.get('/', getCategories);

// protected: create category (admin)
router.post('/', protect, authorize('admin'), [
  body('name').notEmpty().withMessage('Name is required').isLength({ max: 50 }),
], createCategory);

module.exports = router;
