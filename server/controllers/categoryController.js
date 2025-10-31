// server/controllers/categoryController.js
const Category = require('../models/Category');

// GET /api/categories
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort('name');
    res.json({ success: true, data: categories });
  } catch (err) {
    next(err);
  }
};

// POST /api/categories
exports.createCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const exists = await Category.findOne({ name: name.trim() });
    if (exists) return res.status(400).json({ success: false, error: 'Category already exists' });

    const category = await Category.create({ name: name.trim(), description });
    res.status(201).json({ success: true, data: category });
  } catch (err) {
    next(err);
  }
};
