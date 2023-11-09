'use strict';

const Model = require('../mongo/collection.js');
const schema = require('./projects-schema.js');

class Projects extends Model {
  constructor() { super(schema) }
}

module.exports = Projects;