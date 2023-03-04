// Load `*.js` under current directory as properties
const express = require("express");
const passport = require("passport");
const router = express.Router();
const path = require("path");
const ResponseController = require("../controllers/responseController");
const fs = require("fs");
const helper = require("../helper");

/**
 * Response formatting
 */

router.use(function (req, res, next) {
  // cleaning null objects

  res.jsonError = function (message, code, err) {
    if (req.file || req.files) helper.deleteFile(req);
    return res
      .status(code)
      .json(ResponseController.jsonError(message, code, err));
  };
  res.jsonSuccess = function (message, code, data, metaData) {
    return res
      .status(code)
      .json(ResponseController.jsonSuccess(message, code, data, metaData));
  };
  res.ServerError = function (err) {
    if (req.file || req.files) helper.deleteFile(req);
    return res
      .status(400)
      .json(ResponseController.jsonError("Somthing went wrong", 400, err));
  };
  next();
});

/**
 * @return {*}
 */

fs.readdirSync(path.join(__dirname, "/")).forEach((file) => {
  if (file.match(/\.js$/) !== null && file !== "index.js") {
    let name = file.replace(".js", "");

    if (name === "auth" || name === "unauth") {
      router.use("/" + name, require(path.join(__dirname, file)));
    } else {
      router.use(
        "/" + name,
        // passportAuthenticate(),
        passport.authenticate("jwt", {
          session: false,
        }),
        require(path.join(__dirname, file))
      );
    }
  }
});

module.exports = router;
