# Sensing Skies

## Data Format

The application expects data in the form of GeoJSON Features. From the [GeoJSON Specification (RFC 7946)](https://datatracker.ietf.org/doc/html/rfc7946):

> GeoJSON is a geospatial data interchange format based on JavaScript
> Object Notation (JSON). It defines several types of JSON objects and
> the manner in which they are combined to represent data about
> geographic features, their properties, and their spatial extents.
> GeoJSON uses a geographic coordinate reference system, World Geodetic
> System 1984, and units of decimal degrees.

To enrich the data displayed by the app, add additional properties the GeoJSON Features.

## Setup

1. Install the [latest LTS version of Node](https://nodejs.org/)
2. Install the [Vue CLI](https://cli.vuejs.org/): `npm install -g @vue/cli`

### Optional

1. Install [Visual Studio Code](https://code.visualstudio.com/)
2. Install the [recommended VS Code extensions (`.vscode/extensions.json`)](./.vscode/extensions.json)
3. Install extensions for Chrome:
   1. [Vue.js devtools](https://chrome.google.com/webstore/detail/vuejs-devtools/ljjemllljcmogpfapbkkighbhhppjdbg)
   2. [Redux DevTools](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd?hl=en)

## Run Locally

```shell
npm install
npm run serve
```

## Icons

Powered by [SVG Repo](https://www.svgrepo.com/)

- [Plane](https://www.svgrepo.com/svg/151715/normal-plane) licensed under [CC0 1.0][cc0]

[cc0]: https://creativecommons.org/publicdomain/zero/1.0/
