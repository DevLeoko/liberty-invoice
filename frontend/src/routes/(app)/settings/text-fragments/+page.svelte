<script lang="ts">
	import TextFragmentsEditor from '../../../../lib/components/editors/TextFragmentsEditor.svelte'
	import { TEXT_FRAGMENT_NAMES } from '../../../../lib/controller/text-fragment'
	import { applicationLanguage } from '../../../../lib/stores/settings'

	let fragmentLanguage = $applicationLanguage
</script>

<div class="flex flex-col max-w-md space-y-4">
	{#each TEXT_FRAGMENT_NAMES as fragmentName}
		<TextFragmentsEditor {fragmentName} bind:fragmentLanguage />
	{/each}
</div>
