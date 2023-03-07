const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const Round = require("../models/Round");

function CheckAuth(req, res, next) {
  if (req.user) {
    return res.jsonSuccess("MESSAGES.FETCH", 200);
  } else {
    console.log("ELSE");
    return res.jsonError("ONLY ADMINS HAVE ACCESS", 401);
  }
}

router.route("/").get(CheckAuth, adminController.getAll);

router.route("/round").get(async (req, res, next) => {
  try {
    let round = await Round.findOne();
    if (!round) {
      round = await Round.create({});
    }
    console.log(round);
    return res.jsonSuccess("MESSAGES.FETCH", 200, round);
  } catch (error) {
    console.log(error);
    return res.jsonError("ONLY ADMINS HAVE ACCESS", 400);
  }
});

router.route("/round").post(async (req, res, next) => {
  try {
    if (req.user.role != "ADMIN") {
      return res.jsonError("ONLY ADMINS HAVE ACCESS", 401);
    }
    let { round } = req.body;

    round = parseInt(round);
    console.log("round");
    console.log(typeof round);

    let roundDb = await Round.findOne();
    console.log(roundDb);

    if (!roundDb) {
      console.log("NO");
      roundDb = await Round.create({ round });
    } else {
      roundDb = await Round.findOneAndUpdate({}, { round }, { new: true });
      console.log("YES");
      console.log(roundDb);
    }
    // console.log(round);
    return res.jsonSuccess("MESSAGES.FETCH", 200, roundDb);
  } catch (error) {
    console.log(error);
    return res.jsonError("ONLY ADMINS HAVE ACCESS", 400);
  }
});

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
