const path = require('path');
const fs = require('fs');
const appDirectory = fs.realpathSync(process.cwd());
const mapStorePath = fs.realpathSync(path.join(appDirectory, 'node_modules', 'mapstore'));

const getTestConfig = require(path.join(__dirname, 'testConfig.js'));
const frameworkPath = path.join(mapStorePath, 'web', 'client');
const projectJSPath = path.join(appDirectory, 'js');
const testWebpackPath = path.join(__dirname, 'tests-travis.webpack.js');

module.exports = function karmaConfig(config) {

    const code = [
        projectJSPath,
        frameworkPath
    ];
    // set BABEL_ENV to load proper preset config (e.g. istanbul plugin)
    process.env.BABEL_ENV = 'test';
    const testConfig = getTestConfig({
        files: [
            testWebpackPath
        ],
        path: code,
        basePath: appDirectory,
        testFile: testWebpackPath,
        singleRun: true,
        alias: {
            '@js': projectJSPath,
            '@mapstore/framework': frameworkPath
        }
    });

    config.set(testConfig);
};
