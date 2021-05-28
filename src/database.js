const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/testdb", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
