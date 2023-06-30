<script lang="ts">
	import { createUserSettingsQuery } from '../../controller/user-settings'
	import Button from '../basics/Button.svelte'
	import Modal from '../basics/Modal.svelte'
	import GettingStartedView from './GettingStartedView.svelte'

	const userSettings = createUserSettingsQuery()

	const firstTimeGettingStarted = localStorage.getItem('firstTimeGettingStarted') != 'false'

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

	let gettingStartedModalOpen = firstTimeGettingStarted

	function closeModal() {
		gettingStartedModalOpen = false
		localStorage.setItem('firstTimeGettingStarted', 'false')
	}
</script>

<h2 class="flex items-center pageSubTitle">Welcome to Liberty Invoice!</h2>

<div class="text-gray-500">
	To use the full potential of Liberty Invoice you should specify:

	<div class="flex flex-col my-2">
		{#each specifiedKeys as key}
			<div class="flex items-center {!specified[key] ? 'text-gray-500' : ' text-lime-500'}">
				<span class="mr-2 text-sm material-icons-outlined">
					{#if specified[key]}
						check
					{:else}
						remove
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

	<Button class="mt-3" outlined on:click={() => (gettingStartedModalOpen = true)}
		>Get started</Button
	>
</div>

{#if gettingStartedModalOpen}
	<Modal>
		<GettingStartedView on:close={closeModal} />
	</Modal>
{/if}
