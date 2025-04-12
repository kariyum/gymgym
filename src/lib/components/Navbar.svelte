<script lang="ts">
	import { goto, invalidate, invalidateAll } from '$app/navigation';
	import { onMount } from 'svelte';
	import ThemeToggler from './ThemeToggler.svelte';
</script>

<section class="container">
	<h2>Gymmy</h2>
	<nav>
		<ul>
			<li class="lh-0">
				<ThemeToggler />
			</li>
		</ul>
	</nav>
</section>

<style>
	:global(.theme-icons) {
		width: 1.2rem;
	}

	.lh-0 {
		line-height: 0;
	}

	.home {
		position: relative;
		color: inherit;
	}

	li,
	li > * {
		color: inherit;
	}

	button {
		background-color: transparent;
		border: none;
		margin: 0;
		padding: 0;
		font-weight: normal;
		font-size: medium;

		&:hover {
			background-color: transparent;
		}
	}

	nav {
		margin-left: auto;
	}

	a {
		text-decoration: none;
	}

	nav > ul {
		display: flex;
		justify-content: flex-end;
		align-items: safe center;
		gap: 1rem;
		list-style: none;
	}

	.container {
		display: flex;
		flex-direction: row nowrap;
		align-items: safe center;
		max-width: var(--max-width);
		height: max-content;
		margin: auto;
		border-radius: 7px;
	}

	ul {
		display: flex;
		justify-content: space-around;
		align-items: safe center;
		list-style: none;
		padding: 0;
		margin: auto;
	}

	li,
	button {
		height: fit-content;
		font-size: large;
	}
</style>
