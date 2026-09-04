import { buildUnknownTaxonError } from '$lib/warnings.js';

/**
 * @typedef {object} DataFile
 * @property {string} fileName
 * @property {string} dataType
 * @property {number | null} ntax
 * @property {number | null} nchar
 * @property {string[]} taxa
 * @property {string[]} missingTaxa
 * @property {string[]} missingFrom
 */

function createAnalysisState() {
    /** @type {DataFile[]} */
    let dataFiles = $state([]);

    /**
     * @param {string[]} taxa
     * @param {string} fileName
     * @param {{ fileName: string, taxa: string[] } | null} taxonReference
     */
    function findUnknownTaxonError(taxa, fileName, taxonReference) {
        if (!taxonReference) return null;
        const unknown = taxa.filter((t) => !taxonReference.taxa.includes(t));
        if (unknown.length === 0) return null;
        return buildUnknownTaxonError(unknown, fileName, taxonReference.fileName);
    }

    /**
     * @param {{ fileName: string, dataType: string, ntax: number | null, nchar: number | null, taxa: string[] }} file
     * @param {{ fileName: string, taxa: string[] } | null} taxonReference
     * @returns {{ ok: true } | { ok: false, reason: 'error', error: string }}
     */
    function addValidatedFile(file, taxonReference) {
        const unknownError = findUnknownTaxonError(file.taxa, file.fileName, taxonReference);
        if (unknownError) {
            return { ok: false, reason: 'error', error: unknownError };
        }

        /** @type {DataFile} */
        const newFile = { ...file, missingTaxa: [], missingFrom: [] };

        if (taxonReference) {
            const missing = taxonReference.taxa.filter((t) => !newFile.taxa.includes(t));
            if (missing.length > 0) {
                newFile.missingTaxa = missing.sort();
                newFile.missingFrom = [taxonReference.fileName];
            }
        } else if (dataFiles.length > 0) {
            const existingUnion = new Set(dataFiles.flatMap((f) => f.taxa));

            const newFileMissing = [...existingUnion].filter((t) => !newFile.taxa.includes(t));
            if (newFileMissing.length > 0) {
                const sources = dataFiles
                    .filter((f) => f.taxa.some((t) => newFileMissing.includes(t)))
                    .map((f) => f.fileName);
                newFile.missingTaxa = newFileMissing.sort();
                newFile.missingFrom = sources;
            }

            const newlyIntroduced = newFile.taxa.filter((t) => !existingUnion.has(t));
            if (newlyIntroduced.length > 0) {
                for (const existing of dataFiles) {
                    const stillMissing = newlyIntroduced.filter((t) => !existing.taxa.includes(t));
                    if (stillMissing.length > 0) {
                        existing.missingTaxa = [...new Set([...existing.missingTaxa, ...stillMissing])].sort();
                        existing.missingFrom = [...new Set([...existing.missingFrom, newFile.fileName])].sort();
                    }
                }
            }
        }

        dataFiles.push(newFile);
        return { ok: true };
    }

    return {
        get dataFiles() {
            return dataFiles;
        },
        get taxa() {
            /** @type {Set<string>} */
            const union = new Set();
            for (const file of dataFiles) {
                for (const taxon of file.taxa) union.add(taxon);
            }
            return [...union].sort();
        },

        /**
         * @param {{ fileName: string, dataType: string, ntax: number | null, nchar: number | null, taxa: string[] }} file
         * @param {{ fileName: string, taxa: string[] } | null} taxonReference
         * @returns {{ ok: true } | { ok: false, reason: 'conflict', conflictFileName: string } | { ok: false, reason: 'error', error: string }}
         */
        addDataFile(file, taxonReference) {
            const conflict = dataFiles.find((f) => f.dataType === file.dataType);
            if (conflict) {
                return { ok: false, reason: 'conflict', conflictFileName: conflict.fileName };
            }
            return addValidatedFile(file, taxonReference);
        },

        /**
         * Removes `oldFileName` and adds `file` in its place, skipping the
         * "one file per type" check. Sibling files' missing-taxa flags are
         * only reset when there's no taxon reference — in that mode the
         * taxa union can shrink when a file is removed, so siblings need
         * re-checking. With a taxon reference, each file's status is
         * independent of which other Nexus files exist, so siblings are
         * left untouched.
         * @param {string} oldFileName
         * @param {{ fileName: string, dataType: string, ntax: number | null, nchar: number | null, taxa: string[] }} file
         * @param {{ fileName: string, taxa: string[] } | null} taxonReference
         * @returns {{ ok: true } | { ok: false, reason: 'error', error: string }}
         */
        replaceDataFile(oldFileName, file, taxonReference) {
            const unknownError = findUnknownTaxonError(file.taxa, file.fileName, taxonReference);
            if (unknownError) {
                return { ok: false, reason: 'error', error: unknownError };
            }

            dataFiles = dataFiles.filter((f) => f.fileName !== oldFileName);

            if (!taxonReference) {
                for (const existing of dataFiles) {
                    existing.missingTaxa = [];
                    existing.missingFrom = [];
                }
            }

            return addValidatedFile(file, taxonReference);
        }
    };
}

export const analysisState = createAnalysisState();