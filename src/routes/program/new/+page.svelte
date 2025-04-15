<script lang="ts">
	import { onMount } from 'svelte';
	import type { Exercice } from '../../+page';
	import { X } from 'lucide-svelte';
	import { page } from '$app/state';
	let { data } = $props();
	let exercices: Exercice[] = $state(data.exercises);
	let selectedExercices: Exercice[] = $state([]);
</script>

<section>
	<form action="">
		<div class="title">
			<label for="name">Program Title</label>
			<input type="text" />
		</div>
		<div class="choice">
			<div class="exercices-section">
				<label for="exercice">Selected Exercices</label>
				<div class="exercices">
					{#each selectedExercices as exercice, i}
						<button class="exercice">
							<div class="name">{exercice.title}</div>
							<div class="detail">
								<div>{exercice.sets}</div>
								<div class="x"><X size="14" /></div>
								<div>{exercice.reps}</div>
							</div>
						</button>
					{/each}
				</div>
			</div>
			<div class="exercices-section">
				<label for="exercice">All Exercices</label>
				<div class="exercices">
					{#each exercices as exercice, i}
						<div class="exercice">
							<div class="name">{exercice.title}</div>
							<div class="detail">
								<div>{exercice.sets}</div>
								<div class="x"><X size="14" /></div>
								<div>{exercice.reps}</div>
							</div>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</form>
</section>

<style>
	.choice {
		display: grid;
		grid-template-columns: 1fr 1fr;
	}
	.exercices-section {
		label {
			margin: 1rem;
		}
		.exercices {
			display: flex;
			flex-direction: column;
			gap: 0.5rem;

			.exercice {
				display: flex;
				justify-content: space-between;
				align-items: center;

				.name {
					padding: 0.5rem 1rem 0.5rem 1rem;
				}

				.detail {
					padding: 0.5rem 1rem 0.5rem 1rem;
					display: flex;
					font-size: larger;
					font-weight: bold;
					align-items: center;
					gap: 0.5rem;
					background-color: var(--orange);
					line-height: 1rem;
					.x {
						line-height: 0;
					}
				}
			}
		}
	}

	section {
		display: flex;
		flex-direction: column;
		height: 100%;
	}

	.exercices {
		height: auto;
	}

	.title {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		margin-bottom: 0.5rem;
		margin: 1rem;

		input {
			padding: 0.5rem;
			border: 2px solid var(--border);
			border-radius: 5px;
			&:focus {
				outline: none;
				outline: 2px solid var(--blue);
			}
		}
	}
</style>
