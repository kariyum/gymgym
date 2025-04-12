<script lang="ts">
	import Navbar from '$lib/components/Navbar.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<script>
		document.documentElement.classList.add(
			localStorage.getItem('app:theme') ??
				(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
		);
	</script>
</svelte:head>

<div class="page">
    <Navbar/>
    {@render children()}
</div>

<style>
    .page {
        padding: 1rem;
    }
</style>