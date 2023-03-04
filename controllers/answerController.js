const mongoose = require("mongoose");
const { include } = require("underscore");
const User = require("../models/User");
const R1T1 = require("../answers/round1").task1;
const R1T2 = require("../answers/round1").task2;
const R1T3 = require("../answers/round1").task3;
const R1T4 = require("../answers/round1").task4;
const R1T5 = require("../answers/round1").task5;

function getMark(first, second, score) {
  let correctAnswers = 0;

  second.map((ans, index) => {
    if (ans == first[index]) {
      correctAnswers = correctAnswers + score;
    }
  });
  return correctAnswers;
}

function GetTime() {
  const now = new Date();
  const options = {
    timeZone: "Asia/Kolkata",
    hour12: false,
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  };
  return now.toLocaleString("en-US", options);
}

module.exports.RoundOne = async function RoundOne(req, res, next) {
  const RoundOneTasks = [1, 2, 3, 4, 5];
  const RoundOneWeight = [1, 3, 1, 1, 1];
  const answers = [R1T1, R1T2, R1T3, R1T4, R1T5];

  if (RoundOneTasks.indexOf(req.body.task) < 0) {
    return res.jsonError("MESSAGES.FETCH_FAIL", 400, {
      error: `Invalid task for round one,valid tasks are ${RoundOneTasks}`,
    });
  }

  if (!req.body.answers) {
    return res.jsonError("MESSAGES.FETCH_FAIL", 400, {
      error: `Invalid answers ,provide as an array`,
    });
  }

  console.log(req.body.answers.length);

  const timeInIndia = GetTime();

  const taskName = `task${req.body.task}`;
  const ansName = answers[RoundOneTasks.indexOf(req.body.task)];
  const weight = RoundOneWeight[RoundOneTasks.indexOf(req.body.task)];
  const inc = getMark(req.body.answers, ansName, weight);

  const updateUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      $set: {
        [`roundOne.${taskName}`]: {
          mark: inc,
          time: timeInIndia,
        },
      },
    },
    { new: true }
  );
  console.log(updateUser);

  return res.jsonSuccess("MESSAGES.FETCH", 200, "HM");
};

module.exports.RoundTwo = async function RoundOne(req, res, next) {
  try {
    const roundTwoTasks = [1, 2, 3, 4];

    if (roundTwoTasks.indexOf(req.body.task) < 0) {
      return res.jsonError("MESSAGES.FETCH_FAIL", 400, {
        error: `Invalid task for round one,valid tasks are ${roundTwoTasks}`,
      });
    }

    if (!req.body?.answer) {
      return res.jsonError("MESSAGES.FETCH_FAIL", 400, {
        error: `Invalid 'answer' ,provide as an string`,
      });
    }
    const answer = JSON.stringify(req.body?.answer);

    const timeInIndia = GetTime();

    const taskName = `task${req.body.task}`;

    const updateUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        $set: {
          [`roundTwo.${taskName}`]: {
            answer,
            time: timeInIndia,
          },
        },
      },
      { new: true }
    );
    console.log(updateUser);

    return res.jsonSuccess("MESSAGES.FETCH", 200, "HM");
  } catch (error) {
    console.log(error);
    return res.jsonError("server error", 400, {
      error: `Internal server error`,
    });
  }
};
