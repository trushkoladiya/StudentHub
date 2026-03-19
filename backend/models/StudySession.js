const mongoose = require('mongoose');

const studySessionSchema = new mongoose.Schema(
  {
    topic: {
      type: String,
      required: [true, 'Study topic is required'],
      trim: true,
    },
    duration: {
      type: Number, // duration in minutes
      required: [true, 'Duration is required'],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('StudySession', studySessionSchema);
