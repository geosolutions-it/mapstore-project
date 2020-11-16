/**
 * Copyright 2020, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the ISC-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');
const appDirectory = fs.realpathSync(process.cwd());
const packageJSON = require(path.resolve(appDirectory, 'package.json')) || {};

function info() {
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
    return {
        commit,
        version,
        name
    };
}

module.exports = info;
