const express = require('express');
const Product = require('../models/Product');
const router = express.Router();

// Create a new product
router.post('/', async (req, res) => {
    try {
      const newProduct = new Product(req.body);
      await newProduct.save();
      res.status(201).send({ message: 'Product created successfully', newProduct });
    } catch (error) {
      res.status(500).send(error);
    }
});


// Get all products
router.get('/', async (req, res) => {
    try {
        const products = await Product.find({});
        res.status(200).send(products);
    } catch (error) {
        res.status(500).send(error);
    }
});


// Get all products for a farm owner
router.get('/:farmOwnerId', async (req, res) => {
  try {
    const products = await Product.find({ farmOwner: req.params.farmOwnerId });
    res.status(200).send(products);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update a product
router.put('/:id', async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).send(updatedProduct);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Delete a product
router.delete('/:id', async (req, res) => {
    try {
      const deletedProduct = await Product.findByIdAndDelete(req.params.id);
      if (!deletedProduct) {
        res.status(404).send({ message: 'Product not found' });
      } else {
        res.status(200).send({ message: 'Product deleted successfully' });
      }
    } catch (error) {
      console.error("Delete Error:", error);
      res.status(500).send(error);
    }
  });
  
  
  

module.exports = router;
