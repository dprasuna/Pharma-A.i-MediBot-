require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// 🔹 Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => {
    console.error('❌ MongoDB Connection Error:', err);
    process.exit(1); // Exit process if DB fails to connect
  });

// 🔹 Import Routes
const authRouter = require('./routes/auth');
const generateRouter = require('./routes/generate');
const contentRouter = require('./routes/content');

// 🔹 Use Routes
app.use('/auth', authRouter);
app.use('/generate', generateRouter);
app.use('/', contentRouter);

// 🔹 Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('🔥 Server Error:', err);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 🔹 Start Server
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
