/*
 * Copyright 2021, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
*/

import main from '@mapstore/framework/product/main';
import appConfig from '@mapstore/framework/product/appConfig';
import pluginsDef from '@mapstore/framework/product/plugins';
import { checkForMissingPlugins } from '@mapstore/framework/utils/DebugUtils';
import { setConfigProp, setLocalConfigurationFile }  from '@mapstore/framework/utils/ConfigUtils';

setConfigProp('translationsPath', ['ms-translations', 'translations']);

// setLocalConfigurationFile('/rest/config/load/localConfig.json');
// setLocalConfigurationFile('ms-configs/localConfig.json');
// setLocalConfigurationFile(['ms-configs/localConfig.json', 'configs/patch.json']);

setLocalConfigurationFile('ms-configs/localConfig.json');
checkForMissingPlugins(pluginsDef.plugins);

main(appConfig, pluginsDef);
