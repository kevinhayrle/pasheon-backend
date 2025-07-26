// app.js

const express = require('express');
const cors = require("cors");
require('dotenv').config();

const app = express();
console.log('👋 Pasheon backend started');

const allowedOrigins = [
  'https://kevinhayrle.github.io',  
  'http://127.0.0.1:5500'
  // You can add more frontends here
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
console.log('✅ CORS configured');

app.use(express.json());
console.log('✅ express.json middleware loaded');

// Register routes
try {
  const adminRoutes = require('./routes/adminRoutes');
  const authRoutes = require('./routes/auth');
  const productRoutes = require('./routes/productRoutes');

  app.use('/api/admin', adminRoutes);
  app.use('/api/auth', authRoutes);
  app.use('/api/products', productRoutes);
  console.log('✅ Routes registered');
} catch (err) {
  console.error('❌ Error loading routes:', err.message);
}

// Health check
app.get('/', (req, res) => {
  res.send('Pasheon backend is running ✅');
});

const PORT = process.env.PORT;
if (!PORT) {
  throw new Error("❌ Render's PORT is not defined in environment"); }
app.listen(PORT, () => {
  console.log(`🚀 Pasheon backend running on port ${PORT}`);
});