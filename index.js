const express = require("express");
const cookieParser = require("cookie-parser");
const http = require("http");
const passport = require("passport");
const bodyParser = require("body-parser");
const routers = require("./routes");
const path = require("path");
const app = express();
const ResponseController = require("./controllers/responseController");
const Setup = require("./utils/setup");
const cors = require("cors");
require("dotenv").config();

Setup.initialize();
app.disable("x-powered-by");
app.set("port", process.env.PORT);
app.use(cors({ origin: "http://localhost:3001", credentials: true }));

app.use(passport.initialize());
require("./passport")(passport);

app.use(bodyParser.json({ limit: "50mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

app.use(cookieParser());

app.use("/api", routers);

app.use(express.static(path.join(__dirname, "ui/build")));

// root route

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "ui/build", "index.html"));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  console.log(
    "------------------error---------------------\n",
    err,
    "\n---------------------------------------"
  );
  return res
    .status(400)
    .json(
      ResponseController.jsonError("Server Error ", err.status || 500, err)
    );
});

const server = http.createServer(app);
const port = app.get("port");
server.listen(port, () => {
  const URL = process.env.URL;
  const env = process.env.ENV;
  // '\x1b[32m%s\x1b[0m' for coloring console
  console.log("\x1b[32m%s\x1b[0m", `Application listening on ${URL}:${port}`);
  console.log("\x1b[32m%s\x1b[0m", `Environment => ${env}`);
});

module.exports = app;

//testing dev branch
