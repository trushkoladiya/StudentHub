const Note = require('../models/Note');
const { cloudinary } = require('../config/cloudinary');

// ─────────────────────────────────────────────────────────
// @desc    Upload a new note
// @route   POST /api/notes/upload
// @access  Private
// ─────────────────────────────────────────────────────────
const uploadNote = async (req, res) => {
  try {
    const { title, description, subject, semester } = req.body;

    if (!title || !subject || !semester) {
      return res.status(400).json({
        success: false,
        message: 'Title, subject and semester are required',
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a file',
      });
    }

    const note = await Note.create({
      title,
      description: description || '',
      subject,
      semester,
      fileURL: req.file.path,       // Cloudinary URL
      publicId: req.file.filename,  // Cloudinary public_id for deletion
      uploadedBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      data: note,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : null,
    });
  }
};

// ─────────────────────────────────────────────────────────
// @desc    Get all notes (with filters)
// @route   GET /api/notes
// @access  Public
// ─────────────────────────────────────────────────────────
const getNotes = async (req, res) => {
  try {
    const { subject, semester, search } = req.query;

    // Build filter object dynamically
    let filter = {};
    if (subject) filter.subject = subject;
    if (semester) filter.semester = Number(semester);
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } },
      ];
    }

    const notes = await Note.find(filter)
      .populate('uploadedBy', 'name email profilePicture')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: notes.length,
      data: notes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ─────────────────────────────────────────────────────────
// @desc    Get single note by ID
// @route   GET /api/notes/:id
// @access  Public
// ─────────────────────────────────────────────────────────
const getNoteById = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id)
      .populate('uploadedBy', 'name email profilePicture');

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found',
      });
    }

    res.json({ success: true, data: note });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ─────────────────────────────────────────────────────────
// @desc    Delete a note
// @route   DELETE /api/notes/:id
// @access  Private (owner or admin)
// ─────────────────────────────────────────────────────────
const deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found',
      });
    }

    // Only owner or admin can delete
    if (
      note.uploadedBy.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this note',
      });
    }

    // Delete file from Cloudinary
    if (note.publicId) {
      await cloudinary.uploader.destroy(note.publicId, {
        resource_type: 'raw',
      });
    }

    await note.deleteOne();

    res.json({ success: true, message: 'Note deleted successfully' });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ─────────────────────────────────────────────────────────
// @desc    Upvote a note
// @route   PUT /api/notes/:id/upvote
// @access  Private
// ─────────────────────────────────────────────────────────
const upvoteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found',
      });
    }

    // Toggle upvote
    const alreadyUpvoted = note.upvotes.includes(req.user._id);
    if (alreadyUpvoted) {
      note.upvotes = note.upvotes.filter(
        (id) => id.toString() !== req.user._id.toString()
      );
    } else {
      note.upvotes.push(req.user._id);
    }

    await note.save();

    res.json({
      success: true,
      upvotes: note.upvotes.length,
      upvoted: !alreadyUpvoted,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  uploadNote,
  getNotes,
  getNoteById,
  deleteNote,
  upvoteNote,
};