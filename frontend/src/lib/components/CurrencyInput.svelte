<script lang="ts">
	import { CURRENCIES } from '../../../../shared/currencies'
	import FloatingCard from './basics/FloatingCard.svelte'

	export let value: string

	$: currencyInfo = CURRENCIES.find((c) => c.shorthand === value)
</script>

<!-- TODO: refactor to use FloatingCardTrigger -->
<div
	class="!flex items-center input-style group relative {!currencyInfo ? '!ring-orange-300' : ''}"
>
	<div class="w-8 mr-1 text-center">{currencyInfo?.symbol || ''}</div>
	<div
		class="w-[2px] h-3 bg-gray-300 rounded-sm mr-2 group-focus-within:bg-blue-400 {!currencyInfo
			? '!bg-orange-300'
			: ''}"
	/>
	<input type="string" class="outline-none" bind:value />
	<FloatingCard class="hidden overflow-y-auto group-focus-within:block max-h-64">
		{#each CURRENCIES.filter((c) => c.shorthand
				.toLowerCase()
				.includes(value.toLowerCase())) as currency}
			<button
				class="flex items-center cursor-pointer floating-action"
				on:click={() => (value = currency.shorthand)}
				on:keydown={(e) => e.key === 'Enter' && (value = currency.shorthand)}
				tabindex="0"
			>
				<div class="w-8 mr-1 text-center">{currency.symbol}</div>
				<div class="w-[2px] h-3 bg-gray-300 rounded-sm mr-2" />
				<div>{currency.shorthand}</div>
			</button>
		{/each}
	</FloatingCard>
</div>
