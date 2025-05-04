<script lang="ts">
	import type { Repset } from '$lib/schema';
	import OptionsWheel from './OptionsWheel.svelte';

	let { repset }: { repset: Repset[] } = $props();
	let flattenRepsets: string[] = $derived.by(() => {
		return repset.flatMap((rs) => Array(parseInt(rs.sets)).fill(rs.reps));
	});
	let step = $state(0);
</script>

<div class="container">
	{#each flattenRepsets as rep, i}
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div data-current={step == i} class="repset-detail" onclick={() => (step = i)}>
			<div class="details">
				<div class="index">Set {i + 1}</div>
				<div class="reps">{rep} Reps</div>
			</div>
			{#if step == i}
				<div class="set">
					<div class="wheel">
						<OptionsWheel
							options={Array(40)
								.fill(0)
								.map((_, i) => i + 1)}
							selectedIndex={14}
						/>
						<dir>Reps</dir>
					</div>
					<div class="wheel">
						<OptionsWheel
							options={Array(100)
								.fill(0)
								.map((_, i) => (i + 1) * 2.5)}
						/>
						<div>Kg</div>
					</div>
				</div>
			{/if}
		</div>
	{/each}
</div>

<style>
	.repset-detail {
		display: flex;
		gap: 1rem;
		padding: 0.5rem 1rem;
		flex-direction: column;
	}

	.index {
		&::after {
			content: '.';
		}
	}

	.container {
		padding: 1rem 0;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		font-size: 1.5rem;
	}

	div[data-current='true'] {
		background-color: hsl(201, 36%, 34%);
		border-radius: 5px;
	}

	.set {
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-grow: 1;
		flex-direction: row;
		margin: auto;
		gap: 1rem;
	}
	.wheel {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 1rem;
	}
	.details {
		display: flex;
		gap: 1rem;
	}
</style>
