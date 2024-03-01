<script lang="ts">
	import { cloneDeep } from 'lodash'
	import {
		createUserSettingsQuery,
		createUserSettingsUpdateMutation,
	} from '../../controller/user-settings'
	import { t } from '../../stores/settings'
	import type { ReadUserSettings } from '../../trpcClient'
	import InvoiceDefaultsEditor from '../editors/InvoiceDefaultsEditor.svelte'

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

<h2 class="my-2 text-xl font-semibold">{$t('gettingStarted.stepDefaultTitle')}</h2>
<p class="mb-4">{$t('gettingStarted.stepDefaultText')}</p>

{#if userEditObject}
	<div class="grid grid-cols-1 xs:grid-cols-2 gap-2">
		<InvoiceDefaultsEditor bind:entity={userEditObject} />
	</div>
{/if}
