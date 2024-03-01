<script lang="ts">
	import NumberInput from '../../basics/NumberInput.svelte'

	export let quantity: number
	export let unit: string

	let className = ''

	export { className as class }
</script>

<div class="flex w-full {className}">
	<NumberInput class="!rounded-r-none -mr-[1px] text-right" bind:value={quantity} />
	<input type="text" class="!rounded-l-none !bg-opacity-20" bind:value={unit} />
</div>
