const express = require("express");
const router = express.Router();
const answerController = require("../controllers/answerController");

// router.route("/submit").post(answerController.post);
router.route("/submit").post(answerController.Submit);
router.route("/submit/round2").post(answerController.RoundTwo);

// router.route("/login").post(authController.login);

module.exports = router;
