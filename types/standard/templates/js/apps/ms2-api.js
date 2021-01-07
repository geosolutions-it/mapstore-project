/*
 * Copyright 2021, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import MapStore2API from '@mapstore/framework/jsapi/MapStore2';
import appConfigEmbedded from '@mapstore/framework/product/appConfigEmbedded';
import apiPlugins from '@mapstore/framework/product/apiPlugins';

const getScriptPath = () => {
    const scriptEl = document.getElementById('ms2-api');
    return scriptEl && scriptEl.src && scriptEl.src.substring(0, scriptEl.src.lastIndexOf('/')) || '';
};

const MapStore2 = MapStore2API.withPlugins(apiPlugins, {
    theme: {
        path: __MAPSTORE_PROJECT_CONFIG__.themePath || getScriptPath() + '/themes'
    },
    noLocalConfig: true,
    initialState: appConfigEmbedded.initialState,
    translations: getScriptPath() + '/../translations'
});

window.MapStore2 = MapStore2;
