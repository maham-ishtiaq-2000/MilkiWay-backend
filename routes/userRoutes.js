const express = require('express');
const User = require('../models/User');
const router = express.Router();

// Register new user
router.post('/register', async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).send({ message: 'User registered successfully', newUser });
  } catch (error) {
    res.status(500).send(error);
  }
});

// Login user (simple version without token generation)
router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email, password: req.body.password });
    if (user) {
      res.status(200).send({ message: 'Logged in successfully', user });
    } else {
      res.status(401).send({ message: 'Login failed' });
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update user details
router.put('/update/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const updatedUser = await User.findByIdAndUpdate(userId, req.body, { new: true });
    if (updatedUser) {
      res.status(200).send({ message: 'User updated successfully', updatedUser });
    } else {
      res.status(404).send({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
