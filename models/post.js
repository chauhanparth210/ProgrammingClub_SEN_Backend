const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const PostSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "user"
  },
  title: {
    type: String
  },
  post: {
    type: Object,
    required: true
  },
  likes: {
    type: Number,
    default: 0
  },
  comments: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "user"
      },
      comment: {
        type: String,
        required: true
      },
      date: {
        type: Date,
        default: Date.now
      }
    }
  ],
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Post = mongoose.model("post", PostSchema);
