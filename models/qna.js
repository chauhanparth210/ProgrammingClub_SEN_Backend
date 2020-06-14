const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const QnASchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  question: {
    type: String,
    required: true,
    unique: true,
  },
  date: {
    type: Date,
    default: Date.now,
    required: true,
  },
  answers: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true,
      },
      answer: {
        type: String,
        required: true,
      },
      vote: [
        {
          user: {
            type: Schema.Types.ObjectId,
            ref: "user",
          },
        },
      ],
      date: {
        type: Date,
        default: Date.now,
        required: true,
      },
    },
  ],
});

module.exports = mongoose.model("qna", QnASchema);
