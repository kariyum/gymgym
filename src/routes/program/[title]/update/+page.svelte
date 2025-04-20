<script lang="ts">
	import { page } from '$app/state';
	import WorkoutManager from '$lib/components/WorkoutManager.svelte';

	let { data } = $props();
	let workout = $derived(data.userProgram);
</script>

{#if workout}
	<WorkoutManager exercices={data.exercices} {workout} />
{:else}
	<div>Workout '{page.params.title}' not found...</div>
{/if}
