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

    const arr = Array.from({ length: 5 }, (_, i) => i + 1);
    let newUser = users;
    users.map((user, idx) => {
      let sum = 0;
      arr.map((i) => {
        sum = sum + user.roundOne?.[`task${i}`].mark;
      });
      console.log(sum);
      newUser[idx] = {
        ...user._doc,
        roundOne: { ...user._doc.roundOne, total: sum },
      };

      deleteKeys.map((key) => {
        delete newUser[idx]?.[key];
      });
    });

    return res.jsonSuccess("MESSAGES.FETCH", 200, newUser);
  } catch (e) {
    console.log(e);
    return res.jsonError("ERROR OCCURED", 400);
  }
};

module.exports.selectUser = async (req, res, next) => {
  const id = req.params.id;
  const users = await User.findByIdAndUpdate(
    id,
    { selected: true },
    { new: true }
  );
  return res.jsonSuccess("MESSAGES.FETCH", 200, users);

  // return res.jsonError("ERROR OCCURED", 400);
};
