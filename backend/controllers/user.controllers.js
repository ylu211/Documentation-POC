// backend/controllers/user.controller.js

const userService = require('../services/user.service');

exports.getUsers = (req, res) => {
  const users = userService.getAllUsers();
  res.json(users);
};

exports.getUserById = (req, res) => {
  const user = userService.getUserById(req.params.id);
  res.json(user);
};

exports.createUser = (req, res) => {
  const newUser = userService.createUser(req.body);
  res.json(newUser);
};