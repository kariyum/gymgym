<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	function getTheme() {
		if (browser) {
			return (
				localStorage.getItem('app:theme') ??
				(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
			);
		}
		return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
	}

	let theme: string | undefined = $state();

	const toggleTheme = () => {
		if (theme) {
			document.documentElement.classList.remove(theme);
			theme = theme === 'light' ? 'dark' : 'light';
			document.documentElement.classList.add(theme);
			localStorage.setItem('app:theme', theme);
		}
	};

	onMount(() => {
		theme = getTheme();
	});
</script>

<button
	onclick={toggleTheme}
	class="lh-0 outline-none"
	aria-label="Toggle dark mode"
	aria-pressed={theme === 'dark'}
>
</button>

<style>
	.lh-0 {
		background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>');
		aspect-ratio: 1 / 1;
		background-size: cover;
		width: 1.2rem;
		line-height: 0;

		:global(.dark) & {
			background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>');
		}
	}

	.outline-none {
		outline: none;
	}

	button {
		background-color: transparent;
		border: none;
		margin: 0;
		padding: 0;
		height: fit-content;
		font-size: large;
		line-height: 0;
		cursor: pointer;

		&:hover {
			background-color: transparent;
		}
	}
</style>
