// server/routes/posts.js
const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const { protect } = require('../middleware/auth');
const { createPostValidator } = require('../validators/postValidators');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Category = require('../models/Category'); // ✅ Added for category handling

// Configure multer for uploads in server/uploads
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = `${Date.now()}-${file.fieldname}${ext}`;
    cb(null, name);
  },
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB limit

// ------------------------------------------------------------
// Public endpoints
// ------------------------------------------------------------
router.get('/', postController.getPosts);
router.get('/:id', postController.getPost);
router.get('/search', postController.getPosts); // alias to support queries

// ------------------------------------------------------------
// Protected endpoints
// ------------------------------------------------------------

// ✅ Enhanced: Auto-create or link Category by name
router.post('/', protect, upload.single('featuredImage'), createPostValidator, async (req, res, next) => {
  try {
    // Extract category name or ID from request
    let { category } = req.body;

    // If category provided as name, find or create it
    if (category && typeof category === 'string') {
      let categoryDoc = await Category.findOne({ name: category.trim() });
      if (!categoryDoc) {
        categoryDoc = await Category.create({ name: category.trim() });
      }
      req.body.category = categoryDoc._id; // ✅ Use ObjectId going forward
    }

    // Proceed to main controller
    next();
  } catch (error) {
    console.error('Error resolving category:', error);
    res.status(500).json({ message: 'Failed to resolve category', error: error.message });
  }
}, postController.createPost);

// ✅ Update Post (with optional image & category handling)
router.put('/:id', protect, upload.single('featuredImage'), async (req, res, next) => {
  try {
    let { category } = req.body;

    if (category && typeof category === 'string') {
      let categoryDoc = await Category.findOne({ name: category.trim() });
      if (!categoryDoc) {
        categoryDoc = await Category.create({ name: category.trim() });
      }
      req.body.category = categoryDoc._id;
    }

    next();
  } catch (error) {
    console.error('Error resolving category during update:', error);
    res.status(500).json({ message: 'Failed to resolve category', error: error.message });
  }
}, postController.updatePost);

// Delete a post
router.delete('/:id', protect, postController.deletePost);

// ------------------------------------------------------------
// Comments: auth required
// ------------------------------------------------------------
router.post('/:id/comments', protect, postController.addComment);

module.exports = router;
