<script>
	export let height = '100px';

	let className = '';

	export { className as class };
</script>

<div class="skeleton-loader {className}" style="height: {height};" />

<style>
	.skeleton-loader {
		position: relative;
		overflow: hidden;
		background-color: #e0e0e0;
		width: 100%;
		border-radius: 4px;
	}

	.skeleton-loader::after {
		content: '';
		display: block;
		position: absolute;
		top: 0;
		left: -100%;
		width: 50%;
		height: 100%;
		background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.5), transparent);
		animation: loading 1.5s infinite;
	}

	@keyframes loading {
		0% {
			left: -100%;
		}
		100% {
			left: 200%;
		}
	}
</style>
