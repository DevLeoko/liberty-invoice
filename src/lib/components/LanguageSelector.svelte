<script lang="ts">
	import { locale } from '../utils/i18n'
	import { LOCALES } from '../utils/translations'
</script>

<select bind:value={$locale} class="border-gray-200 border">
	{#each LOCALES as l}
		<option value={l}>{l}</option>
	{/each}
</select>
