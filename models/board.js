const mongoose = require("mongoose");

const boardSchema = new mongoose.Schema(
  {
    boardName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "user",
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);
module.exports =mongoose.models.Board || mongoose.model("Board", boardSchema);