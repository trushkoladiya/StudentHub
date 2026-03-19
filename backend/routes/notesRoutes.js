const express = require('express');
const router = express.Router();
const {
  uploadNote, getNotes, getNoteById, upvoteNote, deleteNote,
} = require('../controllers/notesController');
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary');

// upload.single('file') — tells multer to expect one file in 'file' field
router.get('/', getNotes);
router.post('/upload', protect, upload.single('file'), uploadNote);
router.get('/:id', getNoteById);
router.put('/:id/upvote', protect, upvoteNote);
router.delete('/:id', protect, deleteNote);

module.exports = router;