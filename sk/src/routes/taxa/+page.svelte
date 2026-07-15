<script>
    import { analysisState } from '$lib/state/analysis.svelte.js';
</script>

<h2>Taxa</h2>

{#if analysisState.taxa.length > 0}
    <p>{analysisState.ntax} taxa from {analysisState.fileName}</p>
    <ul>
        {#each analysisState.taxa as taxon}
            <li>{taxon}</li>
        {/each}
    </ul>
{:else}
    <p>No data uploaded yet.</p>
{/if}