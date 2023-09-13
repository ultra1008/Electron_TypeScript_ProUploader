export const { fromCharCode } = String;

/**
 * Get string from char code in data view.
 * @param {DataView} dataView - The data view for read.
 * @param {number} start - The start index.
 * @param {number} length - The read length.
 * @returns {string} The read result.
 */
export function getStringFromCharCode(dataView, start, length) {
    let str = '';

    length += start;

    for (let i = start; i < length; i += 1) {
        str += fromCharCode(dataView.getUint8(i));
    }

    return str;
}
