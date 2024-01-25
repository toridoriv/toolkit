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
export class Template<Source extends string, Start extends string = "{", End extends string = "}"> extends String {
    /**
     * Default start tag for placeholders.
     *
     * @readonly
     * @default
     */
    static readonly DEFAULT_START_TAG: "{";
    /**
     * Default end tag for placeholders.
     *
     * @readonly
     * @default
     */
    static readonly DEFAULT_END_TAG: "}";
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
    static create<Source_2 extends string, Start_1 extends string = "{", End_1 extends string = "}", T extends Template<Source_2, Start_1, End_1> = Template<Source_2, Start_1, End_1>>(source: Source_2, tags?: [Start_1, End_1], defaults?: CustomPartial<T["replacements"]>): Template<Source_2, Start_1, End_1>;
    /**
     * Gets the regular expression pattern for finding placeholders in a template.
     *
     * @param {string} start  - The start tag for placeholders.
     * @param {string} end    - The start tag for placeholders.
     * @returns {RegExp} The regular expression pattern.
     */
    static getPlaceholderPattern(start: string, end: string): RegExp;
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
    static fromTemplate<T_1 extends AnyTemplate, R_1 extends CustomPartial<T_1["replacements"]>, Source_3 extends string = ApplyReplacements<T_1, R_1, UnionToTuple<keyof R_1, []>, T_1["source"]>>(template: T_1, replacements: R_1): Template<Source_3, T_1["startTag"], T_1["endTag"]>;
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
    constructor(source: Source, tags?: [Start, End], defaults?: CustomPartial<Expand<Record<Extract<Expand<GetPlaceholderMapHelper<[...GetPlaceholdersHelper<string.Clean<Source>, Start, End, []>], Start, End>>[keyof Expand<GetPlaceholderMapHelper<[...GetPlaceholdersHelper<string.Clean<Source>, Start, End, []>], Start, End>>], string>, is.DefinedPrimitive>>>);
    /**
     * The original template value.
     */
    source: Source;
    /**
     * The start tag for placeholders.
     */
    startTag: Start;
    /**
     * The end tag for placeholders.
     */
    endTag: End;
    /**
     * The regular expression pattern for finding placeholders in the template.
     */
    pattern: RegExp;
    /**
     * All placeholders found in the source string.
     */
    placeholders: [...GetPlaceholdersHelper<string.Clean<Source>, Start, End, []>];
    /**
     * A map of placeholders to their corresponding property names
     * in the replacements object.
     */
    placeholdersMap: Readonly<Expand<GetPlaceholderMapHelper<[...GetPlaceholdersHelper<string.Clean<Source>, Start, End, []>], Start, End>>>;
    /**
     * Initial replacements from the provided defaults and setting to `null`
     * the values not provided.
     */
    replacements: Expand<Record<Extract<Expand<GetPlaceholderMapHelper<[...GetPlaceholdersHelper<string.Clean<Source>, Start, End, []>], Start, End>>[keyof Expand<GetPlaceholderMapHelper<[...GetPlaceholdersHelper<string.Clean<Source>, Start, End, []>], Start, End>>], string>, is.DefinedPrimitive>>;
    /**
     * Replaces the placeholders in the template string with the corresponding values from the
     * replacements object.
     *
     * @param {PartialReplacements} [replacements]
     * @param {boolean}             [validate]
     * @returns {string}
     */
    render(replacements?: CustomPartial<Expand<Record<Extract<Expand<GetPlaceholderMapHelper<[...GetPlaceholdersHelper<string.Clean<Source>, Start, End, []>], Start, End>>[keyof Expand<GetPlaceholderMapHelper<[...GetPlaceholdersHelper<string.Clean<Source>, Start, End, []>], Start, End>>], string>, is.DefinedPrimitive>>>, validate?: boolean): string;
    /**
     * Creates a new `Template` instance derivated from the current one.
     *
     * @template {PartialReplacements} R
     * @template {string}              [Source=ApplyReplacements<this, R>]
     * @param {R} replacements
     * @returns {Template<Source, Start, End>}
     */
    fork<R extends CustomPartial<Expand<Record<Extract<Expand<GetPlaceholderMapHelper<[...GetPlaceholdersHelper<string.Clean<Source>, Start, End, []>], Start, End>>[keyof Expand<GetPlaceholderMapHelper<[...GetPlaceholdersHelper<string.Clean<Source>, Start, End, []>], Start, End>>], string>, is.DefinedPrimitive>>>, Source_1 extends string = ApplyReplacements<this, R, UnionToTuple<keyof R, []>, this["source"]>>(replacements: R): Template<Source_1, Start, End>;
    /**
     * Validates the template string by checking for any remaining placeholders.
     *
     * @param {string} value  - The template string after replacements.
     * @throws {Error} Throws an error if some placeholders haven't been replaced yet.
     */
    validate(value: string): void;
    /**
     * Extracts and returns an array of remaining placeholders in a string.
     *
     * @param {string} value  - The template string after replacements.
     * @returns {string[]} An array of remaining placeholders.
     */
    getRemainingPlaceholders(value: string): string[];
    /**
     * Returns the primitive value of the template string.
     *
     * @returns {Source & string} The primitive value of the template string.
     */
    valueOf(): Source & string;
    #private;
}
export type DefaultStartTag = "{";
export type DefaultEndTag = "}";
/**
 * Represents the expected replacements for a given Template.
 */
