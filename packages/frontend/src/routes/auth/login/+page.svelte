<script lang="ts">
	import { goto } from '$app/navigation'
	import { PUBLIC_GOOGLE_AUTH_CLIENT_ID } from '$env/static/public'
	import { onMount } from 'svelte'
	import Button from '../../../lib/components/basics/Button.svelte'
	import { setLoggedIn } from '../../../lib/stores/auth'
	import { applicationLanguage, logSuccess, t } from '../../../lib/stores/settings'
	import type { TranslationPaths } from '../../../lib/translations/translations'
	import { trpc } from '../../../lib/trpcClient'

	let email = ''
	let password = ''

	let inputIssue: '' | TranslationPaths = ''
	let showIssue = false
	$: {
		if (email === '' || !isValidEmail()) {
			inputIssue = 'auth.emailRequired'
		} else if (password === '') {
			inputIssue = 'auth.passwordRequired'
		} else {
			inputIssue = ''
		}
	}

	function isValidEmail() {
		// https://stackoverflow.com/a/46181/2715716
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
	}

	async function checkForVerificationToken() {
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
	}

	onMount(() => {
		checkForVerificationToken()

		// Register signInWithGoogle callback as global function
		// @ts-ignore
		window.signInWithGoogleCallback = signInWithGoogle

		return () => {
			// @ts-ignore
			delete window.signInWithGoogleCallback
		}
	})

	let loading = false

	async function login() {
		if (inputIssue) return

		loading = true
		const { authData } = await trpc.auth.loginWithPassword
			.mutate({ email, password })
			.finally(() => {
				loading = false
			})
		setLoggedIn(authData)

		goto('/dashboard')
	}

	async function signInWithGoogle(response: any) {
		loading = true
		const { authData } = await trpc.auth.loginWithGoogle
			.mutate({ token: response.credential, createAccountIfNotFound: false })
			.finally(() => {
				loading = false
			})
		setLoggedIn(authData)

		goto('/dashboard')
	}
</script>

<svelte:head>
	<script src="https://accounts.google.com/gsi/client" async defer></script>
</svelte:head>

<div class="flex flex-col w-[350px] max-w-full">
	<h1 class="text-xl font-semibold text-slate-700">{$t('auth.login')}</h1>
	<span class="text-orange-400">
		{inputIssue && showIssue ? $t(inputIssue) : ''}&nbsp;
	</span>
	<input type="text" placeholder={$t('auth.email')} class="mt-2" bind:value={email} />
	<input
		type="password"
		placeholder={$t('auth.password')}
		class="mt-2"
		bind:value={password}
		on:focus={() => (showIssue = true)}
		on:keypress={(e) => e.key === 'Enter' && login()}
	/>

	<Button {loading} disabled={!!inputIssue} on:click={login} class="mt-4">{$t('auth.login')}</Button
	>

	<div class="my-2 text-sm text-center text-gray-500">{$t('auth.or')}</div>

	<div
		id="g_id_onload"
		data-client_id={PUBLIC_GOOGLE_AUTH_CLIENT_ID}
		data-context="signin"
		data-ux_mode="popup"
		data-callback="signInWithGoogleCallback"
		data-itp_support="true"
	/>

	<div class="flex justify-center">
		<div
			class="g_id_signin"
			data-type="standard"
			data-shape="rectangular"
			data-theme="outline"
			data-text="signin_with"
			data-size="large"
			data-locale={$applicationLanguage}
			data-logo_alignment="center"
		/>
	</div>

	<div class="mt-4">
		<a href="/auth/reset-password" class="text-blue-500">{$t('auth.forgotPassword')}</a>
	</div>
	<div>
		<span>{$t('auth.noAccount')}</span>
		<a href="/auth/signup" class="text-blue-500">{$t('auth.register')}</a>
	</div>
</div>
