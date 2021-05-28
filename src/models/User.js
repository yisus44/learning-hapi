const { model, Schema } = require("mongoose");

const userSchema = new Schema({
  username: String,
});

module.exports = model("User", userSchema);
