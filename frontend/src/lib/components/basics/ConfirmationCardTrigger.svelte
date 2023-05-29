<script lang="ts">
	import ConfirmationCard from './ConfirmationCard.svelte'

	let showConfirmationCard = false
</script>

<div class="relative">
	<div on:click={() => (showConfirmationCard = true)}>
		<slot />
	</div>

	{#if showConfirmationCard}
		<ConfirmationCard on:cancel={() => (showConfirmationCard = false)} on:confirm />
	{/if}
</div>
