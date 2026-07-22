<script>
    import { SvelteSet } from "svelte/reactivity";
    import { analysisState } from "$lib/state/analysis.svelte.js";
    import { taxaState } from "$lib/state/taxa.svelte.js";

    /** @type {SvelteSet<string>} */
    let checkedTaxa = new SvelteSet();

    let groupName = $state("");
    /** @type {string | null} */
    let groupError = $state(null);

    /**
     * @param {string} taxon
     * @param {boolean} checked
     */
    function toggleTaxon(taxon, checked) {
        if (checked) {
            checkedTaxa.add(taxon);
        } else {
            checkedTaxa.delete(taxon);
        }
    }

    function handleCreateGroup() {
        groupError = null;

        const name = groupName.trim();
        if (!name) {
            groupError = "Group name is required.";
            return;
        }
        if (checkedTaxa.size === 0) {
            groupError = "Select at least one taxon.";
            return;
        }

        taxaState.createGroup(name, [...checkedTaxa].sort());
        groupName = "";
        checkedTaxa.clear();
    }
</script>

<h2>Taxa</h2>

{#if analysisState.taxa.length === 0}
    <p>No data uploaded yet.</p>
{:else}
    <div style="display: flex; gap: 2rem; margin-top: 1rem;">
        <table>
            <thead>
                <tr>
                    <th></th>
                    <th>Taxa</th>
                    {#if taxaState.ageMode === "range"}
                        <th>Min Age</th>
                        <th>Max Age</th>
                    {:else}
                        <th>Age</th>
                    {/if}
                </tr>
            </thead>
            <tbody>
                {#each analysisState.taxa as taxon}
                    <tr>
                        <td>
                            <input
                                type="checkbox"
                                checked={checkedTaxa.has(taxon)}
                                onchange={(e) =>
                                    toggleTaxon(taxon, e.currentTarget.checked)}
                            />
                        </td>
                        <td>{taxon}</td>
                        {#if taxaState.ageMode === "range"}
                            <td>{taxaState.ages[taxon]?.minAge ?? 0}</td>
                            <td>{taxaState.ages[taxon]?.maxAge ?? 0}</td>
                        {:else}
                            <td>{taxaState.ages[taxon]?.age ?? 0}</td>
                        {/if}
                    </tr>
                {/each}
            </tbody>
        </table>

        <div>
            <div>
                <input
                    type="text"
                    placeholder="Group Name"
                    bind:value={groupName}
                />
                <button onclick={handleCreateGroup}>Create</button>
            </div>
            {#if groupError}
                <p style="color: red">{groupError}</p>
            {/if}

            <table style="margin-top: 1rem;">
                <thead>
                    <tr>
                        <th>Taxa Group</th>
                        <th>Monophyletic?</th>
                        <th>Monitor age?</th>
                    </tr>
                </thead>
                <tbody>
                    {#if taxaState.groups.length === 0}
                        <tr>
                            <td colspan="3">No group is created...</td>
                        </tr>
                    {:else}
                        {#each taxaState.groups as group}
                            <tr>
                                <td>{group.name}</td>
                                <td
                                    ><input
                                        type="checkbox"
                                        bind:checked={group.monophyletic}
                                    /></td
                                >
                                <td
                                    ><input
                                        type="checkbox"
                                        bind:checked={group.monitorAge}
                                    /></td
                                >
                            </tr>
                        {/each}
                    {/if}
                </tbody>
            </table>
        </div>
    </div>
{/if}
