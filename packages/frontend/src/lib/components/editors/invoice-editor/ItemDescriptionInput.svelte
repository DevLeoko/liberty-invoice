<script lang="ts">
	import { tick } from 'svelte'
	import { slide } from 'svelte/transition'
	import { t } from '../../../stores/settings'
	import { sleep } from '../../../utils/sleep'

	export let name: string
	export let description: string

	let showDescription = !!description
	let focusedInput = false
	let descriptionInput: HTMLTextAreaElement

	function addDescription() {
		showDescription = true
		tick().then(async () => {
			// We are using mosedown to add the description but the click event will unfocus the input if we don't wait
			await sleep(100)
			descriptionInput.focus()
		})
	}

	function removeDescription() {
		description = ''
		showDescription = false
	}

	$: {
		if (description) {
			showDescription = true
		}
	}

	let className = ''

	export { className as class }
</script>

<div class="relative {className}">
	<div class="input-style">
		<div class="flex items-center">
			<slot name="icon" />
			<input
				type="text"
				class="w-full plain"
				bind:value={name}
				on:focusin={() => (focusedInput = true)}
				on:focusout={() => (focusedInput = false)}
			/>
		</div>
		{#if showDescription}
			<div class="relative flex pt-1 border-t">
				<textarea
					bind:this={descriptionInput}
					class="w-full text-sm text-gray-500 plain border-t-1 border-t-gray-400"
					bind:value={description}
				/>

				<span
					class="material-icons self-start -ml-4 text-sm !border-l-0 !text-red-500 cursor-pointer show-on-hover"
					on:click={removeDescription}>close</span
				>
			</div>
		{/if}
	</div>
	{#if !showDescription && focusedInput}
		<div
			class="text-sm text-gray-500 cursor-pointer show-on-focus show-on-focus-mobile"
			on:mousedown={addDescription}
			transition:slide={{ duration: 100 }}
		>
			<b>+</b>
			{$t('invoiceEditor.addDescription')}
		</div>
	{/if}
</div>
