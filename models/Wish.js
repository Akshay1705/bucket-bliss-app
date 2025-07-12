const mongoose = require('mongoose');

const wishSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      required: true
    },
    targetDate: {
      type: Date,
      required: true
    },
    isCompleted: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true // auto adds createdAt & updatedAt
  }
);

// Export the model
const Wish = mongoose.model('Wish', wishSchema);
module.exports = Wish;
