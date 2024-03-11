<script lang="ts">
	import BasicModal from '$lib/components/basics/BasicModal.svelte'
	import Button from '$lib/components/basics/Button.svelte'
	import { t } from '$lib/stores/settings'
	import { createEventDispatcher } from 'svelte'

	const dispatch = createEventDispatcher()
</script>

<BasicModal on:exit>
	<img src="/logo.svg" alt="logo" class="h-8 mx-auto my-2" />

	<h2 class="w-full mt-4 mb-8 text-lg text-center">
		{$t('supportModal.titleL1')}<br />
		{$t('supportModal.titleL2')}
	</h2>

	<p>
		{$t('supportModal.text')}
	</p>

	<h3 class="mt-4 text-lg font-semibold">{$t('supportModal.discordTitle')}</h3>
	<p>
		{$t('supportModal.discordText')}
	</p>

	<Button href="https://discord.gg/qTU4xKRv9C" target="_blank" class="mt-2 w-max">
		{$t('supportModal.joinDiscord')}
	</Button>

	<h3 class="mt-4 text-lg font-semibold">{$t('supportModal.emailTitle')}</h3>
	<p>
		{$t('supportModal.emailText')}
		<a href="mailto:lets@respark.dev" class="text-blue-500"> lets@respark.dev </a>
	</p>

	<Button on:click={() => dispatch('exit')} gray class="mx-auto mt-6 w-max"
		>{$t('general.close')}</Button
	>
</BasicModal>
