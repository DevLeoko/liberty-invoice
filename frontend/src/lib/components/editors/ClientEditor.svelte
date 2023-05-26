<script lang="ts">
	import { t } from '../../stores/settings'
	import type { CreateClient } from '../../trpcClient'
	import Collapsable from '../basics/Collapsable.svelte'
	import Labeled from '../basics/Labeled.svelte'
	import AddressEditor from './AddressEditor.svelte'

	export let entity: CreateClient
	export let large = false
</script>

<div class="grid grid-cols-2 gap-2">
	<div class="flex">
		<Labeled label={$t('clientEditor.companyName')} class="flex-grow mr-2">
			<input type="text" bind:value={entity.name} />
		</Labeled>
		<Labeled label={$t('clientEditor.shorthand')} class="w-1/3">
			<input type="text" bind:value={entity.shorthand} />
		</Labeled>
	</div>

	<Labeled label={$t('clientEditor.additionalLine')}>
		<input type="text" bind:value={entity.additionalLine} />
	</Labeled>

	<Labeled label={$t('clientEditor.firstName')}>
		<input type="text" bind:value={entity.firstName} />
	</Labeled>
	<Labeled label={$t('clientEditor.lastName')}>
		<input type="text" bind:value={entity.lastName} />
	</Labeled>

	<div class="col-span-2 my-6">
		<AddressEditor bind:entity />
	</div>

	<Labeled label={$t('clientEditor.phone')}>
		<input type="text" bind:value={entity.contactPhone} />
	</Labeled>
	<Labeled label={$t('clientEditor.email')}>
		<input type="text" bind:value={entity.contactEmail} />
	</Labeled>

	<Labeled label={$t('clientEditor.vatId')} class="col-span-2">
		<input type="text" bind:value={entity.vatNumber} />
	</Labeled>

	<Collapsable
		label={$t('clientEditor.invoiceDefaults')}
		class="col-span-2 mt-2 bg-slate-100"
		flatten={large}
	>
		{#if large}
			<h2 class="!mb-0 pageSubTitle mt-2">{$t('clientEditor.invoiceDefaults')}</h2>
		{/if}
		<div class="grid w-full grid-cols-2 col-span-2 gap-2 my-2">
			<Labeled label={$t('clientEditor.defaultLanguage')}>
				<input type="text" bind:value={entity.defaultLanguage} />
			</Labeled>

			<Labeled label={$t('clientEditor.defaultCurrency')}>
				<input type="text" bind:value={entity.defaultCurrency} />
			</Labeled>

			<Labeled label={$t('clientEditor.defaultDueDays')}>
				<input type="text" bind:value={entity.defaultDueDays} />
			</Labeled>
		</div>
	</Collapsable>
</div>
