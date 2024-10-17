const sign = require("../lib/jwt");
const User = require("./model");

const signUp = async (email, password) => {
  let user = await User.findOne({ email });

  if (user) {
    console.log("User already exists");
    throw new Error("User already exists");
  }

  user = new User({ email, password });
  await user.save();

  const token = sign({ userId: user._id }, "1h");

  return token;
};

const login = async (email, password) => {
  let user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const token = sign({ userId: user._id }, "1h");

  return token;
};

module.exports = {
  login,
  signUp,
};
