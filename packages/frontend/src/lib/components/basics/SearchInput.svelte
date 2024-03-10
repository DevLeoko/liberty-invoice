<script lang="ts">
	import { t } from '$lib/stores/settings'
	import type { TranslationPaths } from '$lib/translations/translations'

	export let placeholder: TranslationPaths
	export let value: string = ''

	let className = ''

	export { className as class }
</script>

<div class="relative {className}">
	<span class="absolute inset-y-0 left-0 flex items-center pl-2">
		<span class="text-lg material-icons">search</span>
	</span>
	<input type="text" bind:value class="!pl-8" placeholder={$t(placeholder)} />
</div>
