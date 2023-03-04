const User = require("../models/User");

module.exports.update = async (Model, id, updateBody) => {
  const data = await Model.findOneAndUpdate(
    { user: id },
    { $set: updateBody },
    { new: true }
  );
  return data ? data : false;
};

module.exports.updatePopulate = async (Model, id, updateBody, populate) => {
  const data = await Model.findOneAndUpdate(
    { user: id },
    { $set: updateBody },
    { new: true }
  ).populate(populate);
  return data ? data : false;
};
module.exports.updateById = async (Model, id, updateBody) => {
  const data = await Model.findByIdAndUpdate(id, updateBody, { new: true });
  return data ? data : false;
};
module.exports.updateByIdAndPopulate = async (
  Model,
  id,
  updateBody,
  populate
) => {
  console.log("POPULATE?");
  const data = await Model.findByIdAndUpdate(id, updateBody, {
    new: true,
  }).populate(populate);
  console.log(data);
  return data ? data : false;
};
module.exports.get = async (Model, id, fields = {}) => {
  let data = await Model.findOne({ user: id }).populate("user");
  return data ? data : false;
};

module.exports.getNoPopulate = async (Model, id, fields = {}) => {
  let data = await Model.findOne({ user: id }).populate("user");
  return data ? data : false;
};

module.exports.getUniqueOne = async (Model, fields = {}, condition) => {
  let data = await Model.findOne(condition, fields);
  return data ? data : false;
};
module.exports.updateUniqueOne = async (Model, updateBody) => {
  console.log("DATA");
  console.log(updateBody);
  let data = await Model.findOneAndUpdate({}, updateBody, { new: true });
  console.log(data);
  return data ? data : false;
};
module.exports.create = async (Model, body) => {
  const data = await Model.create(body);
  return data ? data : false;
};

module.exports.getById = async (Model, id, fields = {}) => {
  const data = await Model.findById(id, fields);
  return data ? data : false;
};

module.exports.getByIdAndPopulate = async (
  Model,
  id,
  fields = {},
  populate
) => {
  const data = await Model.findById(id, fields).populate(populate);
  return data ? data : false;
};

module.exports.getAll = async (Model, fields = {}) => {
  const data = await Model.find({}, fields);
  return data ? data : false;
};
module.exports.getAllPopulate = async (Model, fields = {}, populate) => {
  const data = await Model.find({}, fields).populate(populate);
  return data ? data : false;
};
module.exports.delete = async (Model, id) => {
  const data = await Model.findByIdAndDelete(id);
  return data ? data : false;
};

module.exports.CreateOneIfDoesntExist = async (Model) => {
  const exist = await Model.findOne();
  if (!exist) {
    const newModel = new Model();
    await newModel.save();
  }
  return;
};
