const Question = require('../models/Question');

// ─────────────────────────────────────────────────────────
// @desc    Post a new question
// @route   POST /api/questions
// @access  Private
// ─────────────────────────────────────────────────────────
const createQuestion = async (req, res) => {
  const { title, description, tags } = req.body;

  if (!title) {
    return res.status(400).json({ message: 'Question title is required' });
  }

  const question = await Question.create({
    title,
    description,
    tags: tags || [],
    askedBy: req.user._id,
  });

  const populated = await question.populate('askedBy', 'name profilePicture');
  res.status(201).json({ success: true, data: populated });
};

// ─────────────────────────────────────────────────────────
// @desc    Get all questions
// @route   GET /api/questions
// @access  Public
// ─────────────────────────────────────────────────────────
const getQuestions = async (req, res) => {
  const { search, tag } = req.query;
  let filter = {};

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }
  if (tag) {
    filter.tags = { $in: [tag] };
  }

  const questions = await Question.find(filter)
    .populate('askedBy', 'name profilePicture')
    .sort({ createdAt: -1 });

  res.json({ success: true, count: questions.length, data: questions });
};

// ─────────────────────────────────────────────────────────
// @desc    Post an answer to a question
// @route   POST /api/questions/:id/answer
// @access  Private
// ─────────────────────────────────────────────────────────
const postAnswer = async (req, res) => {
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ message: 'Answer content is required' });
  }

  const question = await Question.findById(req.params.id);

  if (!question) {
    return res.status(404).json({ message: 'Question not found' });
  }

  const answer = {
    content,
    answeredBy: req.user._id,
  };

  question.answers.push(answer);
  await question.save();

  const updated = await Question.findById(req.params.id).populate(
    'askedBy answers.answeredBy',
    'name profilePicture'
  );

  res.status(201).json({ success: true, data: updated });
};

// ─────────────────────────────────────────────────────────
// @desc    Mark an answer as best answer
// @route   PUT /api/questions/:id/best/:answerId
// @access  Private (question owner only)
// ─────────────────────────────────────────────────────────
const markBestAnswer = async (req, res) => {
  const question = await Question.findById(req.params.id);

  if (!question) {
    return res.status(404).json({ message: 'Question not found' });
  }

  // Only the person who asked can mark best answer
  if (question.askedBy.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Only question owner can mark best answer' });
  }

  // Reset all answers, set only this one as best
  question.answers = question.answers.map((ans) => {
    ans.isBestAnswer = ans._id.toString() === req.params.answerId;
    return ans;
  });

  question.isSolved = true;
  await question.save();

  res.json({ success: true, message: 'Best answer marked' });
};

module.exports = { createQuestion, getQuestions, postAnswer, markBestAnswer };