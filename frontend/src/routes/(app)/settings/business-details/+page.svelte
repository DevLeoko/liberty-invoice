<script lang="ts">
	import { cloneDeep } from 'lodash'
	import LogoUpload from '../../../../lib/components/LogoUpload.svelte'
	import Button from '../../../../lib/components/basics/Button.svelte'
	import Labeled from '../../../../lib/components/basics/Labeled.svelte'
	import Skeleton from '../../../../lib/components/basics/Skeleton.svelte'
	import ClientBaseDataEditor from '../../../../lib/components/editors/ClientBaseDataEditor.svelte'
	import {
		createUserSettingsQuery,
		createUserSettingsUpdateMutation,
	} from '../../../../lib/controller/user-settings'
	import { logSuccess, t } from '../../../../lib/stores/settings'
	import type { ReadUserSettings } from '../../../../lib/trpcClient'

	const userSettings = createUserSettingsQuery()
	const updateSettings = createUserSettingsUpdateMutation()

	let userEditObject: ReadUserSettings | undefined = undefined

	function updateData(data?: ReadUserSettings) {
		if (data) userEditObject = cloneDeep(data)
	}

	$: updateData($userSettings.data)

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
		<div class="flex flex-col space-y-8 xl:space-y-0 xl:space-x-8 xl:flex-row">
			<div class="max-w-lg">
				<h2 class="pageSubTitle">{$t('settings.businessDetails')}</h2>
				<ClientBaseDataEditor bind:entity={userEditObject} />
			</div>

			<div class="flex flex-col">
				<h2 class="pageSubTitle">{$t('settings.companyLogo')}</h2>
				<LogoUpload />

				<h2 class="pt-8 mt-auto pageSubTitle">{$t('settings.bankingDetails')}</h2>
				<div class="grid grid-cols-1 gap-4 xs:grid-cols-2">
					<Labeled label={$t('settings.bankName')}>
						<input type="text" bind:value={userEditObject.bankName} />
					</Labeled>

					<Labeled label="BIC">
						<input type="text" bind:value={userEditObject.bic} />
					</Labeled>

					<Labeled label="IBAN" class="xs:col-span-2">
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
