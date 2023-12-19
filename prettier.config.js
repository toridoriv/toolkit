/**
 * @type {PrettierConfig & Partial<PJPOptions>}
 */
export default {
  trailingComma: "all",
  tabWidth: 2,
  semi: true,
  singleQuote: false,
  printWidth: 80,
  proseWrap: "always",
  quoteProps: "consistent",
  useTabs: false,
  endOfLine: "lf",
  bracketSameLine: true,
  plugins: ["@homer0/prettier-plugin-jsdoc"],
  jsdocEnsureDescriptionsAreSentences: true,
  jsdocPrintWidth: 100,
  jsdocTagsOrder: ["example", "template", "param", "returns", "typedef"],
  jsdocFormatExamples: false,
};

/**
 * @typedef {import("prettier").Config} PrettierConfig
 */

/**
 * @typedef {import("@homer0/prettier-plugin-jsdoc/src/types.js").PJPOptions} PJPOptions
 */
