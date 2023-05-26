<script lang="ts">
	import type { CreateClient } from '../../trpcClient'
	import Labeled from '../basics/Labeled.svelte'

	export let entity: {
		street: string
		streetNumber: string
		city: string
		zip: string
		countryCode: string
	}
</script>

<!-- name: string;
shorthand: string;
additionalLine: string;
firstName: string;
lastName: string;
contactPhone: string;
contactEmail: string;
vatNumber: string;
street: string;
streetNumber: string;
city: string;
zip: string;
countryCode: string;
defaultLanguage: string;
defaultCurrency: string;
defaultTaxRateId: number | null;
defaultDueDays: number; -->

<div class="grid grid-cols-2 gap-2">
	<Labeled label="Street">
		<input type="text" bind:value={entity.street} />
	</Labeled>
	<Labeled label="Street number">
		<input type="text" bind:value={entity.streetNumber} />
	</Labeled>
	<Labeled label="City">
		<input type="text" bind:value={entity.city} />
	</Labeled>
	<Labeled label="Zip">
		<input type="text" bind:value={entity.zip} />
	</Labeled>
	<Labeled label="Country code">
		<input type="text" bind:value={entity.countryCode} />
	</Labeled>
</div>
