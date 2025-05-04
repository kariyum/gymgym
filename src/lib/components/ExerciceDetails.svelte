<script lang="ts">
	import type { Exercice } from '$lib/schema';
	import Repset from './Repset.svelte';

	let { exercice }: { exercice: Exercice } = $props();
</script>

<div class="container">
	<p>{exercice.title}</p>
	<Repset repset={exercice.repset} />
</div>

<style>
    .container {
        flex-direction: column;
        margin-bottom: 0.5rem;

        p {
            padding: 0.5rem;
            font-size: large;
        }
    }
</style>