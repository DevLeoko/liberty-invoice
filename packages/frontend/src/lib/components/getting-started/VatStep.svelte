<script lang="ts">
	import {
		createUserSettingsQuery,
		createUserSettingsUpdateMutation,
	} from '../../controller/user-settings'
	import { t } from '../../stores/settings'
	import type { ReadUserSettings } from '../../trpcClient'
	import Labeled from '../basics/Labeled.svelte'

	const userSettings = createUserSettingsQuery()
	const updateUserSettings = createUserSettingsUpdateMutation()

	let bankName = ''
	let bic = ''
	let iban = ''
	let vatNumber = ''

	function updateFetchedDate(data?: ReadUserSettings) {
		bankName = data?.bankName ?? ''
		bic = data?.bic ?? ''
		iban = data?.iban ?? ''
		vatNumber = data?.vatNumber ?? ''
	}

	$: updateFetchedDate($userSettings.data)

	export async function saveStep() {
		const data = {
			bankName,
			bic,
			iban,
			vatNumber,
		}
		await $updateUserSettings.mutateAsync(data)
	}
</script>

<h2 class="my-2 text-xl font-semibold">{$t('gettingStarted.stepVatTitle')}</h2>
<p class="mb-4">{$t('gettingStarted.stepVatText')}</p>

<div class="grid grid-cols-1 xs:grid-cols-2 gap-4">
	<Labeled label={$t('clientEditor.vatId')} class="xs:col-span-2">
		<input type="text" bind:value={vatNumber} />
	</Labeled>

	<Labeled label={$t('settings.bankName')}>
		<input type="text" bind:value={bankName} />
	</Labeled>

	<Labeled label="BIC">
		<input type="text" bind:value={bic} />
	</Labeled>

	<Labeled label="IBAN" class="xs:col-span-2">
		<input type="text" bind:value={iban} />
	</Labeled>
</div>
