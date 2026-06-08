const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  images: [{ type: String, required: true }],
  imageUrl: { type: String }, // Backwards compatibility, synced with images[0]
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  price: { type: Number, required: true },
  salePrice: { type: Number },
  stockStatus: { type: String, enum: ['in-stock', 'out-of-stock'], default: 'in-stock' },
  stock: { type: Number, default: 10 },
  tags: [{ type: String }],
  variants: [{
    size: { type: String },
    price: { type: Number }
  }],
  rating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 }
}, { timestamps: true });

// Pre-save to sync imageUrl and stockStatus
productSchema.pre('save', function(next) {
  if (this.images && this.images.length > 0) {
    this.imageUrl = this.images[0];
  }
  this.stockStatus = this.stock > 0 ? 'in-stock' : 'out-of-stock';
  next();
});

module.exports = mongoose.model('Product', productSchema);
