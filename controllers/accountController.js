const User = require("../models/User");

module.exports.adminLogin = async (req, res, next) => {
  console.log("in adminRegister");
  const { email, password } = req.body;
  const a = await User.findOne({ email });
  const isCorrectPwd = await a.comparePassword(password);
  // console.log(isCorrectPwd);
  if (!isCorrectPwd) return res.jsonError("Fail", 401);
  else return res.jsonSuccess("Data created", 200, { response: "secretVal" });
};

module.exports.getAllusers = async (req, res, next) => {
  console.log("GET ALL USERS");
  const users = await User.find({ role: { $ne: "ADMIN" } }).sort({
    createdAt: -1,
  });
  res.jsonSuccess("Data created", 200, users);
};
