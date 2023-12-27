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
 * Template string with placeholder tags for dynamic content.
 *
 * @template {string} T
 * @template {string} [Start=DefaultStartTag]
 * @template {string} [End=DefaultEndTag]
 * @namespace
 * @augments {String}
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
   * @template {string} T
   * @template {string} [Start=DefaultStartTag]
   * @template {string} [End=DefaultEndTag]
   * @param {T}            template
   * @param {[Start, End]} [tags]
   * @returns {Template<T, Start, End>}
   */
  static init(template, tags) {
    return new Template(template, tags);
  }

  /**
   * Gets the regular expression pattern for finding placeholders in a template.
   *
   * @param {string} start  - The start tag for placeholders.
   * @param {string} end    - The start tag for placeholders.
   * @returns {RegExp} The regular expression pattern.
   */
  static getPlaceholderPattern(start, end) {
    return new RegExp(
      `(?<![${start}|${start[0]}])${start}[A-Za-z0-9\-\_]+?${end}(?![${end}|${end[0]}] )`,
      "g",
    );
  }

  /**
   * @param {T}            template
   * @param {[Start, End]} [tags]
   * @namespace
   */
  constructor(template, tags) {
    super(template);

    /**
     * The start tag for placeholders.
     */
    this.startTag = /**
     * @type {Start}
     */ (tags?.[0] || Template.DEFAULT_START_TAG);

    /**
     * The end tag for placeholders.
     */
    this.endTag = /**
     * @type {End}
     */ (tags?.[1] || Template.DEFAULT_END_TAG);

    /**
     * The regular expression pattern for finding placeholders in the template.
     */
    this.pattern = Template.getPlaceholderPattern(this.startTag, this.endTag);

    /**
     * Array of placeholders found in the template.
     */
    this.placeholders = this.#getPlaceholders();
    this.mapping = this.#getPlaceholderMapping();
  }

  /**
   * Returns the primitive value of the template string.
   *
   * @returns {T & string} The primitive value of the template string.
   */
  valueOf() {
    // eslint-disable-next-line prettier/prettier
    return (/** @type {T & string} */(this.toString()));
  }

  /**
   * @typedef {GetPlaceholders<T, Start, End>} Placeholders
   */

  /**
   * Extracts and returns an array of placeholders in the template string.
   *
   * @returns {Placeholders}
   */
  #getPlaceholders() {
    const placeholders =
      /**
       * @type {any}
       */
      (this.#getRemainingPlaceholders(this.valueOf()));

    return placeholders;
  }

  /**
   * @typedef {Expand<GetMapping<Placeholders, Start, End>>} Mapping
   */

  /**
   * Generates a mapping of placeholders to their corresponding property names.
   *
   * @returns {Mapping} The mapping of placeholders to property names.
   */
  #getPlaceholderMapping() {
    const mapping = /**
     * @type {any}
     */ ({});

    // @ts-ignore: ¯\_(ツ)_/¯
    for (let i = 0; i < this.placeholders.length; i++) {
      const placeholder = /**
       * @type {string}
       */ (this.placeholders[i]);
      const replacementsName = placeholder
        .replace(this.startTag, "")
        .replace(this.endTag, "");

      mapping[placeholder] = replacementsName;
    }

    return mapping;
  }

  /**
   * Extracts and returns an array of remaining placeholders in the template string.
   *
   * @param {string} value  - The template string after replacements.
   * @returns {string[]} An array of remaining placeholders.
   */
  #getRemainingPlaceholders(value) {
    const matches = value.matchAll(this.pattern);

    return Array.from(matches, (match) => match[0]);
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

/**
 * Cleans a template by removing consecutive spaces or newline characters.
 *
 * @template {string} T
 * @typedef {T extends `${infer S1}  ${infer S2}`
 *   ? CleanTemplate<`${S1} ${S2}`>
 *   : T extends `${infer S1}\n${infer S2}`
 *     ? CleanTemplate<`${S1} ${S2}`>
 *     : T} CleanTemplate
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
 * Extracts the first character of a string type `T`.
 *
 * @template {string} T
 * @typedef {T extends `${infer F}${string}` ? F : string} GetFirstChar
 */

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
 * Surrounds a string `S` with specified start and end strings.
 *
 * @template {string} S
 * @template {string} Start
 * @template {string} End
 * @typedef {`${Start}${S}${End}`} Wrap
 */

/**
 * Checks if a string `T` is a valid placeholder name within the specified start and end tags.
 *
 * @template {string} T
 * @template {string} S
 * @template {string} E
 * @typedef {T extends `${S}${infer W}${E}`
 *   ? W extends `${string} ${string}`
 *     ? false
 *     : GetFirstChar<W> extends GetFirstChar<S>
 *       ? false
 *       : GetLastChar<W> extends GetFirstChar<E>
 *         ? false
 *         : W extends Wrap<W, "", E>
 *           ? false
 *           : true
 *   : false} IsValidPlaceholderName
 */

/**
 * Extracts all valid placeholders surrounded by specified start and end tags in a given string.
 *
 * @template {string} T
 * @template {string} S
 * @template {string} E
 * @template [Cleaned=CleanTemplate<T>]
 * @template {string[]} [Cache=[]]
 * @typedef {Cleaned extends ""
 *   ? Cache
 *   : Cleaned extends `${string}${S} ${infer N}${infer R}`
 *     ? GetPlaceholders<R, S, E, R, Cache>
 *     : Cleaned extends `${string}${S}${infer N}${E}${infer R}`
 *       ? IsValidPlaceholderName<Wrap<N, S, E>, S, E> extends false
 *         ? GetPlaceholders<T, S, E, R, Cache>
 *         : Wrap<N, S, E> extends Cache[number]
 *           ? GetPlaceholders<T, S, E, R, Cache>
 *           : GetPlaceholders<T, S, E, R, [...Cache, Wrap<N, S, E>]>
 *       : Cache} GetPlaceholders
 */

/**
 * Unwraps a string by removing specified start and end strings.
 *
 * @template {string} S
 * @template {string} Start
 * @template {string} End
 * @typedef {S extends `${Start}${infer W}${End}` ? `${W}` : S} Unwrap
 */

/**
 * Creates a mapping object for the specified placeholders to its replacement property name.
 *
 * @template {string[]} P
 * @template {string}   S
 * @template {string}   E
 * @typedef {{ [K in P[number]]: Unwrap<K, S, E> }} GetMapping
 */
