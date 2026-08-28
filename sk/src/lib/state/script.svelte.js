/**
 * @typedef {'data' | 'taxa' | 'substitutionModel' | 'treeModel' | 'moves' | 'mcmc'} SummaryKey
 */

function createScript() {
    /** @type {{ data: { value: string }, taxa: { value: string }, substitutionModel: { value: string }, treeModel: { value: string }, moves: { value: string }, mcmc: { value: string } }} */
    let state = $state({
        data: { value: 'No data selected' },
        taxa: { value: 'No taxa selected' },
        substitutionModel: { value: 'No substitution model selected' },
        treeModel: { value: 'No tree model selected' },
        moves: { value: 'No moves selected' },
        mcmc: { value: 'No MCMC settings selected' }
    });

    return {
        get data() {
            return state.data;
        },
        get taxa() {
            return state.taxa;
        },
        get substitutionModel() {
            return state.substitutionModel;
        },
        get treeModel() {
            return state.treeModel;
        },
        get moves() {
            return state.moves;
        },
        get mcmc() {
            return state.mcmc;
        },
        /**
         * @param {SummaryKey} section
         * @param {string} value
         */
        update(section, value) {
            if (section in state) {
                /** @type {{ value: string }} */
                const field = state[section];
                field.value = value;
            }
        }
    };
}

export const analysisScript = createScript();
