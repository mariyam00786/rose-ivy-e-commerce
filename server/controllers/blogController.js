const BlogPost = require('../models/BlogPost');

// @desc    Get all blog posts
// @route   GET /api/blog
// @access  Public
exports.getBlogs = async (req, res, next) => {
  try {
    const blogs = await BlogPost.find({}).sort({ publishedAt: -1 });
    res.status(200).json(blogs);
  } catch (err) {
    next(err);
  }
};

// @desc    Get single blog post by slug
// @route   GET /api/blog/:slug
// @access  Public
exports.getBlogBySlug = async (req, res, next) => {
  try {
    const blog = await BlogPost.findOne({ slug: req.params.slug });
    if (!blog) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    res.status(200).json(blog);
  } catch (err) {
    next(err);
  }
};

// @desc    Create a blog post (Admin only)
// @route   POST /api/admin/blog
// @access  Private/Admin
exports.createBlog = async (req, res, next) => {
  try {
    const { title, content, image, category, author } = req.body;

    if (!title || !content || !image || !category || !author) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const existing = await BlogPost.findOne({ slug });
    if (existing) {
      return res.status(400).json({ message: 'Blog post with this title already exists' });
    }

    const blog = await BlogPost.create({
      title,
      slug,
      content,
      image,
      category,
      author
    });

    res.status(201).json({ success: true, blog });
  } catch (err) {
    next(err);
  }
};
