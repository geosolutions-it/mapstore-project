# MapStore Standard project

The standard project provides a customizable webgis application.
The command `npx @mapstore/project create standard` or `npx @mapstore/project create` generates a MapStore standard project with the structure represented below.

- [Project structure](#project-structure)
- [Configuration](#configuration)

## Project structure

```
standard-project/
|-- assets/ (optional)
|    |-- img/
|    |    |-- favicon.ico
|    |    +-- ... others static image files
|    +-- ... assets files similar to static
|-- configs/
|    |-- localConfig.json
|    |-- new.json
|    |-- newgeostory.json
|    +-- ... others config files
|-- java/
|    |-- services
|    +-- web
|-- js/
|    |-- apps/
|    |    |-- mapstore.jsx
|    |    +-- ... others webpack entry
|    +-- ... others js files
|-- themes/ (optional)
|    |-- default/
|    |    |-- theme.less
|    |    +-- ...
|    +-- ... others themes
|-- translations/ (optional)
|    |-- data.en-US.json
|    +-- ... others translations
|-- .gitignore
|-- README.md
|-- build.sh
|-- index.ejs (optional)
|-- ... others html templates (ejs)
|-- devServer.js (optional)
|-- package.json
```

Folders and files description:

- `assets` this folder contains all the additional static resources
- `configs` this folder contains all the json configuration files
- `js` this folder contains all the custom javascript files of the project
  - `js/apps` each file in this folder becomes automatically a javascript entry. This folder must contain only javascript files
- `themes` each directory in this folder becomes automatically a theme entry. The name of the folder becomes the name of the style and a theme.less file is needed to represent the main theme entry
- `translations` custom translations for the project
- `java` backend modules
  - `java/services` custom backend services of the project
  - `java/web` module that will build the final war
- `build.sh` build script, when run, produces java/web/target/mapstore.war
- `pom.xml` backend build configuration

## Configuration and customizations

### Custom configuration in package.json

The `mapstore` property inside the package.json allows to override and/or customize some configuration of the project. These are the available parameters:

| property | type | description |
| --- | --- | --- |
| `apps` | _{array}_ | mapstore application location. List of .js or .jsx entries: directories or files |
| `html` | _{array}_ | mapstore html templates location. List of .ejs or .html entries: directories or files |
| `themes` | _{array}_ | mapstore .less themes location: directories or files |
| `cesiumBaseUrl` | _{string}_ | location of cesium assets. Related to final dist folder |
| `output` | _{string}_ | output directory location |
| `publicPath` | _{string}_ | public path used by the application |
| `themePrefix` | _{string}_ | class name used to wrap all the classes inside the mapstore themes |
| `templateParameters` | _{object}_ | overrides parameters of default html templates (index.ejs, embedded.ejs, api.ejs and unsupportedBrowser.ejs) |
| templateParameters.`titleIndex` | _{string}_ |  |
| templateParameters.`titleEmbedded` | _{string}_ |  |
| templateParameters.`titleApi` | _{string}_ |  |
| templateParameters.`favicon` | _{string}_ |  |
| templateParameters.`loadingMessageIndex` | _{string}_ |  |
| templateParameters.`loadingMessageEmbedded` | _{string}_ |  |
| templateParameters.`titleUnsupported` | _{string}_ |  |


Example of mapstore configuration in package.json:

```js
{
    // ...others package.json properties,
    "mapstore": {
        "apps": [
            "path/to/dir-of-apps", // scan directory for js or jsx
            "path/to/dir/index.js", // point to a single file
            ["path/to/dir/fileName.js", "file-name"] // point to a single file and replace the bundle name 
        ],
        "html": [
            "path/to/dir-of-ejs", // scan directory for ejs
            "path/to/dir/index.ejs", // point to a single file
            ["path/to/dir/pageName.ejs", "page-name.html"] // point to a single file and replace the html name
        ],
        "themes": [
            "path/to/dir-themes", // scan directory for folder containing theme.less (name from folder)
            "path/to/dir-themes/default", // folder containing theme.less (name from folder)
            "path/to/dir-themes/default/theme.less" // theme.less file to use (name from folder)
        ],
        "templateParameters": {
            "favicon": "path/to/favicon"
        }
    },
}
```

### Override devServer.js

The devServer.js must return a function that returns a webpack devServer object.

Example of devServer.js:

```js
function devServer(devServerDefaultConfiguration) {
    return {
        ...devServerDefaultConfiguration,
        proxy: {
            ...devServerDefaultConfiguration.proxy,
            '/geoserver': {
                target: 'http://localhost:8080'
            }
        }
    };
}
module.exports = devServer;
```

### Developing with custom MapStore

!!! note 
    this is a procedure that is still under testing

A standard project has now these dependencies: 

```json
"dependencies": {
    "mapstore": "git+https://github.com/geosolutions-it/MapStore2.git#master"
  },
```

You can point to a different branch (e.g. stable) by changing the URL (`#mapster` --> `#2022.01.xx`). 
Anyway if you want to depend on your local version of MapStore, with some customization you are developing, you should: 

- remove `node_modules` and `package-lock.json`
- create a local folder called `local_modules` in the root of the project (no need to commit) where to place `MapStore2` directory with the code of MapStore. 
- add the `local_modules` to `.gitignore`
- change the dependency of `mapstore` as following in `package.json`:
```json
  "dependencies": {
    "mapstore": "./local_modules/MapStore2"
  },
```
