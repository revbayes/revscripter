function createAnalysisState() {
    /** @type {string | null} */
    let fileName = $state(null);
    /** @type {string | null} */
    let dataType = $state(null);
    /** @type {number | null} */
    let ntax = $state(null);
    /** @type {number | null} */
    let nchar = $state(null);
    /** @type {string[]} */
    let taxa = $state([]);

    return {
        get fileName() {
            return fileName;
        },
        get dataType() {
            return dataType;
        },
        get ntax() {
            return ntax;
        },
        get nchar() {
            return nchar;
        },
        get taxa() {
            return taxa;
        },
        /**
         * @param {{ fileName: string, dataType: string, ntax: number | null, nchar: number | null, taxa: string[] }} data
         */
        setData({ fileName: fn, dataType: dt, ntax: nt, nchar: nc, taxa: tx }) {
            fileName = fn;
            dataType = dt;
            ntax = nt;
            nchar = nc;
            taxa = tx;
        }
    };
}

export const analysisState = createAnalysisState();
