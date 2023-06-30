<script lang="ts">
	import {
		createUserSettingsQuery,
		createUserSettingsUpdateMutation,
	} from '../../controller/user-settings'
	import { t } from '../../stores/settings'
	import type { ReadUserSettings } from '../../trpcClient'
	import LogoUpload from '../LogoUpload.svelte'
	import Labeled from '../basics/Labeled.svelte'

	const userSettings = createUserSettingsQuery()
	const updateUserSettings = createUserSettingsUpdateMutation()

	let companyName = ''
	let firstName = ''
	let lastName = ''

	function updateFetchedDate(data?: ReadUserSettings) {
		companyName = data?.name ?? ''
		firstName = data?.firstName ?? ''
		lastName = data?.lastName ?? ''
	}

	$: updateFetchedDate($userSettings.data)

	export async function saveStep() {
		const data = {
			name: companyName,
			firstName,
			lastName,
		}
		await $updateUserSettings.mutateAsync(data)
	}
</script>

<h2 class="my-2 text-xl font-semibold">{$t('gettingStarted.stepNameTitle')}</h2>
<p class="mb-4">
	{$t('gettingStarted.stepNameText')}
</p>

<div class="grid grid-cols-2 gap-2">
	<Labeled label={$t('clientEditor.companyName')} class="col-span-2">
		<input type="text" bind:value={companyName} />
	</Labeled>

	<Labeled label={$t('clientEditor.firstName')}>
		<input type="text" bind:value={firstName} />
	</Labeled>
	<Labeled label={$t('clientEditor.lastName')}>
		<input type="text" bind:value={lastName} />
	</Labeled>

	<Labeled label={$t('settings.companyLogo')} class="col-span-2">
		<LogoUpload />
	</Labeled>
</div>
