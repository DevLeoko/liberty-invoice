<script lang="ts">
	export let value = ''
	export let minRows = 1
	export let disabled = false
	export let maxRows: number | undefined = undefined

	let className = ''

	export { className as class }

	$: minHeight = `${1 + minRows * 1.2}em`
	$: maxHeight = maxRows ? `${1 + maxRows * 1.2}em` : `auto`
</script>

<div class="container">
	<div
		aria-hidden="true"
		class="input-style text-container"
		style="min-height: {minHeight}; max-height: {maxHeight}"
	>
		{value + '\n'}
	</div>

	<textarea class={className} bind:value></textarea>
</div>

<style>
	.container {
		position: relative;
	}

	.text-container {
		white-space: pre-wrap;
		opacity: 0;
	}

	.text-container,
	textarea {
		overflow: hidden;
	}

	textarea {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		resize: none;
	}
</style>
