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
import * as is from "./is.js";
import * as string from "./string.js";

/**
 * @typedef {Template.DEFAULT_START_TAG} DefaultStartTag
 * @typedef {Template.DEFAULT_END_TAG}   DefaultEndTag
 */

/**
 * Template string with placeholder tags for dynamic content.
 *
 * @template {string} Source
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
  static DEFAULT_START_TAG = is.constant("{");

  /**
   * Default end tag for placeholders.
   *
   * @readonly
   * @default
   */
  static DEFAULT_END_TAG = is.constant("}");

  /**
   * Creates a new `Template` instance.
   *
   * @template {string}                       Source
   * @template {string}                       [Start=DefaultStartTag]
   * @template {string}                       [End=DefaultEndTag]
   * @template {Template<Source, Start, End>} [T=Template<Source, Start, End>]
   * @param {Source}                           source
   * @param {[Start, End]}                     [tags]
   * @param {CustomPartial<T["replacements"]>} [defaults]
   */
  static create(source, tags, defaults) {
    return new Template(source, tags, defaults);
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
   * Creates a new `Template` instance from a given template and a set of replacements.
   *
   * @template {AnyTemplate}                      T
   * @template {CustomPartial<T["replacements"]>} R
   * @template {string}                           [Source=ApplyReplacements<T, R>]
   * @param {T} template
   * @param {R} replacements
   * @returns {Template<Source, T["startTag"], T["endTag"]>}
   */
  static fromTemplate(template, replacements) {
    const source = /**
     * @type {Source}
     */ (template.render(replacements));

    return new Template(source, template.startTag, template.endTag);
  }

  /**
   * @typedef {GetPlaceholders<string.Clean<Source>, Start, End>} Placeholders
   * @typedef {GetPlaceholderMap<Placeholders, Start, End>} PlaceholderMap
   * @typedef {Extract<PlaceholderMap[keyof PlaceholderMap], string>} ReplacementName
   * @typedef {GetReplacements<ReplacementName>} Replacements
   * @typedef {CustomPartial<Replacements>} PartialReplacements
   */

  /**
   * @param {Source}              source
   * @param {[Start, End]}        [tags]
   * @param {PartialReplacements} [defaults]
   */
  constructor(source, tags, defaults = {}) {
    super(source);

    /**
     * The original template value.
     */
    this.source = source;

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
     * All placeholders found in the source string.
     */
    this.placeholders = this.#getPlaceholders();

    /**
     * A map of placeholders to their corresponding property names
     * in the replacements object.
     */
    this.placeholdersMap = Object.freeze(this.#getPlaceholdersMap());

    /**
     * Initial replacements from the provided defaults and setting to `null`
     * the values not provided.
     */
    this.replacements = this.#getInitialReplacements(defaults);
  }

  /**
   * Replaces the placeholders in the template string with the corresponding values from the
   * replacements object.
   *
   * @param {PartialReplacements} [replacements]
   * @param {boolean}             [validate]
   * @returns {string}
   */
  render(replacements = {}, validate = false) {
    let result = /**
     * @type {string}
     */ (this.valueOf());

    for (const placeholder in this.placeholdersMap) {
      const prop = this.placeholdersMap[placeholder];
      // @ts-ignore: ¯\_(ツ)_/¯
      let value = replacements[prop] || this.replacements[prop];

      if (typeof value === "symbol") {
        value = value.toString().replace("Symbol(", "").replace(")", "");
      }

      if (is.isNonNullable(value)) {
        result = result.replaceAll(placeholder, value);
      }
    }

    if (validate) {
      this.validate(result);
    }

    return result;
  }

  /**
   * Creates a new `Template` instance derivated from the current one.
   *
   * @template {PartialReplacements} R
   * @template {string}              [Source=ApplyReplacements<this, R>]
   * @param {R} replacements
   * @returns {Template<Source, Start, End>}
   */
  fork(replacements) {
    return Template.fromTemplate(this, replacements);
  }

  /**
   * Validates the template string by checking for any remaining placeholders.
   *
   * @param {string} value  - The template string after replacements.
   * @throws {Error} Throws an error if some placeholders haven't been replaced yet.
   */
  validate(value) {
    const remainingPlaceholders = this.getRemainingPlaceholders(value);

    if (remainingPlaceholders.length > 0) {
      throw new Error("Some placeholders haven't been replaced yet", {
        cause: {
          template: `${this}`,
          missingReplacements: remainingPlaceholders,
        },
      });
    }
  }

  /**
   * Extracts and returns an array of remaining placeholders in a string.
   *
   * @param {string} value  - The template string after replacements.
   * @returns {string[]} An array of remaining placeholders.
   */
  getRemainingPlaceholders(value) {
    const matches = value.matchAll(this.pattern);

    return Array.from(matches, (match) => match[0]);
  }

  /**
   * Returns the primitive value of the template string.
   *
   * @returns {Source & string} The primitive value of the template string.
   */
  valueOf() {
    // eslint-disable-next-line prettier/prettier
    return (/** @type {Source & string} */(this.toString()));
  }

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
      (this.getRemainingPlaceholders(this.valueOf()));

    return placeholders;
  }

  /**
   * Generates a map of placeholders to their corresponding property names.
   *
   * @returns {PlaceholderMap}
   */
  #getPlaceholdersMap() {
    const mapping = /**
     * @type {PlaceholderMap}
     */ ({});

    /**
     * @type {Placeholders[number] & string}
     */
    let placeholder;

    // @ts-ignore: ¯\_(ツ)_/¯
    for (placeholder of this.placeholders) {
      Object.defineProperty(mapping, placeholder, {
        value: string.unwrap(placeholder, this.startTag, this.endTag),
        enumerable: true,
      });
    }

    return mapping;
  }

  /**
   * Generates initial replacements by iterating over the template's mapping and using values from
   * the provided fallback object.
   *
   * @param {PartialReplacements} defaults  - The fallback replacement values.
   * @returns {Replacements}
   */
  #getInitialReplacements(defaults) {
    const replacements = /**
     * @type {Replacements}
     */ ({});

    /**
     * @type {keyof PlaceholderMap}
     */
    let placeholder;

    for (placeholder in this.placeholdersMap) {
      const property = this.placeholdersMap[placeholder];
      // @ts-ignore: ¯\_(ツ)_/¯
      let value = defaults[property];
      value = is.isUndefined(value) ? null : value;

      // @ts-ignore: ¯\_(ツ)_/¯
      Object.defineProperty(replacements, property, {
        value,
        enumerable: true,
      });
    }

    return replacements;
  }
}

