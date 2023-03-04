const { isValidDoc } = require("../helper");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const appController = require("../controllers/appController");
const { MESSAGES } = require("../helper/constants");

const deleteKeys = [
  "_id",
  "__v",
  "updatedAt",
  "createdAt",
  "password",
  "isAdmin",
];

module.exports.login = async (req, res, next) => {
  let fields = {
    roundOne: 0,
    roundTwo: 0,
    roundThree: 0,
    roundFour: 0,
    roundFive: 0,
    isAdmin: 0,
  };
  const { username, password } = req.body;
  const user = await appController.getUniqueOne(User, fields, { username });

  if (!user) {
    return res.jsonError(MESSAGES.EMAIL_INCORRECT, 400, {
      email: "Incorrect username",
    });
  }
  user.comparePassword(password, (err, isMatch) => {
    if (err) return res.ServerError(err);
    else if (!isMatch) {
      return res.jsonError(MESSAGES.PASS_INCORRECT, 400, {
        password: "Incorrect password",
      });
    } else {
      let payload = {
        id: user._id,
        username: user.username,
        role: user?.isAdmin ? "ADMIN" : "USER",
      };
      jwt.sign(
        payload,
        process.env.SECRET,
        {
          expiresIn: 36000,
        },
        (err, token) => {
          if (err) return res.ServerError(err);
          else {
            return res.jsonSuccess(MESSAGES.LOGIN, 200, {
              user,
              token: `Bearer ${token}`,
            });
          }
        }
      );
    }
  });
};

module.exports.register = async (req, res, next) => {
  try {
    const username = req.body?.username?.trim();
    console.log(username);
    if (!onValidUsername(req.body.username)) {
      return res.jsonError(MESSAGES.CREATE_FAIL, 404, {
        message: "Invalid Username",
      });
    }

    const userExist = await User.find({ username });
    console.log(userExist);
    console.log(!!userExist.length);

    if (!!userExist.length) {
      return res.jsonError(MESSAGES.CREATE_FAIL, 404, {
        message: "User already exists",
      });
    }
    const bodyObj = new User(req.body);
    const valid = isValidDoc(bodyObj);
    console.log(valid);

    if (valid["ok"]) {
      console.log("VALID ");
      const user = await bodyObj.save();
      return res.jsonSuccess(MESSAGES.CREATE, 200, user);
    } else {
      console.log(valid);
      return res.jsonError(MESSAGES.CREATE_FAIL, 404, valid);
    }
  } catch (e) {
    return res.jsonError(MESSAGES.ANY, 404);
  }
};

// module.exports.refreshToken = async (req, res, next) => {};
function onValidUsername(val) {
  const usernameRegex = /^[a-zA-Z0-9]+$/;
  return usernameRegex.test(val);
}
