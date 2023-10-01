const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "mankavit",
  api_key: "441265679511652",
  api_secret: "ffKs3wigYnxQPBqtg2HfwlxQoIs",
});

module.exports = cloudinary;
