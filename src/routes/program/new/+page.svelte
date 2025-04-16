<script lang="ts">
	import type { Exercice } from '../../+page';
	import { X } from 'lucide-svelte';
	let { data } = $props();
	interface ExtendedExercice {
		exercice: Exercice;
		selected: boolean;
	}
	let availableExercices: ExtendedExercice[] = $derived.by(() => {
		const arr = data.exercises.map((exercice) => {
			let element = $state({
				exercice: exercice,
				selected: false
			});
			return element;
		});
		return arr;
	});

	let exercices: ExtendedExercice[] = $derived(availableExercices);

	function toggleExercice(index: number) {
		if (index <= exercices.length) {
			exercices[index].selected = !exercices[index].selected;
		}
	}
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
					{#each exercices as exercice, i}
						{#if exercice.selected}
							{@const ex = exercice.exercice}
							<button class="exercice" onclick={() => toggleExercice(i)}>
								<div class="name">{ex.title}</div>
								<div class="detail">
									<div>{ex.sets}</div>
									<div class="x"><X size="14" /></div>
									<div>{ex.reps}</div>
								</div>
							</button>
						{/if}
					{/each}
				</div>
			</div>
			<div class="exercices-section">
				<label for="exercice">All Exercices</label>
				<div class="exercices">
					{#each exercices as exercice, i}
						{#if !exercice.selected}
							{@const ex = exercice.exercice}
							<button class="exercice" onclick={() => toggleExercice(i)}>
								<div class="name">{ex.title}</div>
								<div class="detail">
									<div>{ex.sets}</div>
									<div class="x"><X size="14" /></div>
									<div>{ex.reps}</div>
								</div>
							</button>
						{/if}
					{/each}
				</div>
			</div>
		</div>
	</form>
</section>

<style>
	.choice {
		display: flex;
		flex-direction: column;
		overflow-y: auto;
		gap: 1rem;
	}
	.exercices-section {
		label {
			padding: 1rem;
			margin-bottom: 1rem;
		}
		.exercices {
			display: flex;
			flex-direction: column;
			gap: 0.5rem;

			.exercice {
				display: flex;
				justify-content: space-between;
				align-items: center;
				border: none;

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
