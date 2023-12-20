/**
 * @type {Partial<import("typedoc").TypeDocOptions>}
 */
export default {
  entryPoints: ["./index.js"],
  out: "docs",
  tsconfig: "./jsconfig.json",
  jsDocCompatibility: false,
};
