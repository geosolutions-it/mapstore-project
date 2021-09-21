/*
 * Copyright 2021, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
*/

const path = require("path");
const projectConfig = require('./index.js');
const DefinePlugin = require("webpack/lib/DefinePlugin");
const extensionName = projectConfig.extensionName;
const frameworkPath = projectConfig.frameworkPath;
const createExtensionWebpackConfig = require(path.resolve(frameworkPath, '../../build/createExtensionWebpackConfig'));

const commons = require('./commons');
const webpackConfig = createExtensionWebpackConfig({
    prod: false,
    name: extensionName,
    plugins: [
        new DefinePlugin({ '__MAPSTORE_EXTENSION_CONFIG__': JSON.stringify({
            name: extensionName,
            version: projectConfig.version
        }) })
    ],
    ...commons,
    overrides: {
        // serve translations (and index.json)
        devServer: {
            clientLogLevel: 'debug',
            publicPath: "/extension/",
            contentBase: './assets',
            contentBasePublicPath: '/extension/'
        }
    }
});

module.exports = webpackConfig;