export type TemplateReplacements<T extends AnyTemplate> = T["replacements"];
/**
 * Same as {@link TemplateReplacements } but all replacements are marked as optional.
 */
export type PartialTemplateReplacements<T extends AnyTemplate> = Partial<T["replacements"]>;
/**
 * Checks if a string `T` is a valid placeholder name within the specified start and end tags.
 */
export type IsValidPlaceholderName<T extends string, S extends string, E extends string> = T extends `${S}${infer W}${E}` ? W extends `${string} ${string}` ? false : string.GetFirstChar<W> extends string.GetFirstChar<S> ? false : string.GetLastChar<W> extends string.GetFirstChar<E> ? false : W extends string.Wrap<W, "", E> ? false : true : false;
/**
 * Extracts all valid placeholders surrounded by specified start and end tags in a given string.
 */
export type GetPlaceholdersHelper<Source extends string, Start extends string, End extends string, Cache_1 extends string[] = []> = Source extends "" ? Cache : Source extends `${string}${Start} ${infer N}${infer R}` ? GetPlaceholdersHelper<R, Start, End, Cache> : Source extends `${string}${Start}${infer N_1}${End}${infer R_1}` ? IsValidPlaceholderName<string.Wrap<N_1, Start, End>, Start, End> extends false ? GetPlaceholdersHelper<R_1, Start, End, Cache> : string.Wrap<N_1, Start, End> extends Cache[number] ? GetPlaceholdersHelper<R_1, Start, End, Cache> : GetPlaceholdersHelper<Source, Start, End, [...Cache, string.Wrap<N_1, Start, End>]> : Cache;
export type GetPlaceholders<Source extends string, Start extends string, End extends string> = [...GetPlaceholdersHelper<Source, Start, End>];
/**
 * Creates a mapping object for the specified placeholders to its replacement property name.
 */
export type GetPlaceholderMapHelper<P extends string[], S extends string, E extends string> = { [K in P[number]]: string.Unwrap<K, S, E>; };
export type GetPlaceholderMap<P extends string[], S extends string, E extends string> = Expand<GetPlaceholderMapHelper<P, S, E> & {}>;
export type GetPropertyToPlaceholder<P extends Record<string, string>> = { [K in keyof P as P[K]]: K; };
export type GetReplacements<K extends PropertyKey> = Expand<Record<K, is.DefinedPrimitive>>;
export type CustomPartial<T> = { [K in keyof T]?: T[K]; };
/**
 * Takes a type `T` and expands it into an object type with the same properties as `T`.
 * {@link https://stackoverflow.com/a/69288824/62937 Credits to StackOverflow.}
 */
export type Expand<T> = T extends infer O ? { [K in keyof O]: O[K]; } : T;
export type AnyTemplate = Template<string, any, any>;
export type ApplyReplacements<T extends AnyTemplate, R extends CustomPartial<T["replacements"]>, ToReplace extends unknown = UnionToTuple<keyof R, []>, Result extends string = T["source"]> = ToReplace extends [] ? Result : ToReplace extends [infer F, ...infer Rest] ? F extends keyof R ? R[F] extends null ? ApplyReplacements<T, R, Rest, Result> : ApplyReplacements<T, R, Rest, string.ReplaceAll<Result, string.Wrap<F, T["startTag"], T["endTag"]>, string>> : never : R;
export type GetKeys<T extends unknown> = UnionToTuple<keyof T>;
/**
 * Takes a union type `T` and transforms it into an intersection type.
 */
export type UnionToIntersection<T extends unknown> = (T extends T ? (params: T) => any : never) extends (params: infer P) => any ? P : never;
/**
 * Takes a union type `T` and transforms it into a tuple type.
 */
export type UnionToTuple<T extends unknown, Res extends any[] = []> = UnionToIntersection<T extends any ? () => T : never> extends () => infer ReturnType_1 ? UnionToTuple<Exclude<T, ReturnType_1>, [...Res, ReturnType_1]> : Res;
import * as string from "./string.js";
import * as is from "./is.js";
