<script lang="ts">
	import { createEventDispatcher } from 'svelte'

	export let label: string
	export let actionText = null as string | null
	export let rightAlign = false

	const eventDispatcher = createEventDispatcher<{ action: void }>()

	let className = ''

	export { className as class }
</script>

<div class="flex flex-col {className}">
	{#if !actionText && !$$slots.action}
		<span class="mb-0.5 text-sm font-semibold {rightAlign ? 'self-end' : ''}">{label}</span>
	{:else}
		<div class="flex items-center justify-between mb-0.5 {rightAlign ? 'flex-row-reverse' : ''}">
			<span class="text-sm font-semibold">{label}</span>
			<span
				class="text-xs font-semibold text-blue-500 cursor-pointer select-none"
				on:click={() => eventDispatcher('action')}
			>
				<slot name="action">{actionText}</slot>
			</span>
		</div>
	{/if}
	<slot />
</div>
