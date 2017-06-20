'use strict';
const bluebird = require('bluebird');
const logic = bluebird.promisifyAll(require('./business-logic'));

async function doWork() {
    try {
        const stores = await logic.getStoresAsync();
        const users = await getDataForUsers();
        const tasks = [];
        users.forEach(function(user) {
            tasks.push(logic.sendMailAsync(stores, user));
        });
        await Promise.all(tasks);
        console.log('All done!');
    } catch (err) {
        throw err;
    }
}
doWork();

async function getDataForUsers() {
    const users = await logic.getUsersAsync();
    const tasks = [];
    users.forEach(function(user) {
        tasks.push(getUserData(user));
    });
    await Promise.all(tasks);
    return users;
}

async function getUserData(user) {
    return new Promise(async function (resolve){
        const orders = await logic.getOrdersForUserAsync(user);
        const products = await logic.getProductsForOrdersAsync(orders);
        resolve();
    });
}
