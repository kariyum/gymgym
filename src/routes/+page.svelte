<script lang="ts">
	let { data } = $props();
	let days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
</script>

<div class="days-container">
	{#each days as day}
		<button class="day-btn">{day}</button>
	{/each}
</div>
{#each data.data as work}
	<div>
		<div>
			{#each work.exercices as exercice}
				<div>
					<h3>{exercice.name}</h3>
					<p>
						{exercice.sets} sets x {exercice.reps} reps
					</p>
				</div>
			{/each}
		</div>
	</div>
{/each}

<style>
	.days-container {
		display: flex;
		width: 100%;
		overflow-x: scroll;
        column-gap: 1rem;
        row-gap: 0.5rem;
		
        &::-webkit-scrollbar {
			display: none;
		}
	}

    .day-btn {
        padding: 0.3rem;
        border-radius: 5px;
        border: 2px solid var(--border);
    }
</style>