/**
 * Represents the expected replacements for a given Template.
 *
 * @template {AnyTemplate} T
 * @typedef {T["replacements"]} TemplateReplacements
 */

/**
 * Same as {@link TemplateReplacements} but all replacements are marked as optional.
 *
 * @template {AnyTemplate} T
 * @typedef {Partial<T["replacements"]>} PartialTemplateReplacements
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
 *     : string.GetFirstChar<W> extends string.GetFirstChar<S>
 *       ? false
 *       : string.GetLastChar<W> extends string.GetFirstChar<E>
 *         ? false
 *         : W extends string.Wrap<W, "", E>
 *           ? false
 *           : true
 *   : false} IsValidPlaceholderName
 */

/**
 * Extracts all valid placeholders surrounded by specified start and end tags in a given string.
 *
 * @template {string} Source
 * @template {string} Start
 * @template {string} End
 * @template {string[]} [Cache=[]]
 * @typedef {Source extends ""
 *   ? Cache
 *   : Source extends `${string}${Start} ${infer N}${infer R}`
 *     ? GetPlaceholdersHelper<R, Start, End, Cache>
 *     : Source extends `${string}${Start}${infer N}${End}${infer R}`
 *       ? IsValidPlaceholderName<
 *           string.Wrap<N, Start, End>,
 *           Start,
 *           End
 *         > extends false
 *         ? GetPlaceholdersHelper<R, Start, End, Cache>
 *         : string.Wrap<N, Start, End> extends Cache[number]
 *           ? GetPlaceholdersHelper<R, Start, End, Cache>
 *           : GetPlaceholdersHelper<
 *               Source,
 *               Start,
 *               End,
 *               [...Cache, string.Wrap<N, Start, End>]
 *             >
 *       : Cache} GetPlaceholdersHelper
 */

/**
 * @template {string} Source
 * @template {string} Start
 * @template {string} End
 * @typedef {[...GetPlaceholdersHelper<Source, Start, End>]} GetPlaceholders
 */

/**
 * Creates a mapping object for the specified placeholders to its replacement property name.
 *
 * @template {string[]} P
 * @template {string} S
 * @template {string} E
 * @typedef {{ [K in P[number]]: string.Unwrap<K, S, E> }} GetPlaceholderMapHelper
 */

/**
 * @template {string[]} P
 * @template {string} S
 * @template {string} E
 * @typedef {Expand<GetPlaceholderMapHelper<P, S, E> & {}>} GetPlaceholderMap
 */

/**
 * @template {Record<string, string>} P
 * @typedef {{ [K in keyof P as P[K]]: K }} GetPropertyToPlaceholder
 */

/**
 * @template {PropertyKey} K
 * @typedef {Expand<Record<K, is.DefinedPrimitive>>} GetReplacements
 */

/**
 * @template T
 * @typedef {{ [K in keyof T]?: T[K] }} CustomPartial
 */

/**
 * Takes a type `T` and expands it into an object type with the same properties as `T`.
 * {@link https://stackoverflow.com/a/69288824/62937 Credits to StackOverflow.}
 *
 * @template T
 * @typedef {T extends infer O ? { [K in keyof O]: O[K] } : T} Expand
 */

/**
 * @typedef {Template<string, any, any>} AnyTemplate
 */

/**
 * @template {AnyTemplate} T
 * @template {CustomPartial<T["replacements"]>} R
 * @template {any} [ToReplace=GetKeys<R>]
 * @template {string} [Result=T["source"]]
 * @typedef {ToReplace extends []
 *   ? Result
 *   : ToReplace extends [infer F, ...infer Rest]
 *     ? F extends keyof R
 *       ? R[F] extends is.Nullable
 *         ? ApplyReplacements<T, R, Rest, Result>
 *         : ApplyReplacements<
 *             T,
 *             R,
 *             Rest,
 *             string.ReplaceAll<
 *               Result,
 *               string.Wrap<F, T["startTag"], T["endTag"]>,
 *               string
 *             >
 *           >
 *       : never
 *     : R} ApplyReplacements
 */

/**
 * @template {any} T
 * @typedef {UnionToTuple<keyof T>} GetKeys
 */

/**
 * Takes a union type `T` and transforms it into an intersection type.
 *
 * @template {any} T
 * @typedef {(T extends T ? (params: T) => any : never) extends (params: infer P) => any ? P : never}
 * UnionToIntersection
 */

/**
 * Takes a union type `T` and transforms it into a tuple type.
 *
 * @template {any} T
 * @template {any[]} [Res=[]]
 * @typedef {UnionToIntersection<
 *   T extends any ? () => T : never
 * > extends () => infer ReturnType
 *   ? UnionToTuple<Exclude<T, ReturnType>, [...Res, ReturnType]>
 *   : Res} UnionToTuple
 */
