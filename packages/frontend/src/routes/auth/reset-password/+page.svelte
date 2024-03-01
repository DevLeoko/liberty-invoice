<script lang="ts">
	import { goto } from '$app/navigation'
	import { PUBLIC_RECAPTCHA_SITE_KEY } from '$env/static/public'
	import { onMount } from 'svelte'
	import Button from '../../../lib/components/basics/Button.svelte'
	import { logSuccess, t } from '../../../lib/stores/settings'
	import type { TranslationPaths } from '../../../lib/translations/translations'
	import { trpc } from '../../../lib/trpcClient'

	let email = ''

	let inputIssue: '' | TranslationPaths = ''
	$: {
		if (email === '') {
			inputIssue = 'auth.emailRequired'
		} else {
			inputIssue = ''
		}
	}

	let loading = false

	async function resetPassword(token: string) {
		loading = true
		await trpc.auth.requestPasswordReset.mutate({ email, token }).finally(() => {
			loading = false
		})

		$logSuccess('auth.passwordResetPotentiallyRequested', {}, 10000)
	}

	onMount(() => {
		// @ts-ignore
		window.resetPasswordCallback = resetPassword

		return () => {
			// @ts-ignore
			delete window.resetPasswordCallback
		}
	})

	function resetPasswordClick() {
		// @ts-ignore
		grecaptcha.execute()
	}
</script>

<svelte:head>
	<script src="https://www.google.com/recaptcha/api.js" async defer></script>
</svelte:head>

<div class="flex flex-col">
	<div class="flex items-center">
		<span class="material-icons back-nav" on:click={() => goto('/auth/login')}>arrow_back</span>
		<h1 class="text-3xl font-semibold text-slate-700">{$t('auth.forgetPasswordTitle')}</h1>
	</div>
	<p>
		{$t('auth.forgotPasswordInfo')}
	</p>

	<span class="text-orange-400">
		{inputIssue ? $t(inputIssue) : ''}&nbsp;
	</span>
	<input type="text" placeholder={$t('auth.email')} class="mt-2" bind:value={email} />
	<div
		class="z-30 g-recaptcha"
		data-sitekey={PUBLIC_RECAPTCHA_SITE_KEY}
		data-callback="resetPasswordCallback"
		data-size="invisible"
	/>
	<Button {loading} disabled={!!inputIssue} on:click={resetPasswordClick} class="mt-4"
		>{$t('auth.forgotPasswordButton')}</Button
	>
</div>
