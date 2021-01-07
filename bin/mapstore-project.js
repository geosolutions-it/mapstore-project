#!/usr/bin/env node
/*
 * Copyright 2020, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
*/

const childProcess = require('child_process');
const path = require('path');
const message = require('../scripts/utils/message');

const command = process.argv[2] &&  process.argv[2].replace(':', '') || 'create';
const type = process.argv[3] || 'standard';

const commands = [
    'create',
    'compile',
    'start',
    'test',
    'testwatch',
    'update'
];

if (commands.indexOf(command) !== -1) {
    childProcess
        .execSync(
            `node ${path.resolve(__dirname, '..', 'scripts', command + '.js')} --type=${type}`,
            { stdio: 'inherit' }
        );
} else {
    message.error('\'' + command + '\' is not a valid command');
}
