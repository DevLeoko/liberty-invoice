<script lang="ts">
	import Button from '../../../lib/components/basics/Button.svelte'
	import { logSuccess } from '../../../lib/stores/alerts'
	import { trpc } from '../../../lib/trpcClient'

	let email = ''
	let password = ''
	let confirmPassword = ''

	let inputIssue = ''
	$: {
		if (email === '') {
			inputIssue = 'Email is required'
		} else if (password === '') {
			inputIssue = 'Password is required'
		} else if (confirmPassword === '') {
			inputIssue = 'Confirm Password is required'
		} else if (password !== confirmPassword) {
			inputIssue = 'Passwords do not match'
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

		logSuccess('Registered successfully')
	}
</script>

<div class="flex flex-col">
	<h1 class="text-3xl font-semibold text-slate-700">Register</h1>
	<span class="text-orange-400">
		{inputIssue}&nbsp;
	</span>
	<input type="text" placeholder="Email" class="mt-2" bind:value={email} />
	<input type="password" placeholder="Password" class="mt-2" bind:value={password} />
	<input type="password" placeholder="Confirm Password" class="mt-2" bind:value={confirmPassword} />
	<Button {loading} disabled={!!inputIssue} on:click={register} class="mt-4">Register</Button>

	<div class="mt-4">
		<span>Already have an account?</span>
		<a href="/auth/login" class="text-blue-500">Login</a>
	</div>
</div>
