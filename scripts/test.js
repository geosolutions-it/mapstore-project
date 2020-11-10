/*
 * Copyright 2020, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
*/

const fs = require('fs-extra');
const path = require('path');
const childProcess = require('child_process');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const message = require('./utils/message');

const argv = yargs(hideBin(process.argv)).argv;

const appDirectory = fs.realpathSync(process.cwd());
const nodeModulesPath = path.join(appDirectory, 'node_modules');
const mochaPath = path.resolve(nodeModulesPath, 'mocha');
const geoSolutionsMochaPath = path.resolve(nodeModulesPath, '@geosolutions/mocha');
// check if mocha is correctly installed
if (!fs.existsSync(mochaPath) && fs.existsSync(geoSolutionsMochaPath)) {
    message.title('copy \'@geosolutions/mocha\' to \'mocha\'');
    fs.emptyDirSync(mochaPath);
    fs.copySync(geoSolutionsMochaPath, mochaPath);
} else if (!fs.existsSync(mochaPath) && !fs.existsSync(geoSolutionsMochaPath)) {
    throw new Error('Cannot find \'mocha\' nor \'@geosolutions/mocha\' modules');
}

const karmaPath = path.join(appDirectory, 'node_modules', '.bin', 'karma');
const karmaConfigSingleRunPath = path.join(__dirname, '..', 'types', argv.type, 'config', 'karma.conf.single-run.js');
const karmaConfigContinuousPath = path.join(__dirname, '..', 'types', argv.type, 'config', 'karma.conf.continuous-test.js');
const karmaConfigPath = argv.watch ? karmaConfigContinuousPath : karmaConfigSingleRunPath;
childProcess
    .execSync(
        `${karmaPath} start ${karmaConfigPath} --colors`,
        { stdio: 'inherit' }
    );
