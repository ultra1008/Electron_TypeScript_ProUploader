import { WINDOW } from "./constants"

/**
 * Check if the given value is not a number.
 */
export const isNaN = Number.isNaN || WINDOW.isNaN;

/**
 * Check if the given value is a number.
 * @param {*} value - The value to check.
 * @returns {boolean} Returns `true` if the given value is a number, else `false`.
 */
export function isNumber(value) {
    return typeof value === 'number' && !isNaN(value);
}

/**
 * Check if the given value is a positive number.
 * @param {*} value - The value to check.
 * @returns {boolean} Returns `true` if the given value is a positive number, else `false`.
 */
export const isPositiveNumber = value => value > 0 && value < Infinity;

/**
 * Check if the given value is undefined.
 * @param {*} value - The value to check.
 * @returns {boolean} Returns `true` if the given value is undefined, else `false`.
 */
export function isUndefined(value) {
    return typeof value === 'undefined';
}

/**
 * Check if the given value is an object.
 * @param {*} value - The value to check.
 * @returns {boolean} Returns `true` if the given value is an object, else `false`.
 */
export function isObject(value) {
    return typeof value === 'object' && value !== null;
}

const { hasOwnProperty } = Object.prototype;

/**
 * Check if the given value is a plain object.
 * @param {*} value - The value to check.
 * @returns {boolean} Returns `true` if the given value is a plain object, else `false`.
 */
export function isPlainObject(value) {
    if (!isObject(value)) {
        return false;
    }

    try {
        const { constructor } = value;
        const { prototype } = constructor;

        return constructor && prototype && hasOwnProperty.call(prototype, 'isPrototypeOf');
    } catch (error) {
        return false;
    }
}

/**
 * Check if the given value is a function.
 * @param {*} value - The value to check.
 * @returns {boolean} Returns `true` if the given value is a function, else `false`.
 */
export function isFunction(value) {
    return typeof value === 'function';
}

const { slice } = Array.prototype;

/**
 * Convert array-like or iterable object to an array.
 * @param {*} value - The value to convert.
 * @returns {Array} Returns a new array.
 */
export function toArray(value) {
    return Array.from ? Array.from(value) : slice.call(value);
}

/**
 * Iterate the given data.
 * @param {*} data - The data to iterate.
 * @param {Function} callback - The process function for each element.
 * @returns {*} The original data.
 */
export function forEach(data, callback) {
    if (data && isFunction(callback)) {
        if (Array.isArray(data) || isNumber(data.length)/* array-like */) {
            toArray(data).forEach((value, key) => {
                callback.call(data, value, key, data);
            });
        } else if (isObject(data)) {
            Object.keys(data).forEach((key) => {
                callback.call(data, data[key], key, data);
            });
        }
    }

    return data;
}

/**
 * Extend the given object.
 * @param {*} target - The target object to extend.
 * @param {*} args - The rest objects for merging to the target object.
 * @returns {Object} The extended object.
 */
export const assign = Object.assign || function assign(target, ...args) {
    if (isObject(target) && args.length > 0) {
        args.forEach((arg) => {
            if (isObject(arg)) {
                Object.keys(arg).forEach((key) => {
                    target[key] = arg[key];
                });
            }
        });
    }

    return target;
};

const REGEXP_DECIMALS = /\.\d*(?:0|9){12}\d*$/;

/**
 * Normalize decimal number.
 * Check out {@link http://0.30000000000000004.com/}
 * @param {number} value - The value to normalize.
 * @param {number} [times=100000000000] - The times for normalizing.
 * @returns {number} Returns the normalized number.
 */
export function normalizeDecimalNumber(value, times = 100000000000) {
    return REGEXP_DECIMALS.test(value) ? (Math.round(value * times) / times) : value;
}
