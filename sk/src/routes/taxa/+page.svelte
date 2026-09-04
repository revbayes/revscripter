<script>
    import { SvelteSet } from "svelte/reactivity";
    import { analysisState } from "$lib/state/analysis.svelte.js";
    import { taxaState } from "$lib/state/taxa.svelte.js";

    /** @type {SvelteSet<string>} */
    let checkedTaxa = new SvelteSet();

    let filterText = $state("");
    let filteredTaxa = $derived(
        analysisState.taxa.filter((taxon) =>
            taxon.toLowerCase().includes(filterText.trim().toLowerCase()),
        ),
    );
    let allFilteredChecked = $derived(
        filteredTaxa.length > 0 &&
            filteredTaxa.every((taxon) => checkedTaxa.has(taxon)),
    );

    let groupName = $state("");
    /** @type {string | null} */
    let groupError = $state(null);

    /** @type {number | null} */
    let editingIndex = $state(null);
    let editName = $state("");
    let editMonophyletic = $state(false);
    let editMonitorAge = $state(false);
    let editMonitorPosterior = $state(false);
    let editTaxaText = $state("");
    /** @type {string | null} */
    let editTaxaError = $state(null);

    /** @type {HTMLDialogElement | undefined} */
    let dialogEl = $state();

    $effect(() => {
        if (editingIndex !== null) {
            dialogEl?.showModal();
        } else {
            dialogEl?.close();
        }
    });

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

    /**
     * @param {boolean} checked
     */
    function toggleAllFiltered(checked) {
        for (const taxon of filteredTaxa) {
            if (checked) {
                checkedTaxa.add(taxon);
            } else {
                checkedTaxa.delete(taxon);
            }
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

    /**
     * @param {number} index
     */
    function openEdit(index) {
        const group = taxaState.groups[index];
        editingIndex = index;
        editName = group.name;
        editMonophyletic = group.monophyletic;
        editMonitorAge = group.monitorAge;
        editMonitorPosterior = group.monitorPosterior;
        editTaxaText = group.taxa.join("\n");
        editTaxaError = null;
    }

    function closeEdit() {
        editingIndex = null;
    }

    function saveEdit() {
        if (editingIndex === null) return;

        editTaxaError = null;

        const lines = editTaxaText
            .split("\n")
            .map((line) => line.trim())
            .filter((line) => line.length > 0);

        const uniqueTaxa = [...new Set(lines)];
        if (uniqueTaxa.length !== lines.length) {
            editTaxaError = "Duplicate taxon in list.";
            return;
        }

        const invalidTaxon = uniqueTaxa.find(
            (taxon) => !analysisState.taxa.includes(taxon),
        );
        if (invalidTaxon) {
            editTaxaError = `"${invalidTaxon}" is not a taxon in the uploaded data.`;
            return;
        }

        if (uniqueTaxa.length === 0) {
            editTaxaError = "Group must contain at least one taxon.";
            return;
        }

        const group = taxaState.groups[editingIndex];
        group.name = editName.trim() || group.name;
        group.monophyletic = editMonophyletic;
        group.monitorAge = editMonitorAge;
        group.monitorPosterior = editMonitorPosterior;
        group.taxa = uniqueTaxa.sort();
        editingIndex = null;
    }

    /**
     * @param {MouseEvent & { currentTarget: HTMLDialogElement }} event
     */
    function handleDialogClick(event) {
        if (event.target === event.currentTarget) {
            closeEdit();
        }
    }
</script>

<h2>Taxa</h2>

{#if analysisState.taxa.length === 0}
    <p>No data uploaded yet.</p>
{:else}
    <div
        style="display: flex; gap: 2rem; margin-top: 1rem; align-items: start;"
    >
        <div style="flex: 1;">
            <input
                type="text"
                placeholder="Filter"
                bind:value={filterText}
                style="width: 100%; margin-bottom: 0.5rem;"
            />
            <div class="scroll-box">
                <table>
                    <thead>
                        <tr>
                            <th>
                                <input
                                    type="checkbox"
                                    checked={allFilteredChecked}
                                    onchange={(e) =>
                                        toggleAllFiltered(
                                            e.currentTarget.checked,
                                        )}
                                />
                            </th>
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
                        {#each filteredTaxa as taxon}
                            <tr>
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={checkedTaxa.has(taxon)}
                                        onchange={(e) =>
                                            toggleTaxon(
                                                taxon,
                                                e.currentTarget.checked,
                                            )}
                                    />
                                </td>
                                <td>{taxon}</td>
                                {#if taxaState.ageMode === "range"}
                                    <td>{taxaState.ages[taxon]?.minAge ?? 0}</td
                                    >
                                    <td>{taxaState.ages[taxon]?.maxAge ?? 0}</td
                                    >
                                {:else}
                                    <td>{taxaState.ages[taxon]?.age ?? 0}</td>
                                {/if}
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
        </div>

        <div style="flex: 1;">
            <div style="display: flex; gap: 0.5rem; margin-bottom: 0.5rem;">
                <input
                    type="text"
                    placeholder="Group Name"
                    bind:value={groupName}
                    style="flex: 1;"
                />
                <button onclick={handleCreateGroup}>Create</button>
            </div>
            {#if groupError}
                <p style="color: red">{groupError}</p>
            {/if}

            <div class="scroll-box">
                <table>
                    <thead>
                        <tr>
                            <th>Taxa Group</th>
                            <th>Monophyletic?</th>
                            <th>Monitor age?</th>
                            <th>Monitor PP?</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {#if taxaState.groups.length === 0}
                            <tr>
                                <td colspan="5">No group is created...</td>
                            </tr>
                        {:else}
                            {#each taxaState.groups as group, i}
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
                                    <td
                                        ><input
                                            type="checkbox"
                                            bind:checked={
                                                group.monitorPosterior
                                            }
                                        /></td
                                    >
                                    <td>
                                        <button
                                            onclick={() => openEdit(i)}
                                            title="Edit">✎</button
                                        >
                                    </td>
                                </tr>
                            {/each}
                        {/if}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
{/if}

<dialog
    bind:this={dialogEl}
    class="modal-box"
    onclick={handleDialogClick}
    onclose={closeEdit}
>
    {#if editingIndex !== null}
        {@const group = taxaState.groups[editingIndex]}
        <div
            style="display: flex; justify-content: space-between; align-items: center;"
        >
            <h3 style="margin: 0;">{group.name}</h3>
            <button onclick={closeEdit} aria-label="Close">×</button>
        </div>

        <label style="display: block; margin-top: 1rem;">
            Change Name:
            <input type="text" bind:value={editName} style="width: 100%;" />
        </label>

        <div style="margin-top: 0.5rem;">
            <label>
                <input type="checkbox" bind:checked={editMonophyletic} />
                Monophyletic
            </label>
        </div>
        <div>
            <label>
                <input type="checkbox" bind:checked={editMonitorAge} />
                Monitor age
            </label>
        </div>
        <div>
            <label>
                <input type="checkbox" bind:checked={editMonitorPosterior} />
                Monitor posterior probability
            </label>
        </div>

        <p style="margin-top: 0.5rem; margin-bottom: 0.25rem;">
            Taxa in group (add or remove lines to change the taxa in group):
        </p>
        <textarea class="modal-taxa-list" bind:value={editTaxaText}></textarea>
        {#if editTaxaError}
            <p style="color: red">{editTaxaError}</p>
        {/if}

        <div
            style="display: flex; justify-content: flex-end; gap: 0.5rem; margin-top: 1rem;"
        >
            <button onclick={closeEdit}>Close</button>
            <button onclick={saveEdit}>Save</button>
        </div>
    {/if}
</dialog>
