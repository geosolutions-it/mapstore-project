import main from '@mapstore/framework/components/app/main';
import {
    setLocalConfigurationFile,
    setConfigProp
} from '@mapstore/framework/utils/ConfigUtils';
import axios from '@mapstore/framework/libs/ajax';
import App from '@js/components/App';

setLocalConfigurationFile('static/localConfig.json');
setConfigProp('translationsPath', __MAPSTORE_PROJECT_CONFIG__.translationsPath);

// list of path that need version parameter
const pathsNeedVersion = [
    'static/',
    'print.json'
];

const version = __MAPSTORE_PROJECT_CONFIG__.version || 'dev';

axios.interceptors.request.use(
    config => {
        if (config.url && version && pathsNeedVersion.filter(url => config.url.match(url))[0]) {
            return {
                ...config,
                params: {
                    ...config.params,
                    v: version
                }
            };
        }
        return config;
    }
);

main({
    targetId: 'container',
    appComponent: App,
    pluginsDef: {
        plugins: {},
        requires: {}
    },
    appReducers: {},
    appEpics: {},
    initialActions: []
});
