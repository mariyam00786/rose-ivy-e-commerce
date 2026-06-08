const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Backwards compatibility
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
      image: { type: String }
    }
  ],
  orderItems: [ // Backwards compatibility
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      name: String,
      qty: Number,
      price: Number
    }
  ],
  shippingAddress: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    addressLine1: { type: String, required: true },
    addressLine2: { type: String, default: '' },
    city: { type: String, required: true },
    country: { type: String, required: true },
    postalCode: { type: String, required: true },
    phone: { type: String, required: true },
    deliveryNotes: { type: String, default: '' }
  },
  paymentMethod: { type: String, enum: ['stripe', 'cod'], default: 'cod' },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
  isPaid: { type: Boolean, default: false }, // Backwards compatibility
  status: { type: String, enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
  total: { type: Number, required: true },
  totalPrice: { type: Number }, // Backwards compatibility
  deliveryFee: { type: Number, default: 0 },
  discountCode: { type: String, default: '' },
  discountAmount: { type: Number, default: 0 }
}, { timestamps: true });

// Pre-save hook to keep backwards compatibility fields in sync
orderSchema.pre('save', function(next) {
  if (this.user) {
    this.userId = this.user;
  }
  if (this.items && this.items.length > 0) {
    this.orderItems = this.items.map(item => ({
      product: item.product,
      name: item.name,
      qty: item.quantity,
      price: item.price
    }));
  }
  if (this.total !== undefined) {
    this.totalPrice = this.total;
  }
  this.isPaid = this.paymentStatus === 'paid';
  next();
});

module.exports = mongoose.model('Order', orderSchema);
