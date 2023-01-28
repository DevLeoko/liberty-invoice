<script lang="ts">
	import { LOCALES } from '../utils/translations'

	export let selected: string
</script>

<select bind:value={selected} class="border-gray-200 border">
	{#each LOCALES as l}
		<option value={l}>{l}</option>
	{/each}
</select>
