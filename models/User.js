const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcryptjs");
const { toJSON } = require("./plugins");

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return v.length > 2;
        },
        message: (props) => `${props.value} is not a valid name`,
      },
    },
    username: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (v) {
          return v.length > 2;
        },
        message: (props) => `${props.value} is not a valid username`,
      },
    },

    isAdmin: {
      type: Boolean,
      default: false,
    },

    password: {
      type: String,
      validate: {
        validator: function (v) {
          // return v.length > 8;
          return v.length >= 6;
        },
      },
      message: "Password should have minimum 6 length",
    },
    selected: {
      type: Boolean,
      default: false,
    },
    round1: {
      task1: {
        answer: String,
        time: String,
      },
      task2: {
        answer: String,
        time: String,
      },
      task3: {
        answer: String,
        time: String,
      },
      task4: {
        answer: String,
        time: String,
      },
      task5: {
        answer: String,
        time: String,
      },
    },
    round2: {
      task1: {
        answer: String,
        time: String,
      },
      task2: {
        answer: String,
        time: String,
      },
      task3: {
        answer: String,
        time: String,
      },
      task4: {
        answer: String,
        time: String,
      },
    },
    round3: {
      task1: {
        answer: String,
        time: String,
      },
      task2: {
        answer: String,
        time: String,
      },
      task3: {
        answer: String,
        time: String,
      },
    },
    round4: {
      task1: {
        answer: String,
        time: String,
      },
      task2: {
        answer: String,
        time: String,
      },
    },
    round5: {
      task1: {
        answer: String,
        time: String,
      },
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.plugin(toJSON);

UserSchema.pre("save", function (next) {
  var user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified("password")) return next();

  // generate a salt
  const saltNum = parseInt(process.env.SALT_WORK_FACTOR);
  bcrypt.genSalt(saltNum, function (err, salt) {
    if (err) return next(err);

    // hash the password using our new salt
    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err);
      // override the cleartext password with the hashed one
      user.password = hash;
      next();
    });
  });
});

UserSchema.methods.comparePassword = function (candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
