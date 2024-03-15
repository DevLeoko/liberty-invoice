<script lang="ts">
	import type { EditorSelection } from '$lib/utils/EditorSelection'
	import Button from '../../../../lib/components/basics/Button.svelte'
	import Chip from '../../../../lib/components/basics/Chip.svelte'
	import EditorModal from '../../../../lib/components/basics/EditorModal.svelte'
	import Skeleton from '../../../../lib/components/basics/Skeleton.svelte'
	import TaxRateEditor from '../../../../lib/components/editors/TaxRateEditor.svelte'
	import {
		createTaxRateCreateMutation,
		createTaxRateDeleteMutation,
		createTaxRateListQuery,
		createTaxRateUpdateMutation,
	} from '../../../../lib/controller/tax-rate'
	import { t, translateIfFound } from '../../../../lib/stores/settings'
	import type { CreateTaxRate } from '../../../../lib/trpcClient'

	const taxRates = createTaxRateListQuery()

	let selected: EditorSelection<CreateTaxRate> = null

	const createMutation = createTaxRateCreateMutation()
	const updateMutation = createTaxRateUpdateMutation()
	const deleteMutation = createTaxRateDeleteMutation()

	async function onSave() {
		if (selected?.id == undefined) {
			await createMutation(selected!.entity)
		} else {
			await updateMutation({
				...selected!.entity,
				id: selected!.id,
			})
		}
	}

	async function onDelete(id: string) {
		await deleteMutation(id)
	}

	function startCreate() {
		selected = {
			entity: {
				name: '',
				displayText: '',
				rate: 0,
			},
		}
	}
</script>

<EditorModal editor={TaxRateEditor} bind:selected name="taxRates" {onSave} {onDelete} />

<div class="max-w-xs">
	{#if !$taxRates.data}
		<Skeleton class="h-20" />
	{:else}
		<div class="flex flex-col space-y-4">
			<!-- {JSON.stringify($taxRates.data)} -->
			{#each $taxRates.data as taxRate}
				{@const systemTaxRate = taxRate.name.startsWith('taxRate.')}

				<div
					class="flex items-center px-2 py-1 cursor-pointer bg-gray-150 hover:bg-gray-200"
					on:click={systemTaxRate
						? () => {}
						: () => (selected = { id: taxRate.id, entity: { ...taxRate } })}
				>
					<div class="font-medium text-center min-w-[56px]">
						<span>
							{taxRate.rate}%
						</span>
					</div>
					<div class="flex flex-col min-w-0 pl-3 overflow-hidden border-l border-gray-400">
						<h3>
							{$translateIfFound(taxRate.name, 'taxRate')}
						</h3>
						<p class="mb-1 text-sm leading-tight">
							{$translateIfFound(taxRate.displayText, 'taxRate')}
						</p>

						{#if systemTaxRate}
							<Chip snug class="mb-1">Multi-lingual</Chip>
						{/if}
					</div>

					{#if !systemTaxRate}
						<span class="ml-auto text-base material-icons">edit</span>
					{/if}
				</div>
			{/each}

			<Button on:click={startCreate}>{$t('taxRates.newTaxRate')}</Button>
		</div>
	{/if}
</div>
