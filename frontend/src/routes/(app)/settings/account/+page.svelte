<script lang="ts">
	import { onMount } from 'svelte'
	import Button from '../../../../lib/components/basics/Button.svelte'
	import Chip from '../../../../lib/components/basics/Chip.svelte'
	import Skeleton from '../../../../lib/components/basics/Skeleton.svelte'
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
</script>

<div class="flex flex-col max-w-md">
	{#if !myData}
		<Skeleton class="h-20 max-w-md" />
	{:else}
		<div class="px-3 py-2 mt-2 bg-gray-200">
			<b>{$t('auth.email')}</b> <span>{myData.email}</span> <br />
			<i class="text-sm text-gray-500">{$t('auth.canNotChangeEmail')}</i>
		</div>

		<div class="px-3 py-2 mt-2 bg-gray-200">
			{#if myData.isPasswordAccount}
				<b>{$t('auth.password')}</b>
				<p class="text-sm">
					{$t('auth.passwordResetInfo')}
				</p>

				<div class="my-2">
					<input type="checkbox" bind:checked={signOutAllDevices} id="signOutAllDevices" />
					<label for="signOutAllDevices" class="cursor-pointer"
						>{$t('auth.signOutAllDevices')}</label
					>
				</div>

				<Button loading={loadingPasswordReset} on:click={resetPassword}
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
	{/if}
</div>
