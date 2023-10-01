const mongoose = require("mongoose");

const fingerprintSchema = new mongoose.Schema(
  {
  
    fingerprint: 
      {
        type: String,
        required: true,
      },
    
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("fingerprint", fingerprintSchema);