export class NexusParseError extends Error {}

/**
 * Parses a small subset of the Nexus format: enough to pull the data type,
 * taxon count, and taxon names out of a TAXA and/or CHARACTERS/DATA block.
 * It does not attempt to handle the full Nexus grammar (interleaved
 * matrices, multiple char sets, etc).
 * @param {string} text
 * @returns {{ dataType: string, ntax: number | null, nchar: number | null, taxa: string[]}}
 */
export function parseNexus(text) {
    const cleaned = text.replace(/\[[^\]]*\]/g, "");

    if (!/^\s*#NEXUS/i.test(cleaned)) {
        throw new NexusParseError("File does not start with #NEXUS");
    }

    /** @type {Record<string, string>} */
    const blocks = {};
    const blockRegex = /BEGIN\s+(\w+)\s*;([\s\S]*?)END\s*;/gi;
    let match;
    while ((match = blockRegex.exec(cleaned))) {
        const name = match[1].toUpperCase();
        blocks[name] = (blocks[name] ?? "") + match[2];
    }

    const dataBlock = blocks.CHARACTERS ?? blocks.DATA;
    const taxaBlock = blocks.TAXA;

    const dimSource = taxaBlock ?? dataBlock ?? "";
    const ntaxMatch = dimSource.match(/DIMENSIONS[^;]*NTAX\s*=\s*(\d+)/i);
    let ntax = ntaxMatch ? parseInt(ntaxMatch[1], 10) : null;

    const ncharMatch = dimSource.match(/DIMENSIONS[^;]*NCHAR\s*=\s*(\d+)/i);
    let nchar = ncharMatch ? parseInt(ncharMatch[1], 10) : null;

    let dataType = null;
    if (dataBlock) {
        const dataTypeMatch = dataBlock.match(/FORMAT[^;]*DATATYPE\s*=\s*(\w+)/i);
        if (dataTypeMatch) dataType = dataTypeMatch[1].toUpperCase();
    }

    /** @type {string[]} */
    let taxa = [];
    if (taxaBlock) {
        const taxLabelsMatch = taxaBlock.match(/TAXLABELS([\s\S]*?);/i);
        if (taxLabelsMatch) taxa = extractLabels(taxLabelsMatch[1]);
    }

    if (taxa.length === 0 && dataBlock) {
        const matrixMatch = dataBlock.match(/MATRIX([\s\S]*?);/i);
        if (matrixMatch) {
            const seen = new Set();
            for (const line of matrixMatch[1].split("\n")) {
                const label = extractFirstLabel(line.trim());
                if (label && !seen.has(label)) {
                    seen.add(label);
                    taxa.push(label);
                }
            }
        }
    }

    if (nchar === null && dataBlock) {
        const matrixMatch = dataBlock.match(/MATRIX([\s\S]*?);/i);
        if (matrixMatch) {
            const firstLine = matrixMatch[1]
                .split("\n")
                .map((l) => l.trim())
                .find((l) => l.length > 0);
            if (firstLine) {
                const sequence = stripLabel(firstLine);
                nchar = sequence.replace(/\s+/g, "").length;
            }
        }  
    }

    if (ntax === null) ntax = taxa.length || null;
    if (!dataType) throw new NexusParseError("Could not find DATATYPE in a FORMAT command");
    if (taxa.length === 0) throw new NexusParseError("Could not find taxon labels");

    return { dataType, ntax, nchar, taxa };
}

/**
 * 
 * @param {string} str 
 */
function extractLabels(str) {
    const labels = [];
    const re = /'([^']+)'|(\S+)/g;
    let m;
    while ((m = re.exec(str))) {
        labels.push(m[1] ?? m[2]);
    }
    return labels;
}

/**
 * 
 * @param {string} line 
 */
function extractFirstLabel(line) {
    if (!line) return null;
    const quoted = line.match(/^'([^']+)'/);
    if (quoted) return quoted[1];
    const plain = line.match(/^(\S+)/);
    return plain ? plain[1] : null;
}

/**
 * 
 * @param {string} line 
 */
function stripLabel(line) {
    const quoted = line.match(/^'[^']+'\s*(.*)$/);
    if (quoted) return quoted[1];
    const plain = line.match(/^\S+\s*(.*)$/);
    return plain ? plain[1] : "";
}