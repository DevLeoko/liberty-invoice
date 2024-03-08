<script lang="ts">
	import { goto } from '$app/navigation'
	import { onMount } from 'svelte'
	import Button from '../../../lib/components/basics/Button.svelte'
	import { logSuccess, t } from '../../../lib/stores/settings'
	import type { TranslationPaths } from '../../../lib/translations/translations'
	import { trpc } from '../../../lib/trpcClient'

	let email = ''
	let token = ''
	let newPassword = ''
	let confirmPassword = ''

	let inputIssue: '' | TranslationPaths = ''
	$: {
		if (newPassword === '') {
			inputIssue = 'auth.newPasswordRequired'
		} else if (newPassword !== confirmPassword) {
			inputIssue = 'auth.passwordsDoNotMatch'
		} else {
			inputIssue = ''
		}
	}

	let loading = false

	async function resetPassword() {
		loading = true
		await trpc.auth.resetPassword.mutate({ email, token, password: newPassword }).finally(() => {
			loading = false
		})
		$logSuccess('auth.passwordResetSuccess')
		goto('/')
	}

	onMount(() => {
		const urlParams = new URLSearchParams(window.location.search)
		email = urlParams.get('email') || ''
		token = urlParams.get('token') || ''
	})
</script>

<div class="flex flex-col">
	<h1 class="text-xl font-semibold text-slate-700">{$t('auth.resetPassword')}</h1>
	<span class="text-orange-400">
		{inputIssue ? $t(inputIssue) : ''}&nbsp;
	</span>
	<input type="text" placeholder={$t('auth.email')} class="mt-2" bind:value={email} disabled />
	<input
		type="password"
		placeholder={$t('auth.newPassword')}
		class="mt-2"
		bind:value={newPassword}
	/>
	<input
		type="password"
		placeholder={$t('auth.newPasswordRepeat')}
		class="mt-2"
		bind:value={confirmPassword}
	/>
	<Button {loading} disabled={!!inputIssue} on:click={resetPassword} class="mt-4"
		>{$t('auth.resetPassword')}</Button
	>
</div>
