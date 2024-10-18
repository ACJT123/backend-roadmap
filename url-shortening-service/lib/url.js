/**
 * Generates a random string of 6 characters.
 * @returns {string}
 */
const generateRandomString = () => {
  const randomString = Math.random().toString(36).substring(2, 8); // 6 characters

  return randomString;
};

/**
 * Validate the url by matching the regex.
 * @param {string} url
 * @returns {boolean}
 */
const validateUrl = (url) => {
  // 1. Check if the URL is valid
  const urlRegex = new RegExp(
    "^(https?:\\/\\/)?" + // protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$",
    "i"
  );

  if (!urlRegex.test(url)) {
    throw new Error("Invalid URL");
  }

  return true;
};

module.exports = {
  generateRandomString,
  validateUrl,
};
