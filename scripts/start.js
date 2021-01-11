/*
 * Copyright 2020, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
*/

const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const message = require('./utils/message');

message.title('start dev');

const argv = yargs(hideBin(process.argv)).argv;
const appDirectory = fs.realpathSync(process.cwd());
const webpackDevServerPath = path.join(appDirectory, 'node_modules', '.bin', 'webpack');
const webpackConfigPath = path.join(__dirname, '..', 'types', argv.type, 'config', 'webpack.config.js');
childProcess
    .execSync(
        `${webpackDevServerPath} serve --progress --color --port ${argv.port || '8081'} --hot --inline --config ${webpackConfigPath}`,
        { stdio: 'inherit' }
    );
