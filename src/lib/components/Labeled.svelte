<script lang="ts">
	export let label: string
</script>

<div>
	<div class="flex flex-col">
		<span class="text-xs mb-0.5">{label}</span>
		<slot />
	</div>
</div>
