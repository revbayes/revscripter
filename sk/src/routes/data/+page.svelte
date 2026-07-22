<script>
    import { analysisState } from '$lib/state/analysis.svelte.js';
    import { taxaState } from '$lib/state/taxa.svelte.js';
    import { parseNexus, NexusParseError } from '$lib/nexus.js';
    import { parseTaxonTable, TaxonTableParseError } from '$lib/taxonTable.js';
    import { sortedArraysEqual } from '$lib/arrays.js';

    const ALLOWED_EXTENSIONS = ['.nex', '.nexus'];

    /** @type {string | null} */
    let dataError = $state(null);
    /** @type {string | null} */
    let ageFileError = $state(null);

    /**
     * @param {string} filename
     */
    function getExtension(filename) {
        const dotIndex = filename.lastIndexOf('.');
        return dotIndex === -1 ? '' : filename.slice(dotIndex).toLowerCase();
    }

    /**
     * @param {Event & { currentTarget: HTMLInputElement }} event
     */
    async function handleDataFileChange(event) {
        dataError = null;

        const input = event.currentTarget;
        const file = input.files?.[0];
        if (!file) return;

        input.value = '';

        const extension = getExtension(file.name);
        if (!ALLOWED_EXTENSIONS.includes(extension)) {
            dataError = `"${file.name}" is not a Nexus file (.nex).`;
            return;
        }

        const text = await file.text();

        try {
            const parsed = parseNexus(text);
            const result = analysisState.addDataFile({ fileName: file.name, ...parsed });
            if (!result.ok) {
                dataError = result.error;
            }
        } catch (err) {
            const message = err instanceof NexusParseError ? err.message : 'Could not parse the file.';
            dataError = `"${file.name}": ${message}`;
        }
    }

    /**
     * @param {Event & { currentTarget: HTMLInputElement }} event
     */
    async function handleAgeFileChange(event) {
        ageFileError = null;

        const input = event.currentTarget;
        const file = input.files?.[0];
        if (!file) return;

        input.value = '';

        if (analysisState.taxa.length === 0) {
            ageFileError = 'Upload a Nexus data file first.';
            return;
        }

        const text = await file.text();

        try {
            const parsed = parseTaxonTable(text);

            if (!sortedArraysEqual(analysisState.taxa, parsed.taxa)) {
                ageFileError = `Taxa in "${file.name}" do not match the taxa from the uploaded data file(s).`;
                return;
            }

            taxaState.setAges({ fileName: file.name, mode: parsed.mode, ages: parsed.ages });
        } catch (err) {
            const message = err instanceof TaxonTableParseError ? err.message : 'Could not parse the file.';
            ageFileError = `"${file.name}": ${message}`;
        }
    }
</script>

<h2>Data</h2>

<p>Upload Nexus data file(s)</p>
<input type="file" accept=".nex,.nexus" onchange={handleDataFileChange} />

{#if dataError}
    <p style="color: red">{dataError}</p>
{/if}

{#if analysisState.dataFiles.length > 0}
    <ul>
        {#each analysisState.dataFiles as file}
            <li>
                Loaded <strong>{file.fileName}</strong>: {file.nchar} {file.dataType} characters for {file.taxa.length} taxa
            </li>
        {/each}
    </ul>
{/if}

<p>Upload a taxon age file (tab-delimited, with a "taxon" column and either "age" or "min_age"/"max_age")</p>
<input type="file" onchange={handleAgeFileChange} />

{#if ageFileError}
    <p style="color: red">{ageFileError}</p>
{/if}

{#if taxaState.ageFileName}
    <p>
        Loaded ages from <strong>{taxaState.ageFileName}</strong>
        ({taxaState.ageMode === 'age' ? 'age' : 'min/max age'} for {Object.keys(taxaState.ages).length} taxa)
    </p>
{/if}