import { sortedArraysEqual } from "$lib/arrays.js";

/**
 * @typedef {object} DataFile
 * @property {string} fileName
 * @property {string} dataType
 * @property {number | null} ntax
 * @property {number | null} nchar
 * @property {string[]} taxa
 */

function createAnalysisState() {
    /** @type {DataFile[]} */
    let dataFiles = $state([]);

    return {
        get dataFiles() {
            return dataFiles;
        },
        get taxa() {
            return dataFiles[0]?.taxa ?? [];
        },

        /**
         * @param {DataFile} file
         * @returns {{ ok: true } | { ok: false, error: string }}
         */
        addDataFile(file) {
            if (dataFiles.length > 0 && !sortedArraysEqual(dataFiles[0].taxa, file.taxa)) {
                return {
                    ok: false,
                    error: `Taxa in "${file.fileName}" do not match the taxa from previously uploaded files.`
                };
            }
            dataFiles.push(file);
            return { ok: true };
        }
    };
}

export const analysisState = createAnalysisState();