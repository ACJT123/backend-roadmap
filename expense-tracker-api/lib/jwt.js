const jwt = require("jsonwebtoken");

/**
 *
 * @param {object} header
 * @param {number} expIn
 * @returns {string}
 */
const sign = (header, expIn) => {

  console.log('header', header);
  const token = jwt.sign(header, process.env.JWT_SECRET, {
    expiresIn: expIn,
  });

  return token;
};

module.exports = sign;
