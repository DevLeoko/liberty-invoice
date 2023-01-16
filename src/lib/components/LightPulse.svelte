<script lang="ts">
	import { fade } from 'svelte/transition'
</script>

<div class="relative inline-block w-0">
	&nbsp;
	<div
		class="absolute bg-blue-400 rounded-full h-2 w-2 pulse opacity-70 top-1"
		transition:fade={{ duration: 700 }}
	>
		&nbsp;
	</div>
</div>

<style>
	.pulse {
		/* box-shadow: 0 0 8px 4px rgba(54, 54, 54, 0.5); */
		animation: pulse 1.5s infinite;
	}

	@keyframes pulse {
		0% {
			box-shadow: 0 0 2px 0 rgba(37, 150, 255, 0.6);
		}
		90% {
			box-shadow: 0 0 2px 8px rgba(37, 150, 255, 0);
		}
		100% {
			box-shadow: 0 0 0 0 rgba(37, 150, 255, 0);
		}
	}
</style>
