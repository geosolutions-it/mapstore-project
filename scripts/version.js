/*
 * Copyright 2020, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
*/

const path = require('path');
const fs = require('fs-extra');
const childProcess = require('child_process');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const message = require('./utils/message');

const appDirectory = fs.realpathSync(process.cwd());
const versionFileDestination = path.join(appDirectory, 'version.txt');

const argv = yargs(hideBin(process.argv)).argv;

if (argv.v) {
    childProcess.execSync(`npm version ${argv.v}`);
}

const packageJSON = require(path.resolve(appDirectory, 'package.json')) || {};
const version = packageJSON.version;
const name = packageJSON.name;
let commit;

try {
    commit = childProcess
        .execSync('git rev-parse HEAD')
        .toString().trim();
} catch (e) {
    commit = '';
}

fs.writeFileSync(versionFileDestination, `${name}-v${version}-${commit}`);
message.title(`update version -> version ${version} - commit ${commit}`);
