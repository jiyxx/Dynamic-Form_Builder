const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema(
  {
    fieldId: {
      type: String,
      required: true,
    },
    value: {
      type: mongoose.Schema.Types.Mixed,
      default: "",
    },
  },
  { _id: false }
);

const responseSchema = new mongoose.Schema({
  formId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Form",
    required: true,
    index: true,
  },
  answers: {
    type: [answerSchema],
    default: [],
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Response", responseSchema);
