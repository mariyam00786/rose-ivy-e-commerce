const mongoose = require('mongoose');

const blogPostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  content: { type: String, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
  author: { type: String, required: true },
  publishedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('BlogPost', blogPostSchema);
