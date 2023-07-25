<script lang="ts">
	import Button from '../../../../lib/components/basics/Button.svelte'
	import Skeleton from '../../../../lib/components/basics/Skeleton.svelte'
	import InvoiceDefaultsEditor from '../../../../lib/components/editors/InvoiceDefaultsEditor.svelte'
	import {
		createUserSettingsQuery,
		createUserSettingsUpdateMutation,
	} from '../../../../lib/controller/user-settings'
	import { logSuccess, t } from '../../../../lib/stores/settings'
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
	<div class="flex flex-col max-w-md">
		<div class="grid grid-cols-1 gap-4 xs:grid-cols-2">
			<InvoiceDefaultsEditor bind:entity={userEditObject} />
		</div>

		<div class="flex justify-end mt-8">
			<Button loading={$updateSettings.isLoading} on:click={onSave}>{$t('general.save')}</Button>
		</div>
	</div>
{/if}
