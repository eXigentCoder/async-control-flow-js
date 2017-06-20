'use strict';
const suspend = require('suspend');
const logic = require('./business-logic');

const getUserData = suspend(function*(callback) {
    const users = yield logic.getUsers(suspend.resume());
    users.forEach(function(user) {
        logic.getOrdersForUser(user, suspend.fork());
    });
    const orders = yield suspend.join();
    const products = yield logic.getProductsForOrders(orders, suspend.resume());
    callback(null, users);
});

function* doWork() {
    logic.getStores(suspend.fork());
    getUserData(suspend.fork());
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
