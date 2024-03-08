<script lang="ts">
	import { PUBLIC_GOOGLE_AUTH_CLIENT_ID, PUBLIC_RECAPTCHA_SITE_KEY } from '$env/static/public'
	import { onMount } from 'svelte'
	import ConsentCheckBoxes from '../../../lib/components/auth/ConsentCheckBoxes.svelte'
	import BasicModal from '../../../lib/components/basics/BasicModal.svelte'
	import Button from '../../../lib/components/basics/Button.svelte'
	import { applicationLanguage, t } from '../../../lib/stores/settings'
	import type { TranslationPaths } from '../../../lib/translations/translations'
	import { trpc } from '../../../lib/trpcClient'

	let email = ''
	let password = ''
	let confirmPassword = ''

	let agreedToTerms = false
	let agreedToMarketing = false

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
	let showSignupSuccess = false

	async function register(token: string) {
		loading = true
		await trpc.auth.signUpWithPassword
			.mutate({
				email,
				password,
				token,
				marketingEmails: agreedToMarketing,
				langCode: $applicationLanguage,
			})
			.finally(() => {
				loading = false
			})

		showSignupSuccess = true
	}

	onMount(() => {
		// @ts-ignore
		window.registerCallback = register

		return () => {
			// @ts-ignore
			delete window.registerCallback
		}
	})

	function registerClick() {
		if (inputIssue || !agreedToTerms) {
			showIssue = true
			return
		}

		// @ts-ignore
		grecaptcha.execute()
	}
</script>

<svelte:head>
	<script src="https://www.google.com/recaptcha/api.js" async defer></script>
</svelte:head>

{#if showSignupSuccess}
	<BasicModal>
		<div class="flex flex-col items-center">
			<span class="text-3xl text-lime-500 material-icons-outlined"> done_outline </span>

			<h2 class="my-2 text-xl font-semibold">{$t('auth.registrationMailSent')}</h2>
			<Button href="/auth/login" outlined class="max-w-full mt-4 w-max">{$t('auth.login')}</Button>
		</div>
	</BasicModal>
{/if}

<div class="flex flex-col w-[350px] max-w-full">
	<h1 class="text-xl font-semibold text-slate-700">{$t('auth.register')}</h1>
	<span class="text-orange-400">
		{inputIssue && showIssue ? $t(inputIssue) : ''}&nbsp;
	</span>
	<input type="text" placeholder={$t('auth.email')} class="mt-2" bind:value={email} />
	<!-- Chrome should suggest password -->
	<input
		type="password"
		autocomplete="new-password"
		placeholder={$t('auth.password')}
		class="mt-2"
		bind:value={password}
	/>
	<input
		type="password"
		autocomplete="new-password"
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

	<ConsentCheckBoxes bind:agreedToTerms bind:agreedToMarketing />

	<Button {loading} disabled={!!inputIssue || !agreedToTerms} on:click={registerClick} class="mt-4"
		>{$t('auth.register')}</Button
	>

	<div
		id="g_id_onload"
		data-client_id={PUBLIC_GOOGLE_AUTH_CLIENT_ID}
		data-context="signup"
		data-ux_mode="popup"
		data-callback="signUpWithGoogleCallback"
		data-auto_prompt="false"
	/>

	<div class="mt-4">
		<span>{$t('auth.alreadyHaveAnAccount')}</span>
		<a href="/auth/login" class="text-blue-500">{$t('auth.login')}</a>
	</div>
</div>
