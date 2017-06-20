'use strict';
const suspend = require('suspend');
const logic = require('./business-logic');

const getUserData = suspend(function*(user, callback) {
    const orders = yield logic.getOrdersForUser(user, suspend.resume());
    const products = yield logic.getProductsForOrders(orders, suspend.resume());
    callback();
});

const getDataForUsers = suspend(function*(callback) {
    const users = yield logic.getUsers(suspend.resume());
    users.forEach(function(user) {
        getUserData(user, suspend.fork());
    });
    yield suspend.join();
    callback(null, users);
});

function* doWork() {
    logic.getStores(suspend.fork());
    getDataForUsers(suspend.fork());
    const results = yield suspend.join();
    const stores = results[0];
    const users = results[1];
    users.forEach(function(user) {
        logic.sendMail(stores, user, suspend.fork());
    });
    yield suspend.join();
}

suspend.run(doWork, jobsDone);

function jobsDone(err) {
    if (err) {
        throw err;
    }
    console.log('All done');
    process.exit(0);
}
