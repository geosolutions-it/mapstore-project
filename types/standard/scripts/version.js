/*
 * Copyright 2020, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
*/

const message = require('../../../scripts/utils/message');
const info = require('../../../scripts/utils/info');

const { version, commit } = info();
message.title(`version: ${version}, commit: ${commit}`);
