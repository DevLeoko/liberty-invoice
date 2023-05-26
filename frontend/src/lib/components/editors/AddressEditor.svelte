<script lang="ts">
	import { t } from '../../stores/settings'
	import CountryInput from '../CountryInput.svelte'
	import Labeled from '../basics/Labeled.svelte'

	export let entity: {
		street: string
		streetNumber: string
		city: string
		zip: string
		countryCode: string
	}
</script>

<div class="grid grid-cols-2 gap-2">
	<Labeled label={$t('clientEditor.street')}>
		<input type="text" bind:value={entity.street} />
	</Labeled>
	<Labeled label={$t('clientEditor.streetNumber')}>
		<input type="text" bind:value={entity.streetNumber} />
	</Labeled>
	<Labeled label={$t('clientEditor.city')}>
		<input type="text" bind:value={entity.city} />
	</Labeled>
	<Labeled label={$t('clientEditor.zip')}>
		<input type="text" bind:value={entity.zip} />
	</Labeled>
	<Labeled label={$t('clientEditor.country')}>
		<CountryInput bind:countryCode={entity.countryCode} />
	</Labeled>
</div>
