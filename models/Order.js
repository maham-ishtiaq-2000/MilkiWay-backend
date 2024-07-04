const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  products: [{ product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, quantity: Number }],
  status: { type: String, enum: ['pending', 'accepted', 'delivered'], default: 'pending' },
  deliveryBoy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  customerAddress: { type: String, required: true },
  farmOwnerAddress: { type: String, required: true }
});

module.exports = mongoose.model('Order', orderSchema);
