<script lang="ts">
	import Modal from './Modal.svelte'

	export let open = false
</script>

<Modal {open} on:exit>
	<div class="bg-white p-6 flex flex-col">
		<h2 class="text-lg mb-2">
			<slot name="title" />
		</h2>
		<slot />
		<div class="flex justify-end mt-4">
			<slot name="action" />
		</div>
	</div>
</Modal>
