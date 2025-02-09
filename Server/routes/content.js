const express = require('express');
const jwt = require('jsonwebtoken');
const SavedContent = require('../models/SavedContent');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');




router.post('/saveContent', authenticateToken, async (req, res) => {
  const { medicineName, content } = req.body;
  try {
    const savedContent = new SavedContent({
      userId: req.user.id,
      medicineName,
      content,
    });
    await savedContent.save();
    res.status(201).json({ message: 'Content saved successfully' });
  } catch (error) {
    console.error('Error saving content:', error);
    res.status(500).json({ error: 'Error saving content' });
  }
});

router.get('/savedContent', authenticateToken, async (req, res) => {
  try {
    const savedContent = await SavedContent.find({ userId: req.user.id });
    res.json(savedContent);
  } catch (error) {
    console.error('Error fetching saved content:', error);
    res.status(500).json({ error: 'Error fetching saved content' });
  }
});

module.exports = router;
