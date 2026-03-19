const express = require('express');
const router = express.Router();
const {
  createQuestion,
  getQuestions,
  postAnswer,
  markBestAnswer,
} = require('../controllers/questionsController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getQuestions);              // Public
router.post('/', protect, createQuestion);  // Private
router.post('/:id/answer', protect, postAnswer);  // Private
router.put('/:id/best/:answerId', protect, markBestAnswer); // Private

module.exports = router;