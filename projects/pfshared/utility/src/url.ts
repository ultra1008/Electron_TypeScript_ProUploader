import { WINDOW } from "./constants";

const { location } = WINDOW;
const REGEXP_ORIGINS = /^(\w+:)\/\/([^:/?#]*):?(\d*)/i;

/**
 * Check if the given URL is a cross origin URL.
 * @param {string} url - The target URL.
 * @returns {boolean} Returns `true` if the given URL is a cross origin URL, else `false`.
 */
export function isCrossOriginURL(url) {
    const parts = url.match(REGEXP_ORIGINS);

    return parts !== null && (
        parts[1] !== location.protocol
        || parts[2] !== location.hostname
        || parts[3] !== location.port
    );
}

/**
 * Add timestamp to the given URL.
 * @param {string} url - The target URL.
 * @returns {string} The result URL.
 */
export function addTimestamp(url) {
    const timestamp = `timestamp=${(new Date()).getTime()}`;

    return url + (url.indexOf('?') === -1 ? '?' : '&') + timestamp;
}
