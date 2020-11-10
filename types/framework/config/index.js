/*
 * Copyright 2020, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
*/

const path = require('path');
const fs = require('fs-extra');
const appDirectory = fs.realpathSync(process.cwd());
const mapStorePath = fs.realpathSync(path.join(appDirectory, 'node_modules', 'mapstore'));
const frameworkPath = path.join(mapStorePath, 'web', 'client');

const packageJSON = require(path.join(appDirectory, 'package.json'));
const versionData = fs.readFileSync(path.join(appDirectory, 'version.txt'), 'utf8');
const version = versionData.toString();

const isProject = !fs.existsSync(path.resolve(appDirectory, 'bin/mapstore-project.js'));

const translations = {
    'static/ms-translations': [
        path.join(frameworkPath, 'translations'),
        'static/ms-translations'
    ],
    'static/translations': [
        path.join(appDirectory, 'static', 'translations'),
        'static/translations'
    ]
};

const themesPath = path.join(appDirectory, 'themes');
const appsPath = path.join(appDirectory, 'js', 'apps');
const devServerPath = path.join(appDirectory, 'devServer.js');
const themes = isProject && fs.existsSync(themesPath) ? fs.readdirSync(themesPath) : [];
const apps = isProject && fs.existsSync(appsPath) ? fs.readdirSync(appsPath) : [];
const devServer = isProject && fs.existsSync(devServerPath) ? fs.readdirSync(devServerPath) : {
    proxy: {
        '/static/ms-translations': {
            target: 'http://localhost:8081',
            pathRewrite: {
                '/static/ms-translations': path.join(frameworkPath, 'translations')
            }
        }
    }
};

const htmlTemplates = fs.readdirSync(appDirectory)
    .filter((file) => file.indexOf('.ejs') !== -1)
    .map((file) => ({
        filename: file.replace('.ejs', '') + '.html',
        template: path.join(appDirectory, file)
    }));

module.exports = {
    name: packageJSON.name,
    version,
    translations,
    themes,
    apps,
    devServer,
    htmlTemplates
};
