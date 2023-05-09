<script lang="ts">
	import type { CreateInvoiceItem } from '../../trpcClient';

	export let item: CreateInvoiceItem;

	let showDescription = false;

	function removeDescription() {
		item.description = '';
		showDescription = false;
	}
</script>

<tr class="align-top">
	<td>
		<div class="input-style">
			<input type="text" class="plain" bind:value={item.name} />
			{#if showDescription}
				<div class="relative flex pt-1 border-t">
					<textarea
						class="w-full text-sm text-gray-500 plain border-t-1 border-t-gray-400"
						bind:value={item.description}
					/>

					<span
						class="material-icons -ml-4 text-sm !border-l-0 !text-red-500 cursor-pointer"
						on:click={removeDescription}>close</span
					>
				</div>
			{/if}
		</div>
		{#if !showDescription}
			<div class="text-sm text-gray-500 cursor-pointer" on:click={() => (showDescription = true)}>
				<b>+</b> Add description
			</div>
		{/if}
	</td>
	<td>
		<div class="flex">
			<input type="number" class="!rounded-r-none -mr-[1px]" bind:value={item.quantity} />
			<input type="text" class="!rounded-l-none !bg-opacity-20" bind:value={item.unit} />
		</div>
	</td>
	<td>
		<input type="number" bind:value={item.unitPrice} />
	</td>
	<td class="text-right">
		{item.quantity * item.unitPrice}
	</td>
</tr>

<style lang="scss">
	tr:focus-visible,
	tr:hover {
		input {
			background-color: rgba(0, 0, 0, 0.05);
		}
	}
</style>
