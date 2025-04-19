<script lang="ts">
	import OptionsWheel from '$lib/components/OptionsWheel.svelte';
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
	let dialogOpen: boolean = $state(false);
	let popupExercice: Exercice | undefined = $state();
	let sets: number= $state(0);
	let reps: number= $state(0);
</script>

<dialog
	bind:this={dialog}
	onclose={() => {
		if (dialog.returnValue === 'OK' && popupExercice) {
			console.debug('Sets = ', sets);
			console.debug('Reps = ', reps);
			toggleExercice(popupExercice.title);
		}
		popupExercice = undefined;
		dialogOpen = false;
	}}
>
	<!-- Needed because OptionsWheel needs to determine the height
	  of an element when it's mounted to the DOM and not displayed.. -->
	{#if dialogOpen}
		<form method="dialog">
			<div class="container">
				<div aria-label="sets">
					<div class="value-container">
						<OptionsWheel
							options={Array(15).fill(0).map((_, i) => i + 1)}
							bind:selectedIndex={reps}
						></OptionsWheel>
					</div>
				</div>
				<X size="48" />
				<div aria-label="reps">
					<div class="value-container">
						<OptionsWheel options={[1, 2, 3, 4]} bind:selectedIndex={sets}></OptionsWheel>
					</div>
				</div>
			</div>
			<div class="description">
				<div>Reps</div>
				<div>Sets</div>
			</div>
			<div class="actions">
				<button onclick={() => dialog.close('NOT OK')}>Cancel</button>
				<input type="submit" value="OK" />
			</div>
		</form>
	{/if}
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
									popupExercice = ex;
									dialog.showModal();
									dialogOpen = true;
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
		position: absolute;
		width: 15rem;
		top: 50%;
		left: 50%;
		border: 2px solid var(--border);
		overflow: hidden;
		border-radius: 10px;
		transform: translate(-50%, -50%);

		form {
			height: 100%;
			display: flex;
			flex-direction: column;

			.container {
				display: flex;
				flex: 1;
				align-items: center;

				div[aria-label='sets'],
				div[aria-label='reps'] {
					width: 100%;
					justify-content: stretch;
					align-items: stretch;
					height: 100%;

					.value-container {
						display: flex;
						flex-direction: row nowrap;
						justify-content: center;
						align-items: center;
						gap: 1.5rem;
					}
				}

				div[aria-label='sets'] {
					background-color: canvas;
				}

				div[aria-label='reps'] {
					background-color: canvas;
				}
			}

			.description {
				display: flex;
				gap: 1.5rem;

				> * {
					flex: 1;
					text-align: center;
					font-family: monospace;
					margin-bottom: 1rem;
					font-size: large;
				}
			}

			.actions {
				display: flex;
				background-color: var(--background-color);
				button,
				input {
					cursor: pointer;
					flex: 1;
					padding: 0.5rem 1rem;
					width: 5rem;
					border: 0;
				}
			}
		}

		&::backdrop {
			margin: 0;
			padding: 0;
			background-color: rgba(0, 0, 0, 0.6);
			-webkit-backdrop-filter: blur(5px);
			backdrop-filter: blur(2px);
		}
	}
</style>
