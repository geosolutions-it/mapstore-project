/*
 * Copyright 2021, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
*/

const path = require("path");
const fs = require('fs');
const DefinePlugin = require("webpack/lib/DefinePlugin");
const appDirectory = fs.realpathSync(process.cwd());
const projectConfig = require('./index.js');
const extensionName = projectConfig.extensionName;
const frameworkPath = projectConfig.frameworkPath;
const createExtensionWebpackConfig = require(path.resolve(frameworkPath, '../../build/createExtensionWebpackConfig'));
const CopyPlugin = require('copy-webpack-plugin');
const ZipPlugin = require('zip-webpack-plugin');
const commons = require('./commons');

// the build configuration for production allow to create the final zip file, compressed accordingly
const plugins = [
    new CopyPlugin([
        { from: path.resolve(appDirectory, "assets", "translations"), to: "translations" },
        { from: path.resolve(appDirectory, "assets", "index.json"), to: "index.json" }
    ]),
    new ZipPlugin({
        filename: `${extensionName}.zip`,
        pathMapper: assetPath => {
            if (assetPath.startsWith('translations') || assetPath.startsWith('assets')) {
                return assetPath;
            }
            // other files have to be placed in the root, with the same name
            return path.basename(assetPath);
        }
    }),
    new DefinePlugin({ '__MAPSTORE_EXTENSION_CONFIG__': JSON.stringify({
        name: extensionName,
        version: projectConfig.version
    }) })
];
module.exports = createExtensionWebpackConfig({ prod: true, name: extensionName, ...commons, plugins});
