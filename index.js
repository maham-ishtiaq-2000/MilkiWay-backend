const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');  
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');


const app = express();


// Connect to MongoDB
mongoose.connect("mongodb+srv://mahamdaudahmed:qE61CR1oVKcJci64@cluster0.8l6z14l.mongodb.net/MilkiWay?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(cors()); 
app.use(bodyParser.json());

// Routes
app.use('/users', userRoutes);
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

app.get('/',(req,res) => {
    res.send("Working")
})

app.listen(3000, () => {
  console.log(`Server running on port 3000`);
});
