/**
 * This module provides utilities for handling strings with strong typings.
 *
 * @module lib/string
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
 * Splits a string `S` into substrings separated by `SEP`.
 *
 * This is a type-level implementation of `String.split()`.
 *
 * @template {string} S
 * @template {string} SEP
 * @typedef {string extends S
 *   ? string[]
 *   : S extends `${infer A}${SEP}${infer B}`
 *     ? [A, ...(B extends "" ? [] : Split<B, SEP>)]
 *     : SEP extends ""
 *       ? []
 *       : [S]} Split
 */

/**
 * Splits a string by a separator and returns an array of substrings with type annotations.
 *
 * @template {string} Str
 * @template {string} Separator
 * @param {Str}       value
 * @param {Separator} separator
 * @returns {Split<Str, Separator>}
 */
export function split(value, separator) {
  // eslint-disable-next-line prettier/prettier
  return /** @type {Split<Str, Separator>}  */ (value.split(separator));
}

/**
 * Extracts the first character of a string type `T`.
 *
 * @template {string} T
 * @typedef {T extends `${infer F}${string}` ? F : string} GetFirstChar
 */

/**
 * Gets the first character of a string.
 *
 * @template {string} Str
 * @param {Str} value
 * @returns {GetFirstChar<Str>}
 */
export function getFirstChar(value) {
  // eslint-disable-next-line prettier/prettier
  return /** @type {GetFirstChar<Str>}  */ (value[0]);
}

/**
 * Extracts the last character of a string type `T`.
 *
 * @template {string} T
 * @typedef {T extends `${infer F}${infer R}`
 *   ? R extends ""
 *     ? F
 *     : GetLastChar<R>
 *   : string} GetLastChar
 */

/**
 * Gets the last character of a string.
 *
 * @template {string} Str
 * @param {Str} value
 * @returns {GetLastChar<Str>}
 */
export function getLastChar(value) {
  // eslint-disable-next-line prettier/prettier
  return /** @type {GetLastChar<Str>}  */ (value[value.length - 1]);
}

/**
 * Surrounds a string `S` with specified start and end strings.
 *
 * @template {any} S
 * @template {string} Start
 * @template {string} End
 * @typedef {S extends string ? `${Start}${S}${End}` : never} Wrap
 */

/**
 * Surrounds a string with specified start and end strings.
 *
 * @template {string} Str
 * @template {string} Start
 * @template {string} End
 * @param {Str}   value
 * @param {Start} start
 * @param {End}   end
 * @returns {Wrap<Str, Start, End>}
 */
export function wrap(value, start, end) {
  // eslint-disable-next-line prettier/prettier
  return /** @type {Wrap<Str, Start, End>} */ (`${start}${value}${end}`);
}

/**
 * Unwraps a string by removing specified start and end strings.
 *
 * @template {string} S
 * @template {string} Start
 * @template {string} End
 * @typedef {S extends `${Start}${infer W}${End}` ? `${W}` : S} Unwrap
 */

/**
 * Unwraps a string by removing specified start and end strings.
 *
 * @template {string} Str
 * @template {string} Start
 * @template {string} End
 * @param {Str}   value
 * @param {Start} start
 * @param {End}   end
 * @returns {Unwrap<Str, Start, End>}
 */
export function unwrap(value, start, end) {
  const i1 = value.indexOf(start) + start.length;
  const i2 = value.indexOf(end);

  // eslint-disable-next-line prettier/prettier
  return /** @type {Unwrap<Str, Start, End>}  */ (value.substring(i1, i2));
}

/**
 * Cleans a type string by removing consecutive spaces or newline characters.
 *
 * @template {string} T
 * @typedef {T extends `${infer S1}  ${infer S2}`
 *   ? Clean<`${S1} ${S2}`>
 *   : T extends `${infer S1}\n${infer S2}`
 *     ? Clean<`${S1} ${S2}`>
 *     : T} Clean
 */

/**
 * Cleans a string by removing consecutive spaces or newline characters.
 *
 * @template {string} Str
 * @param {Str} value
 * @returns {Clean<Str>}
 */
export function clean(value) {
  /**
   * @type {any}
   */
  let cleaned = value.replaceAll("\n", " ").replaceAll("  ", " ");

  if (cleaned.includes("  ")) {
    cleaned = clean(cleaned);
  }

  return cleaned;
}

/**
 * Takes a string `S` and replaces all occurrences of substring `From` with the substring `To`.
 *
 * @template {string} S
 * @template {string} From
 * @template {string} To
 * @typedef {From extends ""
 *   ? S
 *   : S extends `${infer R1}${From}${infer R2}`
 *     ? `${R1}${To}${ReplaceAll<R2, From, To>}`
 *     : S} ReplaceAll
 */
