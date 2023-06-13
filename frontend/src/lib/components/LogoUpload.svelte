<script lang="ts">
	import { PUBLIC_BACKEND_URL } from '$env/static/public'
	import { logError, logInfo, logSuccess, t } from '../stores/settings'

	export let fileName: string

	let fileInput: HTMLInputElement
	let reloadToken = '-'

	$: fileExtension = fileName.split('.').pop()

	async function uploadLogo() {
		const file = fileInput.files ? fileInput.files[0] : null

		if (!file) return

		$logInfo('settings.uploading')
		const formData = new FormData()
		formData.append('file', file)
		const response = await fetch(`${PUBLIC_BACKEND_URL}/logo/upload`, {
			method: 'POST',
			body: formData,
			credentials: 'include',
		})
		if (response.ok) {
			reloadToken = Math.random().toString(36).substring(7)
			$logSuccess('settings.uploaded')
		} else {
			$logError('general.error')
		}
	}
</script>

<input
	bind:this={fileInput}
	type="file"
	accept="image/png, image/jpeg"
	class="hidden"
	on:change={uploadLogo}
/>
<div
	class="w-full h-48 overflow-hidden bg-center bg-no-repeat bg-contain border rounded-md"
	style="background-image: url({`${PUBLIC_BACKEND_URL}/logo?extension=${fileExtension}&rand=${reloadToken}`}); background-size: 80%;"
	on:click={() => fileInput.click()}
>
	<div
		class="flex items-center justify-center h-full transition-opacity opacity-0 cursor-pointer bg-slate-500 bg-opacity-80 hover:opacity-100"
	>
		<div class="flex items-center font-semibold text-white">
			<span class="text-sm material-icons">upload</span>
			{$t('settings.uploadNew')}
		</div>
	</div>
</div>
