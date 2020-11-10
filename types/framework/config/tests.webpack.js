/*
 * Copyright 2020, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
*/

var context = require.context('../../../../../../js', true, /-test\.jsx?$/);
context.keys().forEach(context);
module.exports = context;
