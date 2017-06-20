'use strict';
const logic = require('./business-logic');
const async = require('async');

async.parallel(
    {
        users: getAllUserData,
        stores: logic.getStores
    },
    parallelComplete
);

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

function getAllUserData(callback) {
    logic.getUsers(allUsersRetrieved);

    function allUsersRetrieved(err, users) {
        if (err) {
            return callback(err);
        }
        async.each(users, getAllDataForUser, allUserDataRetrieved);

        function allUserDataRetrieved(err) {
            if (err) {
                return callback(err);
            }
            callback(null, users);
        }
    }
}
function getAllDataForUser(user, callback) {
    async.waterfall([async.apply(logic.getOrdersForUser, user), logic.getProductsForOrders], callback);
}
