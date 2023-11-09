'use strict';

const express = require('express');
const cors = require('cors');
const apiRoutes = require('./api/api-v1.js');
const email = require('./api/send-email.js');
const logger = require('./middleware/logger.js');
const notFoundHandler = require('./middleware/404.js');
// const errorHandler = require('./middleware/500.js');
 
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(logger);

app.get('/', (req, res) => {
  res.status(200).send("Welcome to my portfolio api.")
})

app.use('/api/v1', apiRoutes);
app.use('/api/v2', email);
app.use('*', notFoundHandler);

// app.use(errorHandler);


module.exports = {
  app,
  start: (port) => app.listen(port, console.log('Up on ', port)),
};