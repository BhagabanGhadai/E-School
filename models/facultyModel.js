const mongoose = require("mongoose");

const ObjectId = mongoose.Schema.Types.ObjectId;

const facultyModel = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    designation: {
      type: String,
      required: true,
    },
    facebook_link: {
      type: String,
    },
    linkedin_link: {
      type: String,
    },
    twitter_link: {
      type: String,
    },
    youtube_link: {
      type: String,
    },

    courseId: {
      type: ObjectId,
      required: true,
      ref: "course",
      trim: true,
    },
    image: {
      type: String,
      required: true,
    },

    status: {
      type: Boolean,
      default: 0,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("faculty", facultyModel);
