<script lang="ts">
	import { t } from '../../stores/settings'
	import type { CreateClient } from '../../trpcClient'
	import Labeled from '../basics/Labeled.svelte'
	import AddressEditor from './AddressEditor.svelte'

	// We could also omit defaults
	export let entity: Omit<CreateClient, 'textFragments'>
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
</div>
