'use strict';
require('dotenv').config();

const mongoose = require('mongoose');


mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const server = require('./server.js');

server.start(process.env.PORT);