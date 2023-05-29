<script lang="ts">
	import FloatingCard from './FloatingCard.svelte'

	let showFloatingCard = false
</script>

<div class="relative">
	<div on:click={() => (showFloatingCard = true)}>
		<slot name="trigger" />
	</div>

	{#if showFloatingCard}
		<FloatingCard on:clickOutside={() => (showFloatingCard = false)} class="cursor-default">
			<slot />
		</FloatingCard>
	{/if}
</div>
