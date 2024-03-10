<script lang="ts">
	import Skeleton from './Skeleton.svelte'

	export let icon: string | undefined = undefined

	export let loading = false
</script>

<div on:click class="relative floating-action">
	{#if loading}
		<Skeleton class="!absolute inset-0 opacity-70" />
	{/if}

	{#if icon}
		<span class="mr-1 text-sm material-icons">{icon}</span>
	{/if}
	<slot />
</div>
