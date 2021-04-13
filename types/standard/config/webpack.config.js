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
const appDirectory = fs.realpathSync(process.cwd());

const publicPath = '';
const output = '';

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

const jsPath = "js";

const paths = {
    base: path.resolve(appDirectory),
    dist: path.resolve(appDirectory, output),
    framework: frameworkPath,
    chunks: jsPath + "/",
    code: [
        path.join(appDirectory, jsPath),
        frameworkPath
    ]
};

const themePrefix = projectConfig.name;

module.exports = () => {

    return buildConfig({
        prod: false,
        publicPath,
        cssPrefix: `.${themePrefix}`,
        bundles: {
            [jsPath + '/mapstore']: path.join(webClientProductPath, 'app'),
            ...(projectConfig.apps || []).reduce((acc, name) => ({
                ...acc,
                [jsPath + '/' + name.replace(/\.jsx|\.js/g, '')]: path.join(appDirectory, jsPath, 'apps', name)
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
        alias: {
            '@mapstore/framework': paths.framework,
            '@js': path.resolve(appDirectory, jsPath)
        },
        plugins: [
            extractThemesPlugin,
            ...Object.keys(projectConfig.htmlTemplates).map((key) =>
                new HtmlWebpackPlugin({
                    inject: false,
                    filename: key,
                    template: projectConfig.htmlTemplates[key],
                    templateParameters: {
                        ...templateParameters,
                        ...projectConfig.templateParameters,
                        version: 'dev',
                        name: projectConfig.name
                    }
                })
            )
        ],
        projectConfig: {
            themePath: publicPath + 'themes',
            themePrefix: themePrefix,
            version: 'dev'
        },
        resolveModules: [
            // resolve module installed inside the MapStore2 submodule
            // it's needed for project that install MapStore dependency with
            // "file:MapStore2"
            ...(fs.existsSync(path.join(appDirectory, 'node_modules', 'mapstore', 'node_modules'))
                ? [fs.realpathSync(path.join(appDirectory, 'node_modules', 'mapstore', 'node_modules'))]
                : []),
            'node_modules'
        ],
        devServer: {
            contentBase: isProject ? '.' : 'web/client',
            ...projectConfig.devServer
        }
    });
};
