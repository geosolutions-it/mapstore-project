/*
 * Copyright 2020, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
*/

const fs = require('fs-extra');
const path = require('path');
const rimraf = require('rimraf');
const childProcess = require('child_process');
const readline = require('readline-promise').default;
const message = require(path.resolve(__dirname, '..', '..', '..', 'scripts/utils/message'));
const appDirectory = fs.realpathSync(process.cwd());
const mapsStoreProjectPackageJSON = require(path.resolve(__dirname, '..', '..', '..', 'package.json'));

const gitignoreBody = `
node_modules/
node/
dist/
build/
target/
*.sublime-*
npm-debug.log
package-lock.json
coverage/
web/client/libs/Cesium/
web/cesium.zip
web/.classpath
web/.project
.idea
*.iml
_site
.sass-cache
.jekyll-metadata
*.lock
docs/developer-guide/reference/
web/client/mapstore/docs/
web/docs
.classpath
.project
.settings/
debug.log
.vscode/settings.json
`;

function readParam(rl, params, result) {
    return new Promise((resolve, reject) => {
        if (params.length === 0) {
            resolve(result);
        } else {
            const [param, ...other] = params;
            rl.questionAsync(param.label).then((answer) => {
                result[param.name] = answer || param.default;
                if (param.validate(result[param.name])) {
                    resolve(readParam(rl, other, result));
                } else {
                    reject(new Error(`the ${param.name}: ${answer} is not valid`));
                }
            });
        }
    });
}

const normalizeProfiles = (profiles) =>
    profiles.split(',').map(s => s.trim().toLowerCase()).join(",");

function readParams(paramsDesc) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    return readParam(rl, paramsDesc, {});
}

function create(params) {
    const clientFolder = path.resolve(appDirectory, params.name);
    if (!fs.existsSync(clientFolder)) {
        fs.mkdirSync(clientFolder);
    }

    const packageJSONPath = path.resolve(clientFolder, 'package.json');
    const packageJSON = fs.existsSync(packageJSONPath) ? require(packageJSONPath) : {};

    const libVersion = mapsStoreProjectPackageJSON.version;

    const newPackageJSON = {
        ...packageJSON,
        'name': params.name || packageJSON.name || 'mapstore-project',
        'version': params.version || packageJSON.version || '1.0.0',
        'description': params.description || packageJSON.description || 'mapstore project',
        'eslintConfig': mapsStoreProjectPackageJSON.eslintConfig,
        "browserslist": mapsStoreProjectPackageJSON.browserslist,
        'scripts': {
            ...packageJSON.scripts,
            'compile': 'mapstore-project compile standard',
            'lint': 'eslint js --ext .jsx,.js',
            'start': 'mapstore-project start standard',
            'test': 'mapstore-project test standard',
            'test:watch': 'mapstore-project test:watch standard'
        },
        'devDependencies': {
            ...packageJSON.devDependencies,
            '@mapstore/project': libVersion + ''
        },
        'dependencies': {
            ...packageJSON.dependencies,
            'mapstore': mapsStoreProjectPackageJSON.devDependencies.mapstore
        },
        'mapstore': {
            ...packageJSON.mapstore
        }
    };

    fs.writeFileSync(packageJSONPath, JSON.stringify(newPackageJSON, null, 2));

    fs.writeFileSync(path.resolve(clientFolder, '.gitignore'), gitignoreBody);

    const buildScript = `
set -e

echo "Running NPM install to update dependencies"
echo \`date\`
npm install

echo "Building frontend"
echo \`date\`
npm run compile
${params.includeBackend === 'yes' ? `
echo "Building backend"
echo \`date\`
cd java
mvn clean install ${params.profiles ? "-P" + normalizeProfiles(params.profiles) : ""}
cd ..
` : ''}
`;

    fs.writeFileSync(path.resolve(clientFolder, "build.sh"), buildScript);

    fs.copySync(path.resolve(__dirname, '..', 'templates'), path.resolve(clientFolder));

    if (params.includeBackend !== 'yes') {
        rimraf.sync(path.resolve(clientFolder, 'java'));
    }
}

const isProject = !fs.existsSync(path.resolve(appDirectory, 'bin/mapstore-project.js'));

const profiles = [
    "printing",
    "ldap"
];

function isValidProfile(profile) {
    return profiles.includes(profile);
}

if (isProject) {

    message.title('create project');

    const paramsDesc = [
        {
            'label': '  - Name of project (default mapstore-project): ',
            'name': 'name',
            'default': 'mapstore-project',
            'validate': () => true
        }, {
            'label': '  - Include backend (yes/no default yes): ',
            'name': 'includeBackend',
            'default': 'yes',
            'validate': () => true
        }, {
            'label': '  - Optional features (printing, ldap): ',
            'name': 'profiles',
            'default': '',
            'validate': (val) => !val || normalizeProfiles(val).split(",").every(isValidProfile)
        }, {
            'label': '  - Run npm install after creation setup (yes/no default yes): ',
            'name': 'runInstall',
            'default': 'yes',
            'validate': () => true
        }
    ];

    readParams(paramsDesc)
        .then((params) => {
            create(params);
            message.success('create project - success');
            if (params.runInstall === 'yes') {
                message.title('npm install');
                const clientFolder = path.resolve(appDirectory, params.name);
                childProcess
                    .execSync(
                        'npm install',
                        {
                            stdio: 'inherit',
                            cwd: clientFolder
                        }
                    );
            }
            process.exit();
        })
        .catch((e) => {
            message.error('create project - error');
            throw new Error(e.message);
        });
}
