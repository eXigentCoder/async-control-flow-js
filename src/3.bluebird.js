'use strict';

const Promise = require('bluebird');
const logic = Promise.promisifyAll(require('./business-logic'));

Promise.all([getAllUserData(), logic.getStoresAsync()])
    .then(function(results) {
        const users = results[0];
        const stores = results[1];
        const tasks = [];
        users.forEach(function(user) {
            tasks.push(logic.sendMailAsync(stores, user));
        });
        Promise.all(tasks)
            .then(function() {
                console.log('All done!');
                process.exit(0);
            })
            .catch(function(err) {
                throw err;
            });
    })
    .catch(function(err) {
        throw err;
    });

function parallelComplete(err, results) {
    if (err) {
        throw err;
    }
    async.each(results.users, async.apply(logic.sendMail, results.stores), function(err) {
        if (err) {
            throw err;
        }
        process.exit(0);
    });
}

function getAllUserData() {
    return new Promise(function(resolve, reject) {
        logic
            .getUsersAsync()
            .then(function(users) {
                users.forEach(function(user) {
                    logic
                        .getOrdersForUserAsync(user)
                        .then(function(orders) {
                            logic
                                .getProductsForOrdersAsync(orders)
                                .then(function(products) {
                                    resolve(users);
                                })
                                .catch(function(err) {
                                    reject(err);
                                });
                        })
                        .catch(function(err) {
                            reject(err);
                        });
                });
            })
            .catch(function(err) {
                reject(err);
            });
    });
}
