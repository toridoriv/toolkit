/**
 * Represents the primitive data types in JavaScript.
 *
 * @typedef {| string
 *   | boolean
 *   | number
 *   | symbol
 *   | undefined
 *   | null
 *   | bigint} Primitive
 */

const PRIMITIVE_TYPES = [
  "boolean",
  "number",
  "symbol",
  "undefined",
  "null",
  "bigint",
];

/**
 * Checks if a value is a JavaScript primitive type.
 *
 * @param {unknown} value
 * @returns {value is Primitive}
 */
export function isPrimitive(value) {
  const type = typeof value;

  return PRIMITIVE_TYPES.includes(type);
}

/**
 * @template T
 * @typedef {Exclude<T, undefined>} Defined
 */

/**
 * Checks whether a value is defined.
 *
 * @template T
 * @param {T} value
 * @returns {value is Defined<T>}
 */
export function isDefined(value) {
  return value !== undefined;
}

/**
 * @typedef {Defined<Primitive>} DefinedPrimitive
 */

/**
 * Checks if a value is a defined JavaScript primitive type.
 *
 * @param {unknown} value
 * @returns {value is DefinedPrimitive}
 */
export function isDefinedPrimitive(value) {
  return isDefined(value) && isPrimitive(value);
}
