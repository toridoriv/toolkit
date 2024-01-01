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
