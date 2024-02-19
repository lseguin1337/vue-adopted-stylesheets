import { getCurrentInstance, onUnmounted } from 'vue';

/** This file will be run during the runtime */

function adoptStyleSheets(container, sheets) {
  const rootNode = container.getRootNode();
  switch (rootNode.nodeType) {
    case Node.DOCUMENT_FRAGMENT_NODE:
    case Node.DOCUMENT_NODE:
      rootNode.adoptedStyleSheets = [
        ...(rootNode.adoptedStyleSheets || []),
        ...sheets,
      ];
      return;
    default:
      console.warn('not able to install adoptedStyleSheets container is a detached node ');
  }
}

function hook(target, prop) {
  return new Promise((resolve) => {
    let value = target[prop];
    Object.defineProperty(target, prop, {
      get() {
        return value;
      },
      set(v) {
        value = v;
        resolve(v);
      }
    });
  });
}

function installSheet(app, sheet) {
  if (app._container) {
    adoptStyleSheets(app._container, [sheet]);
  } else if (app._pendingSheets) {
    app._pendingSheets.push(sheet);
  } else {
    app._pendingSheets = [sheet];
    // countainer not present yet waiting for it
    hook(app, '_container').then((container) => {
      adoptStyleSheets(container, app._pendingSheets);
      delete app._pendingSheets;
    });
  }
}

function unistallSheet(app, sheet) {
  const rootNode = app._container?.getRootNode();
  if (!rootNode) return;
  rootNode.adoptedStyleSheets = rootNode.adoptedStyleSheets.filter((s) => s !== sheet);
}

export function create(styles) {
  const sheet = new CSSStyleSheet();
  sheet.replaceSync(styles.join('\n'));
  Object.defineProperty(sheet, '__vue_apps', {
    value: new WeakMap(),
  });
  return sheet;
}

export function install(sheet) {
  const instance = getCurrentInstance();
  const app = instance.appContext.app;
  const apps = sheet.__vue_apps;
  const refCount = {
    get value() {
      return apps.get(app) || 0;
    },
    set value(value) {
      apps.set(app, value);
    },
    take() {
      if (++this.value === 1)
        installSheet(app, sheet);
      return () => this.release();
    },
    release() {
      if (--this.value === 0)
        unistallSheet(app, sheet);
    }
  };
  onUnmounted(refCount.take());
};