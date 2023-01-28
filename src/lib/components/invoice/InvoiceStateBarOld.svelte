<script lang="ts">
	let step = 1
</script>

<div class="flex text-white h-7">
	<div class="toggleable" class:active={step == 0}>Edit</div>
	<svg
		viewBox="0 0 30 100"
		preserveAspectRatio="none"
		class:prev-active={step == 0}
		class:next-active={step == 1}
	>
		<polygon points="0,0 30,50 0,100" />
	</svg>
	<div class="toggleable" class:active={step == 1}>Preview</div>
	<svg
		viewBox="0 0 30 100"
		preserveAspectRatio="none"
		class:prev-active={step == 1}
		class:next-active={step == 2}
	>
		<polygon points="0,0 30,50 0,100" />
	</svg>
	<div class="toggleable" class:active={step == 2}>Download</div>
</div>

<style lang="scss">
	.toggleable {
		@apply flex justify-center items-center px-2 bg-blue-300 w-48 cursor-pointer;

		&.active {
			@apply bg-blue-500 font-medium;
		}
	}

	svg {
		@apply bg-blue-300 h-full;

		polygon {
			fill: theme('colors.blue.300');
		}

		&.next-active {
			@apply bg-blue-500;
		}

		&.prev-active {
			polygon {
				fill: theme('colors.blue.500');
			}
		}
	}
</style>
