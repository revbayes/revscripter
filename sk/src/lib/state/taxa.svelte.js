/**
 * @typedef { import('$lib/taxonTable.js').TaxonAge } TaxonAge
 */

/**
 * @typedef { object } TaxonGroup
 * @property { string } name
 * @property { string[] } taxa
 * @property { boolean } monophyletic
 * @property { boolean } monitorAge
 */

function createTaxaState() {
    /** @type { string | null } */
    let ageFileName = $state(null);
    /** @type { 'age' | 'range' | null } */
    let ageMode = $state(null);
    /** @type { Record<string, TaxonAge> } */
    let ages = $state({});
    /** @type { TaxonGroup[] } */
    let groups = $state([]);

    return {
        get ageFileName() {
            return ageFileName;
        },
        get ageMode() {
            return ageMode;
        },
        get ages() {
            return ages;
        },
        get groups() {
            return groups;
        },

        /**
         * @param {{ fileName: string, mode: 'age' | 'range', ages: Record<string, TaxonAge> }} data
         */
        setAges({ fileName, mode, ages: newAges }) {
            ageFileName = fileName;
            ageMode = mode;
            ages = newAges;
        },

        /**
         * @param {string} name
         * @param {string[]} taxa
         */
        createGroup(name, taxa) {
            groups.push({ name, taxa, monophyletic: false, monitorAge: false });
        }
    };
}

export const taxaState = createTaxaState();