/**
 * This module provides utility functions to check the type and value of JavaScript variables.
 *
 * @module lib/is
 * @author Tori Rodriguez <vrodriguezfe@icloud.com>
 * @version 0.1.0
 * @license
 * Copyright (C) 2023 Tori Rodriguez <vrodriguezfe@icloud.com>.
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the
 * **GNU General Public License** as published by the Free Software Foundation, either version 3 of
 * the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful, but **WITHOUT ANY WARRANTY**;
 * without even the implied warranty of **MERCHANTABILITY** or **FITNESS FOR A PARTICULAR PURPOSE**.
 * See the GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along with this program. If
 * not, see <https://www.gnu.org/licenses/>.
 */

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

/**
 * Represents nullable primitive data types.
 *
 * @typedef {null | undefined} Nullable
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
 * Checks whether a value is `undefined`.
 *
 * @template T
 * @param {T} value
 * @returns {value is undefined}
 */
export function isUndefined(value) {
  return !isDefined(value);
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

/**
 * Checks if a value is not `null` or `undefined`.
 *
 * @template T
 * @param {T} value
 * @returns {value is NonNullable<T>}
 */
export function isNonNullable(value) {
  return isDefined(value) && value !== null;
}

/**
 * Returns the input value unchanged. This function is useful when you need to ensure that the type
 * of the input is preserved in the output,
 *
 * @example
 *
 * ```javascript
 * const number = constant(42);
 *
 * console.assert(number === 42);
 * ```
 *
 * @template T
 * @param {T} value  The value to be returned.
 * @returns {T} The input value unchanged.
 */
export function constant(value) {
  return value;
}
