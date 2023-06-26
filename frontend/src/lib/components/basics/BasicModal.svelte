<script lang="ts">
	import Modal from './Modal.svelte'
	export let zLevel = 50

	export let title = ''
</script>

<Modal on:exit {zLevel}>
	<div class="flex flex-col p-6 pt-4 bg-white rounded-md" style="width: 600px;">
		<h2 class="mb-2 text-lg">
			<slot name="title">
				{title}
			</slot>
		</h2>
		<slot />
		<div class="flex justify-end pt-4">
			<slot name="action" />
		</div>
	</div>
</Modal>
