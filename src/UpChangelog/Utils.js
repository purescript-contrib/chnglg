export const toUtcDate = (str) => {
  try {
    // quick and dirty way to convert date to UTC
    // for easy sorting
    return new Date(str).toISOString();
  } catch (e) {
    return null;
  }
};
