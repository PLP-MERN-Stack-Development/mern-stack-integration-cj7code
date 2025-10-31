// server/controllers/postController.js
// Controller for posts: CRUD, search, comments, pagination, image upload handling.

const Post = require('../models/Post');
const Category = require('../models/Category');
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

// Utility: build pagination metadata
const buildPagination = (page, limit, total) => {
  const pageCount = Math.ceil(total / limit);
  return { page, limit, pageCount, total };
};

// ======================================================================
// GET /api/posts
// List posts with pagination, optional search & category filter
// ======================================================================
exports.getPosts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page || '1', 10);
    const limit = parseInt(req.query.limit || '10', 10);
    const category = req.query.category;
    const q = req.query.q || req.query.search;

    const filter = {};

    // 🏷 Filter by category (ObjectId only)
    if (category && mongoose.Types.ObjectId.isValid(category)) {
      filter.category = category;
    }

    // 🔍 Full-text search in title, excerpt, or content
    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: 'i' } },
        { excerpt: { $regex: q, $options: 'i' } },
        { content: { $regex: q, $options: 'i' } },
      ];
    }

    // Fetch paginated results
    const total = await Post.countDocuments(filter);
    const posts = await Post.find(filter)
      .populate('author', 'name email')
      .populate('category', 'name')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      success: true,
      data: posts,
      pagination: buildPagination(page, limit, total),
    });
  } catch (err) {
    next(err);
  }
};

// ======================================================================
// GET /api/posts/:idOrSlug
// Fetch a single post by ID or slug
// ======================================================================
exports.getPost = async (req, res, next) => {
  try {
    const idOrSlug = req.params.id;
    const query = mongoose.Types.ObjectId.isValid(idOrSlug)
      ? { _id: idOrSlug }
      : { slug: idOrSlug };

    const post = await Post.findOne(query)
      .populate('author', 'name email')
      .populate('category', 'name');

    if (!post)
      return res.status(404).json({ success: false, error: 'Post not found' });

    // Increment view count asynchronously
    post.viewCount += 1;
    post.save().catch(() => {});

    res.json({ success: true, data: post });
  } catch (err) {
    next(err);
  }
};

// ======================================================================
// POST /api/posts
// Create a new post — auto-creates category if it doesn’t exist
// ======================================================================
exports.createPost = async (req, res, next) => {
  try {
    // Validate request data
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ success: false, errors: errors.array() });

    const {
      title,
      content,
      excerpt,
      category: categoryInput,
      tags = [],
      isPublished,
    } = req.body;

    // 🏷 Handle category: create new if string name provided
    let categoryDoc = null;
    if (categoryInput) {
      if (mongoose.Types.ObjectId.isValid(categoryInput)) {
        categoryDoc = await Category.findById(categoryInput);
      } else {
        categoryDoc =
          (await Category.findOne({ name: categoryInput })) ||
          (await Category.create({ name: categoryInput }));
      }
    }

    if (!categoryDoc)
      return res
        .status(400)
        .json({ success: false, error: 'Invalid or missing category' });

    // 🖼 Handle featured image upload
    const featuredImage = req.file ? req.file.filename : undefined;

    // 💾 Create post
    const post = await Post.create({
      title,
      content,
      excerpt,
      featuredImage,
      author: req.user._id,
      category: categoryDoc._id,
      tags: Array.isArray(tags)
        ? tags
        : typeof tags === 'string'
        ? tags.split(',').map((t) => t.trim())
        : [],
      isPublished: isPublished === 'true' || isPublished === true,
    });

    res.status(201).json({ success: true, data: post });
  } catch (err) {
    next(err);
  }
};

// ======================================================================
// PUT /api/posts/:id
// Update existing post (author or admin only)
// ======================================================================
exports.updatePost = async (req, res, next) => {
  try {
    const id = req.params.id;
    const updates = req.body;

    // 🖼 Replace featured image if new one uploaded
    if (req.file) updates.featuredImage = req.file.filename;

    const post = await Post.findById(id);
    if (!post)
      return res.status(404).json({ success: false, error: 'Post not found' });

    // 🧍 Permission check
    if (!post.author.equals(req.user._id) && req.user.role !== 'admin') {
      return res
        .status(403)
        .json({ success: false, error: 'Not authorized to update this post' });
    }

    Object.assign(post, updates);
    await post.save();

    res.json({ success: true, data: post });
  } catch (err) {
    next(err);
  }
};

// ======================================================================
// DELETE /api/posts/:id
// Delete post (author or admin only)
// ======================================================================
exports.deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post)
      return res.status(404).json({ success: false, error: 'Post not found' });

    // 🧍 Permission check
    if (!post.author.equals(req.user._id) && req.user.role !== 'admin') {
      return res
        .status(403)
        .json({ success: false, error: 'Not authorized to delete this post' });
    }

    await post.remove();
    res.json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
};

// ======================================================================
// POST /api/posts/:id/comments
// Add a comment to a post
// ======================================================================
exports.addComment = async (req, res, next) => {
  try {
    const { content } = req.body;
    const post = await Post.findById(req.params.id);
    if (!post)
      return res.status(404).json({ success: false, error: 'Post not found' });

    post.comments.push({ user: req.user._id, content });
    await post.save();

    const newComment = post.comments[post.comments.length - 1];
    res.status(201).json({ success: true, data: newComment });
  } catch (err) {
    next(err);
  }
};
