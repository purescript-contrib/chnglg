"use strict";

exports.setExitCode = (i) => () => {
  process.exitCode = i;
}
