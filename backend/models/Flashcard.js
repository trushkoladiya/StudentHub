const mongoose = require('mongoose');

const flashcardSchema = new mongoose.Schema(
  {
    deckName: {
      type: String,
      required: [true, 'Deck name is required'],
      trim: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    cards: [
      {
        front: {
          type: String,
          required: [true, 'Front content is required'],
        },
        back: {
          type: String,
          required: [true, 'Back content is required'],
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('FlashcardDeck', flashcardSchema);
