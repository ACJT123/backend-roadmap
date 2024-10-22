const User = require("../models/user");
const { signToken } = require("../libs/jwt");

const login = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("User not found");
  }

  const isValidPassword = await user.comparePassword(password);

  if (!isValidPassword) {
    throw new Error("Invalid password");
  }

  return signToken({ userId: user._id });
};

const signUp = async (email, password) => {
  const user = new User({ email, password });

  await user.save();

  return signToken({ userId: user._id });
};

module.exports = {
  login,
  signUp,
};
