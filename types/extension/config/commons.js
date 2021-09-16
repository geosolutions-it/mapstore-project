/*
 * Copyright 2021, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
*/

const path = require("path");
const fs = require('fs');
const projectConfig = require('./index.js');
const appDirectory = fs.realpathSync(process.cwd());
// common configuration between production and development for webpack
module.exports = {
    // exposes tells the module federation the entries to expose. `./plugin` the plugin key for loading.
    exposes: {
        "./plugin": path.join(appDirectory, 'js', 'extension', 'plugins', "Extension")
    },
    // dist of the root of the project
    destination: path.join(appDirectory, "dist"),
    // to compile properly also mapstore dependencies
    alias: {
        "@mapstore/framework": projectConfig.frameworkPath,
        "@js": path.resolve(appDirectory, "js")
    }
};
