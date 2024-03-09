<script lang="ts">
	import Skeleton from '$lib/components/basics/Skeleton.svelte'
	import ClientCardStatsValue from '$lib/components/clients/ClientCardStatsValue.svelte'
	import {
		createClientToggleArchivedMutation,
		createClientToggleFavoriteMutation,
	} from '$lib/controller/client'
	import { createUserSettingsQuery } from '$lib/controller/user-settings'
	import { formatDate, formatInt, getCurrency } from '$lib/stores/settings'
	import type { ListDetailedClient } from '$lib/trpcClient'
	import { formatClientName } from 'shared/client-formatter'
	import { fly } from 'svelte/transition'

	export let loadingToggleFav: Promise<unknown> | null = null
	export let loadingToggleArchived: Promise<unknown> | null = null
	export let client: ListDetailedClient

	const toggleFavorite = createClientToggleFavoriteMutation()
	const toggleArchive = createClientToggleArchivedMutation()
	const userSettings = createUserSettingsQuery()

	$: currency = $getCurrency($userSettings.data?.defaultCurrency ?? 'USD', true)
</script>

<div
	class="w-full flex flex-col rounded-sm cursor-pointer max-w-[400px] bg-gray-150 hover:bg-gray-200 group"
	transition:fly={{ y: 20, duration: 200 }}
	on:click
>
	<div class="flex gap-2 p-2">
		<div class="flex flex-col mr-auto leading-none">
			<h3 class="text-lg font-semibold">
				{formatClientName(client)} <br />
			</h3>

			<span class="-mt-1 text-sm text-gray-500">
				{client.shorthand} &nbsp;
			</span>
		</div>

		{#await loadingToggleArchived}
			<Skeleton class="w-6 h-6" />
		{:then}
			<span
				class="text-[20px] cursor-pointer material-icons-outlined hover:text-gray-500 text-gray-400"
				on:click|stopPropagation={() =>
					(loadingToggleArchived = toggleArchive({
						id: client.id,
						isArchived: !client.isArchived,
					}))}
			>
				{!client.isArchived ? 'inventory_2' : 'unarchive'}
			</span>
		{/await}

		{#await loadingToggleFav}
			<Skeleton class="w-6 h-6" />
		{:then}
			<span
				class="text-[21px] cursor-pointer material-icons hover:text-blue-500"
				class:text-blue-500={client.isFavorite}
				class:text-gray-400={!client.isFavorite}
				on:click|stopPropagation={() =>
					(loadingToggleFav = toggleFavorite({ id: client.id, isFavorite: !client.isFavorite }))}
			>
				{client.isFavorite ? 'star' : 'star_border'}
			</span>
		{/await}
	</div>

	<div
		class="grid flex-grow grid-cols-2 gap-px bg-gray-300 border-t border-gray-300 xxs:grid-cols-3"
	>
		<ClientCardStatsValue label="client.stats.createdOn">
			{$formatDate(client.createdAt)}
		</ClientCardStatsValue>
		<ClientCardStatsValue label="client.stats.totalInvoiced">
			{currency.format(client.totalAmount || 0)}
		</ClientCardStatsValue>
		<ClientCardStatsValue label="client.stats.invoices">
			{$formatInt(client.invoiceCount)}
		</ClientCardStatsValue>

		<ClientCardStatsValue label="client.stats.lastInvoice">
			{client.lastInvoiceDate ? $formatDate(client.lastInvoiceDate) : '-'}
		</ClientCardStatsValue>
		<ClientCardStatsValue label="client.stats.totalInvoiced" secondaryLabel="client.stats.days90">
			{currency.format(client.totalAmountLast90Days || 0)}
		</ClientCardStatsValue>
		<ClientCardStatsValue label="client.stats.invoices" secondaryLabel="client.stats.days90">
			{$formatInt(client.invoiceCountLast90Days)}
		</ClientCardStatsValue>
	</div>
</div>

<style lang="postcss">
	:global(.client-stats-sub-card) {
		@apply px-2 py-1.5 border border-gray-300 text-gray-500;
	}

	:global(.client-stats-sub-card .value-text) {
		@apply text-lg text-right text-black;
	}
</style>
