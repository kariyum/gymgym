<script lang="ts">
	import { base } from '$app/paths';
	import { page } from '$app/state';

	let { data } = $props();
	let workout = $derived(data.userProgram);
</script>

{#if workout}
	<div class="container">
		<div class="header">
			<h1>{workout.title}</h1>
			<a href={base + `/program/${workout.title}/update`}>Edit</a>
		</div>
		<div class="exercice">
			{#each workout.exercices as ex}
				<p>{ex.reps} x {ex.sets} {ex.title}</p>
			{/each}
		</div>
		<button class="start-action">Start workout</button>
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
		margin: 1rem;

        p {
            margin: 0.5rem 0;
        }
	}
</style>
