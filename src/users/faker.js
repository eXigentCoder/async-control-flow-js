'use strict';
const jsf = require('json-schema-faker');
const userSchema = require('./user-schema.json');
module.exports = function createFakeUser() {
    return jsf(userSchema);
};