<script lang="ts">
	import { onMount } from 'svelte';
	import Button from '../../../lib/components/basics/Button.svelte';
	import { logSuccess } from '../../../lib/stores/alerts';
	import { trpc } from '../../../lib/trpcClient';
	import { page } from '$app/stores';

	let email = '';
	let password = '';

	let inputIssue = '';
	$: {
		if (email === '') {
			inputIssue = 'Email is required';
		} else if (password === '') {
			inputIssue = 'Password is required';
		} else {
			inputIssue = '';
		}
	}

	onMount(async () => {
		// Get token from url
		const urlParams = new URLSearchParams(window.location.search);
		const token = urlParams.get('token');
		const urlEmail = urlParams.get('email');

		if (token && urlEmail) {
			email = urlEmail;
			await trpc.auth.verifyEmail.mutate({ token, email: urlEmail });
			logSuccess('Email verified successfully');

			// Clear url params
			window.history.replaceState({}, document.title, '/');
		}
	});

	let loading = false;

	async function login() {
		loading = true;
		await trpc.auth.loginWithPassword.mutate({ email, password }).finally(() => {
			loading = false;
		});

		logSuccess('Logged in successfully');
	}
</script>

<div class="flex flex-col">
	<h1 class="text-3xl font-semibold text-slate-700">Login</h1>
	<span class="text-orange-400">
		{inputIssue}&nbsp;
	</span>
	<input type="text" placeholder="Email" class="mt-2" bind:value={email} />
	<input type="password" placeholder="Password" class="mt-2" bind:value={password} />
	<Button {loading} disabled={!!inputIssue} on:click={login} class="mt-4">Login</Button>

	<div class="mt-4">
		<span>Don't have an account?</span>
		<a href="/auth/register" class="text-blue-500">Register</a>
	</div>
</div>
