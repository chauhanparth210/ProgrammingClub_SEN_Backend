const mongoose = require("mongoose");

const { Schema } = mongoose;

const userSchema = new Schema({
  studentID: { type: Number, required: true, match: /\d{9}/, unique: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
  isStudentVerified: { type: Boolean, default: false },
  isPCMember: { type: Boolean, default: false }
});

module.exports = mongoose.model("user", userSchema);
