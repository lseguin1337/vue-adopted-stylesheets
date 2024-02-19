# vue-adopted-stylesheets

Vite plugin to use the adopted stylesheets api with your vue app

## How to use it?

```shell
yarn add -D vue-adopted-stylesheets @vitejs/plugin-vue
```

```javascript
// vite.config.js
const { defineConfig } = require('vite');
const { vue } = require('vue-adopted-stylesheets');

module.exports = defineConfig({
  // ...
  plugins: [
    vue({
      // any vue config plugin...
    })
  ]
});
```

is equivalent to:

```javascript
// vite.config.js
const { defineConfig } = require('vite');
const { vueAdoptedStylesheetsPlugin } = require('vue-adopted-stylesheets');

module.exports = defineConfig({
  // ...
  plugins: [
    vueAdoptedStylesheetsPlugin(), // this plugin should be installed before vue
    require('@vitejs/plugin-vue')({
      // any vue config plugin...
      customElement: true, // this is mandatory to make working the plugin
    }),
  ]
});
```