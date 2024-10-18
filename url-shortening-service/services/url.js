const Url = require("../models/url");
const { generateRandomString, validateUrl } = require("../lib/url");

const createShortUrl = async (url) => {
  validateUrl(url);

  const existingUrl = await Url.findOne({ url });

  if (existingUrl) {
    return existingUrl;
  }

  const shortCode = generateRandomString();

  const newUrl = new Url({
    url,
    shortCode,
  });

  await newUrl.save();

  const savedUrl = await Url.findOne({
    url,
  });

  return savedUrl;
};

const getOriginalUrl = async (shortCode) => {
  const { url } = await Url.findOneAndUpdate(
    { shortCode }, // get by shortCode
    { $inc: { accessCount: 1 } }, // increment accessCount by 1
    { new: true } // return the updated document
  );

  return url;
};

const updateShortUrl = async (shortCode, newUrl) => {
  const url = await Url.findOneAndUpdate(
    { shortCode },
    { $set: { url: newUrl, accessCount: 0 } },
    { new: true }
  );

  return url;
};

const deleteShortUrl = async (shortCode) => {
  if (!shortCode) {
    throw new Error("Short code is required");
  }

  await Url.findOneAndDelete({ shortCode });
};

const getUrlStats = async (shortCode) => {
  const url = await Url.findOne({ shortCode });

  return url;
};

module.exports = {
  createShortUrl,
  getOriginalUrl,
  updateShortUrl,
  deleteShortUrl,
  getUrlStats,
};
