<script lang="ts">
	import Repset from '$lib/components/RepsetDetails.svelte';
	import RepsetProgress from '$lib/components/RepsetProgress.svelte';
	import { X } from 'lucide-svelte';

	let { data } = $props();
	let workout = $derived(data.userProgram);
</script>

{#if workout}
	<div class="page">
		<h3 style="margin: 1rem;">{workout.title}</h3>
		<div class="container">
			{#each workout.exercices as ex}
				<div class="card">
					<h2 class="title">{ex.title}</h2>
					<div class="details">
						<RepsetProgress repset={ex.repset}  />
					</div>
				</div>
			{/each}
		</div>
	</div>
{/if}

<style>
	.page {
		display: flex;
		flex-direction: column;
		height: 100%;
	}

	.container {
		display: flex;
		overflow: auto;
		gap: 1rem;
		height: 100%;
		width: 100%;
		padding: 0 1rem 1rem 1rem;
		scroll-snap-type: x mandatory;
		scroll-behavior: smooth;

		&::-webkit-scrollbar {
			display: none;
		}
	}

	.card {
		border: 4px solid hsl(0, 0%, 20%);
		border-radius: 15px;
		display: block;
		min-width: 100%;
		scroll-snap-align: center;
	}

	.title {
		margin: 1rem auto;
		margin-bottom: 0;
		width: fit-content;
	}

	.details {
		margin: 1rem;
	}

	.ex-details {
		margin: 0rem 1rem;
		display: flex;
		font-size: 3rem;
		align-items: center;
		justify-content: center;

		div {
			margin: 0 1rem;
		}
	}

	.set {
		display: flex;
	}

	.set-container {
		display: flex;
	}
</style>
