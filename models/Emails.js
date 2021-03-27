const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema;

const emailSchema = new Schema({
  doctorMail: {
    type: String,
    required: true,
  },
  relativeOne: {
    type: String,
    required: true,
  },
  relativeTwo: {
    type: String,
    required: true,
  },
  relativeThree: {
    type: String,
    required: true,
  },
  user: {
    type: ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Emails", emailSchema);
