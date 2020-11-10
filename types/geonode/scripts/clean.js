/*
 * Copyright 2020, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
*/

const rimraf = require('rimraf');
const fs = require('fs');
const path = require('path');
const message = require('../../../scripts/utils/message');

const appDirectory = fs.realpathSync(process.cwd());
const staticPath = '../static/mapstore';
const distDirectory = 'dist';
rimraf.sync(path.resolve(appDirectory, staticPath));
fs.mkdirSync(path.resolve(appDirectory, staticPath + '/' + distDirectory), { recursive: true });
message.title('clean static directory');
