const express = require('express');
const router = express.Router();
const { getDecks, createDeck, updateDeck, deleteDeck } = require('../controllers/flashcardController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getDecks)
  .post(protect, createDeck);

router.route('/:id')
  .put(protect, updateDeck)
  .delete(protect, deleteDeck);

module.exports = router;
