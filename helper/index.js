const crypto = require("crypto");
const bcrypt = require("bcrypt");
const fs = require("fs");
const util = require("util");
const moment = require("moment");
// const { Parser } = require("json2csv");
// const csv = require("csv-parser");
const jwt = require("jsonwebtoken");

module.exports.createRandomToken = () => {
  return bcrypt.hash(crypto.randomBytes(32).toString("hex"), 10);
};

module.exports.deleteFile = (req) => {
  if (req.file && fs.existsSync(req.file.path)) {
    fs.unlink(req.file.path, (error) => {
      if (error) console.log("-------file unlink error---\n", error, "\n-----");
    });
  }
  if (util.isArray(req.files)) {
    req.files.forEach((file) => {
      if (fs.existsSync(file.path)) {
        fs.unlink(file.path, (error) => {
          if (error)
            console.log("-------files unlink error---\n", error, "\n-----");
        });
      }
    });
  } else if (typeof req.files === "object" && req.files !== null) {
    Object.keys(req.files).forEach((files) => {
      req.files[files].forEach((file) => {
        if (fs.existsSync(file.path)) {
          fs.unlink(file.path, (error) => {
            if (error)
              console.log("-------files unlink error---\n", error, "\n-----");
          });
        }
      });
    });
  }
};
module.exports.manageObj = (val, prop) => {
  if (typeof val === "string") {
    return val;
  }
  if (typeof val === "undefined") {
    return false;
  }
  let _index = prop.indexOf(".");
  let d = val[prop.substring(0, _index)];
  let f = prop.substr(_index + 1);
  if (_index > -1) {
    return this.manageObj(
      val[prop.substring(0, _index)],
      prop.substr(_index + 1)
    );
  }
  return val[prop];
};
module.exports.isJson = (str) => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};

module.exports.multerJsonParse = (req, res, next) => {
  Object.keys(req.body).forEach((key) => {
    req.body[key] = this.isJson(req.body[key])
      ? JSON.parse(req.body[key])
      : req.body[key];
  });
  next();
};

module.exports.fileRename = (req) => {
  return new Promise((resolve, reject) => {
    let newPath = `${req.file.path.replace(/-(.*)\./, `-${req.user.id}.`)}`;
    fs.rename(req.file.path, newPath, (err) => {
      if (err) reject(err);
      req.body.avatar = newPath;
      resolve(req);
    });
  });
};

module.exports.tokenQenerator = () => {
  return new Promise(async (resolve, reject) => {
    let hash = await this.createRandomToken();
    let accessToken = {
      token: hash,
      expiresIn: moment().add(6, "hours"),
      used: false,
    };
    resolve(accessToken);
  });
};

/**
 * checks if the field is empty
 * @param {*} value
 */
module.exports.isEmpty = (value) => {
  return (
    value === undefined ||
    value === null ||
    (typeof value === "object" && Object.keys(value).length === 0) ||
    (typeof value === "string" && value.trim().length === 0)
  );
};

module.exports.generatePassword = () => {
  var length = 8,
    charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
    retVal = "";
  for (var i = 0, n = charset.length; i < length; ++i) {
    retVal += charset.charAt(Math.floor(Math.random() * n));
  }
  return retVal;
};

// module.exports.jsonTocsv = (data, fields = []) => {
//   const json2csvParser = new Parser({ fields, delimiter: "," });
//   const csv = json2csvParser.parse(data);
//   // console.log(csv);
//   return csv;
// };

// module.exports.csvToJson = (path) => {
//   var csvData = [];
//   return new Promise((resolve) => {
//     fs.createReadStream(path)
//       .pipe(csv())
//       .on("data", (data) => csvData.push(data))
//       .on("end", () => {
//         resolve(csvData);
//       });
//   });
// };

module.exports.isValidDoc = (model) => {
  let retErr = { ok: true };
  const errors = model.validateSync();
  if (typeof errors == "object") {
    Object.keys(errors).map((err) => {
      const arr = Object.keys(errors[err]);
      arr.map((key) => {
        if (isNaN(parseInt(key))) {
          let messageObj = errors[err][key];
          let value = messageObj["properties"]["message"];
          retErr = { [key]: value, ...retErr };
        }
      });
    });
    retErr["ok"] = false;
  }
  return retErr;
};
module.exports.generateJwt = (user) => {
  // console.log("generate ");
  // console.log(user);
  const payload = {
    name: `${user?.firstName} ${user?.lastName}`,
    email: user?.email,
    phone: user?.phone,
    role: user?.role,

    //
    //
  };
  return jwt.sign(payload, "secret", { expiresIn: "24h" });
};
