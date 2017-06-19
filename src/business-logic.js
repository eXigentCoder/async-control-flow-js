'use strict';
const _ = require('lodash');
const jsf = require('json-schema-faker');
const userSchema = require('./schemas/user.json');
const orderSchema = require('./schemas/order.json');
const productSchema = require('./schemas/product.json');

jsf.extend('faker', function() {
    //set local for fake values
    return require('faker/locale/en_GB');
});

module.exports = {
    getUsers,
    getOrdersForUser,
    getProductsForOrders,
    sendMail
};

function getUsers(callback) {
    const users = [];
    for (let i = 0; i < 10; i++) {
        users.push(jsf(userSchema));
    }
    process.nextTick(() => {
        callback(null, users);
    });
}

function getOrdersForUser(user, callback) {
    const orderCount = _.random(0, 5);
    const orders = [];
    for (let i = 0; i < orderCount; i++) {
        orders.push(jsf(orderSchema));
    }
    process.nextTick(() => {
        callback(null, orders);
    });
}

function getProductsForOrders(order, callback) {
    const productCount = _.random(0, 5);
    const products = [];
    for (let i = 0; i < productCount; i++) {
        products.push(jsf(productSchema));
    }
    process.nextTick(() => {
        callback(null, products);
    });
}

function sendMail(order, callback) {
    //send mail logic call would go here
    process.nextTick(() => {
        callback();
    });
}
