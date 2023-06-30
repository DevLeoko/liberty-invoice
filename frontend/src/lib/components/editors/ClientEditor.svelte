<script lang="ts">
	import { t } from '../../stores/settings'
	import type { CreateClient } from '../../trpcClient'
	import Collapsable from '../basics/Collapsable.svelte'
	import ClientBaseDataEditor from './ClientBaseDataEditor.svelte'
	import ClientTextFragmentEditor from './ClientTextFragmentEditor.svelte'
	import InvoiceDefaultsEditor from './InvoiceDefaultsEditor.svelte'

	export let entity: CreateClient
	export let large = false
</script>

<div class="flex flex-col space-y-2">
	<ClientBaseDataEditor bind:entity />

	<Collapsable
		label={$t('clientEditor.invoiceDefaults')}
		class="xs:col-span-2 mt-2 bg-slate-100"
		flatten={large}
	>
		{#if large}
			<h2 class="!mb-0 pageSubTitle mt-2">{$t('clientEditor.invoiceDefaults')}</h2>
		{/if}
		<div class="grid w-full grid-cols-1 xs:grid-cols-2 xs:col-span-2 gap-2 my-2">
			<InvoiceDefaultsEditor bind:entity />
		</div>
	</Collapsable>

	<Collapsable
		label={$t('clientEditor.overrideTextFragments')}
		class="xs:col-span-2 mt-2 bg-slate-100"
		flatten={large}
	>
		<ClientTextFragmentEditor
			bind:fragments={entity.textFragments}
			clientLanguage={entity.defaultLanguage}
		/>
	</Collapsable>
</div>
