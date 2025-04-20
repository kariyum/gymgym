<script lang="ts">
	import WorkoutManager from '$lib/components/WorkoutManager.svelte';

	let { data } = $props();
</script>

<WorkoutManager exercices={data.exercices} />
