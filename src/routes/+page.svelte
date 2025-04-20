<script lang="ts">
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { Database, userProgamsRepo } from '$lib/db.js';
	import type { UserProgram } from '$lib/schema.js';
	import { onMount } from 'svelte';

	let { data } = $props();
	let userPrograms: UserProgram[] = $derived(data.userPrograms);

</script>

<div class="page">
	<div>
		<h3>Saved programs</h3>
		{#if userPrograms.length == 0}
			<p>You have no programs saved yet!</p>
		{:else}
			{#each userPrograms as up}
				<div>{up.title}</div>
				<div>{up.exercices.length}</div>
			{/each}
		{/if}
	</div>

	<button class="add-program-btn" onclick={async () => await goto(base + '/program/new')}
		>Add program</button
	>

	{#each data.data as work}
		<div>
			<div>
				{#each work.exercices as exercice}
					<div>
						<h3>{exercice.title}</h3>
						<p>
							{exercice.sets} sets x {exercice.reps} reps
						</p>
					</div>
				{/each}
			</div>
		</div>
	{/each}
</div>

<style>
	.days-container {
		display: flex;
		width: 100%;
		overflow-x: scroll;
		column-gap: 0.3rem;
		row-gap: 0.5rem;

		&::-webkit-scrollbar {
			display: none;
		}
	}

	.day-btn {
		padding: 0.3rem;
		border-radius: 5px;
		border: 2px solid var(--border);
	}

	.add-program-btn {
		width: 100%;
		padding: 0.5rem;
		border: 2px solid var(--border);
		margin: 0.5rem 0 0.5rem 0;
	}

	.page {
		margin: 1rem;
	}
</style>
