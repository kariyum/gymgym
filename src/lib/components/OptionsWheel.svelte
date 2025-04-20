<script lang="ts">
	import { onMount } from "svelte";
	import { Database } from "$lib/db";

	interface Props {
		options: string[] | number[];
		selectedIndex?: number;
	}
	let { 
		options, 
		selectedIndex = $bindable(Math.floor(options.length / 2))
	}: Props = $props();
	
	let dragging = $state(false);
	let startPosition = $state(0);
	let currentPosition = $state(0);
	let offsetY = $derived(currentPosition - startPosition);
	let offsetYcss = $derived(offsetY.toString() + 'px');

	async function selectNext() {
		singleElement.classList.remove('flash');
		void singleElement.offsetWidth; // Force reflow
		selectedIndex = Math.min(selectedIndex + 1, options.length - 1);
		singleElement.classList.add('flash');
		navigator.vibrate(15);
	}

	async function selectPrevious() {
		singleElement.classList.remove('flash');
		void singleElement.offsetWidth; // Force reflow
		selectedIndex = Math.max(selectedIndex - 1, 0);
		singleElement.classList.add('flash');
		navigator.vibrate(15);
	}

	let container: HTMLDivElement;
	let singleElement: HTMLDivElement;
	let gap: number;
	let singleElementHeight: number;
	let triggerOffset: number;
	let database;
	onMount(() => {
		database = Database.getInstance();
		gap = parseInt(getComputedStyle(container).gap.slice(0, 2));
		singleElementHeight = singleElement.offsetHeight;
		triggerOffset = Math.round(singleElementHeight / 2 + gap / 2);
		console.debug('Trigger offset is ', triggerOffset);
		console.debug('Gap is ', gap);
		console.debug('singleElementHeight = ', singleElementHeight);
	});

	function saveProgram() {
	}
</script>

<svelte:document
	onmouseup={(event) => {
		dragging = false;
		offsetY = 0;
	}}
	ontouchend={(event) => {
		dragging = false;
		offsetY = 0;
	}}
	ontouchmove={(event) => {
		if (dragging) {
			const futureDirection = event.touches[0].clientY - startPosition;
			if (offsetY < 0 && selectedIndex == 0 && futureDirection < 0) return;
			if (offsetY > 0 && selectedIndex == options.length - 1 && futureDirection > 0) return;
			currentPosition = event.touches[0].clientY;
			if (Math.abs(offsetY) >= triggerOffset) {
				if (offsetY > 0) {
					selectNext();
					startPosition = currentPosition + triggerOffset;
				} else {
					selectPrevious();
					startPosition = currentPosition - triggerOffset;
				}
			}
		}
	}}
/>

<div class="container">
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		bind:this={container}
		class="sets-container"
		style:--offsetY={offsetYcss}
		style:transition={dragging ? 'none' : 'transform 0.2s ease-in-out'}
		onmousedown={(event) => {
			dragging = true;
			currentPosition = event.clientY;
			startPosition = event.clientY;
		}}
		ontouchstart={(event) => {
			dragging = true;
			currentPosition = event.touches[0].clientY;
			startPosition = event.touches[0].clientY;
		}}
	>
		<div>
			{options[selectedIndex + 1]?.toString().padStart(2, '0') ?? ''}
		</div>
		<div bind:this={singleElement}>{options.at(selectedIndex)?.toString().padStart(2, '0')}</div>
		<div>
			{options[selectedIndex - 1]?.toString().padStart(2, '0') ?? ''}
		</div>
	</div>
</div>

<style>
	.container {
		overflow: hidden;
		height: 4rem;
		width: 100%;

		.sets-container {
			touch-action: none;
			display: grid;
			grid-template-rows: 1fr 1fr 1fr;
			gap: 0.5rem;
			font-size: 2rem;
			overflow: hidden;
			position: relative;
			justify-content: center;
			transform: translateY(var(--offsetY));
			top: -2rem;

			& > :first-child {
				color: var(--border);
			}

			& > :last-child {
				color: var(--border);
			}

			& > * {
				font-weight: 500;
				min-width: 2ch;
				position: relative;
				right: 0;
				text-align: center;
				font-family: monospace;
			}
		}
	}

	:global(.flash) {
		animation: greyFlash 0.5s ease;
	}

	@keyframes greyFlash {
		from {
			color: var(--border);
		}
		to {
			color: white;
		}
	}
</style>
