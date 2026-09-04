<script>
    import { analysisState } from '$lib/state/analysis.svelte.js';
    import { taxaState } from '$lib/state/taxa.svelte.js';
    import { parseNexus, NexusParseError } from '$lib/nexus.js';
    import { parseTaxonTable, TaxonTableParseError } from '$lib/taxonTable.js';
    import { buildCrossFileWarning, buildTaxonFileWarning, buildUnknownTaxonError } from '$lib/warnings.js';

    const ALLOWED_EXTENSIONS = ['.nex', '.nexus'];

    /** @type {string | null} */
    let dataError = $state(null);
    /** @type {string | null} */
    let ageFileError = $state(null);

    let dataWarnings = $derived.by(() => {
        const taxonFileName = taxaState.ageFileName;
        if (taxonFileName) return [];

        /** @type {Map<string, string[]>} */
        const groups = new Map();
        for (const file of analysisState.dataFiles) {
            if (file.missingFrom.length === 0) continue;
            const key = JSON.stringify([...file.missingFrom].sort());
            const deficient = groups.get(key) ?? [];
            deficient.push(file.fileName);
            groups.set(key, deficient);
        }

        /** @type {string[]} */
        const warnings = [];
        for (const [key, deficientNames] of groups) {
            warnings.push(buildCrossFileWarning(JSON.parse(key), deficientNames));
        }
        return warnings;
    });

    let ageFileWarnings = $derived.by(() => {
        const taxonFileName = taxaState.ageFileName;
        if (!taxonFileName) return [];

        const affected = analysisState.dataFiles
            .filter((f) => f.missingFrom.includes(taxonFileName))
            .map((f) => f.fileName);
        return affected.length > 0 ? [buildTaxonFileWarning(affected, taxonFileName)] : [];
    });

    /** @type {{ oldFileName: string, newFile: { fileName: string, dataType: string, ntax: number | null, nchar: number | null, taxa: string[] } } | null} */
    let pendingReplace = $state(null);

    /** @type {HTMLDialogElement | undefined} */
    let replaceDialogEl = $state();

    $effect(() => {
        if (pendingReplace !== null) {
            replaceDialogEl?.showModal();
        } else {
            replaceDialogEl?.close();
        }
    });

    /**
     * @param {string} filename
     */
    function getExtension(filename) {
        const dotIndex = filename.lastIndexOf('.');
        return dotIndex === -1 ? '' : filename.slice(dotIndex).toLowerCase();
    }

    /**
     * @param {MouseEvent & { currentTarget: HTMLDialogElement }} event
     */
    function handleReplaceDialogClick(event) {
        if (event.target === event.currentTarget) {
            cancelReplace();
        }
    }

    function cancelReplace() {
        pendingReplace = null;
    }

    function confirmReplace() {
        if (!pendingReplace) return;
        const taxonReference = taxaState.ageFileName
            ? { fileName: taxaState.ageFileName, taxa: taxaState.taxa }
            : null;
        const result = analysisState.replaceDataFile(pendingReplace.oldFileName, pendingReplace.newFile, taxonReference);
        if (!result.ok) {
            dataError = result.error;
        }
        pendingReplace = null;
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
            const newFile = { fileName: file.name, ...parsed };
            const taxonReference = taxaState.ageFileName
                ? { fileName: taxaState.ageFileName, taxa: taxaState.taxa }
                : null;
            const result = analysisState.addDataFile(newFile, taxonReference);
            if (!result.ok) {
                if (result.reason === 'conflict') {
                    pendingReplace = { oldFileName: result.conflictFileName, newFile };
                } else {
                    dataError = result.error;
                }
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

        if (analysisState.dataFiles.length === 0) {
            ageFileError = 'Upload a Nexus data file first.';
            return;
        }

        const text = await file.text();

        try {
            const parsed = parseTaxonTable(text);

            for (const dataFile of analysisState.dataFiles) {
                const unknown = dataFile.taxa.filter((t) => !parsed.taxa.includes(t));
                if (unknown.length > 0) {
                    ageFileError = buildUnknownTaxonError(unknown, dataFile.fileName, file.name);
                    return;
                }
            }

            taxaState.setAges({ fileName: file.name, mode: parsed.mode, ages: parsed.ages });

            for (const dataFile of analysisState.dataFiles) {
                const missing = parsed.taxa.filter((t) => !dataFile.taxa.includes(t));
                if (missing.length > 0) {
                    dataFile.missingTaxa = missing.sort();
                    dataFile.missingFrom = [file.name];
                } else {
                    dataFile.missingTaxa = [];
                    dataFile.missingFrom = [];
                }
            }
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
{#each dataWarnings as warning}
    <p style="color: #b8860b">{warning}</p>
{/each}

{#if analysisState.dataFiles.length > 0}
    <ul>
        {#each analysisState.dataFiles as file}
            <li>
                Loaded <strong>{file.fileName}</strong>: {file.nchar} {file.dataType} characters for {file.taxa.length} taxa
                {#if file.missingFrom.length > 0}
                    <em>(missing {file.missingTaxa.length} taxa found in {file.missingFrom.join(', ')})</em>
                {/if}
            </li>
        {/each}
    </ul>
{/if}

<p>Upload a taxon age file (tab-delimited, with a "taxon" column and either "age" or "min_age"/"max_age")</p>
<input type="file" onchange={handleAgeFileChange} />

{#if ageFileError}
    <p style="color: red">{ageFileError}</p>
{/if}
{#each ageFileWarnings as warning}
    <p style="color: #b8860b">{warning}</p>
{/each}

{#if taxaState.ageFileName}
    <p>
        Loaded ages from <strong>{taxaState.ageFileName}</strong>
        ({taxaState.ageMode === 'age' ? 'age' : 'min/max age'} for {Object.keys(taxaState.ages).length} taxa)
    </p>
{/if}

<dialog bind:this={replaceDialogEl} class="modal-box" onclick={handleReplaceDialogClick} onclose={cancelReplace}>
    {#if pendingReplace}
        <p>
            Only one data file allowed per type. Partitioned models will be added in the future.
            Would you wish to delete <strong>{pendingReplace.oldFileName}</strong> and upload
            <strong>{pendingReplace.newFile.fileName}</strong>?
        </p>
        <div style="display: flex; justify-content: flex-end; gap: 0.5rem; margin-top: 1rem;">
            <button onclick={cancelReplace}>No</button>
            <button onclick={confirmReplace}>Yes</button>
        </div>
    {/if}
</dialog>