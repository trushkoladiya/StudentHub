const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Note = require('../models/Note');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// All admin routes require login AND admin role
router.use(protect, adminOnly);

// Get all users
router.get('/users', async (req, res) => {
  const users = await User.find({}).select('-password').sort({ createdAt: -1 });
  res.json({ success: true, count: users.length, data: users });
});

// Delete a user
router.delete('/user/:id', async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  await user.deleteOne();
  res.json({ success: true, message: 'User deleted' });
});

// Get all notes (admin view)
router.get('/notes', async (req, res) => {
  const notes = await Note.find({})
    .populate('uploadedBy', 'name email')
    .sort({ createdAt: -1 });
  res.json({ success: true, count: notes.length, data: notes });
});

module.exports = router;