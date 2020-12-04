/*
 * Copyright 2020, GeoSolutions Sas.
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

const isProject = !fs.existsSync(path.join(appDirectory, 'web', 'client', 'product'));

const { commit } = info();
const version = commit;

const themesPath = path.join(appDirectory, 'themes');
const appsPath = path.join(appDirectory, 'js', 'apps');
const devServerPath = path.join(appDirectory, 'devServer.js');
const themes = isProject && fs.existsSync(themesPath) ? fs.readdirSync(themesPath) : [];
const apps = isProject && fs.existsSync(appsPath) ? fs.readdirSync(appsPath) : [];
const devServer = isProject && fs.existsSync(devServerPath) ? require(devServerPath) : undefined;

const defaultHtmlTemplates = {
    'index.html': path.resolve(__dirname, '../index.ejs'),
    'embedded.html': path.resolve(__dirname, '../embedded.ejs'),
    'unsupportedBrowser.html': path.resolve(__dirname, '../unsupportedBrowser.ejs'),
    'api.html': path.resolve(__dirname, '../api.ejs')
};

const htmlTemplates = fs.readdirSync(appDirectory)
    .filter((file) => file.indexOf('.ejs') !== -1)
    .reduce((acc, file) => ({
        ...acc,
        [file.replace('.ejs', '.html') ]: path.join(appDirectory, file)
    }), {});

module.exports = {
    name: packageJSON.name,
    version,
    // translations,
    themes,
    apps,
    devServer,
    htmlTemplates: {
        ...defaultHtmlTemplates,
        ...htmlTemplates
    },
    templateParameters: packageJSON.mapstore && packageJSON.mapstore.templateParameters || {}
};
