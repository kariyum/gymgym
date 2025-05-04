<script lang="ts">
	import { base } from '$app/paths';
	import { page } from '$app/state';
	import ExerciceDetails from '$lib/components/ExerciceDetails.svelte';
	import Repset from '$lib/components/RepsetDetails.svelte';
	import { X } from 'lucide-svelte';

	let { data } = $props();
	let workout = $derived(data.userProgram);
</script>

{#if workout}
	<div class="container">
		<div class="header">
			<h1>{workout.title}</h1>
			<a href={base + `/program/${encodeURIComponent(workout.id ?? 0)}/update`}>Edit</a>
		</div>
		<div class="exercice">
			{#each workout.exercices as ex}
				<ExerciceDetails exercice={ex} />
			{/each}
		</div>
		<a href={`${base}/program/${encodeURIComponent(workout.id ?? 0)}/progress`} class="start-action"
			>Start workout</a
		>
	</div>
{:else}
	Workout '{page.params.title}' not found...
{/if}

<style>
	.header {
		display: flex;
		justify-content: space-between;
	}

	a {
		text-decoration: none;
		color: var(--font-color);
		padding: 0.5rem 1rem;
		display: block;
		background-color: var(--btn-bg);
		width: fit-content;
		border-radius: 5px;
		border: 2px solid var(--border);
	}

	.start-action {
		padding: 0.5rem 1rem;
		border: 2px solid var(--border);
		border-radius: 5px;
		display: block;
		margin-left: auto;
	}
	.container {
		margin: 1rem;
	}

	.exercice {
		margin: 0.5rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
</style>
