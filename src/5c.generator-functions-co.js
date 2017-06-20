'use strict';
const co = require('co');
const bluebird = require('bluebird');
const logic = bluebird.promisifyAll(require('./business-logic'));

co(function*() {
    const results = yield {
        stores: logic.getStoresAsync(),
        users: getDataForUsers()
    };
    const tasks = [];
    results.users.forEach(function(user) {
        tasks.push(logic.sendMailAsync(results.stores, user));
    });
    yield tasks;
})
    .then(function() {
        console.log('All done!');
    })
    .catch(function(err) {
        throw err;
    });

function* getDataForUsers() {
    const users = yield logic.getUsersAsync();
    const tasks = [];
    users.forEach(function(user) {
        tasks.push(getUserData(user));
    });
    yield tasks;
    return users;
}

function* getUserData(user) {
    const orders = yield logic.getOrdersForUserAsync(user);
    const products = yield logic.getProductsForOrdersAsync(orders);
}
