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
    return res.jsonError("ONLY ADMINS HAVE ACCESS", 401);
  }
}

router.route("/getallusers").get(OnlyAdmins, adminController.getAll);
router.route("/getuser/:id([0-9a-f]{24})").get(OnlyAdmins, adminController.get);

router.route("/select/:id([0-9a-f]{24})").post(adminController.selectUser);
// router.route("/login").post(authController.login);

module.exports = router;
