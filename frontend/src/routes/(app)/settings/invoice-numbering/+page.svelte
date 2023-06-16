<script lang="ts">
	import Button from '../../../../lib/components/basics/Button.svelte'
	import Labeled from '../../../../lib/components/basics/Labeled.svelte'
	import Skeleton from '../../../../lib/components/basics/Skeleton.svelte'
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
	<div class="flex flex-col w-max">
		<div class="grid grid-cols-2 gap-4">
			<Labeled label={$t('settings.format')}>
				<input type="text" bind:value={userEditObject.idFormat} />
			</Labeled>

			<Labeled label={$t('settings.nextRunningNumber')}>
				<input type="number" step="1" bind:value={userEditObject.nextPartialId} />
			</Labeled>
		</div>

		<div class="flex justify-end mt-8">
			<Button loading={$updateSettings.isLoading} on:click={onSave}>{$t('general.save')}</Button>
		</div>
	</div>
{/if}
