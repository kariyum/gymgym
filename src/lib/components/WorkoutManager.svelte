<script lang="ts">
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import OptionsWheel from '$lib/components/OptionsWheel.svelte';
	import { Database, userProgamsRepo } from '$lib/db';
	import type { Exercice, UserProgram } from '$lib/schema';
	import { Minus, Trash, X } from 'lucide-svelte';

	interface Props {
		exercices: Exercice[];
		workout?: UserProgram;
	}

	let props: Props = $props();
	interface ExtendedExercice {
		exercice: Exercice;
		selected: boolean;
	}
	let availableExercices: ExtendedExercice[] = $derived.by(() => {
		const userExercices = props.workout?.exercices.map((w) => w.title);
		const arr = props.exercices.map((exercice) => {
			let element = $state({
				exercice: exercice,
				selected: userExercices?.includes(exercice.title) ?? false
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

	function deselectExercice(title: string) {
		let exercice = exercices.find((exercice) => exercice.exercice.title == title);
		if (exercice) {
			exercice.selected = false;
		}
	}

	function selectExercice(title: string) {
		let exercice = exercices.find((exercice) => exercice.exercice.title == title);
		if (exercice) {
			exercice.selected = true;
			updateExercice(exercice.exercice);
		}
	}

	function updateExercice(exercice: Exercice) {
		exercice.sets = setOptions[setsValueIndex];
		exercice.reps = repOptions[repsValueIndex];
	}

	function openExerciceModal(ex: Exercice) {
		popupExercice = ex;
		dialog.showModal();
		dialogOpen = true;
	}

	let dialog: HTMLDialogElement;
	let dialogOpen: boolean = $state(false);
	let popupExercice: Exercice | undefined = $state();
	let setsValueIndex: number = $state(0);
	let repsValueIndex: number = $state(0);
	let title: string = $derived(props.workout?.title ?? '');

	const repOptions = Array(15)
		.fill(0)
		.map((_, i) => i + 1)
		.map((x) => x.toString())
		.concat(['+Inf']);
	const setOptions = Array(4)
		.fill(0)
		.map((_, i) => i + 1)
		.map((x) => x.toString());

	async function insertProgram() {
		const userProgram: UserProgram = {
			title: title,
			exercices: selectedExercices
		};
		const db = (await Database.getInstance()).db;
		if (db) {
			userProgamsRepo.insertUserProgram(db, userProgram);
			if (props.workout) {
				await goto(base + `/program/${props.workout.title}`, { invalidateAll: true });
			} else {
				await goto(base + '/', { invalidateAll: true });
			}
		} else {
			console.error('Failed to get db instance to insert user programs');
		}
	}
</script>

<dialog
	bind:this={dialog}
	onclose={() => {
		if (dialog.returnValue === 'OK' && popupExercice) {
			console.debug('Sets = ', setsValueIndex);
			console.debug('Reps = ', repsValueIndex);
			selectExercice(popupExercice.title);
		}
		popupExercice = undefined;
		dialogOpen = false;
		dialog.returnValue = 'NOT OK';
	}}
	onclick={(event) => {
		const dialogDimensions = dialog.getBoundingClientRect();
		if (
			event.clientX < dialogDimensions.left ||
			event.clientX > dialogDimensions.right ||
			event.clientY < dialogDimensions.top ||
			event.clientY > dialogDimensions.bottom
		) {
			dialog.close('NOT OK');
		}
	}}
>
	<!-- Needed because OptionsWheel needs to determine the height
	  of an element when it's mounted to the DOM and not displayed.. -->
	{#if dialogOpen}
		<form method="dialog">
			<div class="container">
				<div aria-label="sets">
					<div class="value-container">
						<OptionsWheel options={repOptions} bind:selectedIndex={repsValueIndex}></OptionsWheel>
					</div>
				</div>
				<X size="48" />
				<div aria-label="reps">
					<div class="value-container">
						<OptionsWheel options={setOptions} bind:selectedIndex={setsValueIndex}></OptionsWheel>
					</div>
				</div>
			</div>
			<div class="description">
				<div>Reps</div>
				<div>Sets</div>
			</div>
			<div class="actions">
				<input type="submit" value="OK" />
			</div>
		</form>
	{/if}
</dialog>

<section>
	<form action="" onsubmit={(event) => event.preventDefault()}>
		<div class="form-actions">
			{#if props.workout}
				<button
					onclick={async () => {
						if (!props.workout) return;
						const db = (await Database.getInstance()).db;
						if (!db) return;
						userProgamsRepo.deleteUserProgram(db, props.workout.title);
						await goto(base + '/', { invalidateAll: true });
					}}
				>
					<Trash />
				</button>
			{/if}
			<input type="submit" value="Save" class="form-submit" onclick={() => insertProgram()} />
		</div>
		<div class="title">
			<label for="program_title">Program Title</label>
			<input type="text" bind:value={title} />
		</div>
		<div class="choice">
			<div class="exercices-section">
				<h2>Selected Exercices</h2>
				<div class="exercices">
					{#if selectedExercices.length != 0}
						{#each selectedExercices as ex}
							<div class="selected-exercice">
								<div class="exercice">
									<div class="name">{ex.title}</div>
								</div>
								<div style="display: flex; gap:1rem;">
									<button
										class="ex-info"
										onclick={() => {
											setsValueIndex = setOptions.indexOf(ex.sets);
											repsValueIndex = repOptions.indexOf(ex.reps);
											openExerciceModal(ex);
										}}
									>
										<div>{ex.reps.toString().padStart(2, '0')}</div>
										<X size="14" />
										<div>{ex.sets.toString().padStart(2, '0')}</div>
									</button>
									<button class="action" onclick={() => deselectExercice(ex.title)}>
										<Minus />
									</button>
								</div>
							</div>
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
									openExerciceModal(ex);
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

			.selected-exercice {
				display: flex;
				justify-content: space-between;
				align-items: center;
				background-color: var(--btn-bg);
				border-radius: 5px;

				.action {
					padding: 0.2rem;
					margin-right: 0.5rem;
					border: 2px solid var(--border);
					line-height: 0;
					border-radius: 5px;
				}
			}

			.exercice {
				border-radius: 5px;
				display: flex;
				justify-content: space-between;
				align-items: center;
				border: none;
				background-color: var(--btn-bg);
				color: canvastext;

				.name {
					padding: 1rem;
					font-size: medium;
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
		margin: 0 1rem;

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

	.ex-info {
		display: flex;
		font-weight: bold;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem;
		border-radius: 5px;
		border: none;
		> * {
			font-size: 1.3rem;
			font-family: monospace;
		}
	}

	.form-submit {
		display: block;
		padding: 0.5rem 1rem;
		background-color: var(--blue);
		border: 2px solid var(--blue);
		border-radius: 5px;
	}

	.form-actions {
		margin-top: 1rem;
		margin-right: 1rem;
		margin-left: auto;
		display: flex;
		justify-content: end;
		gap: 1rem;
		align-items: center;

		button {
			border: none;
			background-color: transparent;
		}
	}
</style>
