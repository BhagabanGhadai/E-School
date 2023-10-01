
const mongoose = require('mongoose');

const ObjectId = mongoose.Schema.Types.ObjectId

const noteSubjectModel = new mongoose.Schema(
  {
    notesId: {
      type: ObjectId,
      required: true,
      ref: "notesV2",
      trim: true,
    },
    subjectId: {
      type: ObjectId,
      required: true,
      ref: "chapterv2",
      trim: true,
    },
    removeStatus: {
      type: Boolean,
      default: false,
    },
    status: {
      type: Boolean,
      default: false,
    },
    sequence: {
      type: Number,
      default: 0,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("noteSubject", noteSubjectModel )