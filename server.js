var express = require("express");
var mongoose = require("mongoose");

require('dotenv').config()

var app = express();
var PORT = process.env.PORT || 3000;

var portAudio = require('naudiodon');
console.log(portAudio.getDevices());

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

require("./routes/apiRoutes")(app);
require("./routes/htmlRoutes")(app);

mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost/audiodb",
  { useNewUrlParser: true }
);

app.listen(PORT, function () {
  console.log(`Now listening on port: ${PORT}`);
});

//MONGODB_URI = 'mongodb://chrisuser:guestpass123@ds227865.mlab.com:27865/heroku_lwwghkmr'
