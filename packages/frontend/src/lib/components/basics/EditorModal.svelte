<script
	lang="ts"
	generics="E, C extends ComponentType<SvelteComponent<{ entity: E; inputError?: string | null }>>"
>
	import type { EditorSelection } from '$lib/utils/EditorSelection'
	import type { TranslationPaths } from '../../translations/translations'

	import { logSuccess, t } from '../../stores/settings'

	import type { ComponentType, SvelteComponent } from 'svelte'
	import BasicModal from './BasicModal.svelte'
	import Button from './Button.svelte'

	export let editor: C

	let inputError: string | null = null
	let loadingSave = false
	let loadingDelete = false

	$: anyLoading = loadingSave || loadingDelete

	export let name: string

	export let selected: EditorSelection<E> = null

	export let onSave: (selected: { entity: E; id?: string }) => Promise<void>
	export let onDelete: ((id: string) => Promise<void>) | null = null

	function performSave() {
		loadingSave = true
		onSave(selected!)
			.then(() => {
				if (selected!.id === undefined) {
					$logSuccess(`${name}.created` as TranslationPaths)
				} else {
					$logSuccess(`${name}.updated` as TranslationPaths)
				}

				selected = null
			})
			.finally(() => {
				loadingSave = false
			})
	}

	async function performDelete() {
		if (!onDelete) return

		loadingDelete = true
		try {
			await onDelete(selected!.id!)
			selected = null

			$logSuccess(`${name}.deleted` as TranslationPaths)
		} finally {
			loadingDelete = false
		}
	}

	$: title = $t(`${name}.${selected?.id !== undefined ? 'update' : 'create'}` as TranslationPaths)
</script>

{#if selected}
	<BasicModal on:exit={() => (selected = null)} {title}>
		<svelte:component this={editor} bind:entity={selected.entity} bind:inputError />

		{#if inputError}
			<div class="mt-2 text-red-500">{inputError}</div>
		{/if}
		<div class="flex justify-end w-full mt-4" slot="action">
			{#if selected.id !== undefined && onDelete}
				<Button
					outlined
					disabled={anyLoading}
					loading={loadingDelete}
					requiresConfirmation
					on:click={() => performDelete()}
					class="mr-auto"
					red>{$t('general.delete')}</Button
				>
			{/if}

			<Button disabled={loadingSave} on:click={() => (selected = null)} gray
				>{$t('general.cancel')}</Button
			>
			<Button
				loading={loadingSave}
				on:click={() => performSave()}
				disabled={!!inputError || anyLoading}
				class="ml-2">{$t('general.save')}</Button
			>
		</div>
	</BasicModal>
{/if}
