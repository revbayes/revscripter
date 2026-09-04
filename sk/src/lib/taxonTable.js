/**
 * @typedef { object } TaxonAge
 * @property { number } [age]
 * @property { number } [minAge]
 * @property { number } [maxAge]
 */

export class TaxonTableParseError extends Error {}

/**
 * Parses a tab-delimited taxon table with a "taxon" column and either an
 * "age" column, or both "min_age" and "max_age" columns.
 * @param { string } text
 * @returns {{ taxa: string[], ages: Record<string, TaxonAge>, mode: 'age' | 'range' }}
 */
export function parseTaxonTable(text) {
    const lines = text
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter((l) => l.length > 0);

    if (lines.length === 0) throw new TaxonTableParseError("File is empty");

    const header = lines[0].split("\t").map((h) => h.trim().toLowerCase());
    const taxonIndex = header.indexOf("taxon");
    if (taxonIndex === -1) throw new TaxonTableParseError('Missing required "taxon" column');

    const ageIndex = header.indexOf("age");
    const minAgeIndex = header.indexOf("min_age");
    const maxAgeIndex = header.indexOf("max_age");

    /** @type {'age' | 'range'} */
    let mode;
    if (ageIndex !== -1) {
        mode = "age";
    } else if (minAgeIndex !== -1 && maxAgeIndex !== -1) {
        mode = "range";
    } else {
        throw new TaxonTableParseError(
            'File must have an "age" column, or both "min_age" and "max_age" columns'
        );
    }

    /** @type {string[]} */
    const taxa = [];
    /** @type {Record<string, TaxonAge>} */
    const ages = {};

    for (const line of lines.slice(1)) {
        const cells = line.split("\t");
        const taxon = cells[taxonIndex]?.trim();
        if (!taxon) continue;

        if (taxa.includes(taxon)) {
            throw new TaxonTableParseError(`Duplicate taxon "${taxon}"`);
        }
        taxa.push(taxon);

        if (mode === "age") {
            const age = parseFloat(cells[ageIndex]);
            if (Number.isNaN(age)) throw new TaxonTableParseError(`Invalid age for taxon "${taxon}"`);
            ages[taxon] = { age };
        } else {
            const minAge = parseFloat(cells[minAgeIndex]);
            const maxAge = parseFloat(cells[maxAgeIndex]);
            if (Number.isNaN(minAge) || Number.isNaN(maxAge)) {
                throw new TaxonTableParseError(`Invalid min_age/max_age for taxon "${taxon}"`);
            }
            ages[taxon] = { minAge, maxAge };
        }
    }

    taxa.sort();
    return { taxa, ages, mode };
}