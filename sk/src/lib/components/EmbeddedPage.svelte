<script>
    import { analysisScript } from '$lib/state/script.svelte.js';
</script>

<div style="margin-top: 1rem; padding: 1rem; border: 1px solid #c9d1d9; border-radius: 8px; background: white;">
    <h3>Rev Script</h3>

    <ul>
        <li><strong>Data:</strong> {analysisScript.data.value}</li>
        <li><strong>Taxa:</strong> {analysisScript.taxa.value}</li>
        <li><strong>Substitution model:</strong> {analysisScript.substitutionModel.value}</li>
        <li><strong>Tree model:</strong> {analysisScript.treeModel.value}</li>
        <li><strong>Moves:</strong> {analysisScript.moves.value}</li>
        <li><strong>MCMC:</strong> {analysisScript.mcmc.value}</li>
    </ul>
</div>
