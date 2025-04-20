<script lang="ts">
	import { onMount } from 'svelte';

	let range = [1, 2, 3, 4];
	let selectedIndex = $state(1);
	let dragging = $state(false);
	let startPosition = $state(0);
	let currentPosition = $state(0);
	let offsetY = $derived(currentPosition - startPosition);

	let offsetYcss = $derived(offsetY.toString() + 'px');

	function selectNext() {
		selectedIndex = Math.min(selectedIndex + 1, range.length - 1);
	}

	function selectPrevious() {
		selectedIndex = Math.max(selectedIndex - 1, 0);
	}

	let container: HTMLDivElement;
	let singleElement: HTMLDivElement;
	let gap: number;
	let singleElementHeight: number;
	let triggerOffset: number;

	onMount(() => {
		gap = parseInt(getComputedStyle(container).gap.slice(0, 2));
		singleElementHeight = parseInt(getComputedStyle(singleElement).height);
		triggerOffset = Math.round(singleElementHeight + gap / 2);
	});
</script>

<svelte:document
	onmouseup={(event) => {
		dragging = false;
		offsetY = 0;
	}}
	onmousemove={(event) => {
		if (dragging) {
			currentPosition = event.clientY;
			if (Math.abs(offsetY) >= triggerOffset) {
				if (offsetY > 0) {
					selectNext();
					startPosition = currentPosition + gap / 2;
				} else {
					selectPrevious();
					startPosition = currentPosition - gap / 2;
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
		style:transition={dragging ? 'none' : 'all 0.2s ease-in-out'}
		onmousedown={(event) => {
			dragging = true;
			currentPosition = event.clientY;
			startPosition = event.clientY;
		}}
	>
		<button onclick={() => selectNext()}>
			{range[selectedIndex + 1] ?? ''}
		</button>
		<div bind:this={singleElement}>{range.at(selectedIndex)}</div>
		<button onclick={() => selectPrevious()}>
			{range[selectedIndex - 1] ?? ''}
		</button>
	</div>
</div>

<style>
	.container {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		overflow: hidden;

		.sets-container {
			display: grid;
			grid-template-rows: 1fr 1fr 1fr;
			gap: 1rem;
			padding: 0.2rem;
			font-size: xx-large;
			transform: translateY(var(--offsetY));

			& > :first-child {
				color: var(--border);
			}

			& > :last-child {
				color: var(--border);
			}

			button {
				background-color: transparent;
				border: none;
				font-size: inherit;
				cursor: auto;
			}

			button:empty {
				visibility: hidden;
			}
		}
	}
</style>
