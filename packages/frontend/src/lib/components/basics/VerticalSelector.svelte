<script lang="ts" generics="V">
	export let options: {
		label: string
		value: V
	}[] = []

	export let value: V
</script>

<div class="!flex gap-2">
	{#each options as option}
		<div
			class="px-2 py-0.5 rounded-md cursor-pointer font-medium"
			class:bg-gray-200={option.value === value}
			class:bg-gray-50={option.value !== value}
			class:text-gray-500={option.value !== value}
			on:click={() => (value = option.value)}
		>
			{option.label}
		</div>
	{/each}
</div>
