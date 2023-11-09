'use strict';

const logger = (req, res, next) => {
  console.log('request made to', req.method, req.url);
  next();
};

module.exports= logger;