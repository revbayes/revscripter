/**
 * @param {string[]} a
 * @param {string[]} b
 */
export function sortedArraysEqual(a, b) {
    return a.length === b.length && a.every((value, i) => value === b[i]);
}