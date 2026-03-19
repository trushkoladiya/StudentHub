const StudySession = require('../models/StudySession');

// @desc    Get all study sessions for logged in user
// @route   GET /api/study
// @access  Private
const getStudySessions = async (req, res) => {
  try {
    const sessions = await StudySession.find({ user: req.user._id }).sort({ date: -1 });
    res.json({ success: true, count: sessions.length, data: sessions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Log a study session
// @route   POST /api/study
// @access  Private
const logStudySession = async (req, res) => {
  try {
    const { topic, duration } = req.body;

    if (!topic || !duration) {
      return res.status(400).json({ success: false, message: 'Please add a topic and duration' });
    }

    const session = await StudySession.create({
      topic,
      duration,
      user: req.user._id,
    });

    res.status(201).json({ success: true, data: session });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a study session
// @route   DELETE /api/study/:id
// @access  Private
const deleteStudySession = async (req, res) => {
  try {
    const session = await StudySession.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    if (session.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: 'User not authorized' });
    }

    await session.deleteOne();

    res.json({ success: true, id: req.params.id, message: 'Session deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getStudySessions,
  logStudySession,
  deleteStudySession,
};
