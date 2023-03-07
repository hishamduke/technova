const mongoose = require("mongoose");
const { Schema } = mongoose;
const { toJSON } = require("./plugins");

const RoundSchema = new Schema(
  {
    round: {
      type: Number,
      required: true,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

RoundSchema.plugin(toJSON);

const Round = mongoose.model("Round", RoundSchema);

module.exports = Round;
