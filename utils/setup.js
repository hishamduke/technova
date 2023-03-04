const mongoose = require("mongoose");
const q = require("q");

require("dotenv").config();

module.exports.initialize = () => {
  mongoose.Promise = q.Promise;

  mongoose.connection.on("open", () => {
    // '\x1b[32m%s\x1b[0m' for coloring console
    console.log("\x1b[32m%s\x1b[0m", "Connected to mongo shell.");
    console.log(
      "\x1b[32m%s\x1b[0m",
      `mongodb url ${process.env.DB_URL.split("//")[1].split("@")[1]}`
    );
  });

  mongoose.connection.on("error", (err) => {
    // '\x1b[32m%s\x1b[0m' for coloring console
    console.log("\x1b[31m%s\x1b[0m", "Could not connect to mongo server!");
    console.log(err);
  });

  mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};
