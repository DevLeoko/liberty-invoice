<script lang="ts">
	import Button from '../../../../lib/components/basics/Button.svelte'
	import Labeled from '../../../../lib/components/basics/Labeled.svelte'
	import Skeleton from '../../../../lib/components/basics/Skeleton.svelte'
	import ClientEditor from '../../../../lib/components/editors/ClientEditor.svelte'
	import { logSuccess, t } from '../../../../lib/stores/settings'
	import {
		createUserSettingsQuery,
		createUserSettingsUpdateMutation,
	} from '../../../../lib/tanQuery'
	import type { ReadUserSettings } from '../../../../lib/trpcClient'

	const userSettings = createUserSettingsQuery()
	const updateSettings = createUserSettingsUpdateMutation()

	let userEditObject: ReadUserSettings | undefined = undefined
	$: {
		userEditObject = $userSettings.data
	}

	async function onSave() {
		if (!userEditObject) return
		await $updateSettings.mutateAsync(userEditObject)
		$logSuccess('settings.saved')
	}
</script>

{#if !userEditObject}
	<Skeleton class="max-w-lg h-80" />
{:else}
	<div class="flex flex-col w-max">
		<div class="flex space-x-8">
			<div class="max-w-lg">
				<h2 class="pageSubTitle">{$t('settings.businessDetails')}</h2>
				<ClientEditor bind:entity={userEditObject} large hideInvoiceDefaults />
			</div>

			<div>
				<h2 class="pageSubTitle">{$t('settings.companyLogo')}</h2>
				<div
					class="h-48 overflow-hidden bg-center bg-no-repeat bg-contain border rounded-md w-80"
					style="background-image: url({userEditObject.logoUrl}); background-size: 80%; "
				>
					<div
						class="flex items-center justify-center h-full transition-opacity opacity-0 cursor-pointer bg-slate-500 bg-opacity-80 hover:opacity-100"
					>
						<div class="flex items-center font-semibold text-white">
							<span class="text-sm material-icons">upload</span>
							{$t('settings.uploadNew')}
						</div>
					</div>
				</div>

				<h2 class="mt-4 pageSubTitle">{$t('settings.bankingDetails')}</h2>
				<div class="grid grid-cols-2 gap-4">
					<Labeled label={$t('settings.bankName')}>
						<input type="text" bind:value={userEditObject.bankName} />
					</Labeled>

					<Labeled label="BIC">
						<input type="text" bind:value={userEditObject.bic} />
					</Labeled>

					<Labeled label="IBAN" class="col-span-2">
						<input type="text" bind:value={userEditObject.iban} />
					</Labeled>
				</div>
			</div>
		</div>

		<div class="flex justify-end mt-8">
			<Button loading={$updateSettings.isLoading} on:click={onSave}>{$t('general.save')}</Button>
		</div>
	</div>
{/if}
