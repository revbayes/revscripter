<script>
    import '../app.css'
	import revbayessymbol from '$lib/assets/revbayessymbol.png';

	let { children } = $props();
</script>

<h1 style="text-align: center">
	<img src={revbayessymbol} width="50px" height="50px" alt="RevBayes" />RevScripter
</h1>

<nav>
	<a href="/" class="btn-style">Home</a>
	<a href="/data" class="btn-style">Data</a>
	<a href="/taxa" class="btn-style">Taxa</a>
	<a href="/substitution_model" class="btn-style">Substitution model</a>
	<a href="/tree_model" class="btn-style">Tree Model</a>
	<a href="/moves" class="btn-style">Moves</a>
	<a href="/mcmc" class="btn-style">MCMC</a>
</nav>

{@render children()}