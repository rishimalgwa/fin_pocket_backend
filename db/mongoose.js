const mongoose = require("mongoose");
const connectionURL = 'mongodb://127.0.0.1:27017/fin_pocket_dev'
mongoose.connect(connectionURL, {
  useNewUrlParser: true,
});

