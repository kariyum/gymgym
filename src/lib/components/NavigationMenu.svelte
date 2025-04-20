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
		background-color: var(--navbar-color);
		
		li {
			list-style: none;
			align-self: center;
			text-align: center;
			flex: 1;
			a {
				display: block;
				padding: 1rem;
				text-decoration: none;
				color: inherit;
				padding: 1rem;
			}
		}
	}
</style>
