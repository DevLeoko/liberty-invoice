<script lang="ts">
	import type { ClientDetails } from '../../utils/Client'
	import Labeled from '../Labeled.svelte'

	export let client: ClientDetails
</script>

<!-- interface ClientDetails {
	name?: string
	additionalLine?: string
	firstName?: string
	lastName?: string
	phone?: string
	email?: string
	address?: Address
	vatNumber?: string
} -->

<div class="grid grid-cols-2 gap-x-4 gap-y-1 items-end">
	<div class="flex">
		<Labeled label="Company name">
			<input type="text" bind:value={client.name} />
		</Labeled>
		<Labeled label="Shorthand">
			<input type="text" class="w-16" bind:value={client.shorthand} />
		</Labeled>
	</div>
	<Labeled label=" ">
		<input type="text" bind:value={client.additionalLine} />
	</Labeled>
	<Labeled label="First name">
		<input type="text" bind:value={client.firstName} />
	</Labeled>
	<Labeled label="Last name">
		<input type="text" bind:value={client.lastName} />
	</Labeled>
	<Labeled label="Phone">
		<input type="tel" bind:value={client.phone} />
	</Labeled>
	<Labeled label="Email">
		<input type="email" bind:value={client.email} />
	</Labeled>
	<Labeled label="Street">
		<input type="text" bind:value={client.address.street} />
	</Labeled>
	<Labeled label="Street number">
		<input type="text" bind:value={client.address.streetNumber} />
	</Labeled>
	<Labeled label="City">
		<input type="text" bind:value={client.address.city} />
	</Labeled>
	<Labeled label="Country">
		<input type="text" bind:value={client.address.countryCode} />
	</Labeled>
	<Labeled label="Postal code">
		<input type="text" bind:value={client.address.city} />
	</Labeled>
	<div class="col-span-2">
		<Labeled label="VAT number">
			<input type="text" bind:value={client.vatNumber} />
		</Labeled>
	</div>
</div>
