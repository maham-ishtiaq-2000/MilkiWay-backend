const express = require('express');
const Order = require('../models/Order');
const Product = require('../models/Product');
const router = express.Router();

// Place an order
router.post('/', async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    await newOrder.save();
    res.status(201).send({ message: 'Order placed successfully', newOrder });
  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).send(error);
  }
});

// Get orders for a customer
router.get('/customer/:customerId', async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.params.customerId }).populate('products.product');
    res.status(200).send(orders);
  } catch (error) {
    console.error('Error getting customer orders:', error);
    res.status(500).send(error);
  }
});

// Get all orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().populate('customer products.product');
    res.status(200).send(orders);
  } catch (error) {
    console.error('Error getting all orders:', error);
    res.status(500).send(error);
  }
});

// Get all orders for a specific farm owner
router.get('/farmOwner/:farmOwnerId', async (req, res) => {
  try {
    // First, find all product IDs associated with this farm owner
    const products = await Product.find({ farmOwner: req.params.farmOwnerId }).select('_id');
    const productIds = products.map(p => p._id);

    // Now find orders that contain any of these product IDs
    const orders = await Order.find({ 'products.product': { $in: productIds } }).populate('products.product');
    res.status(200).send(orders);
  } catch (error) {
    console.error('Error getting farm owner orders:', error);
    res.status(500).send(error);
  }
});

// Accept an order
router.put('/:id/accept', async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(req.params.id, { status: 'accepted' }, { new: true });
    res.status(200).send({ message: 'Order accepted', updatedOrder });
  } catch (error) {
    console.error('Error accepting order:', error);
    res.status(500).send(error);
  }
});

// Assign a delivery boy to an order
router.put('/:id/assignToDelivery', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order.status === 'accepted') {
      order.deliveryBoy = req.body.deliveryBoy;
      await order.save();
      res.status(200).send({ message: 'Delivery boy assigned', order });
    } else {
      res.status(400).send({ message: 'Order not in accepted state' });
    }
  } catch (error) {
    console.error('Error assigning delivery boy:', error);
    res.status(500).send(error);
  }
});

// Mark an order as delivered
router.put('/:id/delivered', async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(req.params.id, { status: 'delivered' }, { new: true });
    res.status(200).send({ message: 'Order delivered', updatedOrder });
  } catch (error) {
    console.error('Error marking order as delivered:', error);
    res.status(500).send(error);
  }
});


router.get('/sales-data', async (req, res) => {
  try {
    const salesData = await Order.aggregate([
      { $unwind: '$products' },
      { 
        $group: {
          _id: '$products.product',
          totalQuantity: { $sum: '$products.quantity' }
        }
      },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'productDetails'
        }
      },
      { $unwind: '$productDetails' },
      {
        $project: {
          _id: 0,
          productId: '$_id',
          productName: '$productDetails.name',
          totalQuantity: 1
        }
      }
    ]);
    
    res.status(200).send(salesData);
  } catch (error) {
    console.error('Error getting sales data:', error);
    res.status(500).send(error);
  }
});



module.exports = router;
