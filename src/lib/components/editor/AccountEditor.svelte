<script lang="ts">
	import type { AccountDetails } from '../../utils/Client'
	import Labeled from '../Labeled.svelte'
	import ClientEditor from './ClientEditor.svelte'

	export let account: AccountDetails
</script>

<!-- 
  	bankName: string
	Iban: string
	Bic: string
 -->

<div>
	<ClientEditor bind:client={account} />

	<div class="grid grid-cols-2 gap-x-4 gap-y-1 items-end">
		<div class="col-span-2">
			<Labeled label="Logo URL">
				<input type="text" bind:value={account.logoUrl} />
			</Labeled>
		</div>
		<Labeled label="Bank name">
			<input type="text" bind:value={account.bankingDetails.bankName} />
		</Labeled>
		<Labeled label="BIC">
			<input type="text" bind:value={account.bankingDetails.bic} />
		</Labeled>
		<div class="col-span-2">
			<Labeled label="IBAN">
				<input type="text" bind:value={account.bankingDetails.iban} />
			</Labeled>
		</div>
	</div>
</div>
