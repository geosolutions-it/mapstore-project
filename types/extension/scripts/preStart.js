/*
 * Copyright 2021, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
*/

const fs = require('fs');
const path = require('path');
const appDirectory = fs.realpathSync(process.cwd());
const projectConfig = require('../config/index.js');
const extensionIndexPath = path.join(appDirectory, 'assets', 'index.json');
const extensionIndex = fs.existsSync(extensionIndexPath) ? require(extensionIndexPath) : {};
// create index.json if missing or the extension name has been changed
if ((extensionIndex && extensionIndex.plugins && extensionIndex.plugins[0] && extensionIndex.plugins[0].name) !== projectConfig.extensionName) {
    const indexJSON = {
        "plugins": [
            {
                "name": projectConfig.extensionName
            }
        ]
    };
    fs.writeFileSync(extensionIndexPath, JSON.stringify(indexJSON, null, 2));
}
