<script lang="ts">
	import { onMount, tick, untrack } from 'svelte';

	interface Props {
		options: string[] | number[];
		selectedIndex?: number;
	}
	let { options, selectedIndex = $bindable(Math.floor(options.length / 2)) }: Props = $props();
	let sections: HTMLDivElement[] = $state([]);

	onMount(() => {
		sections[selectedIndex].scrollIntoView({ behavior: 'instant' });
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					const htmlElement = entry.target as HTMLElement;
					if (entry.isIntersecting) {
						selectedIndex = parseInt(htmlElement.dataset.section ?? '0');
						navigator.vibrate(15);
					}
				});
			},
			{
				threshold: 0.5,
				rootMargin: '0px'
			}
		);

		sections.forEach((section) => {
			observer.observe(section);
		});

		return () => {
			sections.forEach((section) => {
				observer.unobserve(section);
			});
		};
	});
</script>

<div class="container">
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class="sets-container">
		{#each options as opt, section}
			<div
				bind:this={sections[section]}
				data-section={section}
				data-selected={selectedIndex == section}
			>
				{opt.toString().padStart(2, '0')}
			</div>
		{/each}
	</div>
</div>

<style>
	.container {
		width: 100%;
		height: 3rem;

		.sets-container {
			height: 3rem;
			width: 100%;
			overflow: auto;
			scroll-snap-type: y mandatory;
			text-align: center;
			flex: none;
			font-size: 2rem;
			display: flex;
			flex-direction: column;
			gap: 0.5rem;
			padding: 1rem 0;

			&::-webkit-scrollbar {
				display: none;
			}

			& > * {
				color: var(--font-color);
				scroll-snap-align: center;
				flex-grow: 1;
				font-weight: 500;
				min-width: 2ch;
				font-family: monospace;
				transition: color 0.3s ease-in-out;
			}

			& > [data-selected='false'] {
				color: var(--border);
			}
		}
	}
</style>
