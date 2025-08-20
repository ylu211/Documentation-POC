const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  //API property
  name: String,
  email: String
});

module.exports = mongoose.model('User', userSchema);
