const logic = require('./business-logic');

// sync function, we want to use
logic.getUsers(function(getUserErr, users) {
    if (getUserErr) {
        throw getUserErr;
    }
    console.log(users);
    let callbackHellCompletedCount = 0;
    users.forEach(function(user) {
        logic.getOrdersForUser(user, function(getOrderErr, orders) {
            if (getOrderErr) {
                throw getOrderErr;
            }
            console.log('order retrieved');
            user.orders = orders;
            logic.getProductsForOrders(orders, function(getProductsErr, products) {
                if (getProductsErr) {
                    throw getProductsErr;
                }
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
        process.nextTick(function() {
            checkIfAllOrdersRetrieved();
        });
    }

    function allDataRetrieved() {
        users.forEach(function (user){
            logic.sendMail(user,function (sendEmailError){
                if(sendEmailError){
                    throw sendEmailError;
                }
            })
        })
    }
});
