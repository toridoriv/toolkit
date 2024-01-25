/**
 * Checks if a value is a JavaScript primitive type.
 *
 * @param {unknown} value
 * @returns {value is Primitive}
 */
export function isPrimitive(value: unknown): value is Primitive;
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
export function isDefined<T>(value: T): value is Exclude<T, undefined>;
/**
 * Checks whether a value is `undefined`.
 *
 * @template T
 * @param {T} value
 * @returns {value is undefined}
 */
export function isUndefined<T>(value: T): value is undefined;
/**
 * @typedef {Defined<Primitive>} DefinedPrimitive
 */
/**
 * Checks if a value is a defined JavaScript primitive type.
 *
 * @param {unknown} value
 * @returns {value is DefinedPrimitive}
 */
export function isDefinedPrimitive(value: unknown): value is DefinedPrimitive;
/**
 * Checks if a value is not `null` or `undefined`.
 *
 * @template T
 * @param {T} value
 * @returns {value is NonNullable<T>}
 */
export function isNonNullable<T>(value: T): value is NonNullable<T>;
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
export function constant<T>(value: T): T;
export type Defined<T> = Exclude<T, undefined>;
export type DefinedPrimitive = Defined<Primitive>;
/**
 * Represents the primitive data types in JavaScript.
 */
export type Primitive = string | boolean | number | symbol | undefined | null | bigint;
/**
 * Represents nullable primitive data types.
 */
export type Nullable = null | undefined;
