/*
 * Copyright 2020, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const path = require('path');
const fs = require('fs');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const appDirectory = fs.realpathSync(process.cwd());

const publicPath = '';
const output = 'dist/';

const projectConfig = require('./index.js');
const templateParameters = require('./templateParameters');

const isProject = !fs.existsSync(path.join(appDirectory, 'web', 'client', 'product'));

const frameworkPath = !isProject
    ? path.join(appDirectory, 'web', 'client')
    : fs.existsSync(path.resolve(appDirectory, './MapStore2'))
        ? path.join(appDirectory, 'MapStore2', 'web', 'client')
        : path.join(appDirectory, 'node_modules', 'mapstore', 'web', 'client');

const buildConfig = require(path.resolve(frameworkPath, '../../build/buildConfig'));
const extractThemesPlugin = require(path.resolve(frameworkPath, '../../build/themes.js')).extractThemesPlugin;

const webClientProductPath = path.resolve(frameworkPath, 'product');

const paths = {
    base: path.resolve(appDirectory),
    dist: isProject
        ? path.resolve(appDirectory, output)
        : path.resolve(frameworkPath, output),
    framework: frameworkPath,
    code: [
        path.join(appDirectory, 'js'),
        frameworkPath
    ]
};

const themePrefix = projectConfig.name;

module.exports = buildConfig({
    bundles: {
        'js/mapstore': path.join(webClientProductPath, 'app'),
        'js/embedded': path.join(webClientProductPath, 'embedded'),
        'js/ms2-api': path.join(webClientProductPath, 'api'),
        ...(projectConfig.apps || []).reduce((acc, name) => ({
            ...acc,
            ['js/' + name.replace(/\.jsx|\.js/g, '')]: path.join(appDirectory, 'js', 'apps', name)
        }), {})
    },
    themeEntries: {
        'themes/default': path.join(paths.framework, 'themes', 'default', 'theme.less'),
        ...(projectConfig.themes || []).reduce((acc, name) => ({
            ...acc,
            ['themes/' + name]: path.join(appDirectory, 'themes', name, 'theme.less')
        }), {})
    },
    paths,
    plugins: [
        extractThemesPlugin,
        new CopyWebpackPlugin([
            // mapstore product
            { from: path.join(paths.framework, 'configs'), to: path.join(paths.dist, 'ms-configs') },
            { from: path.join(paths.framework, 'translations'), to: path.join(paths.dist, 'ms-translations') },
            { from: path.join(paths.framework, 'libs', 'cesium-navigation'), to: path.join(paths.dist, 'libs', 'cesium-navigation') },
            { from: path.join(paths.base, 'configs'), to: path.join(paths.dist, 'configs') },
            ...fs.existsSync(path.join(paths.base, 'assets'))
                ? [{ from: path.join(paths.base, 'assets'), to: path.join(paths.dist, 'assets') }]
                : [],
            ...fs.existsSync(path.join(paths.base, 'static'))
                ? [{ from: path.join(paths.base, 'static'), to: path.join(paths.dist, 'static') }]
                : []
        ]),
        ...Object.keys(projectConfig.htmlTemplates).map((key) =>
            new HtmlWebpackPlugin({
                inject: false,
                filename: key,
                template: projectConfig.htmlTemplates[key],
                templateParameters: {
                    ...templateParameters,
                    ...projectConfig.templateParameters,
                    version: projectConfig.version,
                    name: projectConfig.name
                }
            })
        )
    ],
    prod: true,
    publicPath,
    cssPrefix: `.${themePrefix}`,
    alias: {
        '@mapstore/framework': paths.framework,
        '@js': path.resolve(appDirectory, 'js')
    },
    projectConfig: {
        themePath: publicPath + 'themes',
        themePrefix: themePrefix,
        version: projectConfig.version
    },
    resolveModules: [
        // resolve module installed inside the MapStore2 submodule
        // it's needed for project that install MapStore dependency with
        // "file:MapStore2"
        ...(fs.existsSync(path.join(appDirectory, 'node_modules', 'mapstore', 'node_modules'))
            ? [fs.realpathSync(path.join(appDirectory, 'node_modules', 'mapstore', 'node_modules'))]
            : []),
        'node_modules'
    ]
});
