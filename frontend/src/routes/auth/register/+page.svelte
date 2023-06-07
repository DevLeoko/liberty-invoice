<script lang="ts">
	import Button from '../../../lib/components/basics/Button.svelte'
	import { logSuccess, t } from '../../../lib/stores/settings'
	import type { TranslationPaths } from '../../../lib/translations/translations'
	import { trpc } from '../../../lib/trpcClient'

	let email = ''
	let password = ''
	let confirmPassword = ''

	let inputIssue: '' | TranslationPaths = ''
	$: {
		if (email === '') {
			inputIssue = 'auth.emailRequired'
		} else if (password === '') {
			inputIssue = 'auth.passwordRequired'
		} else if (confirmPassword === '' || password !== confirmPassword) {
			inputIssue = 'auth.passwordsDoNotMatch'
		} else {
			inputIssue = ''
		}
	}

	let loading = false

	async function register() {
		loading = true
		await trpc.auth.signUpWithPassword.mutate({ email, password }).finally(() => {
			loading = false
		})

		$logSuccess('auth.registrationMailSent')
	}
</script>

<div class="flex flex-col">
	<h1 class="text-3xl font-semibold text-slate-700">{$t('auth.register')}</h1>
	<span class="text-orange-400">
		{inputIssue ? $t(inputIssue) : ''}&nbsp;
	</span>
	<input type="text" placeholder={$t('auth.email')} class="mt-2" bind:value={email} />
	<input type="password" placeholder={$t('auth.password')} class="mt-2" bind:value={password} />
	<input
		type="password"
		placeholder={$t('auth.passwordRepeat')}
		class="mt-2"
		bind:value={confirmPassword}
	/>
	<Button {loading} disabled={!!inputIssue} on:click={register} class="mt-4"
		>{$t('auth.register')}</Button
	>

	<div class="mt-4">
		<span>{$t('auth.alreadyHaveAnAccount')}</span>
		<a href="/auth/login" class="text-blue-500">{$t('auth.login')}</a>
	</div>
</div>
