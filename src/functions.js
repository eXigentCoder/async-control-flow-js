'use strict';
const _ = require('lodash');
const jsf = require('json-schema-faker');
const userSchema = require('./schemas/user-schema.json');

jsf.extend('faker', function() {
    //set local for fake values
    return require('faker/locale/en_GB');
});

module.exports = {
    getUsers
};

function getUsers(callback) {
    const users = [];
    for (let i = 0; i < 10; i++) {
        users.push(jsf(userSchema));
    }
    process.nextTick(function() {
        callback(null, users);
    });
}

function getOrdersForUser(user, callback) {}
