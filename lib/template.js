/**
 * This module provides utilities for a custom logic-less template system.
 * Think of Mustache, but strongly typed and with far less capabilities.
 *
 * @module lib/template
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
 * @template {string} T
 * @template {string} [Start=DefaultStartTag]
 * @template {string} [End=DefaultEndTag]
 */
export class Template extends String {
  /**
   * Default start tag for placeholders.
   *
   * @readonly
   * @default
   */
  static DEFAULT_START_TAG = constant("{");

  /**
   * Default end tag for placeholders.
   *
   * @readonly
   * @default
   */
  static DEFAULT_END_TAG = constant("}");

  /**
   * @param {T}            template
   * @param {[Start, End]} tags
   */
  constructor(template, tags) {
    super(template);
  }
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

/**
 * Determines if the provided value is defined, meaning it is neither `undefined` nor `null`.
 *
 * @example
 *
 * ```javascript
 * const maybeString = "Hello, World!";
 * const maybeNull = null;
 *
 * console.assert(isDefined(maybeString)); // true
 * console.assert(isDefined(maybeNull) === false); // false
 * ```
 *
 * @template T
 * @param {T} value  The value to check for being defined.
 * @returns {value is NonNullable<T>} `true` if the value is neither `undefined` nor `null`,
 *                                    `false` otherwise.
 */
export function isDefined(value) {
  return typeof value !== "undefined" && value !== null;
}

/**
 * @typedef {typeof Template.DEFAULT_START_TAG} DefaultStartTag
 */

/**
 * @typedef {typeof Template.DEFAULT_END_TAG} DefaultEndTag
 */

/**
 * Takes a type `T` and expands it into an object type with the same properties as `T`.
 * {@link https://stackoverflow.com/a/69288824/62937 Credits to StackOverflow.}
 *
 * @template T
 * @typedef {T extends infer O ? { [K in keyof O]: O[K] } : T} Expand
 */
