<script lang="ts" generics="S extends string">
	import CardActionButton from './CardActionButton.svelte'
	import FloatingCardTrigger from './FloatingCardTrigger.svelte'

	export let title: string
	export let selected: S[] = []
	export let options: { value: S }[] = []

	let className = ''

	export { className as class }
</script>

<FloatingCardTrigger>
	<svelte:fragment slot="trigger">
		<div
			class="input-style !ring-0 !border border-dashed border-gray-300 !text-gray-500 !flex items-center gap-1 {className}"
		>
			<span class="text-base material-icons">add_circle_outline</span>
			<span>{title}</span>

			{#if selected.length}
				<div class="w-px h-4 mx-1 bg-gray-300">&nbsp;</div>

				{#each selected as value}
					<slot name="selected" {value} option={options.find((o) => o.value == value)} />
				{/each}
			{/if}
		</div>
	</svelte:fragment>

	<div class="flex flex-col">
		{#each options as option (option.value)}
			<CardActionButton
				on:click={(ev) => {
					ev.stopPropagation()
					if (selected.includes(option.value)) {
						selected = selected.filter((v) => v != option.value)
					} else {
						selected = [...selected, option.value]
					}
				}}
			>
				<input type="checkbox" class="mr-1" checked={selected.includes(option.value)} />

				<slot name="option" {option} />
			</CardActionButton>
		{/each}
	</div>
</FloatingCardTrigger>
