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
const isProject = !!fs.existsSync(path.join(appDirectory, 'node_modules', 'geonode_mapstore_client'));
const geoNodeMapStorePath = isProject
    ? path.join(appDirectory, 'node_modules', 'geonode_mapstore_client')
    : path.join(appDirectory);
const mapStorePath = fs.realpathSync(path.join(appDirectory, 'node_modules', 'mapstore'));
const frameworkPath = path.join(mapStorePath, 'web', 'client');

const extractThemesPlugin = require(path.resolve(mapStorePath, './build/themes.js')).extractThemesPlugin;
const buildConfig = require(path.resolve(mapStorePath, './build/buildConfig.js'));

const projectConfig = require('./index.js');

const DEV_SERVER_HOST = projectConfig.devServer.host;
const protocol = projectConfig.devServer.protocol;

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
        extractThemesPlugin,
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
            'ms2-geonode-api': path.join(geoNodeMapStorePath, 'js', 'api'),
            ...(projectConfig.apps || []).reduce((acc, name) => ({
                ...acc,
                [name]: path.join(appDirectory, 'js', 'apps', name)
            }), {}),
            'themes/default': path.join(geoNodeMapStorePath, 'themes', 'default', 'theme.less'),
            'themes/preview': path.join(geoNodeMapStorePath, 'themes', 'preview', 'theme.less'),
            ...(projectConfig.themes || []).reduce((acc, name) => ({
                ...acc,
                ['themes/' + name]: path.join(appDirectory, 'themes', name, 'theme.less')
            }), {})
        },
        plugins: [
            ...mapStoreConfig.plugins,
            new DefinePlugin({
                '__GEONODE_PROJECT_CONFIG__': JSON.stringify({
                    translationsPath: Object.keys(projectConfig.translations)
                })
            })
        ],
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
                    if (req.url.indexOf('/ms2-geonode-api') !== -1) {
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
                    target: `${protocol}://${DEV_SERVER_HOST}`,
                    headers: {
                        Host: DEV_SERVER_HOST,
                        Referer: `${protocol}://${DEV_SERVER_HOST}/`
                    }
                },
                {
                    context: [
                        ...Object.keys(projectConfig.translations)
                            .map(key => `${key}/**`)
                    ],
                    target: `${protocol}://localhost:8081`,
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
