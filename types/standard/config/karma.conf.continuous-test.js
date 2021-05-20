const path = require("path");
const fs = require('fs');
const appDirectory = fs.realpathSync(process.cwd());
const mapStorePath = fs.realpathSync(path.join(appDirectory, 'node_modules', 'mapstore'));

const getTestConfig = require(path.join(__dirname, 'testConfig.js'));
const frameworkPath = path.join(mapStorePath, 'web', 'client');
const projectJSPath = path.join(appDirectory, 'js');
const testWebpackPath = path.join(__dirname, 'tests.webpack.js');

module.exports = function karmaConfig(config) {
    const code = [
        projectJSPath,
        frameworkPath
    ];
    config.set(getTestConfig({
        files: [
            testWebpackPath
        ],
        browsers: ["Chrome"],
        basePath: appDirectory,
        path: code,
        testFile: testWebpackPath,
        singleRun: false,
        alias: {
            '@js': projectJSPath,
            '@mapstore/framework': frameworkPath
        }
    }));
};
