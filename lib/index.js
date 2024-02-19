const path = require('path');

// override this virtual module use by vue plugin
// https://github.com/vitejs/vite-plugin-vue/blob/a304569846cb414294a6773e5b20f8cec0e23fb5/packages/plugin-vue/src/helper.ts#L3
const helperCode = `
import { create, install } from '${path.join(__dirname, './css.runtime')}';
export default (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  if (target.styles?.length) {
    const sheet = create(target.styles);
    const setup = target.setup;
    target.setup = function (props, context) {
      install(sheet);
      return setup && setup(props, context);
    };
  }
  return target;
}`;

function vueAdoptedStylesheetsPlugin() {
  const EXPORT_HELPER_ID = '\0plugin-vue:export-helper';

  return {
    name: 'vue-adopted-stylesheets-plugin', // required, will show up in warnings and errors

    resolveId(id) {
      if (id === EXPORT_HELPER_ID)
        return id;
    },

    load(id) {
      if (id === EXPORT_HELPER_ID)
        return helperCode;
    },
  };
}

function vue(options) {
  return [
    vueAdoptedStylesheetsPlugin(),
    require('@vitejs/plugin-vue')({
      ...options,
      customElement: true,
    }),
  ];
}

module.exports = { vue, vueAdoptedStylesheetsPlugin };