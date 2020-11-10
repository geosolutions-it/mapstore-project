/*
 * Copyright 2020, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
*/

const path = require('path');
const fs = require('fs');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const appDirectory = fs.realpathSync(process.cwd());
const mapStorePath = fs.realpathSync(path.join(appDirectory, 'node_modules', 'mapstore'));
const frameworkPath = path.join(mapStorePath, 'web', 'client');

const extractThemesPlugin = require(path.resolve(mapStorePath, 'build/themes.js')).extractThemesPlugin;
const buildConfig = require(path.resolve(mapStorePath, 'build/buildConfig.js'));

const projectConfig = require('./index.js');

module.exports = () => {

    const paths = {
        base: appDirectory,
        dist: path.join(appDirectory, 'dist'),
        framework: frameworkPath,
        code: [
            path.join(appDirectory, 'js'),
            frameworkPath
        ]
    };
    const publicPath = '';
    const cssPrefix = '.' + projectConfig.name;

    const mapStoreConfig = buildConfig(
        {},
        {},
        paths,
        extractThemesPlugin,
        false,
        publicPath,
        cssPrefix,
        [],
        {
            '@js': path.resolve(appDirectory, 'js'),
            '@mapstore/framework': frameworkPath
        }
    );

    return {
        ...mapStoreConfig,
        entry: {
            ...(projectConfig.apps || []).reduce((acc, name) => ({
                ...acc,
                ['js/' + name.replace(/\.jsx|\.js/g, '')]: path.join(appDirectory, 'js', 'apps', name)
            }), {}),
            ...(projectConfig.themes || []).reduce((acc, name) => ({
                ...acc,
                ['themes/' + name]: path.join(appDirectory, 'themes', name, 'theme.less')
            }), {})
        },
        plugins: [
            ...mapStoreConfig.plugins,
            new DefinePlugin({
                '__MAPSTORE_PROJECT_CONFIG__': JSON.stringify({
                    translationsPath: Object.keys(projectConfig.translations),
                    version: 'dev'
                })
            }),
            ...projectConfig.htmlTemplates.map((htmlTemplate) =>
                new HtmlWebpackPlugin({
                    inject: false,
                    filename: htmlTemplate.filename,
                    template: htmlTemplate.template,
                    templateParameters: {
                        version: 'dev',
                        name: projectConfig.name
                    }
                })
            )
        ],
        devServer: projectConfig.devServer || {}
    };
};
