<script>
	import revbayessymbol from '$lib/assets/revbayessymbol.png';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={revbayessymbol} />
</svelte:head>

<nav>
	<button><a href="/">Home</a></button>
	<a href="/data">Data</a>
	<a href="/taxa">Taxa</a>
	<a href="/substitution_model">Substitution model</a>
	<a href="/clock_model">Clock model</a>
	<a href="/priors">Priors</a>
	<a href="/mcmc">MCMC</a>
</nav>

{@render children()}
