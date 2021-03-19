/**
 * Copyright 2020, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the ISC-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const path = require('path');
const fs = require('fs-extra');
const assign = require('object-assign');
const appDirectory = fs.realpathSync(process.cwd());
const isProject = !!fs.existsSync(path.join(appDirectory, 'node_modules', 'geonode-mapstore-client', 'geonode_mapstore_client', 'client'));
const geoNodeMapStorePath = isProject
    ? path.join(appDirectory, 'node_modules', 'geonode-mapstore-client', 'geonode_mapstore_client', 'client')
    : path.join(appDirectory);
const mapStorePath = fs.realpathSync(path.join(appDirectory, 'node_modules', 'mapstore'));
const frameworkPath = path.join(mapStorePath, 'web', 'client');

const packageJSON = require(path.resolve(appDirectory, 'package.json')) || {};

const projectConfig = packageJSON.geonode || {};
const devServer = projectConfig.devServer || {};

const envPath = path.resolve(appDirectory, 'env.json');
const envJson = fs.existsSync(envPath) ? require(envPath) : {};

const versionData = fs.readFileSync(path.join(appDirectory, 'version.txt'), 'utf8');
const version = versionData.toString();

const placeholder = path.join(geoNodeMapStorePath, 'js', 'extend.js');

const extendJSAPIPluginsPath = isProject && fs.existsSync(path.join(appDirectory, 'js', 'jsapi', 'plugins.js'))
    ? path.join(appDirectory, 'js', 'jsapi', 'plugins.js')
    : placeholder;

const extendJSAPIPreviewPluginsPath = isProject && fs.existsSync(path.join(appDirectory, 'js', 'jsapi', 'previewPlugins.js'))
    ? path.join(appDirectory, 'js', 'jsapi', 'previewPlugins.js')
    : placeholder;

const translations = !isProject
    ? {
        '/static/mapstore/ms-translations': [
            path.join(frameworkPath, 'translations'),
            'ms-translations',
            '/node_modules/mapstore/web/client/translations'
        ],
        '/static/mapstore/gn-translations': [
            path.join(appDirectory, 'static', 'mapstore', 'translations'),
            'gn-translations',
            '/static/mapstore/translations'
        ]
    }
    : {
        '/static/mapstore/ms-translations': [
            path.join(frameworkPath, 'translations'),
            'ms-translations',
            '/node_modules/mapstore/web/client/translations'
        ],
        '/static/mapstore/gn-translations': [
            path.join(geoNodeMapStorePath, 'static', 'mapstore', 'translations'),
            'gn-translations',
            '/node_modules/geonode-mapstore-client/geonode_mapstore_client/client/static/mapstore/translations'
        ],
        ...( fs.existsSync(path.join(appDirectory, 'static', 'mapstore', 'translations'))
            && {'/static/mapstore/project-translations': [
                path.join(appDirectory, 'static', 'mapstore', 'translations'),
                'project-translations',
                '/static/mapstore/translations'
            ]})
    };

const themesPath = path.join(appDirectory, 'themes');
const appsPath = path.join(appDirectory, 'js', 'apps');
const themes = isProject && fs.existsSync(themesPath) ? fs.readdirSync(themesPath) : [];
const apps = isProject && fs.existsSync(appsPath) ? fs.readdirSync(appsPath) : [];

module.exports = assign(
    projectConfig,
    {
        version: version,
        devServer: {
            host: devServer.host || envJson.DEV_SERVER_HOST || 'localhost',
            proxyTargetHost: devServer.proxyTargetHost || envJson.DEV_SERVER_PROXY_TARGET_HOST || 'localhost:8000',
            protocol: devServer.protocol || envJson.DEV_SERVER_HOST_PROTOCOL || 'http'
        },
        extend: {
            '@extend/jsapi/plugins': extendJSAPIPluginsPath,
            '@extend/jsapi/previewPlugins': extendJSAPIPreviewPluginsPath
        },
        translations,
        themes,
        apps
    }
);
