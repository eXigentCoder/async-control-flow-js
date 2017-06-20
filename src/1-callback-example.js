const logic = require('./business-logic');
const util = require('util');
const pollInterval = 500;
// sync function, we want to use
console.log('getting users');
logic.getUsers(function(getUserErr, users) {
    if (getUserErr) {
        throw getUserErr;
    }
    console.log(`\tGot ${users.length} users`);
    let callbackHellCompletedCount = 0;
    users.forEach(function(user) {
        console.log(`\tGetting orders for ${user.firstName}`);
        logic.getOrdersForUser(user, function(getOrderErr, orders) {
            if (getOrderErr) {
                throw getOrderErr;
            }
            console.log(`\t\tOrder retrieved for ${user.firstName}, getting products`);
            user.orders = orders;
            logic.getProductsForOrders(orders, function(getProductsErr, products) {
                if (getProductsErr) {
                    throw getProductsErr;
                }
                console.log(`\t\t\tProducts retrieved for ${user.firstName}`);
                callbackHellCompletedCount++;
                user.orderedProducts = products;
            });
        });
    });
    checkIfAllOrdersRetrieved();

    function checkIfAllOrdersRetrieved() {
        if (callbackHellCompletedCount === users.length) {
            /* Not actually using the returned value here, this is short-hand, could also be written as:
             step2();
             return;
            */
            return allDataRetrieved();
        }
        // Need to use the event loop to prevent blocking
        setTimeout(function() {
            checkIfAllOrdersRetrieved();
        }, pollInterval);
    }

    function allDataRetrieved() {
        console.log('all order data retrieved, sending emails.');
        const errors = [];
        let emailResponsesReceived = 0;
        users.forEach(function(user) {
            logic.sendMail(user, function(sendEmailError) {
                emailResponsesReceived++;
                console.log(`\tEmail sent for ${user.firstName}`);
                if (sendEmailError) {
                    errors.push(sendEmailError);
                }
            });
        });
        checkIfAllEmailsRetrieved();

        function checkIfAllEmailsRetrieved() {
            if (emailResponsesReceived === users.length) {
                if (errors.length > 0) {
                    throw new Error(util.format('Errors sending emails, %j', errors));
                }
                console.log('All done!');
                process.exit(0);
            }
            // Need to use the event loop to prevent blocking
            setTimeout(function() {
                checkIfAllEmailsRetrieved();
            }, pollInterval);
        }
    }
});
