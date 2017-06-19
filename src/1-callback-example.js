const fn = require('./functions');

fn.getUsers(function(err, users) {
    console.log(users);
});
