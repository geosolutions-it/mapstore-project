# MapStore GeoNode project

This type of customization has been introduced to be applied to geonode-project and add, replace or remove plugins for the map and layer viewer. This approach is still in development and aim to normalize the way various apps inside [geonode-mapstore-client](https://github.com/GeoNode/geonode-mapstore-client) could be customized.

Given a geonode-project with this directories structure:

```
geonode-project/
|-- ...
|-- project-name/
|    |-- ...
|    +-- ...
|-- ...
```

- Navigate to `geonode-project/project-name/`

`cd geonode-project/project-name/`

- Run the create script of `@mapstore/project`

`npx @mapstore/project create geonode`

The script above will create a folder called `client` inside `geonode-project/project-name/` with the following structure:

```
geonode-project/
|-- ...
|-- project-name/
|    |-- ...
|    |-- client/
|    |    |-- js/
|    |    |     |-- ...
|    |    |     |-- apps/
|    |    |     +-- jsapi/
|    |    |          |-- plugins.js
|    |    |          +-- previewPlugins.js
|    |    |-- static/
|    |    |     +-- mapstore/
|    |    |     |    |-- ...
|    |    |          +-- translations/
|    |    |-- themes/
|    |    |     |-- default/
|    |    |     |    |-- ...
|    |    |     |    +-- theme.less
|    |    |     +-- preview/
|    |    |          +-- theme.less
|    |    |-- .gitignore
|    |    |-- package.json
|    |    +-- version.txt
|    +-- ...
|-- ...
```

This new `client/` directory has a similar structure of `geonode-mapstore-client/geonode_mapstore_client/client/` with some special file and folders:

- `client/js/apps/` each .js file in this directory will became an application entry
- `client/js/jsapi/plugins.js` and `client/js/jsapi/previewPlugins.js` this two file have a function that get current plugins imported in mapstore client and should return a plugin list

```js
// example to add a new plugin
import MyCustomPlugin from '../plugins/MyCustomPlugin.jsx';
export const extendPluginsDefinition = ({ plugins,  requires }) =>
    ({
        plugins: {
            ...plugins,
            MyCustomPlugin
        },
        requires
});
```

- `client/static/mapstore/translations` extend translations of the client
- `client/themes/default/theme.less` extend the default theme
- `client/themes/preview/theme.less` extend the preview theme

Inside this client folder it's possible to use the same scripts used in the geonode-mapstore-client `npm start`, `npm run test`, `npm run compile`, ... .

You can run the `npm run compile` to create the new client application in the `static/mapstore` of the geonode-project once the new customizations are applied.

Important!: the branch/commit of the geonode-mapstore-client inside the package.json must be the same of the pip package inside the requirement.txt

expected version in requirement.txt
```
-e git+https://github.com/GeoNode/geonode-mapstore-client.git@{commit}#egg=django_geonode_mapstore_client
```
expected version in client/package.json
```js
"dependencies": {
    ...,
    "geonode-mapstore-client": "git+https://github.com/GeoNode/geonode-mapstore-client.git#{commit}",
    ...
}
```
