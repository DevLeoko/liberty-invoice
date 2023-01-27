<script lang="ts">
	export let loading = false
	export let disabled = false
	export let outlined = false

	let className = ''

	export { className as class }
</script>

<button
	class="text-white font-medium px-3 py-1 relative {className}"
	class:loading
	class:disabled
	class:outlined
	on:click
>
	{#if loading}
		<div class="absolute inset-0 flex justify-center items-center">
			<div class="lds-ellipsis">
				<div />
				<div />
				<div />
				<div />
			</div>
		</div>
	{/if}
	<div class:invisible={loading}>
		<slot />
	</div>
</button>

<style lang="scss">
	/* Define css variable for color */
	:root {
		--color: theme('colors.blue.500');
		--hover-color: theme('colors.blue.600');
	}

	button {
		background-color: var(--color);

		&:hover {
			background-color: var(--hover-color);
		}

		&.disabled {
			--color: theme('colors.gray.300');
			--hover-color: theme('colors.gray.300');
			pointer-events: none;
			cursor: default;
		}

		&.loading {
			--hover-color: theme('colors.blue.600');
			opacity: 0.7;
			pointer-events: none;
			cursor: default;
		}

		&.outlined {
			background-color: transparent;
			border: 1px solid var(--color);
			color: var(--color);

			&:hover {
				background-color: theme('colors.stone.100');
			}
		}
	}

	.lds-ellipsis {
		opacity: 0.5;
		position: relative;
		display: inline-block;
		width: 75px;
		height: 5px;
	}
	.lds-ellipsis div {
		position: absolute;
		width: 5px;
		height: 5px;
		border-radius: 50%;
		background: #fff;
		animation-timing-function: cubic-bezier(0, 1, 1, 0);
	}

	.outlined .lds-ellipsis {
		opacity: 0.7;
		div {
			background: var(--color);
		}
	}

	.lds-ellipsis div:nth-child(1) {
		left: 8px;
		animation: lds-ellipsis1 0.6s infinite;
	}
	.lds-ellipsis div:nth-child(2) {
		left: 8px;
		animation: lds-ellipsis2 0.6s infinite;
	}
	.lds-ellipsis div:nth-child(3) {
		left: 32px;
		animation: lds-ellipsis2 0.6s infinite;
	}
	.lds-ellipsis div:nth-child(4) {
		left: 56px;
		animation: lds-ellipsis3 0.6s infinite;
	}
	@keyframes lds-ellipsis1 {
		0% {
			transform: scale(0);
		}
		100% {
			transform: scale(1);
		}
	}
	@keyframes lds-ellipsis3 {
		0% {
			transform: scale(1);
		}
		100% {
			transform: scale(0);
		}
	}
	@keyframes lds-ellipsis2 {
		0% {
			transform: translate(0, 0);
		}
		100% {
			transform: translate(24px, 0);
		}
	}
</style>
