const User = require('../models/user.model');

exports.getUsers = async (req, res) => {
  const users = await User.find();
  res.json(users);
};

exports.addUser = async (req, res) => {
  const user = new User(req.body);
  await user.save();
  res.json(user);
};
