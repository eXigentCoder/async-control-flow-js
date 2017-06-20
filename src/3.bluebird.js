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

function getAllUserData() {
    return new Promise(function(resolve, reject) {
        logic
            .getUsersAsync()
            .then(function(users) {
                const tasks = [];
                users.forEach(function(user) {
                    const task = logic.getOrdersForUserAsync(user);
                    task.then(function(orders) {
                        return logic.getProductsForOrdersAsync(orders);
                    });
                    tasks.push(task);
                });
                Promise.all(tasks)
                    .then(function() {
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
}
