#!/usr/bin/env node

const childProcess = require('child_process');
const path = require('path');
const message = require('../scripts/utils/message');

const command = process.argv[2] &&  process.argv[2].replace(':', '') || 'create';
const type = process.argv[3] || 'framework';

const commands = [
    'create',
    'compile',
    'start',
    'test',
    'testwatch',
    'update'
];

if (commands.indexOf(command) !== -1) {
    childProcess
        .execSync(
            `node ${path.resolve(__dirname, '..', 'scripts', command + '.js')} --type=${type}`,
            { stdio: 'inherit' }
        );
} else {
    message.error('\'' + command + '\' is not a valid command');
}
