const fs = require("fs");

exports.mkdtemp = (prefix) => (cbLeft) => (cbRight) => () =>
  fs.mkdtemp(prefix, "utf-8", (err, dir) => {
    if (err) {
      cbLeft(err);
    }
    console.log("Got: " + dir);
    cbRight(dir);
  });
