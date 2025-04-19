<script lang="ts">
	interface Props {
		options: string[] | number[];
	}
	let { options }: Props = $props();
	let selectedIndex = $state(1);
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
	}

	async function selectPrevious() {
		singleElement.classList.remove('flash');
		void singleElement.offsetWidth; // Force reflow
		selectedIndex = Math.max(selectedIndex - 1, 0);
		singleElement.classList.add('flash');
	}

	let container: HTMLDivElement;
	let singleElement: HTMLDivElement;
	let gap: number;
	let singleElementHeight: number;
	let triggerOffset: number;

	$effect(() => {
		gap = parseInt(getComputedStyle(container).gap.slice(0, 2));
		singleElementHeight = singleElement.offsetHeight;
		triggerOffset = Math.round(singleElementHeight / 2 + gap / 2);
		console.log('Trigger offset is ', triggerOffset);
	});
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
			currentPosition = event.touches[0].clientY;
			if (Math.abs(offsetY) >= triggerOffset) {
				if (offsetY > 0) {
					selectNext();
					startPosition = currentPosition + triggerOffset + gap / 2;
				} else {
					selectPrevious();
					startPosition = currentPosition - triggerOffset - gap / 2;
				}
			}
		}
	}}
	onmousemove={(event) => {
		if (dragging) {
			currentPosition = event.clientY;
			if (Math.abs(offsetY) >= triggerOffset) {
				if (offsetY > 0) {
					selectNext();
					startPosition = currentPosition + triggerOffset + gap / 2;
				} else {
					selectPrevious();
					startPosition = currentPosition - triggerOffset - gap / 2;
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
			{options[selectedIndex + 1] ?? ''}
		</div>
		<div bind:this={singleElement}>{options.at(selectedIndex)}</div>
		<div>
			{options[selectedIndex - 1] ?? ''}
		</div>
	</div>
</div>

<style>
	.container {
		overflow: hidden;

		.sets-container {
			touch-action: none;
			display: grid;
			grid-template-rows: 1fr 1fr 1fr;
			gap: 0.1rem;
			font-size: 3rem;

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
