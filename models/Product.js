const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  farmOwner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  available: { type: Boolean, default: true }
});

module.exports = mongoose.model('Product', productSchema);
