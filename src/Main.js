
exports.toUtcDate = (str) => {
  console.log(`Got toUtcDate str: ${str}`);
  try {
    return new Date(str).toISOString();
  } catch (e) {
    return null;
  }
};
