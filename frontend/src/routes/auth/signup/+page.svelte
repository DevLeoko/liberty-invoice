<script lang="ts">
	import { goto } from '$app/navigation'
	import { PUBLIC_GOOGLE_AUTH_CLIENT_ID, PUBLIC_RECAPTCHA_SITE_KEY } from '$env/static/public'
	import { onMount } from 'svelte'
	import Button from '../../../lib/components/basics/Button.svelte'
	import { setLoggedIn } from '../../../lib/stores/auth'
	import { applicationLanguage, logSuccess, t } from '../../../lib/stores/settings'
	import type { TranslationPaths } from '../../../lib/translations/translations'
	import { trpc } from '../../../lib/trpcClient'

	let email = ''
	let password = ''
	let confirmPassword = ''

	let inputIssue: '' | TranslationPaths = ''
	let showIssue = false
	$: {
		if (email === '' || !isValidEmail()) {
			inputIssue = 'auth.emailRequired'
		} else if (password === '') {
			inputIssue = 'auth.passwordRequired'
		} else if (!isPasswordSecure()) {
			inputIssue = 'auth.passwordNotSecure'
		} else if (confirmPassword === '' || password !== confirmPassword) {
			inputIssue = 'auth.passwordsDoNotMatch'
		} else {
			inputIssue = ''
		}
	}

	function isValidEmail() {
		// https://stackoverflow.com/a/46181/2715716
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
	}

	function isPasswordSecure() {
		// Password must be at least 8 characters long and contain at least one number and one letter
		return password.length >= 8 && /\d/.test(password) && /[a-zA-Z]/.test(password)
	}

	let loading = false

	async function register(token: string) {
		loading = true
		await trpc.auth.signUpWithPassword.mutate({ email, password, token }).finally(() => {
			loading = false
		})

		$logSuccess('auth.registrationMailSent')
	}

	async function signUpWithGoogle(response: any) {
		loading = true
		await trpc.auth.loginWithGoogle
			.mutate({ token: response.credential, createAccountIfNotFound: true })
			.finally(() => {
				loading = false
			})
		setLoggedIn()

		goto('/dashboard')
	}

	onMount(() => {
		// @ts-ignore
		window.registerCallback = register
		// @ts-ignore
		window.signUpWithGoogleCallback = signUpWithGoogle

		return () => {
			// @ts-ignore
			delete window.registerCallback
			// @ts-ignore
			delete window.signInWithGoogleCallback
		}
	})

	function registerClick() {
		if (inputIssue) {
			showIssue = true
			return
		}

		// @ts-ignore
		grecaptcha.execute()
	}
</script>

<svelte:head>
	<script src="https://www.google.com/recaptcha/api.js" async defer></script>
	<script src="https://accounts.google.com/gsi/client" async defer></script>
</svelte:head>

<div class="flex flex-col w-[350px]">
	<h1 class="text-3xl font-semibold text-slate-700">{$t('auth.register')}</h1>
	<span class="text-orange-400">
		{inputIssue && showIssue ? $t(inputIssue) : ''}&nbsp;
	</span>
	<input type="text" placeholder={$t('auth.email')} class="mt-2" bind:value={email} />
	<input type="password" placeholder={$t('auth.password')} class="mt-2" bind:value={password} />
	<input
		type="password"
		placeholder={$t('auth.passwordRepeat')}
		class="mt-2"
		bind:value={confirmPassword}
		on:focus={() => (showIssue = true)}
		on:keypress={(e) => e.key === 'Enter' && registerClick()}
	/>
	<div
		class="z-30 g-recaptcha"
		data-sitekey={PUBLIC_RECAPTCHA_SITE_KEY}
		data-callback="registerCallback"
		data-size="invisible"
	/>
	<Button {loading} disabled={!!inputIssue} on:click={registerClick} class="mt-4"
		>{$t('auth.register')}</Button
	>
	<div class="my-2 text-sm text-center text-gray-500">{$t('auth.or')}</div>

	<div
		id="g_id_onload"
		data-client_id={PUBLIC_GOOGLE_AUTH_CLIENT_ID}
		data-context="signup"
		data-ux_mode="popup"
		data-callback="signUpWithGoogleCallback"
		data-itp_support="true"
	/>

	<div
		class="g_id_signin"
		data-type="standard"
		data-shape="rectangular"
		data-theme="outline"
		data-text="signup_with"
		data-size="large"
		data-locale={$applicationLanguage}
		data-logo_alignment="center"
		data-width="350"
	/>

	<div class="mt-4">
		<span>{$t('auth.alreadyHaveAnAccount')}</span>
		<a href="/auth/login" class="text-blue-500">{$t('auth.login')}</a>
	</div>
</div>
