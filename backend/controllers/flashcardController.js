const FlashcardDeck = require('../models/Flashcard');

// @desc    Get all flashcard decks for logged in user
// @route   GET /api/flashcards
// @access  Private
const getDecks = async (req, res) => {
  try {
    const decks = await FlashcardDeck.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, count: decks.length, data: decks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a flashcard deck
// @route   POST /api/flashcards
// @access  Private
const createDeck = async (req, res) => {
  try {
    const { deckName, cards } = req.body;

    if (!deckName) {
      return res.status(400).json({ success: false, message: 'Please add a deck name' });
    }

    const deck = await FlashcardDeck.create({
      deckName,
      cards: cards || [],
      user: req.user._id,
    });

    res.status(201).json({ success: true, data: deck });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a deck (e.g., add/remove cards)
// @route   PUT /api/flashcards/:id
// @access  Private
const updateDeck = async (req, res) => {
  try {
    const deck = await FlashcardDeck.findById(req.params.id);

    if (!deck) {
      return res.status(404).json({ success: false, message: 'Deck not found' });
    }

    if (deck.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: 'User not authorized' });
    }

    const updatedDeck = await FlashcardDeck.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, data: updatedDeck });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a flashcard deck
// @route   DELETE /api/flashcards/:id
// @access  Private
const deleteDeck = async (req, res) => {
  try {
    const deck = await FlashcardDeck.findById(req.params.id);

    if (!deck) {
      return res.status(404).json({ success: false, message: 'Deck not found' });
    }

    if (deck.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: 'User not authorized' });
    }

    await deck.deleteOne();

    res.json({ success: true, id: req.params.id, message: 'Deck deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getDecks,
  createDeck,
  updateDeck,
  deleteDeck,
};
