<script lang="ts">
	import Modal from '../../../lib/components/basics/Modal.svelte'
	import GettingStartedSection from '../../../lib/components/getting-started/GettingStartedSection.svelte'
	import GettingStartedView from '../../../lib/components/getting-started/GettingStartedView.svelte'
	import { createUserSettingsQuery } from '../../../lib/controller/user-settings'

	const userSettings = createUserSettingsQuery()
	const gettingStatedHidden = localStorage.getItem('gettingStartedHidden') == 'true'

	let showGettingStartedModal = false
	let gettingStartedModalOpen = true
	$: {
		if ($userSettings.data) {
			if (!$userSettings.data.name && !$userSettings.data.lastName) {
				showGettingStartedModal = true
			}
		}
	}
</script>

<h1 class="pageTitle">Dashboard</h1>
<!-- <p class="text-sm text-gray-500">Keep track of your invoices and payments with Liberty Invoice.</p> -->

{#if !gettingStatedHidden}
	<GettingStartedSection />

	{#if showGettingStartedModal && gettingStartedModalOpen}
		<Modal>
			<GettingStartedView on:close={() => (showGettingStartedModal = false)} />
		</Modal>
	{/if}
{/if}
