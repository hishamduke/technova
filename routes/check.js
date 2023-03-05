const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

function CheckAuth(req, res, next) {
  if (req.user) {
    return res.jsonSuccess("MESSAGES.FETCH", 200);
  } else {
    console.log("ELSE");
    return res.jsonError("ONLY ADMINS HAVE ACCESS", 401);
  }
}

router.route("/").get(CheckAuth, adminController.getAll);

router.route("/isSelected").get(amIselected, (req, res, next) => {
  return res.jsonSuccess("MESSAGES.FETCH", 200);
});

function amIselected(req, res, next) {
  console.log(req.user);
  if (req.user && req.user.isSelected) {
    return next();
  } else {
    console.log("ELSE");
    return res.jsonError("ONLY ADMINS HAVE ACCESS", 401);
  }
}

// router.route("/login").post(authController.login);

module.exports = router;
