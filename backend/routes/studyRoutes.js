const express = require('express');
const router = express.Router();
const { getStudySessions, logStudySession, deleteStudySession } = require('../controllers/studyController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getStudySessions)
  .post(protect, logStudySession);

router.route('/:id')
  .delete(protect, deleteStudySession);

module.exports = router;
