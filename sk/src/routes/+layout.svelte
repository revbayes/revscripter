<script>
	import revbayessymbol from '$lib/assets/revbayessymbol.png';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={revbayessymbol} />
</svelte:head>

{@render children()}
