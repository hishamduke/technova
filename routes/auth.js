const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");

router.route("/register").post(authController.register);

router.route("/login").post(authController.login);

// router.route("/profile").get(authController.getProfile);

// router.route("/profile").put(authController.updateProfile);

module.exports = router;
