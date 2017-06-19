function syncFunction() {
    return 42;
}

function asyncFunction() {
    process.nextTick(function() {
        return 42;
    });
}

// works - 42
console.log('syncFunction :', syncFunction());
// doesn't work - undefined
console.log('asyncFunction :', asyncFunction());
// Enter callbacks!
function asyncFunctionWithCallback(callback) {
    process.nextTick(function() {
        //Always follow the pattern of callback(error, result);
        callback(null, 42);
    });
}

asyncFunctionWithCallback(function(err, result) {
    // works - undefined, 42 because no err object
    console.log(`asyncFunctionWithCallback : err = ${err} result = ${result}`);
});
