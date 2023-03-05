const User = require("../models/User");

const deleteKeys = [
  "_id",
  "__v",
  "updatedAt",
  "createdAt",
  "password",
  "isAdmin",
];

module.exports.getAll = async (req, res, next) => {
  try {
    console.log("REACHED HERE");
    const users = await User.find({ isAdmin: false });

    return res.jsonSuccess("MESSAGES.FETCH", 200, users);
  } catch (e) {
    console.log(e);
    return res.jsonError("ERROR OCCURED", 400);
  }
};

module.exports.selectUser = async (req, res, next) => {
  const id = req.params.id;
  const selected = req.body.selected;
  const user = await User.findByIdAndUpdate(id, { selected }, { new: true });
  return res.jsonSuccess("MESSAGES.FETCH", 200, user);

  // return res.jsonError("ERROR OCCURED", 400);
};
module.exports.get = async (req, res, next) => {
  const id = req.params.id;
  const users = await User.findById(id);
  return res.jsonSuccess("MESSAGES.FETCH", 200, users);

  // return res.jsonError("ERROR OCCURED", 400);
};
