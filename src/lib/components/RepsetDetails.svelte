<script lang="ts">
	import type { Repset } from '$lib/schema';
	import { X } from 'lucide-svelte';

	interface Props {
		repset: Repset[];
	}
	let { repset }: Props = $props();
</script>

<div class="container">
	{#each repset as repset}
		<div class="repset">
			<div>{repset.reps.toString().padStart(2, "0")}</div>
			<X size="14" />
			<div>{repset.sets.toString().padStart(2, "0")}</div>
		</div>
	{/each}
</div>

<style>
    .repset {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.container {
		margin: 0 1rem;
	}
</style>