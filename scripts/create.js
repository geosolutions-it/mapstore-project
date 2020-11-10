/*
 * Copyright 2020, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
*/

const path = require('path');
const childProcess = require('child_process');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const message = require('./utils/message');

const argv = yargs(hideBin(process.argv)).argv;

message.title(`create ${argv.type} project`);

const createPath = path.join(__dirname, '..', 'types', argv.type, 'scripts', 'create.js');
childProcess
    .execSync(
        `node ${createPath}`,
        { stdio: 'inherit' }
    );
