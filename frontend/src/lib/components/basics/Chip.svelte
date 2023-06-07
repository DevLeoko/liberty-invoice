<script lang="ts">
	export let color = 'blue-500'

	let className = ''

	export { className as class }
</script>

<div
	class="px-3 py-1 text-xs font-medium leading-none text-{color} border border-{color} w-max shadow-sm uppercase rounded-full bg-opacity-10 bg-{color} {className}"
>
	<slot />
</div>
