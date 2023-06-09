<script lang="ts">
	import TextFragmentEditor from '../../../../lib/components/editors/TextFragmentEditor.svelte'
	import { TEXT_FRAGMENT_NAMES } from '../../../../lib/controller/text-fragment'
	import { applicationLanguage } from '../../../../lib/stores/settings'

	let fragmentLanguage = $applicationLanguage
</script>

<div class="flex flex-col max-w-md space-y-4">
	{#each TEXT_FRAGMENT_NAMES as fragmentName}
		<TextFragmentEditor {fragmentName} bind:fragmentLanguage />
	{/each}
</div>
