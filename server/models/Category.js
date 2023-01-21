const mongoose = require("mongoose");
mongoose.set('strictQuery', false);

const categorySchema = new mongoose.Schema({
  name:{
    type: String,
    required: "This field is required"
  },
  image: {
    type: String,
    required: "This field is required"
  }
});

module.exports = mongoose.model("Category", categorySchema);
