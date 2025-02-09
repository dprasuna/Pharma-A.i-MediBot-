// server.js or index.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.error('MongoDB connection error:', err));

const authRouter = require('./routes/auth');
const generateRouter = require('./routes/generate');
const contentRouter = require('./routes/content');

app.use('/auth', authRouter);
app.use('/generate', generateRouter);
app.use('/', contentRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});