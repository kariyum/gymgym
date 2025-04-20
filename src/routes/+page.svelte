<script lang="ts">
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import type { UserProgram } from '$lib/schema.js';
	import { Plus } from 'lucide-svelte';

	let { data } = $props();
	let userPrograms: UserProgram[] = $derived(data.userPrograms);
</script>

<div class="page">
	<div>
		<h3>Saved Workouts</h3>
		{#if userPrograms.length == 0}
			<p>You have no programs saved yet!</p>
		{:else}
			{#each userPrograms as up, i}
				<a href={base + '/program/' + encodeURIComponent(up.title)} class="exercice">
					<h3>{up.title}</h3>
					<div style="margin-left: 1rem;">
						{#each up.exercices as ex}
							<p>{ex.reps} x {ex.sets} {ex.title}</p>
						{/each}
					</div>
				</a>
				{#if i < userPrograms.length - 1}
					<hr />
				{/if}
			{/each}
		{/if}
	</div>

	<button class="add-program-btn" onclick={async () => await goto(base + '/program/new')}>
		<Plus size="16" />
		<div>Add workout</div>
	</button>
</div>

<style>
	hr {
		border: 1px solid var(--border);
		opacity: 0.3;
		border-radius: 10px;
	}
	h3 {
		margin-bottom: 0.5rem;
	}
	.exercice {
		margin: 1rem 0rem;
		display: block;
		color: var(--font-color);
		text-decoration: none;
		p {
			margin: 0.5rem 0;
		}
	}
	.add-program-btn {
		width: 100%;
		padding: 0.5rem;
		border: 2px solid var(--border);
		margin: 0.5rem 0 0.5rem 0;
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 0.5rem;
	}

	.page {
		margin: 1rem;
	}
</style>
