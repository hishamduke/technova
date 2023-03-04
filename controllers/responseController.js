const _ = require("underscore");

function errorToSimpleObject(error) {
  console.log(
    "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n",
    error,
    "\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"
  );
  let errorObject = {};
  if (!_.isEmpty(error)) {
    for (let prop in error) {
      if (error.hasOwnProperty(prop)) {
        console.log(prop);
        let propNested = prop.split(".");
        if (_.isArray(propNested) && propNested.length > 1) {
          if (_.isArray(error[prop])) error[prop].message = error[prop][0];
          if (errorObject[propNested[0]]) {
            errorObject[propNested[0]][propNested[1]] =
              error[prop].message || error[prop];
          } else {
            errorObject[propNested[0]] = {
              [propNested[1]]: error[prop].message || error[prop],
            };
          }
        } else {
          if (_.isArray(error[prop])) error[prop].message = error[prop][0];
          errorObject[prop] = error[prop].message || error[prop];
        }
      }
    }
  } else {
    errorObject = { error };
  }
  console.log(
    "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n",
    errorObject,
    "\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"
  );
  return errorObject;
}
// function validationErrorsToArray(error) {
//     let errorsArray = [];
//     if (!_.isEmpty(error)) {
//         for (let prop in error) {
//             if (error.hasOwnProperty(prop)) {
//                 _.forEach(error[prop], (errorMessage) => {
//                     errorsArray.push(errorMessage);
//                 });
//             }
//         }
//     } else errorsArray.push({errors: this.errors});
//     return errorsArray;
// }

module.exports.jsonError = (message, code, errors) => {
  if (errors) {
    message = errors._message ? errors._message : message;
    errors = errors.errors
      ? errorToSimpleObject(errors.errors)
      : errorToSimpleObject(errors);
  }
  return {
    message,
    code,
    success: false,
    errors,
  };
};

module.exports.jsonSuccess = (message, code, data, metaData) => {
  return {
    message,
    code,
    data,
    metaData,
  };
};
