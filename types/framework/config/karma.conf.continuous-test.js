/*
 * Copyright 2020, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
*/

const path = require('path');
const fs = require('fs');
const appDirectory = fs.realpathSync(process.cwd());
const mapStorePath = path.join(appDirectory, 'node_modules', 'mapstore');
const frameworkPath = path.join(mapStorePath, 'web', 'client');

module.exports = function karmaConfig(config) {
    const testConfig = require(path.join(mapStorePath, 'build', 'testConfig.js'))({
        files: [
            path.join(__dirname, 'tests.webpack.js')
        ],
        browsers: ['Chrome'],
        path: [
            path.join(appDirectory, 'js'),
            frameworkPath
        ],
        basePath: appDirectory,
        testFile: path.join(__dirname, 'tests.webpack.js'),
        singleRun: false,
        alias: {
            '@js': path.resolve(appDirectory, 'js'),
            '@mapstore/framework': frameworkPath
        }
    });

    config.set(testConfig);
};
