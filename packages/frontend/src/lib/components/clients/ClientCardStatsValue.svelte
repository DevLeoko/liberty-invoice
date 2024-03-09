<script lang="ts">
	import { t } from '$lib/stores/settings'
	import type { TranslationPaths } from '$lib/translations/translations'

	export let label: TranslationPaths
	export let secondaryLabel: TranslationPaths | null = null
</script>

<div
	class="flex flex-col items-center justify-center px-2 py-1 bg-gray-100 group-hover:bg-gray-150"
>
	<span class="">
		<slot />
	</span>
	<span class="text-sm text-gray-500">
		{$t(label)}
	</span>

	{#if secondaryLabel}
		<span class="text-xs text-gray-400">
			{$t(secondaryLabel)}
		</span>
	{/if}
</div>
