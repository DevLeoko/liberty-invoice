<script lang="ts">
	export let label: string;
	export let expanded = false;
	export let flatten = false;

	let className = '';

	export { className as class };
</script>

{#if flatten}
	<slot />
{:else}
	<div class="flex flex-col px-4 py-1.5 rounded-md {className}">
		<div
			class="flex items-center cursor-pointer select-none text-slate-500"
			on:click={() => (expanded = !expanded)}
		>
			<span class="text-sm font-semibold">{label}</span>
			<div class="flex-grow h-[2px] mx-2 bg-slate-300" />
			<span class="material-icons">
				{#if expanded}
					expand_less
				{:else}
					expand_more
				{/if}
			</span>
		</div>
		{#if expanded}
			<slot />
		{/if}
	</div>
{/if}
