/**
 * Copyright 2020, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the ISC-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const path = require('path');
const fs = require('fs');
const appDirectory = fs.realpathSync(process.cwd());
const isProject = !!fs.existsSync(path.join(appDirectory, 'node_modules', 'geonode-mapstore-client', 'geonode_mapstore_client', 'client'));
const geoNodeMapStorePath = isProject
    ? path.join(appDirectory, 'node_modules', 'geonode-mapstore-client', 'geonode_mapstore_client', 'client')
    : path.join(appDirectory);
const mapStorePath = path.join(appDirectory, 'node_modules', 'mapstore');
const frameworkPath = path.join(mapStorePath, 'web', 'client');
const projectConfig = require('./index.js');

module.exports = function karmaConfig(config) {
    const testConfig = require(path.join(mapStorePath, 'build', 'testConfig.js'))({
        files: [
            path.join(__dirname, 'tests.webpack.js'),
            ...(isProject ? [] : [{ pattern: './MapStore2/**/*', included: false }])
        ],
        browsers: ['Chrome'],
        path: [
            path.join(geoNodeMapStorePath, 'js'),
            path.join(appDirectory, 'js'),
            frameworkPath,
            // add MapStore2 path for "file:MapStore2" installation
            // to target the correct directory
            ...(isProject ? [] : [ path.join(appDirectory, 'MapStore2', 'web', 'client') ])
        ],
        basePath: appDirectory,
        testFile: path.join(__dirname, 'tests.webpack.js'),
        singleRun: false,
        alias: {
            '@js': path.resolve(geoNodeMapStorePath, 'js'),
            '@mapstore/framework': frameworkPath,
            ...projectConfig.extend
        }
    });

    testConfig.webpack.module.rules = [
        ...testConfig.webpack.module.rules.map((rule) => {
            // remove exclude node_modules for project
            // to get node_modules/mapstore
            if (isProject && rule && rule.use && rule.use[0] && rule.use[0].loader === 'babel-loader') {
                return {
                    ...rule,
                    exclude: undefined
                };
            }
            return rule;
        })];

    testConfig.webpack.resolve.modules = [
        // resolve module installed inside the MapStore2 submodule
        // it's needed for project that install MapStore dependency with
        // "file:MapStore2"
        path.join(mapStorePath, 'node_modules'),
        'node_modules'
    ];

    config.set(testConfig);
};
