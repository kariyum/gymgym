<script lang="ts">
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import OptionsWheel from '$lib/components/OptionsWheel.svelte';
	import { Database, userProgamsRepo } from '$lib/db';
	import type { Exercice, Repset, UserProgram } from '$lib/schema';
	import { Minus, Plus, Trash, X } from 'lucide-svelte';

	interface Props {
		exercices: Exercice[];
		workout?: UserProgram;
	}

	let props: Props = $props();
	interface ExtendedExercice {
		exercice: Exercice;
		selected: boolean;
	}
	interface RepsetIndex {
		repIndex: number;
		setIndex: number;
	}
	let availableExercices: ExtendedExercice[] = $derived.by(() => {
		const arr = props.exercices.map((exercice) => {
			const userExercice = props.workout?.exercices?.find((ex) => ex.title == exercice.title);
			if (userExercice) {
				let element = $state({
					exercice: {
						...exercice,
						repset: userExercice.repset
					},
					selected: true
				});
				return element;
			} else {
				let element = $state({
					exercice: exercice,
					selected: false
				});
				return element;
			}
		});
		return arr;
	});

	let exercices: ExtendedExercice[] = $derived(availableExercices);
	// exercices[0].exercice.repset = [
	// 	{
	// 		reps: '1',
	// 		sets: '1'
	// 	},
	// 	{
	// 		reps: '1',
	// 		sets: '1'
	// 	}
	// ];
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
			exercice.exercice.repset = repsetsIndexes.map((repset) => {
				return {
					reps: repOptions.at(repset.repIndex) ?? 'custom undefined',
					sets: setOptions.at(repset.setIndex) ?? 'custom undefined'
				};
			});
		}
	}

	function openExerciceModal(ex: Exercice) {
		repsetsIndexes = ex.repset.map((repset) => {
			return {
				repIndex: repOptions.indexOf(repset.reps),
				setIndex: setOptions.indexOf(repset.sets)
			};
		});
		if (repsetsIndexes.length == 0) {
			resetCustomSet();
		}
		popupExercice = ex;
		dialog.showModal();
		dialogOpen = true;
	}

	let dialog: HTMLDialogElement;
	let dialogOpen: boolean = $state(false);
	let popupExercice: Exercice | undefined = $state();
	let repsetsIndexes: RepsetIndex[] = $state([
		{
			repIndex: 0,
			setIndex: 0
		}
	]);
	let title: string = $derived(props.workout?.title ?? '');
	let redraw: boolean = $state(false);
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
			id: props.workout?.id,
			title: title,
			exercices: selectedExercices
		};
		const db = (await Database.getInstance()).db;
		if (db) {
			await userProgamsRepo.insertUserProgram(db, userProgram);
			if (props.workout && props.workout.id) {
				await goto(base + `/program/${encodeURIComponent(props.workout.id)}/`, {
					invalidateAll: true,
					replaceState: true
				});
			} else {
				await goto(base + '/', { invalidateAll: true, replaceState: true });
			}
		} else {
			console.error('Failed to get db instance to insert user programs');
		}
	}

	function addCustomSet() {
		repsetsIndexes.push({
			repIndex: 0,
			setIndex: 0
		});
	}

	function resetCustomSet() {
		repsetsIndexes = [{ repIndex: 0, setIndex: 0 }];
	}
</script>

<dialog
	bind:this={dialog}
	onclose={() => {
		if (dialog.returnValue === 'OK' && popupExercice) {
			selectExercice(popupExercice.title);
		}
		popupExercice = undefined;
		dialogOpen = false;
		dialog.returnValue = 'NOT OK';
		resetCustomSet();
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
	<form method="dialog">
		{#if dialogOpen}
			{#each repsetsIndexes as repsetIndex, index}
				<div class="dialog-section">
					{#if index > 0}
						<button
							type="button"
							onclick={() => {
								repsetsIndexes.splice(index, 1);
								redraw = !redraw;
							}}
							class="remove-repset"
						>
							<Minus />
						</button>
					{/if}
					{#key redraw}
						<div style="width: 100%;">
							<div class="container">
								<div aria-label="reps">
									<div class="value-container">
										<OptionsWheel options={setOptions} bind:selectedIndex={repsetIndex.setIndex}
										></OptionsWheel>
									</div>
								</div>
								<X size="48" />
								<div aria-label="sets">
									<div class="value-container">
										<OptionsWheel options={repOptions} bind:selectedIndex={repsetIndex.repIndex}
										></OptionsWheel>
									</div>
								</div>
							</div>
							<div class="description">
								<div>Sets</div>
								<div>Reps</div>
							</div>
						</div>
					{/key}
				</div>
			{/each}
			<div class="plus-container">
				<button type="button" class="plus" onclick={() => addCustomSet()}>
					<Plus />
				</button>
			</div>

			<div class="actions">
				<input type="submit" value="OK" />
			</div>
		{/if}
	</form>
</dialog>

<section>
	<form action="" onsubmit={(event) => event.preventDefault()}>
		<div class="form-actions">
			{#if props.workout}
				<button
					onclick={async () => {
						if (!props.workout) return;
						const db = (await Database.getInstance()).db;
						if (!db || !props.workout.id) return;
						userProgamsRepo.deleteUserProgram(db, props.workout.id);
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
							<!-- svelte-ignore a11y_click_events_have_key_events -->
							<!-- svelte-ignore a11y_no_static_element_interactions -->
							<div
								class="selected-exercice-container"
								onclick={() => {
									openExerciceModal(ex);
								}}
							>
								<div class="selected-exercice">
									<div class="exercice">
										<div class="name">{ex.title}</div>
									</div>
								</div>
								<div class="exercice-details">
									{#each ex.repset as repset}
										<div class="repset">
											<div>{repset.reps.toString().padStart(2, '0')}</div>
											<X size="14" />
											<div>{repset.sets.toString().padStart(2, '0')}</div>
										</div>
									{/each}
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
		min-width: 17rem;
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
				input {
					background-color: var(--background-color);
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

	.dialog-section {
		position: relative;
		display: flex;
		width: 100%;
		justify-content: space-around;
		align-items: center;
		padding: 1rem 1rem 0 1rem;
	}

	.plus {
		width: 100%;
		background-color: hsl(100, 0%, 15%);
		display: flex;
		justify-content: center;
		padding: 0.2rem;
		border-radius: 5px;
		border: none;
	}

	.plus-container {
		padding: 1rem;
	}

	.remove-repset {
		position: absolute;
		left: 0.5rem;
		top: 2rem;

		border: none;
		background-color: transparent;
	}

	.exercice-details {
		background-color: hsla(197, 8%, 17%, 0.5);
		padding-left: 1.5rem;
		padding-bottom: 1rem;
		padding-top: 1rem;
		margin: 0 0.5rem;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.repset {
		display: flex;
		gap: 0.5rem;
		align-items: center;
	}

	.selected-exercice-container {
		border: none;
	}
</style>
