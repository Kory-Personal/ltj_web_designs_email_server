'use strict';

const Model = require('../mongo/collection.js');
const schema = require('./contact-email.js');

class ContactEmail extends Model {
  constructor() { super(schema) }
}

module.exports = ContactEmail;