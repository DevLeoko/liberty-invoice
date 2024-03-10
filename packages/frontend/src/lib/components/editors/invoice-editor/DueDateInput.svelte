<script lang="ts">
	import CardActionButton from '$lib/components/basics/CardActionButton.svelte'
	import DateInput from '$lib/components/basics/DateInput.svelte'
	import FloatingCardTrigger from '$lib/components/basics/FloatingCardTrigger.svelte'
	import Labeled from '$lib/components/basics/Labeled.svelte'
	import { t } from '$lib/stores/settings'

	export let dueDate: Date
	export let date: Date

	$: dueDays = dueDate
		? Math.round((dueDate.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
		: 0

	const DEFAULT_DUE_DAYS = [0, 7, 14, 30, 90]

	function setDueDate(dueDaysDist: number) {
		const newDueDate = new Date(date.getTime() + dueDaysDist * 24 * 60 * 60 * 1000)
		dueDate = newDueDate
	}
</script>

<Labeled label={$t('invoiceEditor.due')} class="flex-1">
	<svelte:fragment slot="action">
		<FloatingCardTrigger>
			<svelte:fragment slot="trigger">
				<span class="lowercase">
					{#if dueDays == 0}
						{$t('invoiceEditor.today')}
					{:else}
						{$t('invoiceEditor.dueIn', { days: dueDays })}
					{/if}
				</span>
			</svelte:fragment>
			<div class="text-sm">
				<div class="mb-1 font-medium">Set due date to</div>
				{#each DEFAULT_DUE_DAYS as dueDaysDist}
					<CardActionButton on:click={() => setDueDate(dueDaysDist)}>
						{#if dueDaysDist == 0}
							{$t('invoiceEditor.today')}
						{:else}
							{$t('invoiceEditor.dueIn', { days: dueDaysDist })}
						{/if}
					</CardActionButton>
				{/each}
			</div>
		</FloatingCardTrigger>
	</svelte:fragment>

	<DateInput bind:date={dueDate} />
</Labeled>
