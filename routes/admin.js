const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

function OnlyAdmins(req, res, next) {
  console.log(req.user);
  if (req.user.role == "ADMIN") {
    console.log("ISADMIN");
    next();
  } else {
    console.log("ELSE");
    return res.jsonError("ONLY ADMINS HAVE ACCESS", 400);
  }
}

router.route("/getallusers").get(OnlyAdmins, adminController.getAll);

// router.route("/login").post(authController.login);

module.exports = router;
