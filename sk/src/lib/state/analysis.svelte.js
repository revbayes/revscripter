function createAnalysisState() {
    let fileName = $state(null);
    let dataType = $state(null);
    let ntax = $state(null);
    let nchar = $state(null);
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
