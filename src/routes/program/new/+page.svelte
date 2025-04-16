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
	let selectedExercices: Exercice[] = $derived(
		exercices.filter((exercice) => exercice.selected).map((exercice) => exercice.exercice)
	);
	let remainingExercices: Exercice[] = $derived(
		exercices.filter((exercice) => !exercice.selected).map((exercice) => exercice.exercice)
	);

	function toggleExercice(title: string) {
		let exercice = exercices.find((exercice) => exercice.exercice.title == title);
		if (exercice) {
			exercice.selected = !exercice.selected;
		}
	}
	let dialog: HTMLDialogElement;
</script>

<dialog bind:this={dialog}>
	<form method="dialog">
		<div class="container">
			<div aria-label="reps">
				<div>
					<div class="value">4</div>
					<div>Sets</div>
				</div>
			</div>
			<div aria-label="sets">
				<div>
					<div class="value">12</div>
					<div>Reps</div>
				</div>
			</div>
		</div>
		<div class="actions">
			<button>Cancel</button>
			<input type="submit" value="OK" />
		</div>
	</form>
</dialog>

<section>
	<form action="">
		<div class="title">
			<label for="name">Program Title</label>
			<input type="text" />
		</div>
		<div class="choice">
			<div class="exercices-section">
				<h2>Selected Exercices</h2>
				<div class="exercices">
					{#if selectedExercices.length != 0}
						{#each selectedExercices as ex}
							<button class="exercice" onclick={() => toggleExercice(ex.title)}>
								<div class="name">{ex.title}</div>
							</button>
						{/each}
					{:else}
						<div>No exercices were selected</div>
					{/if}
				</div>
			</div>
			<div class="exercices-section">
				<h2>All Exercices</h2>
				<div class="exercices">
					{#if remainingExercices.length != 0}
						{#each remainingExercices as ex}
							<button
								class="exercice"
								onclick={() => {
									dialog.show();
									// toggleExercice(ex.title);
								}}
							>
								<div class="name">{ex.title}</div>
							</button>
						{/each}
					{:else}
						<div>No more remaining exercices</div>
					{/if}
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
	}
	.exercices-section {
		h2 {
			margin: 1rem;
		}

		.exercices {
			display: flex;
			flex-direction: column;
			gap: 0.5rem;
			margin: 1rem;

			.exercice {
				border-radius: 5px;
				display: flex;
				justify-content: space-between;
				align-items: center;
				border: none;

				.name {
					padding: 1rem;
					font-size: medium;
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

	dialog {
		width: 100%;
		height: 100%;
		margin: auto;
		position: absolute;
		top: 0;
		left: 0;
		border: none;

		form {
			height: 100%;

			.container {
				display: flex;
				height: 100%;
			}

			div[aria-label='sets'],
			div[aria-label='reps'] {
				flex: 1;
				display: flex;
				justify-content: center;
				align-items: center;
				height: 100%;

				.value {
					font-size: xx-large;
					font-weight: 500;
				}
			}

			div[aria-label='sets'] {
				background-color: var(--blue);
			}

			div[aria-label='reps'] {
				background-color: var(--orange);
			}

			.actions {
				position: absolute;
				bottom: 1rem;
				left: 50%;
				transform: translateX(-50%);

				button,
				input {
					padding: 0.5rem 1rem;
					width: 5rem;
					border: 0;
				}
			}
		}

		&::backdrop {
			margin: 0;
			padding: 0;
		}
	}
</style>
