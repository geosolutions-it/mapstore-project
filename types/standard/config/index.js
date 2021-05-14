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
const castArray = require('lodash/castArray');

const appDirectory = fs.realpathSync(process.cwd());

const packageJSON = require(path.join(appDirectory, 'package.json'));
const mapstoreConfig = packageJSON.mapstore || {};

const { commit } = info();
const version = commit;

const frameworkPath = fs.existsSync(path.resolve(appDirectory, './MapStore2'))
    ? path.join(appDirectory, 'MapStore2', 'web', 'client')
    : path.join(appDirectory, 'node_modules', 'mapstore', 'web', 'client');
const webClientProductPath = path.resolve(frameworkPath, 'product');
const devServerPath = path.join(appDirectory, 'devServer.js');

const devServerDefault = {
    proxy: {
        '/rest': {
            target: 'http://localhost:8080/mapstore'
        },
        '/pdf': {
            target: 'http://localhost:8080/mapstore'
        },
        '/mapstore/pdf': {
            target: 'http://localhost:8080'
        },
        '/proxy': {
            target: 'http://localhost:8080/mapstore'
        },
        '/docs': {
            target: 'http://localhost:8081',
            pathRewrite: {'/docs': '/mapstore/docs'}
        },
        '/ms-translations': {
            target: 'http://localhost:8081/node_modules/mapstore/web/client',
            pathRewrite: {'^/ms-translations': '/translations'}
        },
        '/ms-configs': {
            target: 'http://localhost:8081/node_modules/@mapstore/project/types/standard',
            pathRewrite: {'^/ms-configs': '/defaultConfigs'}
        },
        '/libs': {
            target: 'http://localhost:8081/node_modules/mapstore/web/client'
        }
    }
};
const devServer = fs.existsSync(devServerPath) ? require(devServerPath) : () => devServerDefault;

function readEntriesPaths(entriesPaths, parse) {
    return entriesPaths.reduce((acc, entriesPath) => {
        const [targetPath, entryName] = castArray(entriesPath);
        const absolutePath = path.isAbsolute(targetPath)
            ? targetPath
            : path.resolve(appDirectory, targetPath);
        const stats = fs.lstatSync(absolutePath);
        if (stats.isDirectory()) {
            const dirName = absolutePath;
            const dirEntries = fs.readdirSync(dirName)
                .reduce((parsed, baseName) => ({
                    ...parsed,
                    ...parse({ dirName, baseName })
                }), {});
            return {
                ...acc,
                ...dirEntries
            };
        }
        if (stats.isFile()) {
            const dirName = path.dirname(absolutePath);
            const baseName = path.basename(absolutePath);
            return {
                ...acc,
                ...parse({
                    dirName,
                    baseName,
                    entryName
                })
            };
        }
        return acc;
    }, {});
}

const appsPaths = mapstoreConfig.apps || [
    [path.join(webClientProductPath, 'app.jsx'), 'mapstore'],
    path.join(webClientProductPath, 'embedded.jsx'),
    [path.join(webClientProductPath, 'api.jsx'), 'ms2-api'],
    path.join(appDirectory, 'js', 'apps')
];
const htmlPaths = mapstoreConfig.html || [
    path.resolve(__dirname, '..'), appDirectory
];
const themesPaths = mapstoreConfig.themes || [
    path.join(appDirectory, 'themes')
];
const jsPath = "js/";

const apps = readEntriesPaths(appsPaths, ({ dirName, baseName, entryName }) => ({
    [jsPath + (entryName || baseName).replace(/\.jsx|\.js/g, '')]: path.join(dirName, baseName)
}));
const htmlTemplates = readEntriesPaths(htmlPaths, ({ dirName, baseName, entryName }) => baseName.indexOf('.ejs') !== -1
    ? { [entryName || baseName.replace('.ejs', '.html')]: path.join(dirName, baseName)} : {}
);
const html = readEntriesPaths(htmlPaths, ({ dirName, baseName, entryName }) => baseName.indexOf('.html') !== -1
    ? { [entryName || baseName]: path.join(dirName, baseName)} : {}
);
const themes = readEntriesPaths(themesPaths, ({ dirName, baseName }) => {
    if (baseName.indexOf('theme.less') !== -1) {
        return {
            ['themes/' + path.basename(dirName)]: path.join(dirName, baseName)
        };
    }
    const themesFolder = path.join(dirName, baseName);
    const stats = fs.lstatSync(themesFolder);
    if (stats.isDirectory() && fs.readdirSync(themesFolder).indexOf('theme.less') !== -1) {
        return {
            ['themes/' + path.basename(themesFolder)]: path.join(themesFolder, 'theme.less')
        };
    }
    return {};
});

// for showing a short path in console report
const simplifyEntryPath = (entryPath = "") => {
    return entryPath.replace(appDirectory, ".");
}
const renderEntries = (entries) => {
    return JSON.stringify(Object.keys(entries).reduce((acc,k) => ({...acc, [k]: simplifyEntryPath(entries[k])}), {}), null, 4)
}

// Show a summary of entries to build
console.log(`
Build Entries:
- Apps: ${renderEntries(apps)}
- HTML: ${renderEntries({...html, ...htmlTemplates})}
- Themes: ${renderEntries(themes)}
`);

module.exports = {
    jsPath,
    frameworkPath,
    webClientProductPath,
    name: packageJSON.name,
    version,
    // translations,
    themes,
    apps,
    devServer: devServer(devServerDefault),
    htmlTemplates,
    html,
    templateParameters: mapstoreConfig.templateParameters || {}
};
