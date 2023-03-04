const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

function CheckAuth(req, res, next) {
  if (req.user) {
    return res.jsonSuccess("MESSAGES.FETCH", 200);
  } else {
    console.log("ELSE");
    return res.jsonError("ONLY ADMINS HAVE ACCESS", 400);
  }
}

router.route("/").get(CheckAuth, adminController.getAll);

// router.route("/login").post(authController.login);

module.exports = router;
