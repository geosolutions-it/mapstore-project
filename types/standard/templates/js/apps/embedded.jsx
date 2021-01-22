/*
 * Copyright 2021, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
*/

import { loadVersion } from '@mapstore/framework/actions/version';
import appConfigEmbedded from '@mapstore/framework/product/appConfigEmbedded';
import apiPlugins from '@mapstore/framework/product/apiPlugins';
import main from '@mapstore/framework/product/main';
import { checkForMissingPlugins } from '@mapstore/framework/utils/DebugUtils';
import { setConfigProp, setLocalConfigurationFile }  from '@mapstore/framework/utils/ConfigUtils';

setConfigProp('translationsPath', ['ms-translations', 'translations']);
setLocalConfigurationFile('ms-configs/localConfig.json');

checkForMissingPlugins(apiPlugins.plugins);

main(
    appConfigEmbedded,
    apiPlugins,
    (cfg) => ({
        ...cfg,
        initialActions: [loadVersion]
    })
);
