<script>
    import { analysisState } from '$lib/state/analysis.svelte.js';
    import { parseNexus, NexusParseError } from '$lib/nexus.js';

    const ALLOWED_EXTENSIONS = ['.nex', '.nexus'];

    /** @type {string | null} */
    let error = $state(null);

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
    async function handleFileChange(event) {
        error = null;

        const file = event.currentTarget.files?.[0];
        if (!file) return;

        const extension = getExtension(file.name);
        if (!ALLOWED_EXTENSIONS.includes(extension)) {
            error = `"${file.name}" is not a Nexus file (.nex).`;
            return;
        }

        const text = await file.text();

        try {
            const parsed = parseNexus(text);
            analysisState.setData({ fileName: file.name, ...parsed });
        } catch (err) {
            const message = err instanceof NexusParseError ? err.message : 'Could not parse the file.';
            error = `"${file.name}": ${message}`;
        }
    }
</script>

<h2>Data</h2>

<p>Upload Nexus data file</p>
<input type="file" accept=".nex,.nexus" onchange={handleFileChange} />

{#if error}
    <p style="color: red">{error}</p>
{/if}

{#if analysisState.fileName}
    <p>
        Loaded <strong>{analysisState.fileName}</strong>: {analysisState.nchar} {analysisState.dataType} characters for {analysisState.ntax} taxa
    </p>
{/if}