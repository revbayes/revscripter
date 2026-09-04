/**
 * Joins names into a human-readable list: "a", "a and b", or "a, b, and c".
 * @param {string[]} names
 */
export function joinWithAnd(names) {
    if (names.length === 1) return names[0];
    if (names.length === 2) return `${names[0]} and ${names[1]}`;
    return `${names.slice(0, -1).join(', ')}, and ${names[names.length - 1]}`;
}

/**
 * "File {source} contains/contain taxa missing from {deficient}. The missing
 * taxa will be added to the {deficient} data." Used when two or more Nexus
 * files are compared directly against each other (no taxon file uploaded).
 * @param {string[]} sourceNames
 * @param {string[]} deficientNames
 */
export function buildCrossFileWarning(sourceNames, deficientNames) {
    const source = joinWithAnd(sourceNames);
    const deficient = joinWithAnd(deficientNames);
    const verb = sourceNames.length > 1 ? 'contain' : 'contains';
    return `File ${source} ${verb} taxa missing from ${deficient}. The missing taxa will be added to the ${deficient} data.`;
}

/**
 * "File {deficient} contains/contain taxa missing from {taxonFileName}. The
 * missing taxa will be added to the {deficient} data." Used when Nexus
 * file(s) are compared against the uploaded taxon file.
 * @param {string[]} deficientNames
 * @param {string} taxonFileName
 */
export function buildTaxonFileWarning(deficientNames, taxonFileName) {
    const deficient = joinWithAnd(deficientNames);
    const verb = deficientNames.length > 1 ? 'contain' : 'contains';
    return `File ${deficient} ${verb} taxa missing from ${taxonFileName}. The missing taxa will be added to the ${deficient} data.`;
}

/**
 * '"{taxon}" in "{fileName}" is not present in "{referenceFileName}".' Or,
 * if there's more than one unknown taxon: '"{taxon}" and N other species in
 * "{fileName}" are not present in "{referenceFileName}".'
 * @param {string[]} unknownTaxa
 * @param {string} fileName
 * @param {string} referenceFileName
 */
export function buildUnknownTaxonError(unknownTaxa, fileName, referenceFileName) {
    const [first, ...rest] = unknownTaxa;
    const subject = rest.length > 0 ? `"${first}" and ${rest.length} other species` : `"${first}"`;
    const verb = rest.length > 0 ? 'are' : 'is';
    return `${subject} in "${fileName}" ${verb} not present in "${referenceFileName}".`;
}