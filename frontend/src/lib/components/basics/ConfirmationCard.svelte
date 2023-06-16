<script lang="ts">
	import { createEventDispatcher } from 'svelte'
	import { t } from '../../stores/settings'
	import Button from './Button.svelte'
	import FloatingCard from './FloatingCard.svelte'

	export let loading = false

	const dispatchEvent = createEventDispatcher<{
		confirm: MouseEvent
		cancel: MouseEvent
	}>()

	function handleYes(event: CustomEvent<MouseEvent>) {
		event.stopPropagation()
		dispatchEvent('confirm', event.detail)
	}

	function handleNo(event: CustomEvent<MouseEvent>) {
		event.stopPropagation()
		dispatchEvent('cancel', event.detail)
	}
</script>

<FloatingCard on:clickOutside={handleNo} preferTop>
	<div class="mr-4">{$t('general.areYouSure')}</div>
	<Button snug red {loading} class="mr-2" on:click={handleYes}>{$t('general.yes')}</Button>
	<Button snug gray on:click={handleNo}>{$t('general.cancel')}</Button>
</FloatingCard>
