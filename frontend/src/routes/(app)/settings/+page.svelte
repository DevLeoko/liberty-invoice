<script lang="ts">
	import { createMutation, useQueryClient } from '@tanstack/svelte-query'
	import Button from '../../../lib/components/basics/Button.svelte'
	import Labeled from '../../../lib/components/basics/Labeled.svelte'
	import Skeleton from '../../../lib/components/basics/Skeleton.svelte'
	import ClientEditor from '../../../lib/components/editors/ClientEditor.svelte'
	import { logSuccess } from '../../../lib/stores/alerts'
	import { USER_SETTINGS_KEYS, createUserSettingsQuery } from '../../../lib/tanQuery'
	import { trpc, type ReadUserSettings } from '../../../lib/trpcClient'
	import { t } from '../../../lib/stores/settings'

	const userSettings = createUserSettingsQuery()

	let userEditObject: ReadUserSettings | undefined = undefined

	const queryClient = useQueryClient()

	$: {
		userEditObject = $userSettings.data
	}

	const updateSettings = createMutation({
		mutationFn: async (settings: ReadUserSettings) => {
			await trpc.userSettings.update.mutate({
				id: settings.id,
				settings,
			})
		},
		onSuccess: () => {
			queryClient.invalidateQueries(USER_SETTINGS_KEYS.all)
			logSuccess('Settings saved')
		},
	})

	async function onSave() {
		if (!userEditObject) return
		$updateSettings.mutate(userEditObject)
	}
</script>

<h1 class="pageTitle">{$t('menu.settings')}</h1>

{#if !userEditObject}
	<Skeleton class="max-w-lg h-80" />
{:else}
	<div class="flex flex-col w-max">
		<div class="flex space-x-8">
			<div class="max-w-lg">
				<h2 class="pageSubTitle">{$t('settings.accountDetails')}</h2>
				<ClientEditor bind:entity={userEditObject} large />
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

				<h2 class="mt-4 pageSubTitle">{$t('settings.invoiceNumberFormatting')}</h2>
				<div class="grid grid-cols-2 gap-4">
					<Labeled label={$t('settings.format')}>
						<input type="text" bind:value={userEditObject.idFormat} />
					</Labeled>

					<Labeled label={$t('settings.nextRunningNumber')}>
						<input type="number" step="1" bind:value={userEditObject.nextPartialId} />
					</Labeled>
				</div>
			</div>
		</div>

		<div class="flex justify-end mt-8">
			<Button loading={$updateSettings.isLoading} on:click={onSave}>{$t('general.save')}</Button>
		</div>
	</div>
{/if}
