<script lang="ts">
	export let label: string;
	let className = '';

	export { className as class };
</script>

<div class="flex flex-col {className}">
	<span class="text-sm font-semibold">{label}</span>
	<slot />
</div>
