const User = require("../models/User");

const Freelancer = require("../models/Freelancer");
const { isValidDoc } = require("../helper");
const appController = require("./appController");
const { MESSAGES } = require("../helper/constants");
const { userApprovedMail, userNotApproveddMail } = require("../utils/mail");

module.exports.get = async (req, res, next) => {
  try {
    const _id = req.params?.id;
    let user = await appController.getById(User, _id);
    if (user) {
      user._doc = {
        ...user._doc,
        isNew: user._doc.createdAt.getTime() == user._doc.updatedAt.getTime(),
      };
      return res.jsonSuccess(MESSAGES.FETCH, 200, { data: user });
    }
    throw new Error(MESSAGES.FETCH_FAIL);
  } catch (e) {
    return res.jsonError(MESSAGES.FETCH_FAIL, 400, {
      error: "user fetch failed",
    });
  }
};
module.exports.getAll = async (req, res, next) => {
  try {
    const users = await appController.getAll(User);
    if (users) {
      let nonAdmins = users.filter((user) => user.role != "ADMIN");
      nonAdmins.map((nonAdmin) => {
        nonAdmin._doc = {
          ...nonAdmin._doc,
          isNew:
            nonAdmin._doc.createdAt.getTime() ==
            nonAdmin._doc.updatedAt.getTime(),
        };
      });
      return res.jsonSuccess(MESSAGES.FETCH, 200, { data: nonAdmins });
    }
    throw new Error(MESSAGES.FETCH_FAIL);
  } catch (e) {
    return res.jsonError(MESSAGES.FETCH_FAIL, 400, {
      error: "users fetch failed",
    });
  }
};
module.exports.update = async (req, res, next) => {
  try {
    const updateBody = req.body;
    console.log(req.user);

    const user = await appController.updateById(
      User,
      req.params.id,
      updateBody
    );
    if (user) {
      //TODO: UNCOMMENT the following for sending mail while approving
      // if ("isApproved" in updateBody) {
      //   if (updateBody.isApproved) {
      //     userApprovedMail(user.email);
      //   } else {
      //     userNotApproveddMail(user.email);
      //   }
      // }

      return res.jsonSuccess(MESSAGES.UPDATE, 200, { data: user });
    }
    throw new Error(MESSAGES.UPDATE_FAIL);
  } catch (e) {
    return res.jsonError(MESSAGES.UPDATE_FAIL, 400, {
      error: "user update failed",
    });
  }
};

module.exports.delete = async (req, res, next) => {
  try {
    const _id = req.params.id;
    const user = await appController.delete(User, _id);
    if (user) {
      return res.jsonSuccess(MESSAGES.DELETE, 200, { data: user });
    }
    throw new Error(MESSAGES.DELETE_FAIL);
  } catch (e) {
    return res.jsonError(MESSAGES.DELETE_FAIL, 400, {
      error: "user delete failed",
    });
  }
};
