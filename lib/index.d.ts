export const vueAdoptedStylesheetsPlugin: () => {
  name: string,
  resolveId(id: string): string | void,
  load(id: string): string | void,
};