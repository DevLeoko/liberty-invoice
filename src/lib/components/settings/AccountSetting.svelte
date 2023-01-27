<script lang="ts">
	import { account, type AccountDetails } from '../../utils/Account'
	import { getClientDisplayLines } from '../../utils/Client'
	import { t } from '../../utils/i18n'
	import Button from '../Button.svelte'
	import { cloneDeep } from 'lodash'
	import BasicModal from '../BasicModal.svelte'
	import AccountEditor from '../editor/AccountEditor.svelte'

	$: accountLines = getClientDisplayLines($account, $t)

	let editAccount: AccountDetails | null = null

	function startEdit() {
		editAccount = cloneDeep($account)
	}

	function saveChanges() {
		$account = editAccount!
		editAccount = null
	}
</script>

<BasicModal open={editAccount != null} on:exit={() => (editAccount = null)}>
	<svelte:fragment slot="title">Edit your details</svelte:fragment>
	<AccountEditor account={editAccount} />
	<svelte:fragment slot="action">
		<Button on:click={() => (editAccount = null)}>Cancel</Button>
		<Button on:click={saveChanges} class="ml-2">Save</Button>
	</svelte:fragment>
</BasicModal>

<div class="flex flex-col border-l-2 pl-2 border-blue-300">
	{#each accountLines as line}
		<span class="leading-snug">{line}</span>
	{/each}
</div>

<Button class="mt-2" on:click={startEdit}>Edit</Button>
