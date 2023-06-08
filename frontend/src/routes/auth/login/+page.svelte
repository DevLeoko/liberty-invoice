<script lang="ts">
	import { goto } from '$app/navigation'
	import { onMount } from 'svelte'
	import Button from '../../../lib/components/basics/Button.svelte'
	import { setLoggedIn } from '../../../lib/stores/auth'
	import { logSuccess, t } from '../../../lib/stores/settings'
	import type { TranslationPaths } from '../../../lib/translations/translations'
	import { trpc } from '../../../lib/trpcClient'

	let email = ''
	let password = ''

	let inputIssue: '' | TranslationPaths = ''
	$: {
		if (email === '') {
			inputIssue = 'auth.emailRequired'
		} else if (password === '') {
			inputIssue = 'auth.passwordRequired'
		} else {
			inputIssue = ''
		}
	}

	onMount(async () => {
		// Get token from url
		const urlParams = new URLSearchParams(window.location.search)
		const token = urlParams.get('token')
		const urlEmail = urlParams.get('email')

		if (token && urlEmail) {
			email = urlEmail
			await trpc.auth.verifyEmail.mutate({ token, email: urlEmail })
			$logSuccess('auth.emailVerified')

			// Clear url params
			window.history.replaceState({}, document.title, '/')
		}
	})

	let loading = false

	async function login() {
		loading = true
		await trpc.auth.loginWithPassword.mutate({ email, password }).finally(() => {
			loading = false
		})
		setLoggedIn()

		goto('/dashboard')
	}
</script>

<div class="flex flex-col">
	<h1 class="text-3xl font-semibold text-slate-700">{$t('auth.login')}</h1>
	<span class="text-orange-400">
		{inputIssue ? $t(inputIssue) : ''}&nbsp;
	</span>
	<input type="text" placeholder={$t('auth.email')} class="mt-2" bind:value={email} />
	<input type="password" placeholder={$t('auth.password')} class="mt-2" bind:value={password} />
	<Button {loading} disabled={!!inputIssue} on:click={login} class="mt-4">{$t('auth.login')}</Button
	>

	<div class="mt-4">
		<a href="/auth/reset-password" class="text-blue-500">{$t('auth.forgotPassword')}</a>
	</div>
	<div>
		<span>{$t('auth.noAccount')}</span>
		<a href="/auth/register" class="text-blue-500">{$t('auth.register')}</a>
	</div>
</div>
