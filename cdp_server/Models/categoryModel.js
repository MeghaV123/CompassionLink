// CategoryModel.js
const mongoose = require("mongoose");

const categorySchema = mongoose.Schema({
  categoryname: { type: String, required: true },
  image: { type: String, required: true },
});

const category = mongoose.model("category", categorySchema);

module.exports = { category };