<script>
    import { enhance } from '$app/forms';
    import { analysisState } from '$lib/state/analysis.svelte.js';

    /** @type {import('./$types').ActionData} */
    let { form } = $props();
</script>

<h2>Data</h2>

<p>Upload Nexus data file</p>
<form 
    method="post" 
    enctype="multipart/form-data"
    use:enhance={() => {
        return async ({ result, update }) => {
            if (result.type === 'success' && result.data?.success) {
                analysisState.setData(result.data);
            }
            await update();
        };
    }}
>
    <input type="file" name="data" />
    <button>Upload</button>
</form>

{#if form?.error}
    <p style="color: red">{form.error}</p>
{/if}

{#if analysisState.fileName}
    <p>
        Loaded <strong>{analysisState.fileName}</strong>: {analysisState.nchar} {analysisState.dataType} characters for {analysisState.ntax} taxa
    </p>
{/if}