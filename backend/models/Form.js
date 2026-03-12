const mongoose = require("mongoose");

const fieldSchema = new mongoose.Schema(
  {
    fieldId: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["text", "textarea", "dropdown", "radio", "checkbox"],
    },
    label: {
      type: String,
      required: true,
    },
    placeholder: {
      type: String,
      default: "",
    },
    options: {
      type: [String],
      default: [],
    },
    required: {
      type: Boolean,
      default: false,
    },
    alignment: {
      type: String,
      enum: ["left", "center", "right"],
      default: "left",
    },
  },
  { _id: false }
);

const styleSchema = new mongoose.Schema(
  {
    primaryColor: {
      type: String,
      default: "#3B82F6",
    },
    fontFamily: {
      type: String,
      default: "Inter, sans-serif",
    },
    backgroundColor: {
      type: String,
      default: "#FFFFFF",
    },
  },
  { _id: false }
);

const formSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    fields: {
      type: [fieldSchema],
      default: [],
    },
    style: {
      type: styleSchema,
      default: () => ({}),
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Form", formSchema);
