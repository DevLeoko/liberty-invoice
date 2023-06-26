<script lang="ts">
	import { createUserSettingsQuery } from '../../controller/user-settings'

	const userSettings = createUserSettingsQuery()

	let specified = {
		businessName: false,
		address: false,
		bankingDetails: false,
	}

	let specifiedKeys = Object.keys(specified) as (keyof typeof specified)[]

	$: {
		if ($userSettings.data) {
			if ($userSettings.data.name || $userSettings.data.lastName) {
				specified.businessName = true
			}
			if ($userSettings.data.street) {
				specified.address = true
			}
			if ($userSettings.data.iban) {
				specified.bankingDetails = true
			}
		}
	}
</script>

<h2 class="pageSubTitle">Welcome to Liberty Invoice!</h2>

<div class="text-gray-500">
	We're glad you're here. To use the full potential of Liberty Invoice you should specify:

	<div class="flex flex-col">
		{#each specifiedKeys as key}
			<div class="flex items-center {!specified[key] ? 'text-gray-500' : ' text-lime-500'}">
				<span class="mr-1 text-sm material-icons-outlined">
					{#if specified[key]}
						check
					{:else}
						circle
					{/if}
				</span>
				{#if key == 'businessName'}
					Your business name
				{:else if key == 'address'}
					Your address
				{:else if key == 'bankingDetails'}
					Your banking details
				{/if}
			</div>
		{/each}
	</div>

	<Button>Get started</Button>
</div>
