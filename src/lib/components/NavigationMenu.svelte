<script lang="ts">
	import { base } from '$app/paths';
</script>

<ul>
	<li><a href={base + '/'}>Your Workouts</a></li>
</ul>

<style>
	ul {
		display: flex;
		flex-direction: row nowrap;
		justify-content: space-around;
		background-color: var(--navbar-color);
		padding: 1rem;

		li {
			flex: 1;
			list-style: none;
			align-self: center;
			text-align: center;
			a {
				text-decoration: none;
				color: inherit;
				padding: 1rem;
			}
		}
	}
</style>
