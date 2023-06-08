<script lang="ts">
	import FloatingCard from './FloatingCard.svelte'

	let showFloatingCard = false

	export let triggerClass = ''
</script>

<div class="relative">
	<div on:click={() => (showFloatingCard = true)} class="cursor-pointer {triggerClass}">
		<slot name="trigger" />
	</div>

	{#if showFloatingCard}
		<FloatingCard
			on:clickOutside={() => (showFloatingCard = false)}
			on:click={() => (showFloatingCard = false)}
			class="cursor-default"
		>
			<slot />
		</FloatingCard>
	{/if}
</div>
