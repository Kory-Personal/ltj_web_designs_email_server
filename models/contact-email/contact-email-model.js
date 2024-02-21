'use strict';

const Model = require('../mongo/collection.js');
const schema = require('./projects-schema.js');

class ContactEmail extends Model {
  constructor() { super(schema) }
}

module.exports = ContactEmail;