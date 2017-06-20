'use strict';
const _ = require('lodash');
const jsf = require('json-schema-faker');
const userSchema = require('./schemas/user.json');
const storeSchema = require('./schemas/store.json');
const orderSchema = require('./schemas/order.json');
const productSchema = require('./schemas/product.json');

jsf.extend('faker', function() {
    //set local for fake values
    return require('faker/locale/en_GB');
});

module.exports = {
    getUsers,
    getStores,
    getOrdersForUser,
    getProductsForOrders,
    sendMail
};

function getUsers(callback) {
    fakeSomeData({ min: 5, max: 10, schema: userSchema }, callback);
}

function getStores(callback) {
    fakeSomeData({ min: 1, max: 7, schema: storeSchema }, callback);
}

function getOrdersForUser(user, callback) {
    fakeSomeData({ min: 0, max: 5, schema: orderSchema }, callback);
}

function getProductsForOrders(order, callback) {
    fakeSomeData({ min: 0, max: 5, schema: productSchema }, callback);
}

function sendMail(user, stores, callback) {
    //send mail logic call would go here
    console.log(`Sending update to ${user.firstName} with ${user.orders.length} orders`);
    randomlyCallCallback(null, callback);
}

function fakeSomeData({ min, max, schema }, callback) {
    const count = _.random(min, max);
    const data = [];
    for (let i = 0; i < count; i++) {
        data.push(jsf(schema));
    }

    randomlyCallCallback(data, callback);
}

function randomlyCallCallback(data, callback) {
    let wait = _.random(500, 1500);
    setTimeout(function() {
        callback(null, data);
    }, wait);
}
