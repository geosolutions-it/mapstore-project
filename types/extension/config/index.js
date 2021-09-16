/*
 * Copyright 2021, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
*/

const path = require('path');
const fs = require('fs-extra');
const info = require('../../../scripts/utils/info');
const appDirectory = fs.realpathSync(process.cwd());
const packageJSON = require(path.join(appDirectory, 'package.json'));
const frameworkPath = fs.realpathSync(fs.existsSync(path.resolve(appDirectory, './MapStore2'))
    ? path.join(appDirectory, 'MapStore2', 'web', 'client')
    : path.join(appDirectory, 'node_modules', 'mapstore', 'web', 'client'));

const mapstoreConfig = packageJSON.mapstore || {};
const { commit } = info();
const version = commit;

module.exports = {
    name: packageJSON.name,
    extensionName: mapstoreConfig.extensionName || 'Extension',
    frameworkPath,
    version
};
