const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

const app = express();
const PORT = 5000;

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/Aetherdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Define order schema & model
const orderSchema = new mongoose.Schema({
  name: String,
  email: String,
  address: String,
  cartItems: [
    {
      productName: String,
      price: Number,
      quantity: Number
    }
  ],
  total: Number,
  createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', orderSchema);

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Handle checkout form submission
app.post('/checkout', async (req, res) => {
  try {
    const { name, email, address, cartItems, total } = req.body;

    if (!name || !email || !address) {
      return res.status(400).send('Please fill all fields.');
    }

    // Parse cartItems JSON string into array
    const parsedCart = JSON.parse(cartItems);

    // Ensure total is a number
    const orderTotal = Number(total);

    const newOrder = new Order({
      name,
      email,
      address,
      cartItems: parsedCart,
      total: orderTotal
    });

    await newOrder.save();

    // Redirect to success page
    res.sendFile(path.join(__dirname, 'public', 'success.html'));
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
