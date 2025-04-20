<script lang="ts">
	import { base } from '$app/paths';
</script>

<ul>
	<li><a href={base + '/'}>Programs</a></li>
	<li><a href={base + '/'}>Stats</a></li>
</ul>

<style>
	ul {
		display: flex;
		flex-direction: row nowrap;
		justify-content: space-around;
		background-color: var(--navbar-color);
		padding: 1rem;

		li {
			list-style: none;
			a {
				text-decoration: none;
				color: inherit;
				padding: 1rem;
			}
		}
	}
</style>
