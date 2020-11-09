/**
 * Copyright 2020, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the ISC-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* eslint-disable */

function title(message) {
    console.log(' ');
    console.log(' -------------------------------------------------------------------------------');
    console.log('  ', message);
    console.log(' -------------------------------------------------------------------------------');
    console.log(' ');
    console.log(' ');
}

function success(message) {
    console.log(' ');
    console.log(' ');
    console.log('  ', '\x1b[42m', '\x1b[30m', message, '\x1b[0m');
    console.log(' ');
    console.log(' ');
}

function error(message) {
    console.log(' ');
    console.log(' ');
    console.log('  ', '\x1b[41m', '\x1b[37m', message, '\x1b[0m');
    console.log(' ');
    console.log(' ');
}

function text(message) {
    console.log(message);
}

module.exports = {
    title,
    success,
    error,
    text
};
