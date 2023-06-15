<script lang="ts">
	import Button from '../../../../lib/components/basics/Button.svelte'
	import type { EditorSelection } from '../../../../lib/components/basics/EditorModal.svelte'
	import EditorModal from '../../../../lib/components/basics/EditorModal.svelte'
	import Skeleton from '../../../../lib/components/basics/Skeleton.svelte'
	import TaxRateEditor from '../../../../lib/components/editors/TaxRateEditor.svelte'
	import {
		createTaxRateCreateMutation,
		createTaxRateDeleteMutation,
		createTaxRateListQuery,
		createTaxRateUpdateMutation,
	} from '../../../../lib/controller/tax-rate'
	import { t } from '../../../../lib/stores/settings'
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

	async function onDelete(id: number) {
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
				<div
					class="flex items-center px-2 py-1 bg-gray-200 cursor-pointer hover:bg-gray-300"
					on:click={() => (selected = { id: taxRate.id, entity: { ...taxRate } })}
				>
					<div class="font-medium text-center w-14">
						<span>
							{taxRate.rate}%
						</span>
					</div>
					<div class="pl-3 border-l border-gray-400">
						<h3>{taxRate.name}</h3>
						<p class="mb-1 text-sm leading-tight">{taxRate.displayText}</p>
					</div>

					<span class="ml-auto text-base material-icons">edit</span>
				</div>
			{/each}

			<Button on:click={startCreate}>{$t('taxRates.newTaxRate')}</Button>
		</div>
	{/if}
</div>
