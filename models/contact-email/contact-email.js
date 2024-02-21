'use strict';

const mongoose = require('mongoose');

const email = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  number: { type: String, required: true },
  message: { type: String, required: true },
});

module.exports = mongoose.model('email', email);