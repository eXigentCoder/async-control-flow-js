'use strict';
const _ = require('lodash');
const createFakeUser = require('./users/faker');
module.exports = {
    getUsers
};

const defaultOptions = {
    count: 10
};

function getUsers(options) {
    _.defaultsDeep(options, defaultOptions);
    const users = [];
    for (let i = 0; i < options.count; i++) {
        users.push(createFakeUser());
    }
    process.nextTick(function() {
        return users;
    });
}
