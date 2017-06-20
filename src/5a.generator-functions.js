'use strict';
const line = '\n----================----\n';
console.log('\n');
// Generators can be iteratored through
function* foo() {
    yield 1;
    yield 2;
}
let iterator = foo();

console.log(iterator.next()); //{ value: 1, done: false }
console.log(iterator.next()); //{ value: 2, done: true }
console.log(line);

// Can return values from them
function* foo2() {
    yield 1;
    yield 2;
    return 3;
}
iterator = foo2();
iterator.next();
iterator.next();
console.log(iterator.next().value);

console.log(line);

//Because it's an iterator we can loop through each of the steps.
for (let value of foo2()) {
    console.log(value);
}
// Beware, we only get 1, 2, be careful of using returns!

console.log(line);

// we can also pass values in like a normal function
function* foo3(x) {
    yield 1 + x;
    yield 2 + x;
    return 3 + x;
}

iterator = foo3(1);

console.log(iterator.next());
console.log(iterator.next());
console.log(iterator.next());

console.log(line);

// But how does this all fit in with async control flow?
const _ = require('lodash');
const suspend = require('suspend');
const resume = suspend.resume;
const fs = require('fs');
const path = require('path');

suspend(function*() {
    let wait = _.random(500, 1500);
    yield setTimeout(resume(), wait);
    console.log(`Waited ${wait} milliseconds`);
    const pathToReadme = path.resolve(__dirname, '../README.md');
    const data = yield fs.readFile(pathToReadme, 'utf8', resume());
    console.log('\n\n', data);
})();
