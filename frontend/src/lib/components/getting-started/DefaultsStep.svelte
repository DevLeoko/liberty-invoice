<script lang="ts">
	import { cloneDeep } from 'lodash'
	import {
		createUserSettingsQuery,
		createUserSettingsUpdateMutation,
	} from '../../controller/user-settings'
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

<h2 class="my-2 text-xl font-semibold">Invoice defaults</h2>
<p class="mb-4">You can also adjust these for each client and each invoice.</p>

{#if userEditObject}
	<div class="grid grid-cols-2 gap-2">
		<InvoiceDefaultsEditor bind:entity={userEditObject} />
	</div>
{/if}
