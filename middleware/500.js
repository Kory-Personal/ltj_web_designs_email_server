'use strict';

module.exports = (req, res, next, err) => {
  let error = { error: err };
  res.status(500).json(error);
}