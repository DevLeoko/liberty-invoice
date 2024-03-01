<script lang="ts">
	import { cloneDeep } from 'lodash'
	import {
		createUserSettingsQuery,
		createUserSettingsUpdateMutation,
	} from '../../controller/user-settings'
	import { t } from '../../stores/settings'
	import type { ReadUserSettings } from '../../trpcClient'
	import AddressEditor from '../editors/AddressEditor.svelte'

	const userSettings = createUserSettingsQuery()
	const updateUserSettings = createUserSettingsUpdateMutation()

	let userEditObject: ReadUserSettings | undefined = undefined

	function updateData(data?: ReadUserSettings) {
		if (data) userEditObject = cloneDeep(data)
	}

	$: updateData($userSettings.data)

	export async function saveStep() {
		if (userEditObject) await $updateUserSettings.mutateAsync(userEditObject)
	}
</script>

<h2 class="my-2 text-xl font-semibold">{$t('gettingStarted.stepAddressTitle')}</h2>
<p class="mb-4">{$t('gettingStarted.stepAddressText')}</p>

{#if userEditObject}
	<AddressEditor bind:entity={userEditObject} />
{/if}
