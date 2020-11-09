const rimraf = require('rimraf');
const fs = require('fs');
const path = require('path');
const message = require('../../../scripts/utils/message');

const appDirectory = fs.realpathSync(process.cwd());
const staticPath = '../static/mapstore';
const distDirectory = 'dist';
rimraf.sync(path.resolve(appDirectory, staticPath));
fs.mkdirSync(path.resolve(appDirectory, staticPath + '/' + distDirectory), { recursive: true });
message.title('clean static directory');
