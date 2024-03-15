<script lang="ts">
	import { goto } from '$app/navigation'
	import SubscriptionBox from '$lib/components/settings/SubscriptionBox.svelte'
	import { onMount } from 'svelte'
	import Button from '../../../../lib/components/basics/Button.svelte'
	import Chip from '../../../../lib/components/basics/Chip.svelte'
	import Skeleton from '../../../../lib/components/basics/Skeleton.svelte'
	import {
		createUserSettingsQuery,
		createUserSettingsUpdateMutation,
	} from '../../../../lib/controller/user-settings'
	import { setLoggedOut } from '../../../../lib/stores/auth'
	import { logSuccess, t } from '../../../../lib/stores/settings'
	import { trpc, type ReadMe } from '../../../../lib/trpcClient'

	let myData: ReadMe | null = null
	let loadingPasswordReset = false

	let signOutAllDevices = false

	onMount(async () => {
		myData = await trpc.auth.me.query()
	})

	function resetPassword() {
		loadingPasswordReset = true
		trpc.auth.requestPasswordResetNoCaptcha
			.mutate({ signOutAllDevices })
			.then(() => {
				$logSuccess('auth.passwordResetRequested')
			})
			.finally(() => {
				loadingPasswordReset = false
			})
	}

	const userSettings = createUserSettingsQuery()
	const updateSettings = createUserSettingsUpdateMutation()

	let loadingConsentUpdate = false

	async function toggleMarketingConsent() {
		if (!$userSettings.data) return

		loadingConsentUpdate = true
		await $updateSettings
			.mutateAsync({
				marketingEmails: !$userSettings.data.marketingEmails,
			})
			.finally(() => {
				loadingConsentUpdate = false
			})

		$logSuccess('settings.saved')
	}

	let loadingDelete = false

	async function deleteAccount() {
		loadingDelete = true
		await trpc.auth.deleteAccount.mutate().finally(() => {
			loadingDelete = false
		})
		setLoggedOut()
		$logSuccess('settings.accountDeleted')
		goto('/auth/login')
	}
</script>

<div class="flex flex-col max-w-md gap-4">
	{#if !myData || !$userSettings.data}
		<Skeleton class="h-20 max-w-md" />
	{:else}
		<SubscriptionBox />

		<div class="px-3 py-2 bg-gray-150">
			<b>{$t('auth.email')}</b> <span>{myData.email}</span> <br />
			<i class="text-sm text-gray-500">{$t('auth.canNotChangeEmail')}</i>
		</div>

		<div class="px-3 py-2 bg-gray-150">
			{#if myData.isPasswordAccount}
				<b>{$t('auth.password')}</b>
				<p class="text-sm whitespace-pre-wrap">
					{$t('auth.passwordResetInfo')}
				</p>

				<div class="my-2">
					<input type="checkbox" bind:checked={signOutAllDevices} id="signOutAllDevices" />
					<label for="signOutAllDevices" class="cursor-pointer"
						>{$t('auth.signOutAllDevices')}</label
					>
				</div>

				<Button loading={loadingPasswordReset} snug on:click={resetPassword}
					>{$t('auth.passwordReset')}</Button
				>
			{:else}
				<div class="flex items-center mb-1">
					<b>{$t('auth.password')}</b>
					<Chip class="ml-2">{$t('auth.oAuthAccountChip')}</Chip>
				</div>

				<i class="text-sm text-gray-500">{$t('auth.oAuthPasswordInfo')}</i>
			{/if}
		</div>

		<div class="px-3 py-2 bg-gray-150">
			<b>{$t('settings.marketingConsent')}</b>
			<div class="flex items-center {loadingConsentUpdate ? 'opacity-50' : ''}">
				<input
					id="marketingConsent"
					type="checkbox"
					checked={$userSettings.data.marketingEmails}
					on:change={toggleMarketingConsent}
				/>
				<label for="marketingConsent" class="ml-1 text-sm cursor-pointer"
					>{$t('settings.marketingConsentText')}</label
				>
			</div>
		</div>

		<div class="px-3 py-2 border-l-4 border-red-500 bg-gray-150">
			<b>{$t('settings.deleteAccount')}</b>
			<p>{$t('settings.deleteAccountText')}</p>
			<Button
				class="mt-2"
				snug
				red
				requiresConfirmation
				on:click={deleteAccount}
				loading={loadingDelete}
			>
				{$t('settings.deleteAccount')}
			</Button>
		</div>
	{/if}
</div>
