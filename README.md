# vue-adopted-stylesheets

Vite plugin to use the adopted stylesheets api with your vue app

## Install

```shell
yarn add -D vue-adopted-stylesheets @vitejs/plugin-vue
```

## Plugin Usage

```javascript
// vite.config.js
const { defineConfig } = require('vite');
const vue = require('@vitejs/plugin-vue');
const { vueAdoptedStylesheetsPlugin } = require('vue-adopted-stylesheets');

module.exports = defineConfig({
  // ...
  plugins: [
    vue({
      // any vue config plugin...
      customElement: true, // this is mandatory to make working the plugin
    }),
    vueAdoptedStylesheetsPlugin(),
  ]
});
```

## Unlocked use cases

```javascript
// main.js
import { createApp } from 'vue';
import App from './App.vue';

const app = createApp(App);

// Now you can mount your vue app inside a shadow root all the styling would be properly injected
app.mount(document.querySelector('#custom-element-with-shadow-root').shadowRoot);
```

Or

```javascript
import { createApp } from 'vue';
import App from './App.vue';

class MyApp extends HTMLElement {
  constructor() {
    super();
    const app = createApp(App);
    app.mount(this.attachShadow({ mode: 'open' }));
  }
}

customElements.define('my-app', MyApp);
```

## Note

This plugin is working even if the vue library is externalized