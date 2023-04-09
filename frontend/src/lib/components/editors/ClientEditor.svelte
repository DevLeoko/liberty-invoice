<script lang="ts">
	import type { CreateClient } from '../../trpcClient';
	import Collapsable from '../basics/Collapsable.svelte';
	import Labeled from '../basics/Labeled.svelte';
	import AddressEditor from './AddressEditor.svelte';

	export let entity: CreateClient;
</script>

<!-- name: string;
  shorthand      String
  additionalLine String
  firstName      String
  lastName       String
  contactPhone   String
  contactEmail   String
  vatNumber      String

  street       String
  streetNumber String
  city         String
  zip          String
  countryCode  String

  defaultLanguage  String
  defaultCurrency  String
  defaultTaxRate   TaxRate? @relation(fields: [defaultTaxRateId], references: [id])
  defaultTaxRateId Int?
  defaultDueDays   Int-->

<div class="grid grid-cols-2 gap-2">
	<div class="flex">
		<Labeled label="Company name" class="flex-grow mr-2">
			<input type="text" bind:value={entity.name} />
		</Labeled>
		<Labeled label="Shorthand" class="w-1/3">
			<input type="text" bind:value={entity.shorthand} />
		</Labeled>
	</div>

	<Labeled label="Additional line">
		<input type="text" bind:value={entity.additionalLine} />
	</Labeled>

	<Labeled label="First name">
		<input type="text" bind:value={entity.firstName} />
	</Labeled>
	<Labeled label="Last name">
		<input type="text" bind:value={entity.lastName} />
	</Labeled>

	<div class="col-span-2 my-6">
		<AddressEditor bind:entity />
	</div>

	<Labeled label="Phone">
		<input type="text" bind:value={entity.contactPhone} />
	</Labeled>
	<Labeled label="Email">
		<input type="text" bind:value={entity.contactEmail} />
	</Labeled>

	<Labeled label="VAT number" class="col-span-2">
		<input type="text" bind:value={entity.vatNumber} />
	</Labeled>

	<Collapsable label="Invoice defaults" class="col-span-2 mt-2 bg-slate-100">
		<div class="grid grid-cols-2 gap-2 my-2">
			<Labeled label="Default language">
				<input type="text" bind:value={entity.defaultLanguage} />
			</Labeled>

			<Labeled label="Default currency">
				<input type="text" bind:value={entity.defaultCurrency} />
			</Labeled>

			<Labeled label="Default due days">
				<input type="text" bind:value={entity.defaultDueDays} />
			</Labeled>
		</div>
	</Collapsable>
</div>
