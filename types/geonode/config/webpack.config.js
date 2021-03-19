/**
 * Copyright 2020, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the ISC-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const path = require('path');
const fs = require('fs');
const DefinePlugin = require('webpack/lib/DefinePlugin');

const appDirectory = fs.realpathSync(process.cwd());
const isProject = !!fs.existsSync(path.join(appDirectory, 'node_modules', 'geonode-mapstore-client', 'geonode_mapstore_client', 'client'));
const geoNodeMapStorePath = isProject
    ? path.join(appDirectory, 'node_modules', 'geonode-mapstore-client', 'geonode_mapstore_client', 'client')
    : path.join(appDirectory);
const mapStorePath = fs.realpathSync(path.join(appDirectory, 'node_modules', 'mapstore'));
const frameworkPath = path.join(mapStorePath, 'web', 'client');

const extractThemesPlugin = require(path.resolve(mapStorePath, './build/themes.js')).extractThemesPlugin;
const moduleFederationPlugin = require(path.resolve(mapStorePath, './build/moduleFederation.js')).plugin;
const buildConfig = require(path.resolve(mapStorePath, './build/buildConfig.js'));

const projectConfig = require('./index.js');

const devServerHost = projectConfig.devServer.host;
const proxyTargetHost = projectConfig.devServer.proxyTargetHost;
const protocol = projectConfig.devServer.protocol;

const geoNodeMapStoreAppsPath = path.join(geoNodeMapStorePath, 'js', 'apps');
const geoNodeMapStoreApps = fs.existsSync(geoNodeMapStoreAppsPath) ? fs.readdirSync(geoNodeMapStoreAppsPath) : [];

module.exports = () => {

    const mapStoreConfig = buildConfig(
        {},
        {},
        {
            base: appDirectory,
            dist: path.join(appDirectory, 'dist'),
            framework: frameworkPath,
            code: [
                path.join(geoNodeMapStorePath, 'js'),
                path.join(appDirectory, 'js'),
                frameworkPath
            ]
        },
        [
            extractThemesPlugin,
            new DefinePlugin({
                '__MAPSTORE_PROJECT_CONFIG__': JSON.stringify({
                    translationsPath: Object.keys(projectConfig.translations)
                })
            }),
            moduleFederationPlugin
        ],
        false,
        '/static/mapstore/dist/',
        '.msgapi',
        [],
        {
            '@js': path.resolve(geoNodeMapStorePath, 'js'),
            '@mapstore/framework': frameworkPath,
            ...projectConfig.extend
        }
    );

    return {
        ...mapStoreConfig,
        entry: {
            ...geoNodeMapStoreApps.reduce((acc, name) => ({
                ...acc,
                [name.replace(/\.jsx|\.js/g, '')]: path.join(geoNodeMapStorePath, 'js', 'apps', name)
            }), {}),
            ...(projectConfig.apps || []).reduce((acc, name) => ({
                ...acc,
                [name.replace(/\.jsx|\.js/g, '')]: path.join(appDirectory, 'js', 'apps', name)
            }), {}),
            'themes/default': path.join(geoNodeMapStorePath, 'themes', 'default', 'theme.less'),
            'themes/preview': path.join(geoNodeMapStorePath, 'themes', 'preview', 'theme.less'),
            ...(projectConfig.themes || []).reduce((acc, name) => ({
                ...acc,
                ['themes/' + name]: path.join(appDirectory, 'themes', name, 'theme.less')
            }), {})
        },
        resolve: {
            ...mapStoreConfig.resolve,
            modules: [
                // resolve module installed inside the MapStore2 submodule
                // it's needed for project that install MapStore dependency with
                // "file:MapStore2"
                path.join(mapStorePath, 'node_modules'),
                'node_modules'
            ]
        },
        module: {
            ...mapStoreConfig.module,
            rules: [
                ...mapStoreConfig.module.rules,
                {
                    test: /\.s[ac]ss$/i,
                    use: [
                        'style-loader',
                        'css-loader',
                        'sass-loader'
                    ]
                }
            ]
        },
        devServer: {
            clientLogLevel: 'debug',
            https: protocol === 'https' ? true : false,
            host: devServerHost,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            contentBase: [
                path.join(appDirectory)
            ],
            before: function(app) {
                const hashRegex = /\.[a-zA-Z0-9]{1,}\.js/;
                app.use(function(req, res, next) {
                    // remove hash from requests to use the local js
                    const appsName = [
                        ...geoNodeMapStoreApps,
                        ...(projectConfig.apps || [])
                    ]
                        .find(name => req.url.indexOf('/' + name) !== -1 );
                    if (appsName) {
                        req.url = req.url.replace(hashRegex, '.js');
                        req.path = req.path.replace(hashRegex, '.js');
                        req.originalUrl = req.originalUrl.replace(hashRegex, '.js');
                    }
                    next();
                });
            },
            proxy: [
                {
                    context: [
                        '**',
                        '!**/static/mapstore/**',
                        '!**/MapStore2/**',
                        '!**/node_modules/**'
                    ],
                    target: `${protocol}://${proxyTargetHost}`,
                    headers: {
                        Host: proxyTargetHost,
                        Referer: `${protocol}://${proxyTargetHost}/`
                    }
                },
                {
                    context: [
                        ...Object.keys(projectConfig.translations)
                            .map(key => `${key}/**`)
                    ],
                    target: `${protocol}://${devServerHost}:8081`,
                    secure: false,
                    changeOrigin: true,
                    pathRewrite: {
                        ...Object.keys(projectConfig.translations)
                            .reduce((acc, key) => ({
                                ...acc,
                                [key]: projectConfig.translations[key][2]
                            }), {})
                    }
                }
            ]
        }
    };
};
